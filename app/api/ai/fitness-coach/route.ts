import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { messages, conversationId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    // Fetch user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const userContext = profile
      ? `User Profile:
- Name: ${profile.display_name || "User"}
- Goal: ${profile.fitness_goal || "Not set"}
- Level: ${profile.current_fitness_level || "Not specified"}
- Weight: ${profile.weight_kg ? profile.weight_kg + " kg" : "Not specified"}
- Height: ${profile.height_cm ? profile.height_cm + " cm" : "Not specified"}`
      : "";

    const systemPrompt = `You are a friendly and expert AI Fitness Coach.
You give workout, nutrition, and motivation advice tailored to the user's fitness profile.

${userContext}

Respond helpfully, clearly, and concisely.`;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Combine messages into a single user prompt
    const conversation = messages
      .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const fullPrompt = `${systemPrompt}\n\n${conversation}\nAI:`; // AI will continue the conversation

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const text = response.response.text();

    // Save AI message
    if (conversationId && conversationId !== "temp") {
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: text,
        user_id: user.id,
      });
    }

    return NextResponse.json({ content: text });
  } catch (err) {
    console.error("AI error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
