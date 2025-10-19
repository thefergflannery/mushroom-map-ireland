'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('./map-picker'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [loading, setLoading] = useState(false);

  const handleUseMyLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          onLocationSelect(newLocation.lat, newLocation.lng);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please click on the map instead.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    onLocationSelect(lat, lng);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {location
            ? `Selected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
            : 'Click on the map or use your location'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUseMyLocation}
          disabled={loading}
        >
          {loading ? 'Getting location...' : '📍 Use My Location'}
        </Button>
      </div>

      <MapPicker
        center={location || { lat: 53.3498, lng: -6.2603 }}
        onLocationSelect={handleMapClick}
        selectedLocation={location}
      />

      {location && (
        <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-3">
          <p className="font-medium text-blue-900 mb-1">🔒 Privacy Protected</p>
          <p>Your exact location is stored privately. The public map will show this at 1km grid precision.</p>
        </div>
      )}
    </div>
  );
}

