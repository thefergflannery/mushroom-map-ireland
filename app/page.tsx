import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import MapClient from '@/components/map/map-client';

async function getRecentObservations() {
  const observations = await prisma.observation.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          handle: true,
        },
      },
      identifications: {
        where: { isConsensus: true },
        include: {
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

export default async function HomePage() {
  const observations = await getRecentObservations();

  // Transform for map component
  const mapObservations = observations.map((obs) => ({
    id: obs.id,
    lat: obs.lat,
    lng: obs.lng,
    status: obs.status,
    photoUrl: obs.photoUrl,
    identifications: obs.identifications,
  }));

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-forest-700">🍄 Mushroom Map Ireland</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/species">
              <Button variant="ghost">Species Guide</Button>
            </Link>
            <Link href="/glossary">
              <Button variant="ghost">Glossary</Button>
            </Link>
            <Link href="/observe">
              <Button>Add a Find</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1 relative">
        <div className="absolute inset-0 flex">
          {/* Map */}
          <div className="flex-1 relative">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Loading observations...</p>
                </div>
              }
            >
              <MapClient observations={mapObservations} />
            </Suspense>
          </div>

          {/* Side panel */}
          <aside className="w-96 bg-white border-l overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Welcome to Mushroom Map Ireland</h2>
                <p className="text-sm text-muted-foreground">
                  A privacy-first citizen science platform for identifying and mapping fungi across Ireland.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How it works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Find a mushroom</p>
                      <p className="text-muted-foreground">Take a clear photo in its natural habitat</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Upload & get AI suggestions</p>
                      <p className="text-muted-foreground">AI provides initial candidates (assistive, not authoritative)</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Community identifies</p>
                      <p className="text-muted-foreground">
                        Experts and community vote to reach consensus
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    ⚠️ Important Safety Notice
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>Never consume mushrooms based solely on online identification.</strong>
                  </p>
                  <p className="text-muted-foreground">
                    Many edible species have toxic lookalikes. Always consult with an experienced mycologist in
                    person before consuming any wild mushroom.
                  </p>
                </CardContent>
              </Card>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>Privacy-first:</strong> Locations shown at 1-10km grid precision. Exact coordinates
                  never shared publicly.
                </p>
                <p>
                  <strong>Data exports:</strong> Structured data available for biological research (contact us).
                </p>
              </div>

              <Link href="/observe">
                <Button className="w-full" size="lg">
                  Add Your First Observation
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
