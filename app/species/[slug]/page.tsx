import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { SafetyBanner } from '@/components/common/safety-banner';

interface PageProps {
  params: { slug: string };
}

const edibilityColors: Record<string, string> = {
  CHOICE:  'bg-forest-700 text-white',
  EDIBLE:  'bg-forest-600 text-white',
  CAUTION: 'bg-amber-500 text-white',
  TOXIC:   'bg-orange-600 text-white',
  DEADLY:  'bg-red-700 text-white',
  UNKNOWN: 'bg-slate-500 text-white',
};

const edibilityDescriptions: Record<string, string> = {
  CHOICE:  'Highly regarded edible mushroom',
  EDIBLE:  'Edible, but may require proper preparation',
  CAUTION: 'Edible with caution — may cause reactions in some people',
  TOXIC:   'Toxic — will cause illness if consumed',
  DEADLY:  'Deadly poisonous — can be fatal',
  UNKNOWN: 'Edibility unknown or uncertain',
};

export default async function SpeciesDetailPage({ params }: PageProps) {
  const species = await prisma.species.findUnique({
    where: { slug: params.slug },
    include: {
      _count: {
        select: {
          identifications: { where: { isConsensus: true } },
        },
      },
    },
  });

  if (!species) notFound();

  const lookalikes = species.lookalikeIds.length > 0
    ? await prisma.species.findMany({
        where: { id: { in: species.lookalikeIds } },
        select: {
          id: true, latinName: true, commonEn: true, commonGa: true,
          slug: true, edibility: true, keyTraits: true, heroImageUrl: true,
        },
      })
    : [];

  const recentObservations = await prisma.observation.findMany({
    where: {
      identifications: { some: { speciesId: species.id, isConsensus: true } },
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: { id: true, photoUrl: true, createdAt: true, grid1km: true },
  });

  const isHazardous = species.edibility === 'DEADLY' || species.edibility === 'TOXIC';

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container-modern py-10 max-w-6xl">

        {/* Back link */}
        <Link href="/species" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-forest-700 transition-colors mb-8">
          <span>←</span> Back to Species Guide
        </Link>

        <SafetyBanner />

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-10 mt-8 mb-12">
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold italic text-forest-900 mb-1">{species.latinName}</h1>
              <p className="text-2xl font-semibold text-slate-700 mb-1">{species.commonEn}</p>
              {species.commonGa && (
                <p className="text-xl text-slate-500">{species.commonGa}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className={`${edibilityColors[species.edibility]} text-sm px-4 py-1.5 rounded-full font-bold`}>
                {species.edibility}
              </Badge>
              {species.sensitive && (
                <Badge variant="outline" className="text-sm px-4 py-1.5 rounded-full border-amber-500 text-amber-700 font-semibold">
                  🔒 Sensitive Species
                </Badge>
              )}
            </div>

            <Card className={`card-modern ${isHazardous ? 'bg-red-50 border-red-200' : ''}`}>
              <CardContent className="pt-6 space-y-3">
                <p className={`font-semibold ${isHazardous ? 'text-red-900' : 'text-slate-800'}`}>
                  {edibilityDescriptions[species.edibility]}
                </p>
                {isHazardous && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-sm text-red-900 font-bold">⚠️ DO NOT CONSUME — consult an expert mycologist in person</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Image */}
          <div>
            {species.heroImageUrl ? (
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                <Image src={species.heroImageUrl} alt={species.commonEn} fill className="object-cover" />
              </div>
            ) : (
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-slate-200 flex items-center justify-center">
                <p className="text-slate-500 text-lg">No image available</p>
              </div>
            )}
          </div>
        </div>

        {/* Details grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-xl text-forest-900">Identification Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              {species.keyTraits && (
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Key Traits</p>
                  <p>{species.keyTraits}</p>
                </div>
              )}
              {species.habitat && (
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Habitat</p>
                  <p>{species.habitat}</p>
                </div>
              )}
              {species.season && (
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Season</p>
                  <p>{species.season}</p>
                </div>
              )}
              {!species.keyTraits && !species.habitat && !species.season && (
                <p className="text-slate-400 italic">No identification details available yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-xl text-forest-900">Community Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-5xl font-extrabold text-forest-700 mb-1">{species._count.identifications}</p>
                <p className="text-sm text-slate-600">Confirmed observations on platform</p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <Link href={`/map?species=${species.id}`}>
                  <Button variant="outline" className="w-full rounded-full">
                    View on Map →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lookalikes */}
        {lookalikes.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-forest-900">⚠️ Lookalike Species</h2>
            </div>
            <p className="text-slate-600 mb-6">
              These species can be confused with <span className="italic">{species.commonEn}</span>. Take extra care when identifying.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {lookalikes.map((lookalike) => (
                <Link key={lookalike.id} href={`/species/${lookalike.slug}`}>
                  <div className="card-modern group cursor-pointer overflow-hidden flex gap-0">
                    {lookalike.heroImageUrl && (
                      <div className="relative w-28 flex-shrink-0">
                        <Image
                          src={lookalike.heroImageUrl}
                          alt={lookalike.commonEn}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <p className="font-bold italic text-forest-900 text-sm">{lookalike.latinName}</p>
                      <p className="text-slate-600 text-sm mb-2">{lookalike.commonEn}</p>
                      <Badge className={`${edibilityColors[lookalike.edibility]} text-xs px-3 py-0.5 rounded-full`}>
                        {lookalike.edibility}
                      </Badge>
                      {lookalike.keyTraits && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{lookalike.keyTraits}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Observations */}
        {recentObservations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-forest-900 mb-2">Recent Observations</h2>
            <p className="text-slate-600 mb-6">
              Community members have spotted this species {recentObservations.length} time{recentObservations.length !== 1 ? 's' : ''} recently.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recentObservations.map((obs) => (
                <Link key={obs.id} href={`/observation/${obs.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow">
                      <Image src={obs.photoUrl} alt="Observation" fill className="object-cover img-hover-zoom" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">Grid: {obs.grid1km}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
