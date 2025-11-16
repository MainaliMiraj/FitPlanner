export interface ProfileData {
  id: string
  email?: string | null
  display_name: string
  fitness_goal?: string | null
  body_type?: string | null
  dream_body?: string | null
  sports_experience?: string | null
  best_condition?: string | null
  workout_frequency?: string | null
  popular_cuisines?: string[] | null
  nutrition_habits?: string | null
  cooking_time?: string | null
  diet_preference?: string | null
  daily_routine?: string | null
  energy_level?: string | null
  water_intake?: string | null
  bad_habits?: string[] | null
  height?: string | null
  weight?: string | null
  target_weight?: string | null
  age?: string | null
  height_cm?: number | null
  weight_kg?: number | null
  target_weight_kg?: number | null
  date_of_birth?: string | null
  activity_level?: string | null
  created_at?: string
  updated_at?: string
}

export type QuizAnswers = Record<string, string | string[] | null>
