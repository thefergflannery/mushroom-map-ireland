-- AlterTable
-- Add speciesName field to Identification table for custom species identifications
-- This allows users to propose identifications for species not yet in the database

ALTER TABLE "Identification" ADD COLUMN IF NOT EXISTS "speciesName" TEXT;

