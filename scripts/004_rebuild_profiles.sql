-- Completely rebuild the profiles table so it lines up with the sign-up form
-- and onboarding quiz answers. This drops the previous definition, recreates
-- the table with the new columns, and reapplies the policies/triggers.

BEGIN;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.profiles;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  fitness_goal TEXT,
  body_type TEXT,
  dream_body TEXT,
  sports_experience TEXT,
  best_condition TEXT,
  workout_frequency TEXT,
  popular_cuisines TEXT[],
  nutrition_habits TEXT,
  cooking_time TEXT,
  diet_preference TEXT,
  daily_routine TEXT,
  energy_level TEXT,
  water_intake TEXT,
  bad_habits TEXT[],
  height TEXT,
  weight TEXT,
  target_weight TEXT,
  age TEXT,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS + policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Allow both authenticated sessions and the anon role (used just after sign-up
-- before a session exists) to insert rows for themselves.
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    (auth.role() = 'authenticated' AND auth.uid() = id)
    OR auth.role() = 'anon'
  );

-- Recreate updated_at trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;
