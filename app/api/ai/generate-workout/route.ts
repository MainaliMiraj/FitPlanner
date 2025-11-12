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
    const { goal, difficulty, duration, equipment } = body

    // Generate workout plan using AI
    const prompt = `Generate a detailed workout plan based on the following requirements:

User Profile:
- Fitness Goal: ${profile?.fitness_goal || "general fitness"}
- Current Level: ${profile?.current_fitness_level || "intermediate"}
- Activity Level: ${profile?.activity_level || "moderate"}
- Preference: ${profile?.workout_preference || "strength training"}
- Duration Available: ${profile?.workout_duration || "45 minutes"}
- Health Conditions: ${profile?.health_conditions || "none"}
- Stress Level: ${profile?.stress_level || "moderate"}
- Sleep Quality: ${profile?.sleep_hours || "6-7 hours"}

Workout Requirements:
- Goal: ${goal || "strength training"}
- Difficulty: ${difficulty || "intermediate"}
- Duration: ${duration || 45} minutes
- Available Equipment: ${equipment || "full gym"}

Please provide:
1. A workout name
2. A brief description
3. A list of 5-7 exercises with:
   - Exercise name
   - Sets (number)
   - Reps (number)
   - Recommended weight (if applicable)
   - Rest time in seconds
   - Brief notes/form cues

Format your response as JSON with this structure:
{
  "name": "workout name",
  "description": "workout description",
  "exercises": [
    {
      "name": "exercise name",
      "sets": 3,
      "reps": 10,
      "weight_kg": 20,
      "rest_seconds": 60,
      "notes": "form cues"
    }
  ]
}`

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
    })

    // Parse the AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const workoutPlan = JSON.parse(jsonMatch[0])

    return Response.json(workoutPlan)
  } catch (error) {
    console.error("[v0] AI workout generation error:", error)
    return Response.json({ error: "Failed to generate workout plan" }, { status: 500 })
  }
}
