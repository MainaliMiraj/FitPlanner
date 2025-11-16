import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { NutritionPageClient } from "@/components/nutrition/nutrition-page-client"
import { nutritionPlanSchema, type NutritionPlan } from "@/types/nutrition"
import type { ProfileData } from "@/types/user"

export default async function NutritionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: planRow } = await supabase
    .from("nutrition_plans")
    .select("plan")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  let parsedPlan: NutritionPlan | null = null
  if (planRow?.plan) {
    const result = nutritionPlanSchema.safeParse(planRow.plan)
    if (result.success) {
      parsedPlan = result.data
    }
  }

  return <NutritionPageClient initialProfile={(profile as ProfileData) ?? null} initialPlan={parsedPlan} />
}
