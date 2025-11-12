import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const body = await request.json()
    const { targetCalories, dietaryPreferences, mealsPerDay } = body

    const getMacros = (calories: number, goal: string) => {
      switch (goal) {
        case "Weight Loss":
          return {
            protein: Math.round((calories * 0.35) / 4),
            carbs: Math.round((calories * 0.3) / 4),
            fat: Math.round((calories * 0.35) / 9),
          }
        case "Muscle Gain":
          return {
            protein: Math.round((calories * 0.3) / 4),
            carbs: Math.round((calories * 0.45) / 4),
            fat: Math.round((calories * 0.25) / 9),
          }
        default:
          return {
            protein: Math.round((calories * 0.3) / 4),
            carbs: Math.round((calories * 0.4) / 4),
            fat: Math.round((calories * 0.3) / 9),
          }
      }
    }

    const macros = getMacros(targetCalories || 2000, profile?.fitness_goal || "General Fitness")

    const prompt = `Generate a daily meal plan based on the following requirements:

User Profile:
- Fitness Goal: ${profile?.fitness_goal || "maintain"}
- Diet Preference: ${profile?.diet_preference || "balanced"}
- Activity Level: ${profile?.activity_level || "moderate"}

Requirements:
- Target Calories: ${targetCalories || 2000}
- Meals: ${mealsPerDay || 3}
- Preferences: ${dietaryPreferences || "none"}

Provide JSON response only:
{
  "name": "meal plan name",
  "description": "brief description",
  "meals": [
    {
      "name": "meal name",
      "calories": 500,
      "ingredients": ["ingredient1"]
    }
  ]
}`

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
      temperature: 0.7,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid response format")
    }

    const mealPlan = JSON.parse(jsonMatch[0])
    return Response.json(mealPlan)
  } catch (error) {
    console.error("[v0] Meal plan error:", error)
    return Response.json({ error: "Failed to generate meal plan" }, { status: 500 })
  }
}
