-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS "lookingForAgeMin" INTEGER DEFAULT 18,
ADD COLUMN IF NOT EXISTS "lookingForAgeMax" INTEGER DEFAULT 99,
ADD COLUMN IF NOT EXISTS "federalState" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "phoneNumber" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "facebookProfile" VARCHAR(255);

-- Update existing records with default values
UPDATE profiles 
SET 
  "lookingForAgeMin" = 18,
  "lookingForAgeMax" = 75,
  "federalState" = 'bayern'
WHERE "lookingForAgeMin" IS NULL;