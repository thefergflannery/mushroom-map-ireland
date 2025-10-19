'use client';

import dynamic from 'next/dynamic';

const MushroomMap = dynamic(() => import('./mushroom-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default MushroomMap;

