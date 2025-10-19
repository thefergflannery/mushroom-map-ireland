'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapPickerProps {
  center: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number; lng: number } | null;
}

export default function MapPicker({ center, onLocationSelect, selectedLocation }: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-light': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'carto-light-layer',
            type: 'raster',
            source: 'carto-light',
          },
        ],
      },
      center: [center.lng, center.lat],
      zoom: 12,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add click handler
    map.current.on('click', (e) => {
      onLocationSelect(e.lngLat.lat, e.lngLat.lng);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update marker when location changes
  useEffect(() => {
    if (!map.current || !selectedLocation) return;

    // Remove old marker
    if (marker.current) {
      marker.current.remove();
    }

    // Add new marker
    const el = document.createElement('div');
    el.className = 'w-8 h-8 bg-forest-600 rounded-full border-4 border-white shadow-lg';
    el.style.cursor = 'pointer';

    marker.current = new maplibregl.Marker({ element: el })
      .setLngLat([selectedLocation.lng, selectedLocation.lat])
      .addTo(map.current);

    // Pan to location
    map.current.flyTo({
      center: [selectedLocation.lng, selectedLocation.lat],
      zoom: 14,
    });
  }, [selectedLocation]);

  return (
    <div
      ref={mapContainer}
      className="h-64 rounded-lg border border-gray-200 shadow-sm"
      role="application"
      aria-label="Location picker map"
    />
  );
}

