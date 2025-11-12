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
