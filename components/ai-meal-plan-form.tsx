"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2 } from "lucide-react"

export function AIMealPlanForm() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedPlan, setGeneratedPlan] = useState<{
    name: string
    description: string
    meals: {
      name: string
      meal_type: string
      calories: number
      protein_g: number
      carbs_g: number
      fat_g: number
      ingredients: string[]
      instructions: string
    }[]
  } | null>(null)

  const [targetCalories, setTargetCalories] = useState("2000")
  const [dietaryPreferences, setDietaryPreferences] = useState("")
  const [mealsPerDay, setMealsPerDay] = useState("3")

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedPlan(null)

    try {
      const response = await fetch("/api/ai/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCalories: Number.parseInt(targetCalories),
          dietaryPreferences,
          mealsPerDay: Number.parseInt(mealsPerDay),
        }),
      })

      if (!response.ok) throw new Error("Failed to generate meal plan")

      const data = await response.json()
      setGeneratedPlan(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate meal plan")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedPlan) return

    setIsSaving(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Calculate total macros
      const totalCalories = generatedPlan.meals.reduce((acc, m) => acc + m.calories, 0)
      const totalProtein = generatedPlan.meals.reduce((acc, m) => acc + m.protein_g, 0)
      const totalCarbs = generatedPlan.meals.reduce((acc, m) => acc + m.carbs_g, 0)
      const totalFat = generatedPlan.meals.reduce((acc, m) => acc + m.fat_g, 0)

      // Create meal plan
      const { data: mealPlan, error: planError } = await supabase
        .from("meal_plans")
        .insert({
          user_id: user.id,
          name: generatedPlan.name,
          description: generatedPlan.description,
          target_calories: totalCalories,
          target_protein_g: totalProtein,
          target_carbs_g: totalCarbs,
          target_fat_g: totalFat,
        })
        .select()
        .single()

      if (planError) throw planError

      // Create meals
      const mealsData = generatedPlan.meals.map((meal) => ({
        meal_plan_id: mealPlan.id,
        name: meal.name,
        meal_type: meal.meal_type,
        calories: meal.calories,
        protein_g: meal.protein_g,
        carbs_g: meal.carbs_g,
        fat_g: meal.fat_g,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
      }))

      const { error: mealsError } = await supabase.from("meals").insert(mealsData)

      if (mealsError) throw mealsError

      router.push("/dashboard/nutrition")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save meal plan")
    } finally {
      setIsSaving(false)
    }
  }

  const mealTypeColors: Record<string, string> = {
    breakfast: "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
    lunch: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    dinner: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
    snack: "bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400",
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      {!generatedPlan && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="calories">Target Daily Calories</Label>
            <Input
              id="calories"
              type="number"
              min="1200"
              max="5000"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="meals">Meals Per Day</Label>
            <Input
              id="meals"
              type="number"
              min="2"
              max="6"
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="preferences">Dietary Preferences/Restrictions</Label>
            <Textarea
              id="preferences"
              placeholder="e.g., vegetarian, gluten-free, high protein, low carb"
              value={dietaryPreferences}
              onChange={(e) => setDietaryPreferences(e.target.value)}
              rows={2}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Meal Plan...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Meal Plan
              </>
            )}
          </Button>
        </div>
      )}

      {/* Generated Meal Plan */}
      {generatedPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">{generatedPlan.name}</h3>
            <Button variant="outline" onClick={() => setGeneratedPlan(null)} disabled={isSaving}>
              Regenerate
            </Button>
          </div>

          <p className="text-muted-foreground">{generatedPlan.description}</p>

          <div className="space-y-6">
            {generatedPlan.meals.map((meal, index) => (
              <Card key={index} className="border-lime-200 dark:border-lime-900/20">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-lg">{meal.name}</h4>
                      <Badge variant="secondary" className={mealTypeColors[meal.meal_type] || ""}>
                        {meal.meal_type}
                      </Badge>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Calories:</span>
                        <span className="ml-1 font-semibold">{meal.calories}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Protein:</span>
                        <span className="ml-1 font-semibold">{meal.protein_g}g</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Carbs:</span>
                        <span className="ml-1 font-semibold">{meal.carbs_g}g</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fat:</span>
                        <span className="ml-1 font-semibold">{meal.fat_g}g</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Ingredients:</div>
                      <div className="flex flex-wrap gap-2">
                        {meal.ingredients.map((ingredient, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Instructions:</div>
                      <p className="text-sm text-muted-foreground">{meal.instructions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-lime-500 hover:bg-lime-600">
              {isSaving ? "Saving..." : "Save Meal Plan"}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-lime-700 bg-lime-50 dark:bg-lime-950/20 p-3 rounded-lg border border-lime-200 dark:border-lime-900">
          {error}
        </div>
      )}
    </div>
  )
}
