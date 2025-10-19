'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapObservation {
  id: string;
  lat: number;
  lng: number;
  status: 'NEEDS_ID' | 'HAS_CANDIDATES' | 'CONSENSUS';
  photoUrl: string;
  identifications?: Array<{
    species?: {
      latinName: string;
      commonEn: string;
    };
  }>;
}

interface MushroomMapProps {
  observations: MapObservation[];
  onObservationClick?: (id: string) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export default function MushroomMap({
  observations,
  onObservationClick,
  initialCenter = [-8.2439, 53.4129], // Ireland center
  initialZoom = 7,
}: MushroomMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Initialize map
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
              'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        },
        layers: [
          {
            id: 'carto-light-layer',
            type: 'raster',
            source: 'carto-light',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: true,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add scale
    map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-left'
    );

    // Keyboard navigation
    map.current.keyboard.enable();

    map.current.on('load', () => {
      setLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [initialCenter, initialZoom]);

  // Update markers when observations change
  useEffect(() => {
    if (!map.current || !loaded) return;

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    observations.forEach((obs) => {
      if (!map.current) return;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'observation-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.backgroundImage = `url(${obs.photoUrl})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', `Observation ${obs.id}`);
      el.setAttribute('tabindex', '0');

      // Status indicator
      const statusColors = {
        NEEDS_ID: '#3b82f6', // blue
        HAS_CANDIDATES: '#f59e0b', // amber
        CONSENSUS: '#10b981', // green
      };

      const statusDot = document.createElement('div');
      statusDot.style.position = 'absolute';
      statusDot.style.bottom = '-2px';
      statusDot.style.right = '-2px';
      statusDot.style.width = '12px';
      statusDot.style.height = '12px';
      statusDot.style.borderRadius = '50%';
      statusDot.style.backgroundColor = statusColors[obs.status];
      statusDot.style.border = '2px solid white';
      el.appendChild(statusDot);

      // Create marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([obs.lng, obs.lat])
        .addTo(map.current);

      // Create popup
      const species = obs.identifications?.[0]?.species;
      const popupContent = `
        <div class="p-2">
          <img src="${obs.photoUrl}" alt="Observation" class="w-32 h-32 object-cover rounded mb-2" />
          ${
            species
              ? `<p class="font-semibold text-sm">${species.latinName}</p>
                 <p class="text-xs text-gray-600">${species.commonEn}</p>`
              : '<p class="text-sm text-gray-600">Needs identification</p>'
          }
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(popupContent);

      marker.setPopup(popup);

      // Click handler
      el.addEventListener('click', () => {
        if (onObservationClick) {
          onObservationClick(obs.id);
        }
      });

      // Keyboard handler
      el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onObservationClick) {
            onObservationClick(obs.id);
          }
        }
      });

      markers.current.push(marker);
    });
  }, [observations, loaded, onObservationClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" role="application" aria-label="Interactive map" />
      
      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <h3 className="font-semibold mb-2">Legend</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Needs ID</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Has candidates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Consensus</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t text-xs text-gray-500">
          <p>Locations shown at grid precision</p>
          <p className="text-[10px]">Privacy-first: no exact coordinates</p>
        </div>
      </div>

      {/* Accessibility skip link */}
      <a href="#content" className="skip-to-content">
        Skip map navigation
      </a>
    </div>
  );
}

