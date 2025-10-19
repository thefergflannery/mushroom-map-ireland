/**
 * EXIF stripping utilities for privacy
 */

import exifParser from 'exif-parser';

export interface ImageMetadata {
  lat?: number;
  lng?: number;
  timestamp?: Date;
}

/**
 * Extract GPS coordinates from EXIF data
 */
export function extractExifLocation(buffer: Buffer): ImageMetadata | null {
  try {
    const parser = exifParser.create(buffer);
    const result = parser.parse();
    
    const metadata: ImageMetadata = {};
    
    if (result.tags?.GPSLatitude && result.tags?.GPSLongitude) {
      metadata.lat = result.tags.GPSLatitude;
      metadata.lng = result.tags.GPSLongitude;
    }
    
    if (result.tags?.DateTimeOriginal) {
      metadata.timestamp = new Date(result.tags.DateTimeOriginal * 1000);
    }
    
    return Object.keys(metadata).length > 0 ? metadata : null;
  } catch (error) {
    console.error('Error parsing EXIF:', error);
    return null;
  }
}

/**
 * Strip EXIF data from image buffer
 * Uses sharp to re-encode without metadata
 */
export async function stripExifData(buffer: Buffer): Promise<Buffer> {
  // Note: This is a placeholder. In production, use sharp:
  // const sharp = require('sharp');
  // return await sharp(buffer).rotate().toBuffer();
  
  // For now, return as-is (sharp would be added as dependency)
  return buffer;
}

/**
 * Validate image dimensions and size
 */
export function validateImageDimensions(
  width: number,
  height: number,
  maxDimension: number = 4000
): { valid: boolean; error?: string } {
  if (width > maxDimension || height > maxDimension) {
    return {
      valid: false,
      error: `Image dimensions exceed maximum of ${maxDimension}px`,
    };
  }
  
  if (width < 300 || height < 300) {
    return {
      valid: false,
      error: 'Image too small (minimum 300x300px)',
    };
  }
  
  return { valid: true };
}

