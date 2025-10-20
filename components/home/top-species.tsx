import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export async function TopSpecies() {
  const topSpecies = await prisma.species.findMany({
    take: 6,
    include: {
      identifications: {
        where: { isConsensus: true },
      },
      _count: {
        select: {
          identifications: {
            where: { isConsensus: true },
          },
        },
      },
    },
    orderBy: {
      identifications: {
        _count: 'desc',
      },
    },
  });

  const edibilityColors: Record<string, string> = {
    CHOICE: 'bg-green-600',
    EDIBLE: 'bg-green-500',
    CAUTION: 'bg-yellow-500',
    TOXIC: 'bg-orange-500',
    DEADLY: 'bg-red-600',
    UNKNOWN: 'bg-gray-400',
  };

  if (topSpecies.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Most Identified Species</h3>
          <p className="text-gray-600">
            The mushrooms our community has spotted and identified most frequently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSpecies.map((species, index) => (
            <Link key={species.id} href={`/species/${species.slug}`}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden">
                {/* Rank Badge */}
                {index < 3 && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                )}

                {species.heroImageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={species.heroImageUrl}
                      alt={species.commonEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-lg">
                    <p className="italic text-gray-900">{species.latinName}</p>
                    <p className="text-base font-medium text-gray-700 mt-1">{species.commonEn}</p>
                    {species.commonGa && (
                      <p className="text-sm text-gray-600 font-normal mt-1">{species.commonGa}</p>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={`${edibilityColors[species.edibility]} text-white`}>
                      {species.edibility}
                    </Badge>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-forest-700">{species._count.identifications}</p>
                      <p className="text-xs text-gray-500">observations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/species">
            <button className="px-6 py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors font-medium">
              View All Species →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

