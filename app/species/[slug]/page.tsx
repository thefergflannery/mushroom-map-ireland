import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

interface PageProps {
  params: { slug: string };
}

export default async function SpeciesDetailPage({ params }: PageProps) {
  const species = await prisma.species.findUnique({
    where: { slug: params.slug },
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

  if (!species) {
    notFound();
  }

  // Get lookalike species
  let lookalikes = [];
  if (species.lookalikeIds.length > 0) {
    lookalikes = await prisma.species.findMany({
      where: {
        id: { in: species.lookalikeIds },
      },
      select: {
        id: true,
        latinName: true,
        commonEn: true,
        commonGa: true,
        slug: true,
        edibility: true,
        keyTraits: true,
        heroImageUrl: true,
      },
    });
  }

  // Get recent observations of this species
  const recentObservations = await prisma.observation.findMany({
    where: {
      identifications: {
        some: {
          speciesId: species.id,
          isConsensus: true,
        },
      },
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      photoUrl: true,
      createdAt: true,
      grid1km: true,
    },
  });

  const edibilityColors: Record<string, string> = {
    CHOICE: 'bg-green-600 text-white',
    EDIBLE: 'bg-green-500 text-white',
    CAUTION: 'bg-yellow-500 text-white',
    TOXIC: 'bg-orange-500 text-white',
    DEADLY: 'bg-red-600 text-white',
    UNKNOWN: 'bg-gray-400 text-white',
  };

  const edibilityDescriptions: Record<string, string> = {
    CHOICE: 'Highly regarded edible mushroom',
    EDIBLE: 'Edible, but may require proper preparation',
    CAUTION: 'Edible with caution - may cause reactions in some people',
    TOXIC: 'Toxic - will cause illness if consumed',
    DEADLY: 'Deadly poisonous - can be fatal',
    UNKNOWN: 'Edibility unknown or uncertain',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/species">
            <Button variant="ghost">← Back to Species Guide</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold italic text-gray-900 mb-2">{species.latinName}</h1>
              <p className="text-2xl text-gray-700 mb-1">{species.commonEn}</p>
              {species.commonGa && (
                <p className="text-xl text-gray-600">{species.commonGa}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className={`${edibilityColors[species.edibility]} text-base px-4 py-2`}>
                {species.edibility}
              </Badge>
              {species.sensitive && (
                <Badge variant="outline" className="text-base px-4 py-2 border-amber-500 text-amber-700">
                  🔒 Sensitive Species
                </Badge>
              )}
            </div>

            <Card className={species.edibility === 'DEADLY' || species.edibility === 'TOXIC' ? 'bg-red-50 border-red-300' : ''}>
              <CardContent className="pt-6">
                <p className="font-medium mb-2">Edibility:</p>
                <p className={species.edibility === 'DEADLY' || species.edibility === 'TOXIC' ? 'text-red-800' : ''}>
                  {edibilityDescriptions[species.edibility]}
                </p>
                {(species.edibility === 'DEADLY' || species.edibility === 'TOXIC') && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
                    <p className="text-sm text-red-900 font-bold">⚠️ WARNING: DO NOT CONSUME</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {species.heroImageUrl ? (
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={species.heroImageUrl}
                  alt={species.commonEn}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle>Identification Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {species.keyTraits && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Key Traits:</p>
                  <p className="text-gray-600">{species.keyTraits}</p>
                </div>
              )}
              {species.habitat && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Habitat:</p>
                  <p className="text-gray-600">{species.habitat}</p>
                </div>
              )}
              {species.season && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Season:</p>
                  <p className="text-gray-600">{species.season}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Community Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-forest-700">{species._count.identifications}</p>
                <p className="text-sm text-gray-600">Confirmed observations on platform</p>
              </div>
              <div className="pt-4 border-t">
                <Link href={`/?species=${species.id}`}>
                  <Button variant="outline" className="w-full">
                    View on Map
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lookalikes */}
        {lookalikes.length > 0 && (
          <Card className="mb-12 bg-amber-50 border-amber-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚠️ Lookalike Species
              </CardTitle>
              <CardDescription>
                These species can be confused with {species.commonEn}. Take extra care when identifying!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {lookalikes.map((lookalike) => (
                  <Link key={lookalike.id} href={`/species/${lookalike.slug}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      {lookalike.heroImageUrl && (
                        <div className="relative h-32 overflow-hidden rounded-t-lg">
                          <Image
                            src={lookalike.heroImageUrl}
                            alt={lookalike.commonEn}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="pt-4">
                        <p className="font-semibold italic text-sm">{lookalike.latinName}</p>
                        <p className="text-sm text-gray-600">{lookalike.commonEn}</p>
                        <Badge className={`mt-2 ${edibilityColors[lookalike.edibility]}`}>
                          {lookalike.edibility}
                        </Badge>
                        {lookalike.keyTraits && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{lookalike.keyTraits}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Observations */}
        {recentObservations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Observations</CardTitle>
              <CardDescription>
                Community members have spotted this species {recentObservations.length} time{recentObservations.length !== 1 ? 's' : ''} recently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recentObservations.map((obs) => (
                  <Link key={obs.id} href={`/observation/${obs.id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                        <Image
                          src={obs.photoUrl}
                          alt="Observation"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Grid: {obs.grid1km}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Warning */}
        <Card className="mt-12 bg-amber-50 border-amber-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚠️ Safety Reminder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-900">
              <strong>Never consume wild mushrooms without expert verification in person.</strong> This guide is for educational purposes only. Many edible species have toxic lookalikes that can cause serious illness or death.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

