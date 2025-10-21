import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/glossary/[id] - Update glossary term
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { termGa, meaning, category, variants, regions, sources, audioUrl } = body;

    const term = await prisma.glossary.update({
      where: { id: params.id },
      data: {
        termGa,
        meaning,
        category: category || null,
        variants: variants || [],
        regions: regions || [],
        sources: sources || [],
        audioUrl: audioUrl || null,
      },
    });

    return NextResponse.json({ success: true, data: term });
  } catch (error) {
    console.error('Error updating glossary term:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update glossary term' },
      { status: 500 }
    );
  }
}

// DELETE /api/glossary/[id] - Delete glossary term
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.glossary.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting glossary term:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete glossary term' },
      { status: 500 }
    );
  }
}

