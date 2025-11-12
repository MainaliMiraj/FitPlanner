-- Create profiles table
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
