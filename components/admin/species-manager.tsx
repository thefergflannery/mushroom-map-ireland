'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SpeciesManagerProps {
  species: any[];
}

export function SpeciesManager({ species }: SpeciesManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecies = species.filter(s =>
    s.latinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.commonEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const edibilityColors = {
    CHOICE: 'bg-forest-700 text-white',
    EDIBLE: 'bg-forest-600 text-white',
    CAUTION: 'bg-amber-500 text-white',
    TOXIC: 'bg-orange-600 text-white',
    DEADLY: 'bg-red-700 text-white',
    UNKNOWN: 'bg-slate-500 text-white',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-forest-900">Species Management</h2>
        <Button className="bg-forest-700 hover:bg-forest-800">
          + Add New Species
        </Button>
      </div>

      <Card className="card-modern">
        <CardContent className="p-6">
          <input
            type="text"
            placeholder="Search species by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpecies.map((sp) => (
          <Card key={sp.id} className="card-modern">
            <CardContent className="p-6">
              <div className="mb-3">
                <Badge className={`${edibilityColors[sp.edibility]} font-semibold`}>
                  {sp.edibility}
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold text-forest-900 mb-1 italic">{sp.latinName}</h3>
              <p className="text-lg text-slate-700 mb-1">{sp.commonEn}</p>
              {sp.commonGa && (
                <p className="text-sm text-slate-600 mb-3">{sp.commonGa}</p>
              )}

              <div className="text-sm text-slate-600 mb-4">
                {sp._count.identifications} identifications
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Link href={`/species/${sp.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

