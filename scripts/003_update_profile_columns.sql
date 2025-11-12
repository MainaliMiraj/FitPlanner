-- Add quiz-related columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fitness_goal TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_fitness_level TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workout_frequency TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS diet_preference TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activity_level TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workout_preference TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workout_duration TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS health_conditions TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sleep_hours TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stress_level TEXT;
