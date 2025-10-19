import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { glossarySearchSchema } from '@/lib/validations';
import { z } from 'zod';

/**
 * GET /api/glossary
 * Search Irish mushroom terms
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = glossarySearchSchema.parse({
      q: searchParams.get('q') || undefined,
      region: searchParams.get('region') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
    });

    const where: any = {};

    if (params.q) {
      where.OR = [
        { termGa: { contains: params.q, mode: 'insensitive' } },
        { meaning: { contains: params.q, mode: 'insensitive' } },
        { variants: { has: params.q } },
      ];
    }

    if (params.region) {
      where.regions = { has: params.region };
    }

    const terms = await prisma.glossary.findMany({
      where,
      take: params.limit,
      orderBy: { termGa: 'asc' },
    });

    return NextResponse.json({ data: terms });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }

    console.error('Error fetching glossary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

