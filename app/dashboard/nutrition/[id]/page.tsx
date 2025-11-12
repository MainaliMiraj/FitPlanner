import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Utensils, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function MealPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch meal plan with meals
  const { data: mealPlan, error } = await supabase
    .from("meal_plans")
    .select("*, meals(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !mealPlan) {
    notFound()
  }

  const meals = mealPlan.meals || []

  const mealTypeColors = {
    breakfast: "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
    lunch: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    dinner: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
    snack: "bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400",
  }

  const isActive =
    mealPlan.start_date &&
    mealPlan.end_date &&
    new Date(mealPlan.start_date) <= new Date() &&
    new Date(mealPlan.end_date) >= new Date()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard/nutrition">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Nutrition
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
              {mealPlan.name}
              {isActive && <Badge className="bg-lime-500 hover:bg-lime-600">Active</Badge>}
            </h1>
            {mealPlan.description && <p className="text-muted-foreground mt-2">{mealPlan.description}</p>}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid gap-4 sm:grid-cols-2">
        {(mealPlan.start_date || mealPlan.end_date) && (
          <Card className="border-lime-200 dark:border-lime-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-lime-500" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {mealPlan.start_date ? new Date(mealPlan.start_date).toLocaleDateString() : "?"} -{" "}
                {mealPlan.end_date ? new Date(mealPlan.end_date).toLocaleDateString() : "?"}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-lime-200 dark:border-lime-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Utensils className="h-4 w-4 text-lime-500" />
              Total Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meals.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Nutrition Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Calories</div>
              <div className="text-2xl font-bold">{mealPlan.target_calories || 0}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Protein</div>
              <div className="text-2xl font-bold">
                {mealPlan.target_protein_g || 0}
                <span className="text-sm text-muted-foreground ml-1">g</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Carbs</div>
              <div className="text-2xl font-bold">
                {mealPlan.target_carbs_g || 0}
                <span className="text-sm text-muted-foreground ml-1">g</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Fat</div>
              <div className="text-2xl font-bold">
                {mealPlan.target_fat_g || 0}
                <span className="text-sm text-muted-foreground ml-1">g</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <Card>
        <CardHeader>
          <CardTitle>Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No meals added yet</p>
          ) : (
            <div className="space-y-6">
              {meals.map(
                (meal: {
                  id: string
                  name: string
                  meal_type: string
                  calories: number | null
                  protein_g: number | null
                  carbs_g: number | null
                  fat_g: number | null
                  ingredients: string[] | null
                  instructions: string | null
                }) => (
                  <div key={meal.id} className="p-4 rounded-lg border border-lime-200 dark:border-lime-900/20">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg">{meal.name}</h3>
                      <Badge
                        variant="secondary"
                        className={mealTypeColors[meal.meal_type as keyof typeof mealTypeColors] || ""}
                      >
                        {meal.meal_type}
                      </Badge>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-4 mb-3 text-sm">
                      {meal.calories && (
                        <div>
                          <span className="text-muted-foreground">Calories:</span>
                          <span className="ml-1 font-semibold">{meal.calories}</span>
                        </div>
                      )}
                      {meal.protein_g && (
                        <div>
                          <span className="text-muted-foreground">Protein:</span>
                          <span className="ml-1 font-semibold">{meal.protein_g}g</span>
                        </div>
                      )}
                      {meal.carbs_g && (
                        <div>
                          <span className="text-muted-foreground">Carbs:</span>
                          <span className="ml-1 font-semibold">{meal.carbs_g}g</span>
                        </div>
                      )}
                      {meal.fat_g && (
                        <div>
                          <span className="text-muted-foreground">Fat:</span>
                          <span className="ml-1 font-semibold">{meal.fat_g}g</span>
                        </div>
                      )}
                    </div>

                    {meal.ingredients && meal.ingredients.length > 0 && (
                      <div className="mb-2">
                        <div className="text-sm font-medium mb-1">Ingredients:</div>
                        <div className="flex flex-wrap gap-2">
                          {meal.ingredients.map((ingredient, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {meal.instructions && (
                      <div>
                        <div className="text-sm font-medium mb-1">Instructions:</div>
                        <p className="text-sm text-muted-foreground">{meal.instructions}</p>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
