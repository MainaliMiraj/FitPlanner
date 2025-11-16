//001_create_schema.sql-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  date_of_birth DATE,
  fitness_goal TEXT CHECK (fitness_goal IN ('lose_weight', 'gain_muscle', 'maintain', 'improve_endurance')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_muscle_groups TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight_kg DECIMAL(5,2),
  rest_seconds INTEGER,
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_calories INTEGER,
  target_protein_g INTEGER,
  target_carbs_g INTEGER,
  target_fat_g INTEGER,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  calories INTEGER,
  protein_g INTEGER,
  carbs_g INTEGER,
  fat_g INTEGER,
  ingredients TEXT[],
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout_logs table
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercise_logs table
CREATE TABLE IF NOT EXISTS public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  sets_completed INTEGER NOT NULL,
  reps_completed INTEGER NOT NULL,
  weight_kg DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create body_measurements table
CREATE TABLE IF NOT EXISTS public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  chest_cm DECIMAL(5,2),
  waist_cm DECIMAL(5,2),
  hips_cm DECIMAL(5,2),
  biceps_cm DECIMAL(5,2),
  thighs_cm DECIMAL(5,2),
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for workouts
CREATE POLICY "Users can view their own workouts" ON public.workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workouts" ON public.workouts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for exercises (via workout ownership)
CREATE POLICY "Users can view exercises of their workouts" ON public.exercises FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = exercises.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY "Users can create exercises for their workouts" ON public.exercises FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = exercises.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY "Users can update exercises of their workouts" ON public.exercises FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = exercises.workout_id AND workouts.user_id = auth.uid()));
CREATE POLICY "Users can delete exercises of their workouts" ON public.exercises FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = exercises.workout_id AND workouts.user_id = auth.uid()));

-- RLS Policies for meal_plans
CREATE POLICY "Users can view their own meal plans" ON public.meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own meal plans" ON public.meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meal plans" ON public.meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meal plans" ON public.meal_plans FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for meals (via meal_plan ownership)
CREATE POLICY "Users can view meals of their meal plans" ON public.meals FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.meal_plans WHERE meal_plans.id = meals.meal_plan_id AND meal_plans.user_id = auth.uid()));
CREATE POLICY "Users can create meals for their meal plans" ON public.meals FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.meal_plans WHERE meal_plans.id = meals.meal_plan_id AND meal_plans.user_id = auth.uid()));
CREATE POLICY "Users can update meals of their meal plans" ON public.meals FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.meal_plans WHERE meal_plans.id = meals.meal_plan_id AND meal_plans.user_id = auth.uid()));
CREATE POLICY "Users can delete meals of their meal plans" ON public.meals FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.meal_plans WHERE meal_plans.id = meals.meal_plan_id AND meal_plans.user_id = auth.uid()));

-- RLS Policies for workout_logs
CREATE POLICY "Users can view their own workout logs" ON public.workout_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own workout logs" ON public.workout_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workout logs" ON public.workout_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workout logs" ON public.workout_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for exercise_logs (via workout_log ownership)
CREATE POLICY "Users can view exercise logs of their workout logs" ON public.exercise_logs FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.workout_logs WHERE workout_logs.id = exercise_logs.workout_log_id AND workout_logs.user_id = auth.uid()));
CREATE POLICY "Users can create exercise logs for their workout logs" ON public.exercise_logs FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.workout_logs WHERE workout_logs.id = exercise_logs.workout_log_id AND workout_logs.user_id = auth.uid()));
CREATE POLICY "Users can update exercise logs of their workout logs" ON public.exercise_logs FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.workout_logs WHERE workout_logs.id = exercise_logs.workout_log_id AND workout_logs.user_id = auth.uid()));
CREATE POLICY "Users can delete exercise logs of their workout logs" ON public.exercise_logs FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.workout_logs WHERE workout_logs.id = exercise_logs.workout_log_id AND workout_logs.user_id = auth.uid()));

