'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Species {
  id: string;
  latinName: string;
  commonEn: string;
  commonGa?: string | null;
  edibility: string;
}

interface IdentificationFormProps {
  observationId: string;
  availableSpecies: Species[];
}

export function IdentificationForm({ observationId, availableSpecies }: IdentificationFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [speciesId, setSpeciesId] = useState('');
  const [speciesName, setSpeciesName] = useState(''); // For species not in database
  const [useCustomName, setUseCustomName] = useState(false);
  const [confidence, setConfidence] = useState(0.7);
  const [rationale, setRationale] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecies = availableSpecies.filter(
    (sp) =>
      sp.latinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.commonEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.commonGa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSpecies = availableSpecies.find((sp) => sp.id === speciesId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!speciesId && !speciesName.trim()) {
      setError('Please select a species or enter a species name');
      return;
    }

    if (!rationale.trim()) {
      setError('Please explain your reasoning');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/identifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          observationId,
          speciesId: speciesId || undefined,
          speciesName: speciesName.trim() || undefined,
          confidence,
          rationale: rationale.trim(),
          method: 'HUMAN',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit identification');
      }

      // Success - refresh and close
      router.refresh();
      setIsOpen(false);
      setSpeciesId('');
      setSpeciesName('');
      setUseCustomName(false);
      setRationale('');
      setConfidence(0.7);
    } catch (err: any) {
      setError(err.message || 'Failed to submit identification');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-forest-600 hover:bg-forest-700"
      >
        Propose Identification
      </Button>
    );
  }

  return (
    <Card className="border-forest-200 bg-forest-50/50">
      <CardHeader>
        <CardTitle className="text-lg">Propose Identification</CardTitle>
        <CardDescription>
          Share your expert knowledge to help identify this mushroom
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Species Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Species *</label>
            
            {/* Toggle between database search and custom name */}
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  setUseCustomName(false);
                  setSpeciesName('');
                  setSpeciesId('');
                }}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  !useCustomName
                    ? 'bg-forest-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Search Database
              </button>
              <button
                type="button"
                onClick={() => {
                  setUseCustomName(true);
                  setSpeciesId('');
                  setSearchTerm('');
                }}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  useCustomName
                    ? 'bg-forest-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Enter Custom Name
              </button>
            </div>

            {!useCustomName ? (
              <>
                <input
                  type="text"
                  placeholder="Search species by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                />
                
                {searchTerm && filteredSpecies.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white">
                    {filteredSpecies.slice(0, 10).map((sp) => (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() => {
                          setSpeciesId(sp.id);
                          setSearchTerm('');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b last:border-0"
                      >
                        <p className="font-medium text-sm italic">{sp.latinName}</p>
                        <p className="text-xs text-gray-600">{sp.commonEn}</p>
                      </button>
                    ))}
                  </div>
                )}

                {selectedSpecies && (
                  <div className="p-3 bg-white border border-forest-300 rounded-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium italic">{selectedSpecies.latinName}</p>
                        <p className="text-sm text-gray-600">{selectedSpecies.commonEn}</p>
                        {selectedSpecies.commonGa && (
                          <p className="text-xs text-gray-500">{selectedSpecies.commonGa}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSpeciesId('')}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter scientific name (e.g., Amanita muscaria)..."
                  value={speciesName}
                  onChange={(e) => setSpeciesName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                />
                <p className="text-xs text-gray-500">
                  Enter the scientific (Latin) name for species not yet in our database. 
                  This allows the community to identify new species.
                </p>
              </div>
            )}
          </div>

          {/* Confidence */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Confidence: {Math.round(confidence * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Uncertain</span>
              <span>Very Confident</span>
            </div>
          </div>

          {/* Rationale */}
          <div className="space-y-2">
            <label htmlFor="rationale" className="text-sm font-medium">
              Rationale * (Key identification features)
            </label>
            <textarea
              id="rationale"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-forest-600 focus:border-transparent"
              placeholder="Describe the key features that support this identification (cap color/shape, gill type, stem characteristics, habitat, etc.)"
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500">{rationale.length} / 1000 characters</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={(!speciesId && !speciesName.trim()) || !rationale.trim() || submitting}
              className="flex-1 bg-forest-600 hover:bg-forest-700"
            >
              {submitting ? 'Submitting...' : 'Submit Identification'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

