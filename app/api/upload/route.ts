import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { put } from '@vercel/blob';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { nanoid } from 'nanoid';

/**
 * POST /api/upload
 * Upload observation photo to Vercel Blob
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

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const filename = `observations/${session.user.id}/${nanoid()}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // TODO: In production, add:
    // 1. EXIF stripping (using sharp)
    // 2. Image optimization/resizing
    // 3. NSFW content detection
    // 4. Extract GPS coordinates from EXIF before stripping

    return NextResponse.json(
      {
        data: {
          url: blob.url,
          key: filename,
        },
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

