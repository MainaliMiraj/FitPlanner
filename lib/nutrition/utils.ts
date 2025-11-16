import type { ProfileData, QuizAnswers } from "@/types/user"

const quizFieldKeys: (keyof ProfileData)[] = [
  "fitness_goal",
  "body_type",
  "dream_body",
  "sports_experience",
  "best_condition",
  "workout_frequency",
  "popular_cuisines",
  "nutrition_habits",
  "cooking_time",
  "diet_preference",
  "daily_routine",
  "energy_level",
  "water_intake",
  "bad_habits",
  "height",
  "weight",
  "target_weight",
  "age",
]

export function extractQuizData(profile: ProfileData | null): QuizAnswers {
  if (!profile) return {}

  return quizFieldKeys.reduce<QuizAnswers>((acc, key) => {
    const value = profile[key]
    if (value !== undefined) {
      acc[key as string] = value as string | string[] | null
    }
    return acc
  }, {})
}

export function buildProfileSummary(profile: ProfileData | null, quizData: QuizAnswers | null): string {
  if (!profile) return "No profile data was provided."

  const lines = [
    `Name: ${profile.display_name}`,
    `Goal/Focus: ${profile.fitness_goal || "not specified"}`,
    `Diet Preference: ${profile.diet_preference || "not specified"}`,
    `Activity Level: ${profile.activity_level || profile.daily_routine || "not specified"}`,
    `Height: ${profile.height_cm ? `${profile.height_cm} cm` : profile.height || "not specified"}`,
    `Weight: ${profile.weight_kg ? `${profile.weight_kg} kg` : profile.weight || "not specified"}`,
    `Target Weight: ${profile.target_weight || "not specified"}`,
    `Cuisines enjoyed: ${profile.popular_cuisines?.join(", ") || "not specified"}`,
    `Nutrition habits: ${profile.nutrition_habits || "not specified"}`,
  ]

  if (quizData) {
    Object.entries(quizData).forEach(([key, value]) => {
      if (value && !lines.some((line) => line.toLowerCase().includes(key))) {
        lines.push(`${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
      }
    })
  }

  return lines.join("\n")
}
