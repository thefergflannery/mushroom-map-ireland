import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/auth';
import { UserMenu } from '@/components/auth/user-menu';
import { TopSpecies } from '@/components/home/top-species';
import { MobileNav } from '@/components/ui/mobile-nav';
import { prisma } from '@/lib/prisma';

async function getStats() {
  const [observationCount, speciesCount, userCount] = await Promise.all([
    prisma.observation.count(),
    prisma.species.count(),
    prisma.user.count(),
  ]);
  
  return { observationCount, speciesCount, userCount };
}

export default async function HomePage() {
  const [session, stats] = await Promise.all([
    auth(),
    getStats(),
  ]);

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
              <Link href="/map" className="text-sm font-medium text-gray-700 hover:text-forest-700">
                Explore Map
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
      <section className="relative bg-gradient-to-br from-forest-50 via-green-50 to-emerald-50 py-20 sm:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23047857' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}/>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 bg-forest-600 text-white px-4 py-2 text-sm">
              🇮🇪 Ireland's First Citizen Science Mushroom Platform
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Ireland's
              <span className="block text-forest-600 mt-2">Fungal Biodiversity</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join our community of citizen scientists mapping mushrooms across Ireland. 
              <strong className="text-forest-700"> Privacy-first, AI-assisted, research-grade.</strong>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-forest-700">{stats.observationCount}+</div>
                <div className="text-sm text-gray-600 mt-1">Observations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-forest-700">{stats.speciesCount}</div>
                <div className="text-sm text-gray-600 mt-1">Species</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-forest-700">{stats.userCount}+</div>
                <div className="text-sm text-gray-600 mt-1">Contributors</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/map">
                <Button size="lg" className="bg-forest-600 hover:bg-forest-700 text-lg px-8 py-6 h-auto">
                  Explore the Map →
                </Button>
              </Link>
              <Link href="/observe">
                <Button size="lg" variant="outline" className="border-forest-600 text-forest-700 hover:bg-forest-50 text-lg px-8 py-6 h-auto">
                  Submit an Observation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-forest-200 shadow-xl bg-gradient-to-br from-white to-forest-50/30">
              <CardContent className="p-8 sm:p-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    🌱 Our Mission
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Beacáin empowers everyday people to contribute to Ireland's mycological knowledge 
                    while protecting sensitive species and respecting forager privacy. Through community 
                    consensus and AI assistance, we're building the most comprehensive map of Irish fungi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Species Section */}
      <Suspense fallback={<div className="py-16 bg-gray-50"><div className="container mx-auto px-4 text-center"><p className="text-gray-500">Loading top species...</p></div></div>}>
        <TopSpecies />
      </Suspense>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-forest-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to contribute to Ireland's fungal knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 hover:border-forest-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">📸</span>
                </div>
                <CardTitle className="text-xl">1. Photograph</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Take photos of mushrooms you find. GPS location auto-extracted from your photo!
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 hover:border-forest-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">📍</span>
                </div>
                <CardTitle className="text-xl">2. Mark Location</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Pin where you found it. Your exact location stays private - displayed on a 1km grid.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 hover:border-forest-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <CardTitle className="text-xl">3. Get AI Help</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our AI suggests possible identifications. Community voting determines consensus.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 hover:border-forest-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                <CardTitle className="text-xl">4. Build Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Earn badges and reputation. Top contributors gain more voting power in the community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Beacáin?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for the Irish mycology community, by the community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Exact locations never shared publicly. Grid-based display protects sensitive species and private foraging spots.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">🧠</span>
                </div>
                <CardTitle>AI-Assisted</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get instant AI suggestions for identification. Community consensus and expert override ensure accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">🔬</span>
                </div>
                <CardTitle>Research Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Export structured data for scientific research. Consensus-based verification ensures data quality.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">🇮🇪</span>
                </div>
                <CardTitle>Irish Language</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Full support for Irish (Gaeilge) names. Comprehensive glossary of mycological terms as Gaeilge.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">🤝</span>
                </div>
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vote on identifications, discuss finds, earn reputation. Moderation by biologists and experienced foragers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <CardTitle>Mobile Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Submit observations from your phone in the field. GPS auto-detected from photos. Works anywhere in Ireland.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-forest-600 via-forest-700 to-emerald-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Start Mapping?
            </h2>
            <p className="text-xl mb-8 text-forest-100">
              Join Ireland's growing community of citizen scientists documenting our fungal biodiversity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/map">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto bg-white text-forest-700 hover:bg-gray-100">
                  Explore the Map
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-2 border-white text-white hover:bg-white/10">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🍄</span>
                <span className="text-xl font-bold text-white">Beacáin</span>
              </div>
              <p className="text-sm">
                Ireland's privacy-first citizen science platform for mapping fungal biodiversity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/map" className="hover:text-white">Interactive Map</Link></li>
                <li><Link href="/species" className="hover:text-white">Species Guide</Link></li>
                <li><Link href="/glossary" className="hover:text-white">Irish Glossary</Link></li>
                <li><Link href="/observe" className="hover:text-white">Submit Observation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/signin" className="hover:text-white">Sign In</Link></li>
                <li><Link href="https://github.com/thefergflannery/mushroom-map-ireland" className="hover:text-white">GitHub</Link></li>
                <li><a href="mailto:hello@beacain.ie" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Beacáin. Built with 🍄 in Ireland. Open source and privacy-first.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