-- RLS Policies for body_measurements
CREATE POLICY "Users can view their own body measurements" ON public.body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own body measurements" ON public.body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own body measurements" ON public.body_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own body measurements" ON public.body_measurements FOR DELETE USING (auth.uid() = user_id);

-- Create trigger function for updating updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON public.workouts 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON public.meal_plans 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

002_create_profile_trigger.sql
-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

003_update_profile_columns.sql
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

004_create_nutrition_schema.sql
-- Create chat_messages table for AI chatbot
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON chat_messages FOR DELETE
  USING (auth.uid() = user_id);


005_create_exercise_library.sql
-- Create exercise_library table
CREATE TABLE IF NOT EXISTS exercise_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_groups TEXT[] NOT NULL,
  equipment TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  instructions TEXT NOT NULL,
  tips TEXT,
  video_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  goal_type TEXT NOT NULL,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create goal_milestones table
CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_value NUMERIC,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RPE and notes to exercise_logs
ALTER TABLE exercise_logs ADD COLUMN IF NOT EXISTS rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10);
ALTER TABLE exercise_logs ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exercise_library_category ON exercise_library(category);
CREATE INDEX IF NOT EXISTS idx_exercise_library_difficulty ON exercise_library(difficulty);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON goal_milestones(goal_id);

-- Enable RLS
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for exercise_library (public read)
CREATE POLICY "Anyone can view exercises"
  ON exercise_library FOR SELECT
  USING (true);

-- Create policies for goals
CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for goal_milestones
CREATE POLICY "Users can view milestones of their goals"
  ON goal_milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM goals WHERE goals.id = goal_milestones.goal_id AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert milestones for their goals"
  ON goal_milestones FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM goals WHERE goals.id = goal_milestones.goal_id AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update milestones of their goals"
  ON goal_milestones FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM goals WHERE goals.id = goal_milestones.goal_id AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete milestones of their goals"
  ON goal_milestones FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM goals WHERE goals.id = goal_milestones.goal_id AND goals.user_id = auth.uid()
  ));

006_seed_exercise_library.sql
-- Seed exercise library with comprehensive exercises
INSERT INTO exercise_library (name, category, muscle_groups, equipment, difficulty, instructions, tips, video_url) VALUES

-- Chest Exercises
('Barbell Bench Press', 'Chest', ARRAY['Chest', 'Triceps', 'Shoulders'], 'Barbell', 'Intermediate', 'Lie on bench, grip bar slightly wider than shoulders, lower to chest, press up', 'Keep feet flat on ground, arch lower back slightly', 'https://example.com/bench-press'),
('Dumbbell Flyes', 'Chest', ARRAY['Chest'], 'Dumbbells', 'Beginner', 'Lie on bench with dumbbells, arms extended, lower in arc motion, squeeze chest at top', 'Keep slight bend in elbows throughout', 'https://example.com/db-flyes'),
('Push-ups', 'Chest', ARRAY['Chest', 'Triceps', 'Core'], 'Bodyweight', 'Beginner', 'Start in plank, lower body until chest near floor, push back up', 'Keep core tight, body in straight line', 'https://example.com/pushups'),
('Incline Dumbbell Press', 'Chest', ARRAY['Upper Chest', 'Shoulders'], 'Dumbbells', 'Intermediate', 'Set bench to 30-45 degrees, press dumbbells up from chest level', 'Focus on upper chest contraction', 'https://example.com/incline-press'),

