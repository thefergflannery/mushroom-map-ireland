import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeroCTA } from '@/components/home/hero-cta';
import { TopSpecies } from '@/components/home/top-species';
import MapClient from '@/components/map/map-client';
import { prisma } from '@/lib/prisma';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faRobot, faMicroscope, faMapMarkerAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

async function getStats() {
  const [observationCount, speciesCount, userCount] = await Promise.all([
    prisma.observation.count(),
    prisma.species.count(),
    prisma.user.count(),
  ]);
  return { observationCount, speciesCount, userCount };
}

async function getObservations() {
  const observations = await prisma.observation.findMany({
    where: {
      status: 'CONSENSUS', // Only show approved observations on homepage
    },
    take: 50,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      lat: true,
      lng: true,
      photoUrl: true,
      status: true,
    },
  });
  return observations;
}

export default async function HomePage() {
  const [stats, observations] = await Promise.all([
    getStats(),
    getObservations(),
  ]);

  const mapObservations = observations.map((obs) => ({
    id: obs.id,
    lat: obs.lat,
    lng: obs.lng,
    photoUrl: obs.photoUrl,
    status: obs.status,
  }));

  return (
    <div className="min-h-screen bg-slate-50 -mt-20">

      {/* Hero Section - Full bleed photography */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero1.jpg"
            alt="Irish mushrooms in their natural forest habitat"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-900/85 via-forest-800/75 to-earth-900/70"></div>
        </div>

        <div className="relative h-full container-modern">
          <div className="h-full flex flex-col justify-center max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 w-fit mb-6">
              <span className="w-2 h-2 bg-forest-400 rounded-full animate-pulse"></span>
              <span className="text-white text-sm font-medium tracking-wide">
                {stats.speciesCount} Species • {stats.observationCount} Observations
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="heading-display text-white mb-6">
              <br />
              <span className="text-forest-300 italic">discover</span> Ireland's
              <br />
              fungi kingdom
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-12 leading-relaxed">
              A privacy-first citizen science platform empowering communities to identify, map, and protect Ireland's
              fungal biodiversity. Join mycologists, foragers, and naturalists in documenting our living heritage.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <HeroCTA 
                observationCount={stats.observationCount}
                speciesCount={stats.speciesCount}
                userCount={stats.userCount}
              />
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl">
              <div className="text-center md:text-left">
                <div className="text-5xl md:text-6xl font-extrabold mb-2 text-forest-300">{stats.speciesCount}</div>
                <div className="text-sm text-white/90 uppercase tracking-widest font-medium">Species</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-5xl md:text-6xl font-extrabold mb-2 text-forest-300">{stats.observationCount}</div>
                <div className="text-sm text-white/90 uppercase tracking-widest font-medium">Observations</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-5xl md:text-6xl font-extrabold mb-2 text-forest-300">{stats.userCount}</div>
                <div className="text-sm text-white/90 uppercase tracking-widest font-medium">Contributors</div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Introduction Section */}
      <section className="section bg-white">
        <div className="container-modern">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="heading-section text-forest-900 mb-6">
              Our Vision
            </h2>
            <p className="lead">
              Mushroom Map Ireland believes in empowering communities to shape biodiversity research and conservation
              actions in their neighbourhoods. Citizens across Ireland are documenting fungal species to improve
              ecological understanding and habitat protection.
            </p>
          </div>

          {/* Three Column Features */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-forest-700 to-forest-900"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCamera} className="text-8xl text-white opacity-20" />
                </div>
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Find & Document</h3>
                  <p className="text-white/90 text-sm">
                    Photograph mushrooms in the wild. GPS auto-extracted for easy mapping.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-earth-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRobot} className="text-8xl text-white opacity-20" />
                </div>
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">AI-Powered ID</h3>
                  <p className="text-white/90 text-sm">
                    Get instant AI suggestions. Community consensus ensures accuracy.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600 to-slate-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FontAwesomeIcon icon={faMicroscope} className="text-8xl text-white opacity-20" />
                </div>
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Research Data</h3>
                  <p className="text-white/90 text-sm">
                    Contribute to mycological research and biodiversity monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section - Photo background */}
      <section className="section-sm relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero-image.jpg"
            alt="Forest background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative container-modern">
          <div className="text-center mb-12">
            <h2 className="heading-section text-white mb-4">
              Explore Live Observations
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {observations.length} privacy-protected observations mapped across Ireland
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
            <div className="h-[600px] bg-slate-800">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-forest-400 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-white text-lg">Loading map...</p>
                    </div>
                  </div>
                }
              >
                <MapClient observations={mapObservations} />
              </Suspense>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/map">
              <Button className="btn-secondary">
                View Full Screen Map
                <span className="text-xl">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Species Highlights - Grid with photos */}
      <section className="section bg-white">
        <div className="container-modern">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="heading-section text-forest-900 mb-4">
                Featured Species
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl">
                Discover Ireland's most commonly observed mushrooms, from choice edibles to deadly poisonous varieties.
              </p>
            </div>
            <Link href="/species" className="hidden md:block">
              <Button variant="outline" className="rounded-full">
                View All {stats.speciesCount} Species →
              </Button>
            </Link>
          </div>

          {/* Species Grid */}
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-forest-400 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-500">Loading species...</p>
            </div>
          }>
            <TopSpecies />
          </Suspense>

          <div className="text-center mt-12 md:hidden">
            <Link href="/species">
              <Button variant="outline" className="rounded-full">
                View All {stats.speciesCount} Species →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Photography backgrounds */}
      <section className="section bg-slate-50">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="heading-section text-forest-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Four simple steps to contribute to Ireland's fungal biodiversity research
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="card-photo group cursor-pointer">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-forest-800/90 to-forest-900/80"></div>
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-forest-900 text-2xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">Observe & Upload</h3>
                    <p className="text-white/90 text-lg">
                      Photograph mushrooms you encounter. Our system auto-extracts GPS from your photo and
                      privacy-masks the location.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card-photo group cursor-pointer">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/90 to-earth-900/80"></div>
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-earth-900 text-2xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">AI Assistance</h3>
                    <p className="text-white/90 text-lg">
                      Receive AI-powered species suggestions to guide your identification process.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card-photo group cursor-pointer">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600/90 to-slate-900/80"></div>
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-sky-900 text-2xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">Community Consensus</h3>
                    <p className="text-white/90 text-lg">
                      Expert mycologists and trusted members vote on identifications to reach scientific consensus.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="card-photo group cursor-pointer">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-forest-600/90 to-forest-900/80"></div>
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-forest-900 text-2xl font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">Build Knowledge</h3>
                    <p className="text-white/90 text-lg">
                      Verified observations contribute to research-grade data for conservation and science.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Banner - Prominent */}
      <section className="section-sm bg-amber-500">
        <div className="container-modern">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Never Consume Based on Online ID
            </h2>
            <p className="text-xl md:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto">
              Many edible mushrooms have deadly lookalikes. Always consult an expert mycologist in person and
              cross-reference with multiple field guides before consuming any wild mushroom. This platform is for
              documentation and research only.
            </p>
          </div>
        </div>
      </section>

      {/* Get Involved CTA - Photo background */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero1-optimized.jpg"
            alt="Join the community"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-800/90 to-forest-700/85"></div>
        </div>

        <div className="relative container-modern">
          <div className="max-w-3xl">
            <h2 className="heading-hero text-white mb-6">
              Ready to contribute to Ireland's fungal biodiversity?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Join our growing community of citizen scientists. Document species, share knowledge, and help protect
              Ireland's natural heritage for future generations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/observe" className="btn-primary">
                Submit an Observation
              </Link>
              <Link href="/about" className="btn-outline">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Modern & Clean */}
      <footer className="bg-slate-950 text-slate-400">
        <div className="container-modern py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🍄</span>
                <span className="text-2xl font-bold text-white">Beacáin</span>
              </div>
              <p className="text-sm leading-relaxed">
                Ireland's citizen science platform for mushroom identification and mapping.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/map" className="hover:text-white transition-colors">Map</Link></li>
                <li><Link href="/species" className="hover:text-white transition-colors">Species Guide</Link></li>
                <li><Link href="/glossary" className="hover:text-white transition-colors">Irish Glossary</Link></li>
                <li><Link href="/observe" className="hover:text-white transition-colors">Add Observation</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Community</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal & Info</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><span className="text-slate-500">Version 1.1.0</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col items-center justify-center gap-2 text-sm">
              <p>
                © 2025 Beacáin • Open Source
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

