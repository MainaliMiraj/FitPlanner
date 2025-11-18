import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weight_kg?: number;
  rest_seconds: number;
  notes?: string;
}

interface WorkoutPlan {
  name: string;
  description: string;
  exercises: WorkoutExercise[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 🔐 Check if user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🧠 Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const body = await request.json();
    const { goal, difficulty, duration, equipment } = body;

    // 🧩 Build AI prompt
    const prompt = `
Generate a detailed workout plan based on the following user and requirements:

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
3. A list of 5–7 exercises with:
   - Exercise name
   - Sets (number)
   - Reps (number)
   - Recommended weight (if applicable)
   - Rest time in seconds
   - Brief notes/form cues

Return ONLY valid JSON in this format:
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
}
`;

    // ⚙️ Initialize Google GenAI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 🧠 Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();

    // 🧩 Extract and validate JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const workoutPlan = parseWorkoutPlan(JSON.parse(jsonMatch[0]));
    if (!workoutPlan) {
      throw new Error("Invalid workout plan");
    }

    // ✅ Optionally save to Supabase
    // await supabase.from("workouts").insert({
    //   user_id: user.id,
    //   plan_name: workoutPlan.name,
    //   description: workoutPlan.description,
    //   data: workoutPlan,
    // });

    return Response.json(workoutPlan);
  } catch (error) {
    console.error("[FitPlanner] AI workout generation error:", error);
    return Response.json(
      { error: "Failed to generate workout plan" },
      { status: 500 }
    );
  }
}

function parseWorkoutPlan(payload: unknown): WorkoutPlan | null {
  if (!isRecord(payload)) return null;
  if (!isString(payload.name) || !isString(payload.description)) return null;
  if (!Array.isArray(payload.exercises)) return null;

  const exercises = payload.exercises
    .filter((exercise): exercise is Record<string, unknown> => isRecord(exercise))
    .map((exercise) => {
      if (!isString(exercise.name)) return null;
      if (!isNumber(exercise.sets) || !isNumber(exercise.reps)) return null;
      if (!isNumber(exercise.rest_seconds)) return null;

      const parsed: WorkoutExercise = {
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_seconds: exercise.rest_seconds,
      };

      if (isNumber(exercise.weight_kg)) parsed.weight_kg = exercise.weight_kg;
      if (isString(exercise.notes)) parsed.notes = exercise.notes;

      return parsed;
    })
    .filter((exercise): exercise is WorkoutExercise => Boolean(exercise));

  if (exercises.length === 0) return null;

  return {
    name: payload.name,
    description: payload.description,
    exercises,
  };
}