-- Back Exercises
('Deadlift', 'Back', ARRAY['Lower Back', 'Glutes', 'Hamstrings'], 'Barbell', 'Advanced', 'Stand with bar over mid-foot, grip bar, keep back straight, lift by extending hips and knees', 'Keep bar close to body, neutral spine', 'https://example.com/deadlift'),
('Pull-ups', 'Back', ARRAY['Lats', 'Biceps'], 'Pull-up Bar', 'Intermediate', 'Hang from bar, pull body up until chin over bar, lower with control', 'Engage lats, avoid swinging', 'https://example.com/pullups'),
('Barbell Rows', 'Back', ARRAY['Lats', 'Rhomboids', 'Traps'], 'Barbell', 'Intermediate', 'Bend at hips, pull bar to lower chest, squeeze shoulder blades', 'Keep core tight, slight knee bend', 'https://example.com/barbell-rows'),
('Lat Pulldowns', 'Back', ARRAY['Lats', 'Biceps'], 'Cable Machine', 'Beginner', 'Grip bar wider than shoulders, pull down to upper chest, control up', 'Lean back slightly, focus on lat engagement', 'https://example.com/lat-pulldown'),

-- Leg Exercises
('Barbell Squats', 'Legs', ARRAY['Quads', 'Glutes', 'Hamstrings'], 'Barbell', 'Intermediate', 'Bar on upper back, squat down until thighs parallel, drive through heels', 'Keep chest up, knees track over toes', 'https://example.com/squats'),
('Romanian Deadlift', 'Legs', ARRAY['Hamstrings', 'Glutes', 'Lower Back'], 'Barbell', 'Intermediate', 'Hold bar at hip level, push hips back, lower bar along legs, return to start', 'Keep slight knee bend, feel hamstring stretch', 'https://example.com/rdl'),
('Leg Press', 'Legs', ARRAY['Quads', 'Glutes'], 'Machine', 'Beginner', 'Sit in machine, feet shoulder-width, press weight up, control down', 'Don''t lock knees at top', 'https://example.com/leg-press'),
('Walking Lunges', 'Legs', ARRAY['Quads', 'Glutes', 'Hamstrings'], 'Dumbbells', 'Beginner', 'Step forward into lunge, rear knee near floor, push through front heel', 'Keep torso upright, front knee over ankle', 'https://example.com/lunges'),

-- Shoulder Exercises
('Overhead Press', 'Shoulders', ARRAY['Shoulders', 'Triceps'], 'Barbell', 'Intermediate', 'Bar at shoulder level, press overhead, lock out at top, lower with control', 'Keep core tight, don''t arch back excessively', 'https://example.com/ohp'),
('Lateral Raises', 'Shoulders', ARRAY['Lateral Deltoids'], 'Dumbbells', 'Beginner', 'Hold dumbbells at sides, raise arms out to sides to shoulder height', 'Slight bend in elbows, control the movement', 'https://example.com/lateral-raises'),
('Face Pulls', 'Shoulders', ARRAY['Rear Deltoids', 'Upper Back'], 'Cable Machine', 'Beginner', 'Pull rope to face level, separate hands at end, squeeze shoulder blades', 'Focus on rear delts, high elbow position', 'https://example.com/face-pulls'),

-- Arm Exercises
('Barbell Curls', 'Arms', ARRAY['Biceps'], 'Barbell', 'Beginner', 'Hold bar at hip level, curl up to shoulders, squeeze biceps, lower with control', 'Keep elbows stationary, no swinging', 'https://example.com/barbell-curls'),
('Tricep Dips', 'Arms', ARRAY['Triceps', 'Chest'], 'Parallel Bars', 'Intermediate', 'Support body on bars, lower until upper arms parallel to ground, push back up', 'Lean forward for chest, upright for triceps', 'https://example.com/dips'),
('Hammer Curls', 'Arms', ARRAY['Biceps', 'Forearms'], 'Dumbbells', 'Beginner', 'Hold dumbbells with neutral grip, curl up, lower with control', 'Targets brachialis and brachioradialis', 'https://example.com/hammer-curls'),
('Skull Crushers', 'Arms', ARRAY['Triceps'], 'Barbell', 'Intermediate', 'Lie on bench, bar overhead, lower to forehead by bending elbows, extend back up', 'Keep upper arms stationary', 'https://example.com/skull-crushers'),

