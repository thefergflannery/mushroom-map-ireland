/**
 * Zod validation schemas for API routes
 */

import { z } from 'zod';

// Observation schemas
export const createObservationSchema = z.object({
  lat: z.number().min(51).max(56), // Ireland bounds
  lng: z.number().min(-11).max(-5),
  photoUrl: z.string().url(),
  photoKey: z.string().optional(),
  notes: z.string().max(2000).optional(),
  privacyLevel: z.enum(['EXACT', 'GRID_1KM', 'GRID_10KM']).default('GRID_1KM'),
  accuracyM: z.number().positive().optional(),
  observedAt: z.string().datetime().optional(),
});

export const updateObservationSchema = z.object({
  notes: z.string().max(2000).optional(),
  privacyLevel: z.enum(['EXACT', 'GRID_1KM', 'GRID_10KM']).optional(),
});

export const observationFilterSchema = z.object({
  bbox: z.string().optional(), // "minLng,minLat,maxLng,maxLat"
  status: z.enum(['NEEDS_ID', 'HAS_CANDIDATES', 'CONSENSUS']).optional(),
  userId: z.string().optional(),
  speciesId: z.string().optional(),
  since: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

// Identification schemas
export const createIdentificationSchema = z.object({
  observationId: z.string(),
  speciesId: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  rationale: z.string().max(1000).optional(),
  method: z.enum(['AI', 'HUMAN']).default('HUMAN'),
});

export const updateIdentificationSchema = z.object({
  confidence: z.number().min(0).max(1).optional(),
  rationale: z.string().max(1000).optional(),
});

// Vote schemas
export const createVoteSchema = z.object({
  identificationId: z.string(),
  value: z.number().int().min(-1).max(1),
});

// Comment schemas
export const createCommentSchema = z.object({
  observationId: z.string(),
  body: z.string().min(1).max(2000),
});

export const updateCommentSchema = z.object({
  body: z.string().min(1).max(2000),
});

// Flag schemas
export const createFlagSchema = z.object({
  observationId: z.string(),
  reason: z.string().min(10).max(500),
});

export const updateFlagSchema = z.object({
  status: z.enum(['open', 'resolved', 'dismissed']),
});

// Species schemas
export const createSpeciesSchema = z.object({
  latinName: z.string().min(3).max(100),
  commonEn: z.string().min(2).max(100),
  commonGa: z.string().max(100).optional(),
  edibility: z.enum(['CHOICE', 'EDIBLE', 'CAUTION', 'TOXIC', 'DEADLY', 'UNKNOWN']).default('UNKNOWN'),
  season: z.string().max(200).optional(),
  habitat: z.string().max(500).optional(),
  keyTraits: z.string().max(1000).optional(),
  lookalikeIds: z.array(z.string()).optional(),
  sensitive: z.boolean().default(false),
  heroImageUrl: z.string().url().optional(),
});

export const speciesSearchSchema = z.object({
  q: z.string().min(1).optional(),
  edibility: z.enum(['CHOICE', 'EDIBLE', 'CAUTION', 'TOXIC', 'DEADLY', 'UNKNOWN']).optional(),
  limit: z.number().min(1).max(100).default(20),
});

// Glossary schemas
export const glossarySearchSchema = z.object({
  q: z.string().min(1).optional(),
  region: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

// AI suggestion schema
export const aiSuggestSchema = z.object({
  imageUrl: z.string().url(),
});

// User update schema
export const updateUserSchema = z.object({
  handle: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/),
});

// Admin schemas
export const updateUserRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['USER', 'TRUSTED', 'MOD', 'BIOLOGIST', 'ADMIN']),
});

export const resolveConsensusSchema = z.object({
  observationId: z.string(),
  identificationId: z.string(),
  reason: z.string().max(500).optional(),
});

