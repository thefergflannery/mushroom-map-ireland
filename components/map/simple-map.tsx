'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

interface SimpleMapProps {
  observations: Array<{
    id: string;
    lat: number;
    lng: number;
    status: string;
    photoUrl: string;
    identification?: {
      latinName?: string;
      commonEn?: string;
    } | null;
  }>;
}

export default function SimpleMap({ observations }: SimpleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) {
      console.error('Map container not found');
      return;
    }
    
    if (map.current) return; // already initialized

    // Debug container dimensions
    const rect = mapContainer.current.getBoundingClientRect();
    console.log('Map container dimensions:', rect.width, 'x', rect.height);

    try {
      console.log('Creating MapLibre instance...');
      
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        // Use simple grayscale style
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              paint: {
                'raster-opacity': 0.7,
                'raster-hue-rotate': 0,
                'raster-saturation': -1, // Convert to grayscale
                'raster-contrast': 0.8,
                'raster-brightness-min': 0.1,
                'raster-brightness-max': 0.9
              }
            }
          ]
        },
        center: [-8.2439, 53.4129],
        zoom: 6.5,
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsLoading(false);
        // Ensure correct sizing when the map first loads
        map.current?.resize();
        
        // Add markers
        if (observations.length > 0) {
          observations.forEach((obs) => {
            if (!map.current) return;

            // Create marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'map-marker';
            markerEl.style.cssText = `
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              background: ${getStatusColor(obs.status)};
              transition: transform 0.2s ease;
            `;

            // Add thumbnail image
            const img = document.createElement('img');
            img.src = obs.photoUrl;
            img.style.cssText = `
              width: 34px;
              height: 34px;
              border-radius: 50%;
              object-fit: cover;
            `;
            img.alt = 'Observation';
            markerEl.appendChild(img);

            // Add hover effect
            markerEl.addEventListener('mouseenter', () => {
              markerEl.style.transform = 'scale(1.1)';
            });
            markerEl.addEventListener('mouseleave', () => {
              markerEl.style.transform = 'scale(1)';
            });

            // Create marker
            const marker = new maplibregl.Marker(markerEl)
              .setLngLat([obs.lng, obs.lat])
              .addTo(map.current);

            // Create popup content
            const popupContent = document.createElement('div');
            popupContent.style.cssText = `
              padding: 12px;
              min-width: 200px;
              font-family: system-ui, -apple-system, sans-serif;
            `;

            // Add thumbnail
            const popupImg = document.createElement('img');
            popupImg.src = obs.photoUrl;
            popupImg.style.cssText = `
              width: 60px;
              height: 60px;
              border-radius: 8px;
              object-fit: cover;
              margin-bottom: 8px;
              display: block;
            `;
            popupImg.alt = 'Observation';
            popupContent.appendChild(popupImg);

            // Add species name
            const speciesName = document.createElement('div');
            if (obs.identification?.latinName) {
              speciesName.innerHTML = `
                <div style="font-weight: 600; font-style: italic; color: #1f2937; margin-bottom: 2px;">
                  ${obs.identification.latinName}
                </div>
                <div style="font-size: 14px; color: #6b7280;">
                  ${obs.identification.commonEn || 'Unknown'}
                </div>
              `;
            } else {
              speciesName.innerHTML = `
                <div style="font-weight: 600; color: #1f2937;">
                  Needs Identification
                </div>
              `;
            }
            popupContent.appendChild(speciesName);

            // Add status badge
            const statusBadge = document.createElement('div');
            statusBadge.style.cssText = `
              display: inline-block;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
              margin-top: 8px;
              background: ${getStatusColor(obs.status)};
              color: white;
            `;
            statusBadge.textContent = obs.status.replace('_', ' ');
            popupContent.appendChild(statusBadge);

            // Create popup
            const popup = new maplibregl.Popup({
              offset: 25,
              closeButton: true,
              closeOnClick: false
            }).setDOMContent(popupContent);

            // Add click handler to open observation page
            markerEl.addEventListener('click', () => {
              window.open(`/observation/${obs.id}`, '_blank');
            });

            // Add popup to marker
            marker.setPopup(popup);
          });
          console.log(`Added ${observations.length} markers`);
        } else {
          console.log('No observations to display');
        }
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Map failed to load. Please refresh the page.');
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Map initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [observations]);

  // Resize on mount and when container size changes (e.g., tab switch)
  useEffect(() => {
    const id = setInterval(() => {
      map.current?.resize();
    }, 500);
    // Stop aggressive resizing after initial seconds
    const stop = setTimeout(() => clearInterval(id), 3000);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <p className="text-red-600 font-medium mb-2">Map Error</p>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-forest-600 text-white rounded hover:bg-forest-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative min-h-[400px] bg-gray-200">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {observations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 pointer-events-none">
          <div className="text-center">
            <p className="text-2xl mb-2">🍄</p>
            <p className="text-gray-600">No observations yet</p>
            <p className="text-sm text-gray-500">Be the first to add one!</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs pointer-events-auto">
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
        <div className="mt-2 pt-2 border-t text-[10px] text-gray-500">
          <p>🔒 Privacy-first: Grid precision only</p>
        </div>
      </div>
    </div>
  );
}

