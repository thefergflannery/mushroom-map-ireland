import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/glossary - Get all glossary terms
export async function GET() {
  try {
    const terms = await prisma.glossary.findMany({
      orderBy: { termGa: 'asc' },
    });

    return NextResponse.json({ success: true, data: terms });
  } catch (error) {
    console.error('Error fetching glossary terms:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch glossary terms' },
      { status: 500 }
    );
  }
}

// POST /api/glossary - Create new glossary term
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

    const body = await request.json();
    const { termGa, meaning, category, variants, regions, sources, audioUrl } = body;

    const term = await prisma.glossary.create({
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
    console.error('Error creating glossary term:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create glossary term' },
      { status: 500 }
    );
  }
}
