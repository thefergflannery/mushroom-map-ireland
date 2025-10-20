import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { put } from '@vercel/blob';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { nanoid } from 'nanoid';
import { extractExifLocation } from '@/lib/blob/exif';

/**
 * POST /api/upload
 * Upload observation photo to Vercel Blob and extract EXIF GPS data
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Strict rate limiting
    const rateLimitResult = await checkRateLimit(session.user.id, true);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Upload rate limit exceeded' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Convert file to buffer for EXIF extraction
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract GPS coordinates from EXIF
    let exifLocation = null;
    try {
      exifLocation = extractExifLocation(buffer);
      console.log('EXIF location extracted:', exifLocation);
    } catch (err) {
      console.log('No EXIF GPS data found or error extracting:', err);
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const filename = `observations/${session.user.id}/${nanoid()}.${fileExtension}`;

    // Upload to Vercel Blob
    // Note: In production, we should strip EXIF here using sharp
    // For now, we keep original but extracted GPS data separately
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
      // Explicitly pass token to avoid environment binding issues
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json(
      {
        data: {
          url: blob.url,
          key: filename,
          exif: exifLocation
            ? {
                lat: exifLocation.lat,
                lng: exifLocation.lng,
                timestamp: exifLocation.timestamp,
              }
            : null,
        },
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    // surface minimal error info to help debugging client-side
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Ensure Node.js runtime for Buffer and blob SDK token usage
export const runtime = 'nodejs';

