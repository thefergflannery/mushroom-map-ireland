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
  hidden: boolean;
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
      // Exclude hidden species
      if (sp.hidden) return false;
      
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
              aria-label="Search species by name, habitat, or features"
              aria-describedby="search-help"
            />
            <p id="search-help" className="text-sm text-slate-500 mt-1">
              Search by Latin name, common name, Irish name, or habitat
            </p>
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
            <Link href={`/species/${sp.slug}`} key={sp.id} aria-label={`View details for ${sp.commonEn} (${sp.latinName})`}>
              <Card className="card-modern h-full group" role="article">
                <div className="h-64 overflow-hidden rounded-t-2xl relative bg-slate-100">
                  {sp.heroImageUrl ? (
                    <Image
                      key={sp.heroImageUrl} // Force re-render when URL changes
                      src={sp.heroImageUrl}
                      alt={`${sp.commonEn} mushroom`}
                      fill
                      className="object-cover img-hover-zoom"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={false}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-700 to-forest-900 flex items-center justify-center" aria-hidden="true">
                      <span className="text-9xl opacity-20">🍄</span>
                    </div>
                  )}
                  
                  {/* Edibility badge overlay */}
                  <div className="absolute top-4 right-4 z-10">
                    <span 
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${edibilityColors[sp.edibility].replace('bg-', 'bg-')} text-white`}
                      aria-label={`Edibility: ${sp.edibility}`}
                    >
                      {sp.edibility}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-forest-900 mb-1 italic group-hover:text-forest-700 transition-colors">
                    {sp.latinName}
                  </h3>
                  <p className="text-lg font-semibold text-slate-700 mb-1">{sp.commonEn}</p>
                  {sp.commonGa && (
                    <p className="text-sm text-slate-500 mb-4">{sp.commonGa}</p>
                  )}
                  
                  {sp.keyTraits && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">{sp.keyTraits}</p>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    {sp._count.identifications > 0 && (
                      <div className="text-sm">
                        <span className="font-bold text-forest-700">{sp._count.identifications}</span>
                        <span className="text-slate-600 ml-1">observations</span>
                      </div>
                    )}
                    {sp.sensitive && (
                      <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                        Protected
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

