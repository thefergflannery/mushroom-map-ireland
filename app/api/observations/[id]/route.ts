import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDisplayCoordinates, canViewExactCoordinates } from '@/lib/geo/grid';

/**
 * GET /api/observations/[id]
 * Get single observation details
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const viewerRole = session?.user ? (session.user as any).role : undefined;

    const observation = await prisma.observation.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            handle: true,
            role: true,
            image: true,
            reputation: true,
          },
        },
        identifications: {
          include: {
            species: true,
            proposer: {
              select: {
                id: true,
                handle: true,
                role: true,
                image: true,
              },
            },
            votes: {
              include: {
                voter: {
                  select: {
                    id: true,
                    handle: true,
                    role: true,
                    reputation: true,
                  },
                },
              },
            },
          },
          orderBy: { score: 'desc' },
        },
        comments: {
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
          orderBy: { createdAt: 'asc' },
        },
        flags: {
          where: { status: 'open' },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!observation) {
      return NextResponse.json({ error: 'Observation not found' }, { status: 404 });
    }

    // Get consensus species for privacy check
    const consensusSpecies = observation.identifications.find((id) => id.isConsensus)?.species;

    // Apply privacy masking
    const canViewExact = canViewExactCoordinates(
      observation.privacyLevel,
      consensusSpecies?.sensitive || false,
      viewerRole
    );

    const displayCoords = getDisplayCoordinates(
      observation.lat,
      observation.lng,
      observation.privacyLevel,
      consensusSpecies?.sensitive || false,
      viewerRole
    );

    return NextResponse.json({
      data: {
        ...observation,
        lat: displayCoords.lat,
        lng: displayCoords.lng,
        exactLocation: canViewExact
          ? { lat: observation.lat, lng: observation.lng }
          : undefined,
        privacyApplied: !canViewExact,
      },
    });
  } catch (error) {
    console.error('Error fetching observation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/observations/[id]
 * Update observation (owner only)
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const observation = await prisma.observation.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!observation) {
      return NextResponse.json({ error: 'Observation not found' }, { status: 404 });
    }

    if (observation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.observation.update({
      where: { id: params.id },
      data: {
        notes: body.notes,
        privacyLevel: body.privacyLevel,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating observation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/observations/[id]
 * Delete observation (owner or moderator)
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const observation = await prisma.observation.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!observation) {
      return NextResponse.json({ error: 'Observation not found' }, { status: 404 });
    }

    const userRole = (session.user as any).role;
    const isModerator = ['MOD', 'BIOLOGIST', 'ADMIN'].includes(userRole);

    if (observation.userId !== session.user.id && !isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.observation.delete({
      where: { id: params.id },
    });

    // Log moderator action
    if (isModerator && observation.userId !== session.user.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'DELETE_OBSERVATION',
          target: 'observation',
          targetId: params.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting observation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

