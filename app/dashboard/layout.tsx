import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { FitnessCoachSidebar } from "@/components/fitness-coach-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let conversationId = ""
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (conversation) {
    conversationId = conversation.id
  } else {
    const { data: newConversation } = await supabase
      .from("conversations")
      .insert({ user_id: user.id })
      .select("id")
      .single()
    conversationId = newConversation?.id || ""
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardNav user={user} />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto p-6 lg:p-8">{children}</div>
      </main>
      <FitnessCoachSidebar conversationId={conversationId} />
    </div>
  )
}
