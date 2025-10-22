import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createObservationSchema, observationFilterSchema } from '@/lib/validations';
import { calculateGridCoordinates, getDisplayCoordinates } from '@/lib/geo/grid';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { z } from 'zod';

/**
 * GET /api/observations
 * List observations with filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = observationFilterSchema.parse({
      bbox: searchParams.get('bbox') || undefined,
      status: searchParams.get('status') || undefined,
      userId: searchParams.get('userId') || undefined,
      speciesId: searchParams.get('speciesId') || undefined,
      since: searchParams.get('since') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
    });

    const session = await auth();
    const viewerRole = session?.user ? (session.user as any).role : undefined;

    // Build where clause
    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.since) {
      where.createdAt = { gte: new Date(params.since) };
    }

    // Bbox filter (simplified - real implementation would be more sophisticated)
    if (params.bbox) {
      const [minLng, minLat, maxLng, maxLat] = params.bbox.split(',').map(Number);
      where.lat = { gte: minLat, lte: maxLat };
      where.lng = { gte: minLng, lte: maxLng };
    }

    // Filter by species (through consensus identification)
    if (params.speciesId) {
      where.identifications = {
        some: {
          speciesId: params.speciesId,
          isConsensus: true,
        },
      };
    }

    const observations = await prisma.observation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            handle: true,
            role: true,
            image: true,
          },
        },
        identifications: {
          where: { isConsensus: true },
          include: {
            species: {
              select: {
                id: true,
                latinName: true,
                commonEn: true,
                commonGa: true,
                sensitive: true,
                edibility: true,
              },
            },
          },
          take: 1,
        },
        _count: {
          select: {
            identifications: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: params.limit,
      skip: params.offset,
    });

    // Apply privacy masking
    const maskedObservations = observations.map((obs) => {
      const species = obs.identifications[0]?.species;
      const displayCoords = getDisplayCoordinates(
        obs.lat,
        obs.lng,
        obs.privacyLevel,
        species?.sensitive || false,
        viewerRole
      );

      return {
        ...obs,
        lat: displayCoords.lat,
        lng: displayCoords.lng,
        // Don't expose full photo URLs, use thumbnail service in production
        photoUrl: obs.photoUrl,
      };
    });

    return NextResponse.json({
      data: maskedObservations,
      pagination: {
        limit: params.limit,
        offset: params.offset,
        hasMore: observations.length === params.limit,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }

    console.error('Error fetching observations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/observations
 * Create new observation
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(session.user.id, true);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const body = await request.json();
    const data = createObservationSchema.parse(body);

    // Calculate grid coordinates
    const gridCoords = calculateGridCoordinates(data.lat, data.lng, data.privacyLevel);

    // Create observation (auto-approved, moderators can review and remove if needed)
    const observation = await prisma.observation.create({
      data: {
        userId: session.user.id,
        lat: data.lat,
        lng: data.lng,
        grid1km: gridCoords.grid1km,
        grid10km: gridCoords.grid10km,
        photoUrl: data.photoUrl,
        photoKey: data.photoKey,
        notes: data.notes,
        privacyLevel: data.privacyLevel,
        accuracyM: data.accuracyM,
        status: 'CONSENSUS', // Auto-accepted, moderators can reject if inappropriate
      },
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
    });

    return NextResponse.json(
      { data: observation },
      { status: 201, headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }

    console.error('Error creating observation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

