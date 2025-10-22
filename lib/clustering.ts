import ngeohash from 'ngeohash';

export interface ClusteredObservation {
  id: string;
  lat: number;
  lng: number;
  count: number;
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
}

/**
 * Cluster observations by proximity using geohash
 * Based on Stack Overflow solution: https://stackoverflow.com/questions/31722630/group-coordinates-by-proximity-to-each-other
 */
export function clusterObservations(
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
  }>,
  precision: number = 3
): ClusteredObservation[] {
  const clusters = new Map<string, ClusteredObservation>();

  observations.forEach((obs) => {
    // Generate geohash with specified precision
    const geohash = ngeohash.encode(obs.lat, obs.lng, precision);
    
    if (clusters.has(geohash)) {
      const cluster = clusters.get(geohash)!;
      cluster.count++;
      cluster.observations.push(obs);
      
      // Update cluster center (average of all observations)
      cluster.lat = cluster.observations.reduce((sum, o) => sum + o.lat, 0) / cluster.observations.length;
      cluster.lng = cluster.observations.reduce((sum, o) => sum + o.lng, 0) / cluster.observations.length;
    } else {
      clusters.set(geohash, {
        id: geohash,
        lat: obs.lat,
        lng: obs.lng,
        count: 1,
        observations: [obs],
      });
    }
  });

  return Array.from(clusters.values());
}

/**
 * Get appropriate clustering precision based on zoom level
 */
export function getClusteringPrecision(zoom: number): number {
  if (zoom >= 10) return 6; // Very detailed
  if (zoom >= 8) return 5;  // Detailed
  if (zoom >= 6) return 4; // Medium
  if (zoom >= 4) return 3;  // Coarse
  return 2; // Very coarse
}
