import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Nightly cron job to warm caches and pre-compute data
 * Called by Vercel Cron at 3 AM daily
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Cron] Starting cache warm...');

    // Pre-compute expensive queries
    const stats = {
      totalObservations: await prisma.observation.count(),
      totalSpecies: await prisma.species.count(),
      consensusObservations: await prisma.observation.count({
        where: { status: 'CONSENSUS' },
      }),
      needsIdObservations: await prisma.observation.count({
        where: { status: 'NEEDS_ID' },
      }),
      activeUsers: await prisma.user.count({
        where: {
          observations: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
        },
      }),
    };

    // Pre-compute top species
    const topSpecies = await prisma.species.findMany({
      take: 10,
      orderBy: {
        identifications: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: {
            identifications: {
              where: { isConsensus: true },
            },
          },
        },
      },
    });

    // Pre-compute recent activity
    const recentObservations = await prisma.observation.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            handle: true,
          },
        },
        identifications: {
          where: { isConsensus: true },
          take: 1,
          include: {
            species: {
              select: {
                latinName: true,
                commonEn: true,
              },
            },
          },
        },
      },
    });

    console.log('[Cron] Cache warm complete:', stats);

    return NextResponse.json({
      success: true,
      stats,
      topSpeciesCount: topSpecies.length,
      recentActivityCount: recentObservations.length,
    });
  } catch (error) {
    console.error('[Cron] Cache warm failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

