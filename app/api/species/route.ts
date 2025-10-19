import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { speciesSearchSchema } from '@/lib/validations';
import { z } from 'zod';

/**
 * GET /api/species
 * Search species
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = speciesSearchSchema.parse({
      q: searchParams.get('q') || undefined,
      edibility: searchParams.get('edibility') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
    });

    const where: any = {};

    if (params.q) {
      where.OR = [
        { latinName: { contains: params.q, mode: 'insensitive' } },
        { commonEn: { contains: params.q, mode: 'insensitive' } },
        { commonGa: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    if (params.edibility) {
      where.edibility = params.edibility;
    }

    const species = await prisma.species.findMany({
      where,
      take: params.limit,
      orderBy: { latinName: 'asc' },
    });

    return NextResponse.json({ data: species });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }

    console.error('Error fetching species:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

