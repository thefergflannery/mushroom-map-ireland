'use client';

import dynamic from 'next/dynamic';

const SimpleMap = dynamic(() => import('./simple-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapClientProps {
  observations: Array<{
    id: string;
    lat: number;
    lng: number;
    photoUrl: string;
    status: string;
    identification?: {
      latinName?: string;
      commonEn?: string;
    } | null;
  }>;
  viewMode?: 'markers' | 'heatmap';
  selectedMonth?: number | null;
}

export default function MapClient({ observations, viewMode = 'markers', selectedMonth = null }: MapClientProps) {
  return <SimpleMap observations={observations} viewMode={viewMode} selectedMonth={selectedMonth} />;
}

