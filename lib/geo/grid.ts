/**
 * Privacy-first grid snapping utilities for Mushroom Map Ireland
 * Converts exact lat/lng to grid references (Irish National Grid)
 */

export interface GridCoordinates {
  lat: number;
  lng: number;
  grid1km: string;
  grid10km: string;
}

/**
 * Convert WGS84 lat/lng to Irish National Grid reference
 * Simplified implementation - uses approximate grid squares
 * For production, consider using proj4js or a proper ITM converter
 */
export function latLngToIrishGrid(lat: number, lng: number): string {
  // Irish National Grid covers roughly:
  // Lat: 51.4° to 55.4°N
  // Lng: -10.5° to -5.4°W
  
  // Convert to grid reference (simplified)
  // Real implementation would use ITM projection
  const gridLetters = 'VWXYZABCDEFGHJKLMNOPQRSTUVWXYZ';
  
  // Normalize to grid space (100km squares)
  const normalizedLat = ((lat - 51.4) / 4.0) * 5; // 0-5
  const normalizedLng = ((lng + 10.5) / 5.1) * 5; // 0-5
  
  const letterIndex = Math.floor(normalizedLat) * 5 + Math.floor(normalizedLng);
  const letter = gridLetters[Math.max(0, Math.min(letterIndex, gridLetters.length - 1))];
  
  // Within the 100km square, get 1km precision
  const eastings = Math.floor(((normalizedLng % 1) * 100)) % 100;
  const northings = Math.floor(((normalizedLat % 1) * 100)) % 100;
  
  return `${letter}${eastings.toString().padStart(2, '0')}${northings.toString().padStart(2, '0')}`;
}

/**
 * Snap coordinates to 1km grid
 */
export function snapTo1kmGrid(lat: number, lng: number): { lat: number; lng: number } {
  // 1km is approximately 0.009 degrees lat, 0.014 degrees lng in Ireland
  const kmLat = 0.009;
  const kmLng = 0.014;
  
  return {
    lat: Math.round(lat / kmLat) * kmLat,
    lng: Math.round(lng / kmLng) * kmLng,
  };
}

/**
 * Snap coordinates to 10km grid
 */
export function snapTo10kmGrid(lat: number, lng: number): { lat: number; lng: number } {
  // 10km is approximately 0.09 degrees lat, 0.14 degrees lng in Ireland
  const kmLat = 0.09;
  const kmLng = 0.14;
  
  return {
    lat: Math.round(lat / kmLat) * kmLat,
    lng: Math.round(lng / kmLng) * kmLng,
  };
}

/**
 * Get 10km grid reference from 1km grid reference
 */
export function get10kmGridFromIrishGrid(grid1km: string): string {
  // Extract letter and first digit of eastings/northings
  if (grid1km.length < 5) return grid1km;
  
  const letter = grid1km[0];
  const eastings = grid1km.slice(1, 3);
  const northings = grid1km.slice(3, 5);
  
  // Round down to 10km
  const eastings10 = Math.floor(parseInt(eastings) / 10);
  const northings10 = Math.floor(parseInt(northings) / 10);
  
  return `${letter}${eastings10}${northings10}`;
}

/**
 * Calculate grid coordinates based on privacy level and species sensitivity
 */
export function calculateGridCoordinates(
  lat: number,
  lng: number,
  privacyLevel: 'EXACT' | 'GRID_1KM' | 'GRID_10KM',
  speciesSensitive: boolean = false
): GridCoordinates {
  const grid1km = latLngToIrishGrid(lat, lng);
  const grid10km = get10kmGridFromIrishGrid(grid1km);
  
  return {
    lat,
    lng,
    grid1km,
    grid10km,
  };
}

/**
 * Get display coordinates based on privacy rules
 */
export function getDisplayCoordinates(
  lat: number,
  lng: number,
  privacyLevel: 'EXACT' | 'GRID_1KM' | 'GRID_10KM',
  speciesSensitive: boolean = false,
  viewerRole?: string
): { lat: number; lng: number } {
  // Sensitive species always use 10km grid
  if (speciesSensitive && viewerRole !== 'MOD' && viewerRole !== 'BIOLOGIST' && viewerRole !== 'ADMIN') {
    return snapTo10kmGrid(lat, lng);
  }
  
  // Apply user's privacy level
  switch (privacyLevel) {
    case 'EXACT':
      if (!speciesSensitive) {
        return { lat, lng };
      }
      return snapTo1kmGrid(lat, lng);
    case 'GRID_10KM':
      return snapTo10kmGrid(lat, lng);
    case 'GRID_1KM':
    default:
      return snapTo1kmGrid(lat, lng);
  }
}

/**
 * Check if viewer can see exact coordinates
 */
export function canViewExactCoordinates(
  privacyLevel: 'EXACT' | 'GRID_1KM' | 'GRID_10KM',
  speciesSensitive: boolean,
  viewerRole?: string
): boolean {
  if (speciesSensitive && viewerRole !== 'MOD' && viewerRole !== 'BIOLOGIST' && viewerRole !== 'ADMIN') {
    return false;
  }
  
  return privacyLevel === 'EXACT' && !speciesSensitive;
}

