import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 🔐 Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🧠 Get user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const body = await request.json();
    const { targetCalories, dietaryPreferences, mealsPerDay } = body;

    // 🍎 Calculate macros
    const getMacros = (calories: number, goal: string) => {
      switch (goal) {
        case "Weight Loss":
          return {
            protein: Math.round((calories * 0.35) / 4),
            carbs: Math.round((calories * 0.3) / 4),
            fat: Math.round((calories * 0.35) / 9),
          };
        case "Muscle Gain":
          return {
            protein: Math.round((calories * 0.3) / 4),
            carbs: Math.round((calories * 0.45) / 4),
            fat: Math.round((calories * 0.25) / 9),
          };
        default:
          return {
            protein: Math.round((calories * 0.3) / 4),
            carbs: Math.round((calories * 0.4) / 4),
            fat: Math.round((calories * 0.3) / 9),
          };
      }
    };

    const macros = getMacros(
      targetCalories || 2000,
      profile?.fitness_goal || "General Fitness"
    );

    // 🧾 AI prompt
    const prompt = `
Generate a structured daily meal plan based on the following details:

User Profile:
- Fitness Goal: ${profile?.fitness_goal || "Maintain"}
- Diet Preference: ${profile?.diet_preference || "Balanced"}
- Activity Level: ${profile?.activity_level || "Moderate"}

Requirements:
- Target Calories: ${targetCalories || 2000}
- Meals per Day: ${mealsPerDay || 3}
- Preferences: ${dietaryPreferences || "None"}

Macros (approximate):
- Protein: ${macros.protein}g
- Carbs: ${macros.carbs}g
- Fat: ${macros.fat}g

Return ONLY valid JSON in this format:
{
  "name": "Meal Plan Name",
  "description": "Brief description",
  "meals": [
    {
      "name": "Meal Name",
      "calories": 500,
      "ingredients": ["ingredient1", "ingredient2"]
    }
  ]
}
`;

    // 🧠 Initialize Google Gen AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 🗣️ Generate response
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();

    // 🧩 Extract JSON safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }
    const mealPlanSchema = z.object({
      name: z.string(),
      description: z.string(),
      meals: z.array(
        z.object({
          name: z.string(),
          calories: z.number(),
          ingredients: z.array(z.string()),
        })
      ),
    });

    const mealPlan = JSON.parse(jsonMatch[0]);
    return Response.json(mealPlan);
  } catch (error) {
    console.error("[FitPlanner] Meal plan generation error:", error);
    return Response.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
