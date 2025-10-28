'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapClient from '@/components/map/map-client';
import { formatRelativeTime } from '@/lib/utils';

interface Observation {
  id: string;
  lat: number;
  lng: number;
  photoUrl: string;
  status: string;
  createdAt: string;
  observedAt: string | null;
  user: {
    handle: string;
  };
  identifications: Array<{
    species: {
      id: string;
      latinName: string;
      commonEn: string;
      sensitive: boolean;
    } | null;
  }>;
}

interface Species {
  id: string;
  latinName: string;
  commonEn: string;
}

export default function MapPage() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Filter states
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all'); // 'all' means show CONSENSUS and HAS_CANDIDATES by default
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers');

  // Fetch species for filter dropdown
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await fetch('/api/species?limit=100');
        if (response.ok) {
          const result = await response.json();
          setSpecies(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching species:', error);
      }
    };
    fetchSpecies();
  }, []);

  const fetchObservations = async () => {
    setIsLoading(true);
    try {
      // Build queries for all statuses we want
      const statusesToFetch: string[] = [];
      
      if (selectedStatus === 'all') {
        // Fetch both CONSENSUS and HAS_CANDIDATES
        statusesToFetch.push('CONSENSUS', 'HAS_CANDIDATES');
      } else {
        statusesToFetch.push(selectedStatus);
      }
      
      // Fetch observations for each status and combine
      const allObservations: Observation[] = [];
      
      for (const status of statusesToFetch) {
        const params = new URLSearchParams();
        params.set('limit', '100'); // API maximum is 100
        params.set('status', status);
        
        if (selectedSpecies !== 'all') {
          params.set('speciesId', selectedSpecies);
        }
        
        if (selectedMonth !== null) {
          params.set('month', selectedMonth.toString());
          params.set('year', selectedYear.toString());
        }
        
        try {
          const response = await fetch(`/api/observations?${params.toString()}`);
          if (response.ok) {
            const result = await response.json();
            const observations = result.data || [];
            allObservations.push(...observations);
            console.log(`Fetched ${observations.length} observations with status ${status}`);
          } else {
            const errorText = await response.text();
            console.error(`API error for ${status}:`, response.status, errorText);
          }
        } catch (err) {
          console.error(`Failed to fetch observations for ${status}:`, err);
        }
      }
      
      // Deduplicate by ID (in case of overlap)
      const uniqueObservations = Array.from(
        new Map(allObservations.map(obs => [obs.id, obs])).values()
      );
      
      console.log('Total unique observations:', uniqueObservations.length);
      setObservations(uniqueObservations);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching observations:', error);
      setObservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchObservations();
  }, [selectedSpecies, selectedStatus, selectedMonth, selectedYear]);

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

  const months = [
    { value: null, label: 'All Months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Generate last 5 years for year selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-white">
      {/* Map Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 flex">
          {/* Map */}
          <div className="flex-1">
            <MapClient 
              observations={mapObservations} 
              viewMode={viewMode}
              selectedMonth={selectedMonth}
            />
          </div>

          {/* Sidebar */}
          <div className="w-96 bg-white border-l overflow-y-auto hidden lg:block">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-forest-900">Map Filters</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchObservations}
                  disabled={isLoading}
                >
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>

              {/* View Mode Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  View Mode
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'markers' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('markers')}
                    className="flex-1"
                  >
                    Markers
                  </Button>
                  <Button
                    variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('heatmap')}
                    className="flex-1"
                  >
                    Heatmap
                  </Button>
                </div>
              </div>

              {/* Species Filter */}
              <div className="mb-4">
                <label htmlFor="species-filter" className="block text-sm font-medium text-slate-700 mb-2">
                  Species
                </label>
                <select
                  id="species-filter"
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="all">All Species</option>
                  {species.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.commonEn} ({sp.latinName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="mb-4">
                <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="all">All Status</option>
                  <option value="CONSENSUS">Consensus</option>
                  <option value="HAS_CANDIDATES">Has Candidates</option>
                  <option value="NEEDS_ID">Needs ID</option>
                </select>
              </div>

              {/* Month Filter */}
              <div className="mb-4">
                <label htmlFor="month-filter" className="block text-sm font-medium text-slate-700 mb-2">
                  Month
                </label>
                <select
                  id="month-filter"
                  value={selectedMonth?.toString() || 'all'}
                  onChange={(e) => setSelectedMonth(e.target.value === 'all' ? null : parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  {months.map((month) => (
                    <option key={month.value || 'all'} value={month.value?.toString() || 'all'}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter (only show if month is selected) */}
              {selectedMonth !== null && (
                <div className="mb-4">
                  <label htmlFor="year-filter" className="block text-sm font-medium text-slate-700 mb-2">
                    Year
                  </label>
                  <select
                    id="year-filter"
                    value={selectedYear.toString()}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  >
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Clear Filters */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSpecies('all');
                  setSelectedStatus('all');
                  setSelectedMonth(null);
                  setSelectedYear(currentYear);
                }}
                className="w-full mb-6"
              >
                Clear All Filters
              </Button>

              {/* Stats */}
              <div className="border-t pt-4 mb-4">
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-semibold">{observations.length}</span> observations shown
                </p>
                {lastRefresh && (
                  <p className="text-xs text-slate-500">
                    Last updated: {formatRelativeTime(lastRefresh)}
                  </p>
                )}
              </div>

              {/* Recent Observations List */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-4">Recent Observations</h3>
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
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h3 className="font-semibold text-slate-900 mb-2">Legend</h3>
          {viewMode === 'heatmap' ? (
            <div className="text-sm">
              <p className="text-slate-700 mb-2">Heat intensity shows observation density</p>
              {selectedMonth !== null && (
                <p className="text-xs text-slate-500">
                  Showing: {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                </p>
              )}
            </div>
          ) : (
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
          )}
          <p className="text-xs text-slate-500 mt-2">
            🔒 Privacy-first: Grid precision only
          </p>
        </div>
      </section>
    </div>
  );
}