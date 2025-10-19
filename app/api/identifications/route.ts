import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createIdentificationSchema } from '@/lib/validations';
import { processConsensus, calculateIdentificationScore } from '@/lib/consensus/voting';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { z } from 'zod';

/**
 * POST /api/identifications
 * Create new identification proposal
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
    const data = createIdentificationSchema.parse(body);

    // Check if observation exists
    const observation = await prisma.observation.findUnique({
      where: { id: data.observationId },
    });

    if (!observation) {
      return NextResponse.json({ error: 'Observation not found' }, { status: 404 });
    }

    // Check if species exists (if provided)
    if (data.speciesId) {
      const species = await prisma.species.findUnique({
        where: { id: data.speciesId },
      });

      if (!species) {
        return NextResponse.json({ error: 'Species not found' }, { status: 404 });
      }
    }

    // Create identification
    const identification = await prisma.identification.create({
      data: {
        observationId: data.observationId,
        proposerUserId: session.user.id,
        speciesId: data.speciesId,
        method: data.method,
        confidence: data.confidence,
        rationale: data.rationale,
        score: 0,
      },
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
      },
    });

    // Update observation status
    await prisma.observation.update({
      where: { id: data.observationId },
      data: { status: 'HAS_CANDIDATES' },
    });

    return NextResponse.json(
      { data: identification },
      { status: 201, headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }

    console.error('Error creating identification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

