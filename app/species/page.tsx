import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { SpeciesList } from '@/components/species/species-list';

async function getSpecies() {
  return await prisma.species.findMany({
    orderBy: { latinName: 'asc' },
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
}

export default async function SpeciesGuidePage() {
  const species = await getSpecies();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Photography */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero1.jpg"
            alt="Mushroom species diversity"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-900/90 via-earth-900/85 to-forest-800/90"></div>
        </div>

        <div className="relative h-full container-modern flex items-center">
          <div className="max-w-3xl">
            <Link href="/" className="inline-block mb-6">
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full">
                <span className="mr-2">←</span> Back to Map
              </Button>
            </Link>
            
            <h1 className="heading-display text-white mb-6 text-shadow-lg">
              Irish Mushroom
              <br />
              Species Guide
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed text-shadow">
              Explore {species.length} mushroom species found across Ireland. From choice edibles to deadly poisonous varieties,
              learn to identify each species safely.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container-modern">
          <SpeciesList species={species} />
        </div>
      </section>

      {/* Safety Banner */}
      <section className="section-sm bg-amber-500">
        <div className="container-modern">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
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
