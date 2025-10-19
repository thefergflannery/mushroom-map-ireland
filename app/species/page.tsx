import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';

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

  const edibilityColors: Record<string, string> = {
    CHOICE: 'bg-green-600',
    EDIBLE: 'bg-green-500',
    CAUTION: 'bg-yellow-500',
    TOXIC: 'bg-orange-500',
    DEADLY: 'bg-red-600',
    UNKNOWN: 'bg-gray-400',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">← Back to Map</Button>
          </Link>
          <h1 className="text-2xl font-bold">Species Guide</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Irish Mushroom Species</h2>
          <p className="text-muted-foreground">
            Explore {species.length} common mushroom species found in Ireland. Click any species to learn more about
            identification features, habitat, and safety information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {species.map((sp) => (
            <Link href={`/species/${sp.slug}`} key={sp.id}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                {sp.heroImageUrl && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={sp.heroImageUrl}
                      alt={sp.commonEn}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg italic">{sp.latinName}</CardTitle>
                      <CardDescription className="text-base font-medium">{sp.commonEn}</CardDescription>
                      {sp.commonGa && <p className="text-sm text-muted-foreground">{sp.commonGa}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={`${edibilityColors[sp.edibility]} text-white text-xs`}>
                        {sp.edibility}
                      </Badge>
                      {sp.sensitive && (
                        <Badge variant="outline" className="text-xs">
                          Sensitive
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {sp.habitat && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">
                        <strong>Habitat:</strong> {sp.habitat}
                      </p>
                    </div>
                  )}
                  {sp.season && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">
                        <strong>Season:</strong> {sp.season}
                      </p>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {sp._count.identifications} confirmed observation{sp._count.identifications !== 1 ? 's' : ''}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-8 bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">⚠️ Safety Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This guide is for educational purposes only. Many edible species have toxic lookalikes. Never consume
              wild mushrooms without expert verification in person.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

