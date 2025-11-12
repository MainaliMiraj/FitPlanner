import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Apple, Sparkles } from "lucide-react"
import Link from "next/link"
import { MealPlanCard } from "@/components/meal-plan-card"

export default async function NutritionPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's meal plans
  const { data: mealPlans } = await supabase
    .from("meal_plans")
    .select("*, meals(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  // Calculate totals
  const activePlans =
    mealPlans?.filter(
      (plan) =>
        plan.start_date &&
        plan.end_date &&
        new Date(plan.start_date) <= new Date() &&
        new Date(plan.end_date) >= new Date(),
    ).length || 0

  const totalMeals = mealPlans?.reduce((acc, plan) => acc + (plan.meals?.length || 0), 0) || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-100 dark:bg-lime-950/30">
              <Apple className="h-6 w-6 text-lime-500" />
            </div>
            Nutrition
          </h1>
          <p className="text-muted-foreground mt-2">Plan your meals and track your nutrition</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="border-green-200 dark:border-green-900/20 bg-transparent">
            <Link href="/dashboard/nutrition/ai-generate">
              <Sparkles className="h-4 w-4 mr-2 text-green-500" />
              AI Generate
            </Link>
          </Button>
          <Button asChild className="bg-lime-500 hover:bg-lime-600">
            <Link href="/dashboard/nutrition/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Meal Plan
            </Link>
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {!mealPlans || mealPlans.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-100 dark:bg-lime-950/30">
                <Apple className="h-8 w-8 text-lime-500" />
              </div>
            </div>
            <CardTitle className="text-2xl">No Meal Plans Yet</CardTitle>
            <CardDescription className="text-base">
              Create your first meal plan to start tracking your nutrition
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-lime-500 hover:bg-lime-600">
              <Link href="/dashboard/nutrition/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Meal Plan
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mealPlans.map((mealPlan) => (
            <MealPlanCard key={mealPlan.id} mealPlan={mealPlan} />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {mealPlans && mealPlans.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-lime-200 dark:border-lime-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Apple className="h-4 w-4 text-lime-500" />
                Total Meal Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mealPlans.length}</div>
            </CardContent>
          </Card>

          <Card className="border-lime-200 dark:border-lime-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Apple className="h-4 w-4 text-lime-500" />
                Active Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activePlans}</div>
            </CardContent>
          </Card>

          <Card className="border-lime-200 dark:border-lime-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Apple className="h-4 w-4 text-lime-500" />
                Total Meals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMeals}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
