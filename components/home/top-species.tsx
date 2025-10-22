import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export async function TopSpecies() {
  const topSpecies = await prisma.species.findMany({
    take: 8,
    include: {
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
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Most Identified Species</CardTitle>
          <p className="text-sm text-gray-500">
            Top mushrooms identified by our community
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topSpecies.map((species, index) => (
            <Link key={species.id} href={`/species/${species.slug}`}>
              <div className="border rounded-lg p-3 hover:bg-gray-50 hover:border-green-500 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg font-bold ${
                    index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-600'
                  }`}>
                    #{index + 1}
                  </span>
                  <Badge className={`${edibilityColors[species.edibility]} text-white text-xs`}>
                    {species.edibility}
                  </Badge>
                </div>
                <p className="text-sm italic font-medium text-gray-900">{species.latinName}</p>
                <p className="text-xs text-gray-600">{species.commonEn}</p>
                <p className="text-xs font-bold text-green-700 mt-2">
                  {species._count.identifications} IDs
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/species">
            <Button variant="outline" size="sm">
              View All Species →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
    </section>
  );
}

