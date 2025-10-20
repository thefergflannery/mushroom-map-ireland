'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Species {
  id: string;
  latinName: string;
  commonEn: string;
  commonGa: string | null;
  slug: string;
  edibility: string;
  sensitive: boolean;
  heroImageUrl: string | null;
  season: string | null;
  habitat: string | null;
  keyTraits: string | null;
  _count: {
    identifications: number;
  };
}

interface SpeciesListProps {
  species: Species[];
}

export function SpeciesList({ species }: SpeciesListProps) {
  const [search, setSearch] = useState('');
  const [edibilityFilter, setEdibilityFilter] = useState<string>('ALL');

  const edibilityColors: Record<string, string> = {
    CHOICE: 'bg-green-600',
    EDIBLE: 'bg-green-500',
    CAUTION: 'bg-yellow-500',
    TOXIC: 'bg-orange-500',
    DEADLY: 'bg-red-600',
    UNKNOWN: 'bg-gray-400',
  };

  const filteredSpecies = useMemo(() => {
    return species.filter((sp) => {
      const matchesSearch =
        search === '' ||
        sp.latinName.toLowerCase().includes(search.toLowerCase()) ||
        sp.commonEn.toLowerCase().includes(search.toLowerCase()) ||
        (sp.commonGa && sp.commonGa.toLowerCase().includes(search.toLowerCase())) ||
        (sp.habitat && sp.habitat.toLowerCase().includes(search.toLowerCase()));

      const matchesEdibility = edibilityFilter === 'ALL' || sp.edibility === edibilityFilter;

      return matchesSearch && matchesEdibility;
    });
  }, [species, search, edibilityFilter]);

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search by name, habitat, or features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setEdibilityFilter('ALL')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                edibilityFilter === 'ALL'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setEdibilityFilter('EDIBLE')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                edibilityFilter === 'EDIBLE'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Edible
            </button>
            <button
              onClick={() => setEdibilityFilter('CHOICE')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                edibilityFilter === 'CHOICE'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Choice
            </button>
            <button
              onClick={() => setEdibilityFilter('TOXIC')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                edibilityFilter === 'TOXIC'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              Toxic
            </button>
            <button
              onClick={() => setEdibilityFilter('DEADLY')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                edibilityFilter === 'DEADLY'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Deadly
            </button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Showing {filteredSpecies.length} of {species.length} species
        </p>
      </div>

      {/* Species Grid */}
      {filteredSpecies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No species found matching your criteria</p>
          <button
            onClick={() => {
              setSearch('');
              setEdibilityFilter('ALL');
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecies.map((sp) => (
            <Link href={`/species/${sp.slug}`} key={sp.id}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                {sp.heroImageUrl && (
                  <div className="h-48 overflow-hidden rounded-t-lg relative">
                    <Image
                      src={sp.heroImageUrl}
                      alt={sp.commonEn}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
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
                          Protected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {sp.keyTraits && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{sp.keyTraits}</p>
                  )}
                  {sp.season && (
                    <div className="text-xs text-muted-foreground mb-2">
                      <span className="font-medium">Season:</span> {sp.season}
                    </div>
                  )}
                  {sp.habitat && (
                    <div className="text-xs text-muted-foreground mb-2">
                      <span className="font-medium">Habitat:</span> {sp.habitat}
                    </div>
                  )}
                  {sp._count.identifications > 0 && (
                    <p className="text-xs text-blue-600">
                      {sp._count.identifications} observation{sp._count.identifications !== 1 ? 's' : ''}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

