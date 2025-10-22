import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UserMenu } from '@/components/auth/user-menu';
import MapClient from '@/components/map/map-client';
import { formatRelativeTime } from '@/lib/utils';

async function getRecentObservations() {
  const observations = await prisma.observation.findMany({
    where: {
      status: 'CONSENSUS', // Only show approved observations
    },
    take: 100,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      lat: true,
      lng: true,
      photoUrl: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          handle: true,
        },
      },
      identifications: {
        where: { isConsensus: true },
        select: {
          species: {
            select: {
              latinName: true,
              commonEn: true,
              sensitive: true,
            },
          },
        },
        take: 1,
      },
    },
  });

  return observations;
}

export default async function MapPage() {
  const [observations, session] = await Promise.all([
    getRecentObservations(),
    auth(),
  ]);

  // Transform for map component
  const mapObservations = observations.map((obs) => ({
    id: obs.id,
    lat: obs.lat,
    lng: obs.lng,
    photoUrl: obs.photoUrl,
    status: obs.status,
    identification: obs.identifications[0]?.species
      ? {
          latinName: obs.identifications[0].species.latinName,
          commonEn: obs.identifications[0].species.commonEn,
        }
      : null,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🍄</span>
              <span className="text-xl font-bold text-forest-700">Beacáin</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/map" className="text-sm font-medium text-forest-700 border-b-2 border-forest-700">
                Map
              </Link>
              <Link href="/species" className="text-sm font-medium text-gray-700 hover:text-forest-700">
                Species Guide
              </Link>
              <Link href="/glossary" className="text-sm font-medium text-gray-700 hover:text-forest-700">
                Glossary
              </Link>
              {session?.user ? (
                <>
                  <Link href="/observe">
                    <Button className="bg-forest-600 hover:bg-forest-700">
                      Add a Find
                    </Button>
                  </Link>
                  <UserMenu user={session.user} />
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button className="bg-forest-600 hover:bg-forest-700">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Map Section */}
      <section className="relative h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 flex">
          {/* Map */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              }
            >
              <MapClient observations={mapObservations} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white border-l overflow-y-auto hidden lg:block">
            <div className="p-4 border-b bg-forest-50">
              <h2 className="font-bold text-lg text-forest-900 mb-1">Recent Observations</h2>
              <p className="text-sm text-gray-600">{observations.length} observations mapped</p>
            </div>

            <div className="divide-y">
              {observations.slice(0, 20).map((obs) => (
                <Link
                  key={obs.id}
                  href={`/observation/${obs.id}`}
                  className="block p-4 hover:bg-forest-50 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src={obs.photoUrl}
                        alt="Observation"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {obs.identifications[0]?.species ? (
                        <>
                          <p className="font-medium text-sm italic text-gray-900 truncate">
                            {obs.identifications[0].species.latinName}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {obs.identifications[0].species.commonEn}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-600">Needs identification</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        by @{obs.user.handle} • {formatRelativeTime(obs.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {observations.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p className="text-4xl mb-3">🍄</p>
                <p className="text-sm">No observations yet</p>
                <p className="text-xs mt-1">Be the first to map a mushroom!</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Recent Button */}
        <div className="lg:hidden absolute bottom-4 right-4">
          <Link href="#recent">
            <Button className="bg-white shadow-lg border border-gray-200">
              Recent Observations
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

