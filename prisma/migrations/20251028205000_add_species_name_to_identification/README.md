# Migration: Add speciesName to Identification

This migration adds a `speciesName` field to the `Identification` table to allow users to propose identifications for species not yet in the database.

**Purpose:**
- Enable community members to identify mushrooms using scientific names even if the species isn't in the database yet
- Support AI suggestions that might identify species we haven't catalogued
- Allow expansion of the species database organically through user contributions

**Changes:**
- Adds nullable `speciesName` TEXT column to `Identification` table
- Field is optional - existing identifications work with just `speciesId`
- When `speciesId` is null but `speciesName` is provided, the identification shows the custom name

**Rollback:**
To rollback this migration:
```sql
ALTER TABLE "Identification" DROP COLUMN IF EXISTS "speciesName";
```

