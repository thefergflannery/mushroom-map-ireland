import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * PUT /api/observations/[id]
 * Update observation status (admin only)
 */
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
    const { status } = body;

    if (!status || !['NEEDS_ID', 'HAS_CANDIDATES', 'CONSENSUS'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const observation = await prisma.observation.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            handle: true,
            role: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ data: observation });
  } catch (error) {
    console.error('Error updating observation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}