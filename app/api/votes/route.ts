import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createVoteSchema } from '@/lib/validations';
import { processConsensus, calculateIdentificationScore } from '@/lib/consensus/voting';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { z } from 'zod';

/**
 * POST /api/votes
 * Vote on an identification
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(session.user.id);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const body = await request.json();
    const data = createVoteSchema.parse(body);

    // Check if identification exists
    const identification = await prisma.identification.findUnique({
      where: { id: data.identificationId },
      include: { observation: true },
    });

    if (!identification) {
      return NextResponse.json({ error: 'Identification not found' }, { status: 404 });
    }

    // Can't vote on your own identification
    if (identification.proposerUserId === session.user.id) {
      return NextResponse.json({ error: 'Cannot vote on your own identification' }, { status: 400 });
    }

    // Upsert vote (update if exists, create if doesn't)
    const vote = await prisma.vote.upsert({
      where: {
        identificationId_voterUserId: {
          identificationId: data.identificationId,
          voterUserId: session.user.id,
        },
      },
      create: {
        identificationId: data.identificationId,
        voterUserId: session.user.id,
        value: data.value,
      },
      update: {
        value: data.value,
      },
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
    });

    // Recalculate scores and consensus
    const allIdentifications = await prisma.identification.findMany({
      where: { observationId: identification.observationId },
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
    });

    // Update scores
    for (const id of allIdentifications) {
      const score = calculateIdentificationScore(id.votes);
      await prisma.identification.update({
        where: { id: id.id },
        data: { score },
      });
    }

    // Process consensus
    const consensusResult = processConsensus(allIdentifications);

    // Update consensus flags
    if (consensusResult.shouldUpdateStatus) {
      await prisma.identification.updateMany({
        where: { observationId: identification.observationId },
        data: { isConsensus: false },
      });

      if (consensusResult.consensusIdentificationId) {
        await prisma.identification.update({
          where: { id: consensusResult.consensusIdentificationId },
          data: { isConsensus: true },
        });
      }

      await prisma.observation.update({
        where: { id: identification.observationId },
        data: { status: consensusResult.newStatus },
      });
    }

    return NextResponse.json({ data: vote }, { headers: getRateLimitHeaders(rateLimitResult) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }

    console.error('Error creating vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

