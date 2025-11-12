import { convertToModelMessages, streamText } from "ai"
import { google } from "@ai-sdk/google"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch (e) {
      console.error("[v0] Failed to parse request body:", e)
      return Response.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { messages, conversationId } = body

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages must be an array" }, { status: 400 })
    }

    if (!conversationId) {
      return Response.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    // Ensure conversation exists
    if (conversationId !== "temp") {
      const { data: existingConversation } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .single()

      if (!existingConversation) {
        // Create new conversation if it doesn't exist
        const { error: insertError } = await supabase.from("conversations").insert({
          id: conversationId,
          user_id: user.id,
        })
        if (insertError) {
          console.error("[v0] Error creating conversation:", insertError)
        }
      }
    }

    // Save user message
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage?.role === "user" && conversationId !== "temp") {
      const { error: msgError } = await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: lastUserMessage.content,
        user_id: user.id,
      })
      if (msgError) {
        console.error("[v0] Error saving user message:", msgError)
      }
    }

    // Get user profile for context
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[v0] Error fetching profile:", profileError)
    }

    const userContext = profile
      ? `User Profile:
- Name: ${profile.display_name || "User"}
- Fitness Goal: ${profile.fitness_goal || "Not set"}
- Experience: ${profile.current_fitness_level || "Not specified"}
- Weight: ${profile.weight_kg ? profile.weight_kg + " kg" : "Not specified"}
- Height: ${profile.height_cm ? profile.height_cm + " cm" : "Not specified"}`
      : ""

    const systemPrompt = `You are a 24/7 AI Fitness Coach for FitPlanner. You provide expert guidance on:
- Personalized workout suggestions based on user's goals and experience
- Nutrition advice and meal planning
- Motivation and accountability support
- Exercise form tips and injury prevention
- Progress tracking and goal setting

${userContext}

Be encouraging, knowledgeable, and supportive. Keep responses concise but informative. Ask follow-up questions when needed.`

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      maxTokens: 1000,
      onFinish: async (event) => {
        // Save assistant response to database
        if (conversationId !== "temp") {
          const { error: assistantMsgError } = await supabase.from("chat_messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: event.text,
            user_id: user.id,
          })
          if (assistantMsgError) {
            console.error("[v0] Error saving assistant message:", assistantMsgError)
          }
        }
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Fitness coach API error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 })
  }
}
