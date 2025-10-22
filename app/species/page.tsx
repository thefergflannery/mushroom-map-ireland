'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SpeciesList } from '@/components/species/species-list';

interface Species {
  id: string;
  latinName: string;
  commonEn: string;
  commonGa: string | null;
  slug: string;
  edibility: string;
  sensitive: boolean;
  hidden: boolean;
  heroImageUrl: string | null;
  season: string | null;
  habitat: string | null;
  keyTraits: string | null;
  _count: {
    identifications: number;
  };
}

export default function SpeciesGuidePage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpecies = async () => {
    try {
      const response = await fetch('/api/species');
      if (!response.ok) throw new Error('Failed to fetch species');
      
      const data = await response.json();
      setSpecies(data);
    } catch (error) {
      console.error('Error fetching species:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
    
    // Refresh every 30 seconds to get updated images
    const interval = setInterval(fetchSpecies, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-forest-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading species...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Photography */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden" aria-label="Species guide hero section">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80"
            alt="Mushroom forest floor"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/70"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="container-modern">
            <div className="max-w-4xl">
              <h1 className="heading-display text-white mb-6">
                Irish Mushroom Species Guide
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
                Discover Ireland's diverse fungal kingdom. From choice edibles to deadly poisonous varieties, 
                learn to identify mushrooms safely and responsibly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/observe">
                  <Button size="lg" className="bg-forest-700 hover:bg-forest-800 rounded-full px-8">
                    Submit Your Find
                  </Button>
                </Link>
                <Link href="/glossary">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900 rounded-full px-8">
                    Irish Glossary
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="section bg-white" role="main">
        <div className="container-modern">
          <SpeciesList species={species} />
        </div>
      </main>

      {/* Safety Banner */}
      <section className="section-sm bg-amber-500" role="alert" aria-labelledby="safety-heading">
        <div className="container-modern">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6" aria-hidden="true">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 id="safety-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              For Identification Only
            </h2>
            <p className="text-lg md:text-xl text-white/95 leading-relaxed max-w-2xl mx-auto">
              This guide is for educational purposes only. Many edible species have toxic lookalikes. Always consult
              an expert mycologist in person before consuming any wild mushroom.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}