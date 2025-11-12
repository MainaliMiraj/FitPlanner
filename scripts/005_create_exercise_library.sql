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
