'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { UserMenu } from '@/components/auth/user-menu';
import MapClient from '@/components/map/map-client';
import { formatRelativeTime } from '@/lib/utils';

interface Observation {
  id: string;
  lat: number;
  lng: number;
  photoUrl: string;
  status: string;
  createdAt: string;
  user: {
    handle: string;
  };
  identifications: Array<{
    species: {
      latinName: string;
      commonEn: string;
      sensitive: boolean;
    };
  }>;
}

export default function MapPage() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchObservations = async () => {
    try {
      const response = await fetch('/api/observations?limit=100');
      if (!response.ok) throw new Error('Failed to fetch observations');
      
      const data = await response.json();
      const filteredObservations = data.filter((obs: any) => 
        ['CONSENSUS', 'HAS_CANDIDATES'].includes(obs.status)
      );
      
      setObservations(filteredObservations);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching observations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchObservations();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchObservations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Transform for map component
  const mapObservations = observations.map((obs) => ({
    id: obs.id,
    lat: obs.lat,
    lng: obs.lng,
    photoUrl: obs.photoUrl,
    status: obs.status,
    identification: obs.identifications[0]?.species
      ? {
          latinName: obs.identifications[0].species.latinName,
          commonEn: obs.identifications[0].species.commonEn,
        }
      : null,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Map Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 flex">
          {/* Map */}
          <div className="flex-1">
            <MapClient observations={mapObservations} />
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white border-l overflow-y-auto hidden lg:block">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-forest-900">Recent Observations</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchObservations}
                  disabled={isLoading}
                >
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
              
              <p className="text-sm text-slate-600 mb-4">
                {observations.length} observations mapped
              </p>
              
              {lastRefresh && (
                <p className="text-xs text-slate-500 mb-4">
                  Last updated: {formatRelativeTime(lastRefresh)}
                </p>
              )}

              <div className="space-y-4">
                {observations.slice(0, 10).map((obs) => (
                  <Link key={obs.id} href={`/observation/${obs.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            <img
                              src={obs.photoUrl}
                              alt="Observation"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-slate-900">
                                {obs.identifications[0]?.species?.latinName || 'Needs identification'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                obs.status === 'CONSENSUS' ? 'bg-green-100 text-green-700' :
                                obs.status === 'HAS_CANDIDATES' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {obs.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">
                              by @{obs.user.handle} • {formatRelativeTime(new Date(obs.createdAt))}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h3 className="font-semibold text-slate-900 mb-2">Legend</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Needs ID</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Has candidates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Consensus</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            🔒 Privacy-first: Grid precision only
          </p>
        </div>
      </section>
    </div>
  );
}