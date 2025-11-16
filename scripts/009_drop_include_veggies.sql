-- Remove the old include_veggies column from profiles
BEGIN;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS include_veggies;

COMMIT;