-- Core Exercises
('Plank', 'Core', ARRAY['Abs', 'Core'], 'Bodyweight', 'Beginner', 'Hold push-up position on forearms, keep body straight, engage core', 'Don''t let hips sag or rise', 'https://example.com/plank'),
('Russian Twists', 'Core', ARRAY['Obliques', 'Abs'], 'Medicine Ball', 'Beginner', 'Sit with feet elevated, rotate torso side to side, touching weight to floor', 'Keep core engaged throughout', 'https://example.com/russian-twists'),
('Hanging Leg Raises', 'Core', ARRAY['Lower Abs'], 'Pull-up Bar', 'Advanced', 'Hang from bar, raise legs to 90 degrees, lower with control', 'Avoid swinging, control the movement', 'https://example.com/leg-raises'),
('Cable Crunches', 'Core', ARRAY['Abs'], 'Cable Machine', 'Intermediate', 'Kneel facing cable, hold rope behind head, crunch down, squeeze abs', 'Focus on ab contraction, not arm pull', 'https://example.com/cable-crunches'),

-- Cardio Exercises
('Running', 'Cardio', ARRAY['Full Body'], 'Treadmill', 'Beginner', 'Maintain steady pace, focus on breathing, proper running form', 'Start slow, gradually increase duration', 'https://example.com/running'),
('Rowing Machine', 'Cardio', ARRAY['Back', 'Legs', 'Core'], 'Rowing Machine', 'Intermediate', 'Push with legs, pull handle to chest, reverse the motion', 'Legs, then back, then arms in sequence', 'https://example.com/rowing'),
('Battle Ropes', 'Cardio', ARRAY['Arms', 'Shoulders', 'Core'], 'Battle Ropes', 'Intermediate', 'Create waves with ropes using alternating or simultaneous arm movements', 'High intensity, short intervals', 'https://example.com/battle-ropes'),
('Jump Rope', 'Cardio', ARRAY['Calves', 'Full Body'], 'Jump Rope', 'Beginner', 'Jump over rope as it passes under feet, maintain rhythm', 'Stay on balls of feet, slight knee bend', 'https://example.com/jump-rope'),
('Burpees', 'Cardio', ARRAY['Full Body'], 'Bodyweight', 'Intermediate', 'Squat, place hands on floor, jump feet back to plank, do push-up, jump feet forward, jump up', 'Full body exercise, great for conditioning', 'https://example.com/burpees'),
('Mountain Climbers', 'Cardio', ARRAY['Core', 'Full Body'], 'Bodyweight', 'Beginner', 'Start in plank, alternate bringing knees to chest quickly', 'Keep hips level, maintain fast pace', 'https://example.com/mountain-climbers'),
('Box Jumps', 'Cardio', ARRAY['Legs', 'Glutes'], 'Plyo Box', 'Intermediate', 'Jump onto box, land softly with knees bent, step down', 'Explosive movement, land with control', 'https://example.com/box-jumps'),
('Cycling', 'Cardio', ARRAY['Legs'], 'Stationary Bike', 'Beginner', 'Maintain steady cadence, adjust resistance as needed', 'Focus on breathing and leg endurance', 'https://example.com/cycling');

007_create_nutrition_schema.sql
-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT NOT NULL,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  calories NUMERIC,
  protein NUMERIC,
  carbs NUMERIC,
  fats NUMERIC,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create food_logs table for calorie tracking
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
  food_name TEXT NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC DEFAULT 0,
  carbs NUMERIC DEFAULT 0,
  fats NUMERIC DEFAULT 0,
  servings NUMERIC DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create macro_targets table
CREATE TABLE IF NOT EXISTS macro_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_calories NUMERIC NOT NULL,
  daily_protein NUMERIC NOT NULL,
  daily_carbs NUMERIC NOT NULL,
  daily_fats NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meal_schedule table
