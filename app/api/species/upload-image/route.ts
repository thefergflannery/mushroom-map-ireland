import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

/**
 * POST /api/species/upload-image
 * Upload species hero image to Vercel Blob
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const speciesSlug = formData.get('slug') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!speciesSlug) {
      return NextResponse.json({ error: 'No species slug provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`species/${speciesSlug}/${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      url: blob.url,
    });
  } catch (error) {
    console.error('Error uploading species image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}

