import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { error } = await supabase.from("profiles").update(body).eq("id", user.id)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Quiz save error:", error)
    return Response.json({ error: "Failed to save quiz answers" }, { status: 500 })
  }
}
