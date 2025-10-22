import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

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

/**
 * PUT /api/species/[slug]
 * Update species details (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
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

    // Update species
    const species = await prisma.species.update({
      where: { slug: params.slug },
      data: {
        latinName: body.latinName,
        commonEn: body.commonEn,
        commonGa: body.commonGa || null,
        edibility: body.edibility,
        season: body.season || null,
        habitat: body.habitat || null,
        keyTraits: body.keyTraits || null,
        heroImageUrl: body.heroImageUrl || null,
        sensitive: body.sensitive || false,
        hidden: body.hidden || false,
      },
      include: {
        _count: {
          select: {
            identifications: true,
          },
        },
      },
    });

    return NextResponse.json({ data: species });
  } catch (error) {
    console.error('Error updating species:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

