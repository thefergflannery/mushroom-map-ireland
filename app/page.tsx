import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UserMenu } from '@/components/auth/user-menu';
import { TopSpecies } from '@/components/home/top-species';
import { MobileNav } from '@/components/ui/mobile-nav';
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
  const [observations, session] = await Promise.all([
    getRecentObservations(),
    auth(),
  ]);

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-green-50/30">
      {/* Header - Urban ReLeaf inspired */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl">🍄</div>
              <div>
                <h1 className="text-xl font-bold text-forest-700">Mushroom Map Ireland</h1>
                <p className="text-xs text-forest-600/70">Citizen Science Platform</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/species" className="text-sm font-medium text-gray-700 hover:text-forest-700 transition-colors">
                Species Guide
              </Link>
              <Link href="/glossary" className="text-sm font-medium text-gray-700 hover:text-forest-700 transition-colors">
                Glossary
              </Link>
              {session?.user ? (
                <>
                  <Link href="/observe">
                    <Button size="lg" className="bg-forest-600 hover:bg-forest-700">
                      Add a Find
                    </Button>
                  </Link>
                  <UserMenu user={session.user} />
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button size="lg" className="bg-forest-600 hover:bg-forest-700">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section - Urban ReLeaf Style */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              We innovate together to{' '}
              <span className="text-forest-600">empower</span> citizens and create{' '}
              <span className="text-forest-600">liveable</span>,{' '}
              <span className="text-forest-600">greener</span> understanding of Ireland&apos;s fungi
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A privacy-first citizen science platform mapping Ireland&apos;s fungal biodiversity. Together, we&apos;re building comprehensive data to support conservation and research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/observe">
                <Button size="lg" className="w-full sm:w-auto bg-forest-600 hover:bg-forest-700 text-lg px-8 py-6">
                  Start Contributing
                </Button>
              </Link>
              <Link href="/species">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-forest-600 text-forest-700 hover:bg-forest-50">
                  Explore Species
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Live Observation Map</h3>
            <p className="text-gray-600">Privacy-protected locations of recent mushroom finds across Ireland</p>
          </div>
          
          <div className="relative h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading observations...</p>
                  </div>
                </div>
              }
            >
              <MapClient observations={mapObservations} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Top Species Section */}
      <Suspense fallback={<div className="py-16 bg-white"><div className="container mx-auto px-4 text-center"><p className="text-gray-500">Loading top species...</p></div></div>}>
        <TopSpecies />
      </Suspense>

      {/* How It Works - Urban ReLeaf Card Style */}
      <section className="py-16 bg-gradient-to-b from-green-50/50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">How it works</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community of citizen scientists mapping Ireland&apos;s fungal biodiversity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mb-4">
                  <span className="text-3xl">📸</span>
                </div>
                <CardTitle className="text-xl">1. Find & Photograph</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Discover mushrooms in their natural habitat. Take clear photos showing key identification features.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <CardTitle className="text-xl">2. AI Assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get initial suggestions from AI. Remember: AI is assistive, not authoritative. Community consensus determines identification.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <CardTitle className="text-xl">3. Community Consensus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Experts and community members vote on identifications. Biologists provide final verification for research-grade data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Notice - Urban ReLeaf Warning Style */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex gap-6 items-start">
            <div className="text-5xl flex-shrink-0">⚠️</div>
            <div>
              <h3 className="text-2xl font-bold text-amber-900 mb-3">Important Safety Notice</h3>
              <p className="text-lg text-amber-800 mb-2">
                <strong>Never consume mushrooms based solely on online identification.</strong>
              </p>
              <p className="text-amber-700">
                Many edible species have toxic or deadly lookalikes. Always consult with an experienced mycologist in person before consuming any wild mushroom. This platform is for educational and research purposes only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved - Urban ReLeaf CTA Style */}
      <section className="py-20 bg-forest-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-4xl font-bold mb-6">Join Our Community</h3>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Help shape a greener understanding of Ireland&apos;s fungal ecosystem. Your observations contribute to scientific research and conservation efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/observe">
                <Button size="lg" className="w-full sm:w-auto bg-white text-forest-700 hover:bg-green-50 text-lg px-8 py-6">
                  Submit Your First Observation
                </Button>
              </Link>
              <Link href="/species">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-forest-600 text-lg px-8 py-6">
                  Browse Species Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-700 mb-2">{observations.length}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Observations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-700 mb-2">12</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Species</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-700 mb-2">100%</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Privacy-First</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-700 mb-2">∞</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Potential</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Mushroom Map Ireland</h4>
              <p className="text-sm">Privacy-first citizen science for Ireland&apos;s fungi</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Explore</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/species" className="hover:text-white transition-colors">Species Guide</Link></li>
                <li><Link href="/glossary" className="hover:text-white transition-colors">Irish Glossary</Link></li>
                <li><Link href="/observe" className="hover:text-white transition-colors">Add Observation</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">About</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">Our Mission</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Newsletter</h5>
              <p className="text-sm mb-3">Stay updated on new species and features</p>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2025 Mushroom Map Ireland. Built with 🍄 for the mycology community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
