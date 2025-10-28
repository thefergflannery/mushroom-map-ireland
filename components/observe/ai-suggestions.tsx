'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AISuggestionsProps {
  imageUrl: string;
  onSpeciesSelect?: (speciesId: string, confidence: number, rationale: string) => void;
}

export function AISuggestions({ imageUrl, onSpeciesSelect }: AISuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [disclaimer, setDisclaimer] = useState('');

  const handleGetSuggestions = async () => {
    if (!imageUrl) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to get AI suggestions (${response.status})`);
      }

      const data = await response.json();
      
      if (!data.data) {
        throw new Error('Invalid response from AI service');
      }
      
      setSuggestions(data.data.candidates || []);
      setDisclaimer(data.data.disclaimer || '');
    } catch (err: any) {
      console.error('AI suggestion error:', err);
      setError(err.message || 'Failed to get AI suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    if (onSpeciesSelect) {
      if (suggestion.species) {
        // Species in database
        onSpeciesSelect(
          suggestion.species.id,
          suggestion.confidence || 0.5,
          suggestion.rationale || ''
        );
      } else if (suggestion.label) {
        // Species not in database - use custom name
        // Note: This would need to be handled differently if we want to allow
        // AI suggestions to create identifications with custom names
        console.warn('AI suggested species not in database:', suggestion.label);
      }
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          AI Identification Assistant
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions to help identify your mushroom
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestions.length && !loading && (
          <div>
            <Button
              onClick={handleGetSuggestions}
              disabled={loading || !imageUrl}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              size="lg"
            >
              {loading ? 'Analyzing...' : !imageUrl ? 'Upload Image First' : '✨ Get AI Suggestions'}
            </Button>
            <p className="text-xs text-gray-600 mt-2 text-center">
              AI will analyze your photo and suggest possible identifications
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI is analyzing your photo...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
              <p className="text-xs text-amber-900 font-medium">
                ⚠️ {disclaimer || 'AI suggestions are assistive only. Community consensus determines final identification.'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">AI Suggestions:</h4>
              {suggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <Badge
                            variant={suggestion.confidence > 0.7 ? 'success' : 'warning'}
                            className="text-xs"
                          >
                            {Math.round((suggestion.confidence || 0) * 100)}% confident
                          </Badge>
                        </div>
                        
                        {suggestion.species ? (
                          <>
                            <p className="font-semibold italic">{suggestion.species.latinName}</p>
                            <p className="text-sm text-gray-600">{suggestion.species.commonEn}</p>
                            {suggestion.species.commonGa && (
                              <p className="text-xs text-gray-500">{suggestion.species.commonGa}</p>
                            )}
                          </>
                        ) : (
                          <p className="font-semibold">{suggestion.label}</p>
                        )}
                        
                        {suggestion.rationale && (
                          <p className="text-xs text-gray-600 mt-2">{suggestion.rationale}</p>
                        )}
                      </div>

                      {suggestion.species && (
                        <Badge className={`${
                          suggestion.species.edibility === 'DEADLY' ? 'bg-red-600' :
                          suggestion.species.edibility === 'TOXIC' ? 'bg-orange-500' :
                          suggestion.species.edibility === 'CHOICE' ? 'bg-green-600' :
                          'bg-gray-500'
                        } text-white`}>
                          {suggestion.species.edibility}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSuggestions([]);
                setDisclaimer('');
              }}
              className="w-full"
            >
              Clear Suggestions
            </Button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

