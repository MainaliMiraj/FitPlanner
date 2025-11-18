import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

import { createClient } from "@/lib/supabase/server"
import { buildProfileSummary, extractQuizData } from "@/lib/nutrition/utils"
import { normalizeNutritionPlan } from "@/types/nutrition"
import type { NutritionPlan } from "@/types/nutrition"
import type { ProfileData, QuizAnswers } from "@/types/user"

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    const incomingProfile = isRecord(body.profile) ? (body.profile as ProfileData) : null
    const incomingQuiz = isRecord(body.quizData) ? (body.quizData as QuizAnswers) : null

    let profile = incomingProfile
    if (!profile) {
      const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      profile = (profileRow as ProfileData | null) ?? null
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 400 })
    }

    const quizData = incomingQuiz ?? extractQuizData(profile)

    const prompt = buildPrompt(profile, quizData)

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    })

    const rawText = response.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON")
    }

    const parsedPlan = normalizeNutritionPlan(JSON.parse(jsonMatch[0]))
    if (!parsedPlan) {
      throw new Error("Unable to parse AI response")
    }

    const normalizedPlan: NutritionPlan = {
      ...parsedPlan,
      generatedAt: parsedPlan.generatedAt || new Date().toISOString(),
    }

    const { data: existingPlan } = await supabase
      .from("nutrition_plans")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingPlan) {
      const { error } = await supabase
        .from("nutrition_plans")
        .update({ plan: normalizedPlan, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from("nutrition_plans").insert({
        user_id: user.id,
        plan: normalizedPlan,
      })
      if (error) throw error
    }

    return NextResponse.json({ plan: normalizedPlan })
  } catch (error) {
    console.error("[Nutrition Plan] generation error", error)
    return NextResponse.json({ error: "Failed to generate nutrition plan" }, { status: 500 })
  }
}

function buildPrompt(profile: ProfileData, quizData: QuizAnswers | null) {
  const summary = buildProfileSummary(profile, quizData)

  return `You are an elite nutrition coach creating a comprehensive weekly nutrition plan.
Use the following profile data:
${summary}

Return ONLY valid JSON with this structure:
{
  "generatedAt": "ISO timestamp",
  "dailyCalories": 2200,
  "dietType": "Mediterranean",
  "macros": { "calories": 2200, "protein": 150, "carbs": 230, "fats": 70 },
  "weeklyPlan": [
    {
      "day": "Monday",
      "focus": "High protein day",
      "meals": [
        {
          "name": "Greek yogurt parfait",
          "type": "breakfast",
          "calories": 400,
          "macros": { "protein": 30, "carbs": 40, "fats": 10 },
          "ingredients": ["Greek yogurt", "berries", "granola"],
          "instructions": ["Assemble ingredients in a bowl"]
        }
      ],
      "snacks": ["Almonds", "Protein shake"]
    }
  ],
  "snacks": ["Fresh fruit with nut butter", "Protein shake with greens blend"],
  "recipes": [
    {
      "title": "Sheet pan salmon and veggies",
      "summary": "Easy dinner rich in omega-3s",
      "macros": { "calories": 520, "protein": 40, "carbs": 35, "fats": 24 },
      "ingredients": ["salmon fillets", "broccoli", "olive oil", "lemon"],
      "instructions": ["Preheat oven ...", "Bake ..."]
    }
  ],
  "shoppingList": [
    {
      "category": "Produce",
      "items": [
        { "name": "Spinach", "quantity": "3 bags" },
        { "name": "Blueberries", "quantity": "4 cups" }
      ]
    }
  ],
  "notes": [
    "Drink at least 3L of water daily",
    "Prep grains and proteins on Sunday night"
  ]
}

Rules:
- Provide 7 days in weeklyPlan with 3-4 meals per day.
- Macros must align with dailyCalories totals (approximate is fine).
- Snacks list should include versatile, quick ideas.
- Recipes should include instructions and macros.
- Shopping list must be grouped by category with meaningful quantities.
- Respond with JSON only, no markdown fencing.`
}
