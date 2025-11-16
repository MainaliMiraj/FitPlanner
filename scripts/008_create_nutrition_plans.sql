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
