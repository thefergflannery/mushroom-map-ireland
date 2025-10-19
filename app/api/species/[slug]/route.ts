import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/species/[slug]
 * Get single species details
 */
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const species = await prisma.species.findUnique({
      where: { slug: params.slug },
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

    if (!species) {
      return NextResponse.json({ error: 'Species not found' }, { status: 404 });
    }

    // Get lookalike species
    let lookalikes = [];
    if (species.lookalikeIds.length > 0) {
      lookalikes = await prisma.species.findMany({
        where: {
          id: { in: species.lookalikeIds },
        },
        select: {
          id: true,
          latinName: true,
          commonEn: true,
          commonGa: true,
          slug: true,
          edibility: true,
          keyTraits: true,
          heroImageUrl: true,
        },
      });
    }

    return NextResponse.json({
      data: {
        ...species,
        lookalikes,
      },
    });
  } catch (error) {
    console.error('Error fetching species:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

