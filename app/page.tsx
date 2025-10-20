import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UserMenu } from '@/components/auth/user-menu';
import { TopSpecies } from '@/components/home/top-species';
import { MobileNav } from '@/components/ui/mobile-nav';
import { SafetyBanner } from '@/components/common/safety-banner';
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

async function getStats() {
  const [observationCount, speciesCount, userCount] = await Promise.all([
    prisma.observation.count(),
    prisma.species.count(),
    prisma.user.count(),
  ]);
  
  return { observationCount, speciesCount, userCount };
}

export default async function HomePage() {
  const [observations, session, stats] = await Promise.all([
    getRecentObservations(),
    auth(),
    getStats(),
  ]);

  // Transform for map component
  const mapObservations = observations.map((obs) => ({
    id: obs.id,
    lat: obs.lat,
    lng: obs.lng,
    photoUrl: obs.photoUrl,
    identification: obs.identifications[0]?.species
      ? {
          latinName: obs.identifications[0].species.latinName,
          commonEn: obs.identifications[0].species.commonEn,
        }
      : null,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍄</span>
              <div>
                <span className="text-lg font-bold text-gray-900">Beacáin</span>
                <span className="text-xs text-gray-500 ml-2">Ireland Mushroom Map</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/map" className="text-sm text-gray-700 hover:text-gray-900">
                Map
              </Link>
              <Link href="/species" className="text-sm text-gray-700 hover:text-gray-900">
                Species
              </Link>
              <Link href="/glossary" className="text-sm text-gray-700 hover:text-gray-900">
                Glossary
              </Link>
              {session?.user ? (
                <>
                  <Link href="/observe">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Add Observation
                    </Button>
                  </Link>
                  <UserMenu user={session.user} />
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button size="sm" variant="outline">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className="font-bold">{stats.observationCount}</span> Observations
              </div>
              <div>
                <span className="font-bold">{stats.speciesCount}</span> Species
              </div>
              <div>
                <span className="font-bold">{stats.userCount}</span> Contributors
              </div>
            </div>
            <div className="hidden sm:block text-xs">
              Privacy-First • Community-Driven • Research-Grade
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map of Life-style Hero */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 text-white mb-10">
          <div className="px-6 py-12 sm:px-10 sm:py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Explore the Map</h1>
              <p className="text-emerald-200/90 max-w-2xl mb-8">
                Access comprehensive, privacy-safe data on mushroom species and habitats across Ireland.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                  <p className="text-sm text-emerald-200">Species</p>
                  <p className="text-2xl font-semibold">{stats.speciesCount}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                  <p className="text-sm text-emerald-200">Observations</p>
                  <p className="text-2xl font-semibold">{stats.observationCount}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                  <p className="text-sm text-emerald-200">Contributors</p>
                  <p className="text-2xl font-semibold">{stats.userCount}</p>
                </div>
              </div>
              <Link href="/observe">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards: Species / Regions / Patterns */}
        <section className="mb-10">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🧬</span> Species
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Explore profiles, edibility, lookalikes, and identification tips.</p>
                <Link href="/species"><Button size="sm">Open guide</Button></Link>
              </CardContent>
            </Card>
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🗺️</span> Regions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Browse observations by county or protected areas.</p>
                <Link href="/map"><Button size="sm" variant="outline">Open map</Button></Link>
              </CardContent>
            </Card>
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📈</span> Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Coming soon: seasonal trends and biodiversity indicators.</p>
                <Button size="sm" disabled>Coming soon</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Indicators (accordion) */}
        <section className="mb-10">
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-6">
            <h2 className="text-xl font-semibold mb-4">Biodiversity Indicators</h2>
            <div className="space-y-3">
              <details className="group border rounded-md p-4 bg-white">
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  Species Protection Index
                  <span className="text-gray-400 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">Tracks how well important species are represented in protected areas.</p>
              </details>
              <details className="group border rounded-md p-4 bg-white">
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  Species Habitat Index
                  <span className="text-gray-400 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">Signals habitat suitability change across regions.</p>
              </details>
              <details className="group border rounded-md p-4 bg-white">
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  Species Information Index
                  <span className="text-gray-400 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">Measures data completeness and certainty for species.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Interactive Map */}
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Observation Map</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {observations.length} observations • Privacy-protected 1km grid
                </p>
              </div>
              <Link href="/map">
                <Button variant="outline" size="sm">
                  Full Screen Map →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] bg-gray-100">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading map...</p>
                    </div>
                  </div>
                }
              >
                <MapClient observations={mapObservations} />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        {/* Core dashboard media block */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Core Dashboard</h2>
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5 border">
            {/* Placeholder: swap for real video or screenshot */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">Dashboard preview</div>
          </div>
        </section>

        {/* Safety Banner */}
        <div className="mb-8">
          <SafetyBanner />
        </div>

        {/* Top Species */}
        <Suspense fallback={<div className="text-center py-8"><p className="text-gray-500">Loading species...</p></div>}>
          <TopSpecies />
        </Suspense>

        {/* How It Works */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">📸</div>
              <CardTitle className="text-lg">Find & Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Photograph mushrooms in the wild. Upload with automatic GPS extraction from your photo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">🤖</div>
              <CardTitle className="text-lg">AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get AI-powered identification suggestions. Community consensus determines final ID.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">🔬</div>
              <CardTitle className="text-lg">Research Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Contribute to scientific research. Export structured data for mycological studies.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Contribute?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our community of citizen scientists documenting Ireland's fungal biodiversity.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/observe">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Submit Observation
              </Button>
            </Link>
            <Link href="/species">
              <Button size="lg" variant="outline">
                Browse Species Guide
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🍄</span>
                <span className="text-lg font-bold text-white">Beacáin</span>
              </div>
              <p className="text-sm text-gray-400">
                Ireland's citizen science platform for mushroom identification and mapping.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/map" className="hover:text-white">Map</Link></li>
                <li><Link href="/species" className="hover:text-white">Species Guide</Link></li>
                <li><Link href="/glossary" className="hover:text-white">Irish Glossary</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/observe" className="hover:text-white">Add Observation</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white">Sign In</Link></li>
                <li><Link href="https://github.com/thefergflannery/mushroom-map-ireland" className="hover:text-white">GitHub</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:hello@beacain.ie" className="hover:text-white">Contact</a></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="https://github.com/thefergflannery/mushroom-map-ireland" className="hover:text-white">v1.0.0</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
            <p className="text-gray-400">
              © 2025 Beacáin • Open Source • Privacy-First
            </p>
            <p className="text-gray-500 text-xs">
              Version 1.0.0 • Build {new Date().toISOString().split('T')[0].replace(/-/g, '')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
