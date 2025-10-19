import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { suggestIdentification } from '@/lib/ai/suggest';
import { aiSuggestSchema } from '@/lib/validations';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/ai/suggest
 * Get AI identification suggestions
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Strict rate limiting for AI calls
    const rateLimitResult = await checkRateLimit(session.user.id, true);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. AI suggestions are limited to prevent abuse.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const body = await request.json();
    const data = aiSuggestSchema.parse(body);

    // Get AI suggestions
    const result = await suggestIdentification(data.imageUrl);

    // Try to match candidates with database species
    const enhancedCandidates = await Promise.all(
      result.candidates.map(async (candidate) => {
        // Try to find matching species in database
        const species = await prisma.species.findFirst({
          where: {
            OR: [
              { latinName: { equals: candidate.label, mode: 'insensitive' } },
              { commonEn: { equals: candidate.label, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            latinName: true,
            commonEn: true,
            commonGa: true,
            slug: true,
            edibility: true,
            keyTraits: true,
            sensitive: true,
          },
        });

        return {
          ...candidate,
          species,
        };
      })
    );

    return NextResponse.json(
      {
        data: {
          candidates: enhancedCandidates,
          disclaimer: result.disclaimer,
        },
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }

    console.error('Error getting AI suggestions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

