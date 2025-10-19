import { describe, it, expect } from 'vitest';
import {
  snapTo1kmGrid,
  snapTo10kmGrid,
  getDisplayCoordinates,
  canViewExactCoordinates,
} from '@/lib/geo/grid';

describe('Grid snapping utilities', () => {
  describe('snapTo1kmGrid', () => {
    it('should snap coordinates to 1km grid', () => {
      const result = snapTo1kmGrid(53.3498, -6.2603);
      
      expect(result.lat).toBeCloseTo(53.3498, 2);
      expect(result.lng).toBeCloseTo(-6.2603, 2);
    });

    it('should snap consistently for nearby points', () => {
      const result1 = snapTo1kmGrid(53.3498, -6.2603);
      const result2 = snapTo1kmGrid(53.3501, -6.2606);
      
      // Should snap to same grid cell
      expect(result1.lat).toEqual(result2.lat);
      expect(result1.lng).toEqual(result2.lng);
    });
  });

  describe('snapTo10kmGrid', () => {
    it('should snap coordinates to 10km grid', () => {
      const result = snapTo10kmGrid(53.3498, -6.2603);
      
      expect(result.lat).toBeCloseTo(53.3498, 1);
      expect(result.lng).toBeCloseTo(-6.2603, 1);
    });
  });

  describe('getDisplayCoordinates', () => {
    const testLat = 53.3498;
    const testLng = -6.2603;

    it('should return exact coords when EXACT privacy and not sensitive', () => {
      const result = getDisplayCoordinates(testLat, testLng, 'EXACT', false);
      
      expect(result.lat).toBe(testLat);
      expect(result.lng).toBe(testLng);
    });

    it('should return 1km grid when GRID_1KM privacy', () => {
      const result = getDisplayCoordinates(testLat, testLng, 'GRID_1KM', false);
      
      expect(result.lat).not.toBe(testLat);
      expect(result.lng).not.toBe(testLng);
    });

    it('should return 10km grid for sensitive species', () => {
      const result = getDisplayCoordinates(testLat, testLng, 'EXACT', true);
      
      // Should be snapped to coarser grid
      expect(result.lat).not.toBe(testLat);
      expect(result.lng).not.toBe(testLng);
    });

    it('should allow exact coords for moderators on sensitive species', () => {
      const result = getDisplayCoordinates(testLat, testLng, 'EXACT', true, 'MOD');
      
      expect(result.lat).toBe(testLat);
      expect(result.lng).toBe(testLng);
    });
  });

  describe('canViewExactCoordinates', () => {
    it('should allow viewing exact coords when not sensitive and EXACT privacy', () => {
      expect(canViewExactCoordinates('EXACT', false)).toBe(true);
    });

    it('should not allow viewing exact coords for sensitive species', () => {
      expect(canViewExactCoordinates('EXACT', true, 'USER')).toBe(false);
    });

    it('should allow moderators to view exact coords for sensitive species', () => {
      expect(canViewExactCoordinates('EXACT', true, 'MOD')).toBe(true);
      expect(canViewExactCoordinates('EXACT', true, 'BIOLOGIST')).toBe(true);
    });

    it('should not allow viewing exact coords when privacy is GRID_1KM', () => {
      expect(canViewExactCoordinates('GRID_1KM', false)).toBe(false);
    });
  });
});

