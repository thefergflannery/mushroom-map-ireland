import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processConsensus, calculateIdentificationScore } from '@/lib/consensus/voting';

/**
 * Nightly cron job to recalculate consensus
 * Called by Vercel Cron at 2 AM daily
 */
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Cron] Starting consensus recalculation...');

    // Get all observations that need consensus check
    const observations = await prisma.observation.findMany({
      where: {
        status: {
          in: ['HAS_CANDIDATES', 'CONSENSUS'],
        },
      },
      include: {
        identifications: {
          include: {
            votes: {
              include: {
                voter: {
                  select: {
                    role: true,
                    reputation: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    let updated = 0;
    let errors = 0;

    for (const observation of observations) {
      try {
        // Recalculate scores
        for (const identification of observation.identifications) {
          const score = calculateIdentificationScore(identification.votes);
          await prisma.identification.update({
            where: { id: identification.id },
            data: { score },
          });
        }

        // Process consensus
        const consensusResult = processConsensus(observation.identifications);

        if (consensusResult.shouldUpdateStatus) {
          // Clear old consensus flags
          await prisma.identification.updateMany({
            where: { observationId: observation.id },
            data: { isConsensus: false },
          });

          // Set new consensus
          if (consensusResult.consensusIdentificationId) {
            await prisma.identification.update({
              where: { id: consensusResult.consensusIdentificationId },
              data: { isConsensus: true },
            });
          }

          // Update observation status
          await prisma.observation.update({
            where: { id: observation.id },
            data: { status: consensusResult.newStatus },
          });

          updated++;
        }
      } catch (error) {
        console.error(`[Cron] Error processing observation ${observation.id}:`, error);
        errors++;
      }
    }

    console.log(`[Cron] Consensus recalculation complete: ${updated} updated, ${errors} errors`);

    return NextResponse.json({
      success: true,
      processed: observations.length,
      updated,
      errors,
    });
  } catch (error) {
    console.error('[Cron] Consensus recalculation failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

