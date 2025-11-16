-- Add quiz-related columns to profiles table
-- These columns correspond to all onboarding questions in Questions.ts

-- Fitness Goals & Body Information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fitness_goal TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS body_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dream_body TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sports_experience TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS best_condition TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workout_frequency TEXT;

-- Nutrition Preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS popular_cuisines TEXT; -- JSON array for multiple selections
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nutrition_habits TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cooking_time TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS diet_preference TEXT;

-- Lifestyle & Habits
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_routine TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS energy_level TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS water_intake TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bad_habits TEXT; -- JSON array for multiple selections

-- Physical Measurements
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_weight TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age TEXT;