CREATE TABLE IF NOT EXISTS meal_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  custom_meal_name TEXT,
  notes TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_macro_targets_user_id ON macro_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_schedule_user_date ON meal_schedule(user_id, date);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE macro_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_schedule ENABLE ROW LEVEL SECURITY;

-- Create policies for recipes
CREATE POLICY "Users can view their own recipes"
  ON recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own recipes"
  ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own recipes"
  ON recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own recipes"
  ON recipes FOR DELETE USING (auth.uid() = user_id);

-- Create policies for food_logs
CREATE POLICY "Users can view their own food logs"
  ON food_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own food logs"
  ON food_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own food logs"
  ON food_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own food logs"
  ON food_logs FOR DELETE USING (auth.uid() = user_id);

-- Create policies for macro_targets
CREATE POLICY "Users can view their own macro targets"
  ON macro_targets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own macro targets"
  ON macro_targets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own macro targets"
  ON macro_targets FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for shopping_lists
CREATE POLICY "Users can view their own shopping lists"
  ON shopping_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own shopping lists"
  ON shopping_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shopping lists"
  ON shopping_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shopping lists"
 ON shopping_lists FOR DELETE USING (auth.uid() = user_id);

-- Create policies for meal_schedule
CREATE POLICY "Users can view their own meal schedule"
  ON meal_schedule FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meal schedule"
  ON meal_schedule FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meal schedule"
  ON meal_schedule FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meal schedule"
  ON meal_schedule FOR DELETE USING (auth.uid() = user_id);

008_create_nutrition_plans.sql
-- Create table to store generated nutrition plans
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_user_id ON public.nutrition_plans(user_id);

-- Enable row level security
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;

-- Policies to ensure users can only access their plan
CREATE POLICY "Users can view their nutrition plans"
  ON public.nutrition_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their nutrition plan"
  ON public.nutrition_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their nutrition plan"
  ON public.nutrition_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their nutrition plan"
  ON public.nutrition_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Keep updated_at fresh
CREATE TRIGGER update_nutrition_plans_updated_at
  BEFORE UPDATE ON public.nutrition_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

008_add-chat-schema.sql
-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for chat messages
CREATE POLICY "Users can view messages from their conversations" ON chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );
  
  009_fix-chat-schema-clean.sql
  -- Drop and recreate to ensure clean state
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert messages to their conversations" ON chat_messages;
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;

DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

-- Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_messages table with proper structure
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for chat_messages
CREATE POLICY "Users can view messages from their conversations" ON chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

fix-chat-schema-v2.sql
-- Add conversations table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing conversation_id column to chat_messages if it doesn't exist
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS conversation_id UUID;

-- Add foreign key constraint for conversation_id if it doesn't exist
ALTER TABLE chat_messages
ADD CONSTRAINT IF NOT EXISTS fk_chat_messages_conversation_id
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Enable RLS on conversations if not already enabled
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert messages to their conversations" ON chat_messages;

-- RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for chat messages (already has user_id and messages policies)
CREATE POLICY "Users can view messages from their conversations" ON chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );


fix-chat-schema-v3.sql
-- Step 1: Create conversations table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 2: Verify chat_messages table exists, if not create it
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 3: Add conversation_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='chat_messages' AND column_name='conversation_id'
  ) THEN
    ALTER TABLE chat_messages ADD COLUMN conversation_id UUID;
  END IF;
END $$;

-- Step 4: Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name='chat_messages' AND constraint_name='fk_chat_messages_conversation'
  ) THEN
    ALTER TABLE chat_messages
    ADD CONSTRAINT fk_chat_messages_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- Step 6: Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop old policies to recreate
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert messages to their conversations" ON chat_messages;

-- Step 8: Create RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 9: Create RLS policies for chat messages
CREATE POLICY "Users can view messages from their conversations" ON chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );
