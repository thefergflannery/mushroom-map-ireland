import Link from 'next/link';
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

        <SpeciesList species={species} />
      </main>
    </div>
  );
}

