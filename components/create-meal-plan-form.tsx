"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface Meal {
  name: string
  meal_type: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  ingredients: string
  instructions: string
}

export function CreateMealPlanForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [targetCalories, setTargetCalories] = useState(2000)
  const [targetProtein, setTargetProtein] = useState(150)
  const [targetCarbs, setTargetCarbs] = useState(200)
  const [targetFat, setTargetFat] = useState(65)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [meals, setMeals] = useState<Meal[]>([
    {
      name: "",
      meal_type: "breakfast",
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      ingredients: "",
      instructions: "",
    },
  ])

  const addMeal = () => {
    setMeals([
      ...meals,
      {
        name: "",
        meal_type: "breakfast",
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        ingredients: "",
        instructions: "",
      },
    ])
  }

  const removeMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index))
  }

  const updateMeal = (index: number, field: keyof Meal, value: string | number) => {
    const updated = [...meals]
    updated[index] = { ...updated[index], [field]: value }
    setMeals(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Create meal plan
      const { data: mealPlan, error: mealPlanError } = await supabase
        .from("meal_plans")
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          target_calories: targetCalories,
          target_protein_g: targetProtein,
          target_carbs_g: targetCarbs,
          target_fat_g: targetFat,
          start_date: startDate || null,
          end_date: endDate || null,
        })
        .select()
        .single()

      if (mealPlanError) throw mealPlanError

      // Create meals
      const mealsData = meals
        .filter((meal) => meal.name.trim())
        .map((meal) => ({
          meal_plan_id: mealPlan.id,
          name: meal.name,
          meal_type: meal.meal_type,
          calories: meal.calories || null,
          protein_g: meal.protein_g || null,
          carbs_g: meal.carbs_g || null,
          fat_g: meal.fat_g || null,
          ingredients: meal.ingredients ? meal.ingredients.split(",").map((i) => i.trim()) : null,
          instructions: meal.instructions || null,
        }))

      if (mealsData.length > 0) {
        const { error: mealsError } = await supabase.from("meals").insert(mealsData)

        if (mealsError) throw mealsError
      }

      router.push("/dashboard/nutrition")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create meal plan")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Meal Plan Name *</Label>
          <Input
            id="name"
            placeholder="e.g., High Protein Weekly Plan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your meal plan..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Nutrition Targets */}
      <div className="space-y-4">
        <Label className="text-lg">Daily Nutrition Targets</Label>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              min="0"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number.parseInt(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              min="0"
              value={targetProtein}
              onChange={(e) => setTargetProtein(Number.parseInt(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input
              id="carbs"
              type="number"
              min="0"
              value={targetCarbs}
              onChange={(e) => setTargetCarbs(Number.parseInt(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              type="number"
              min="0"
              value={targetFat}
              onChange={(e) => setTargetFat(Number.parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg">Meals</Label>
          <Button type="button" variant="outline" size="sm" onClick={addMeal}>
            <Plus className="h-4 w-4 mr-2" />
            Add Meal
          </Button>
        </div>

        <div className="space-y-4">
          {meals.map((meal, index) => (
            <Card key={index} className="border-lime-200 dark:border-lime-900/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 grid gap-2">
                      <Label>Meal Name *</Label>
                      <Input
                        placeholder="e.g., Grilled Chicken Salad"
                        value={meal.name}
                        onChange={(e) => updateMeal(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    {meals.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMeal(index)}
                        className="text-lime-600 hover:text-lime-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-5">
                    <div className="grid gap-2">
                      <Label>Type</Label>
                      <Select value={meal.meal_type} onValueChange={(value) => updateMeal(index, "meal_type", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Calories</Label>
                      <Input
                        type="number"
                        min="0"
                        value={meal.calories}
                        onChange={(e) => updateMeal(index, "calories", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Protein (g)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={meal.protein_g}
                        onChange={(e) => updateMeal(index, "protein_g", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Carbs (g)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={meal.carbs_g}
                        onChange={(e) => updateMeal(index, "carbs_g", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Fat (g)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={meal.fat_g}
                        onChange={(e) => updateMeal(index, "fat_g", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Ingredients (comma-separated)</Label>
                    <Input
                      placeholder="e.g., Chicken breast, Lettuce, Tomatoes"
                      value={meal.ingredients}
                      onChange={(e) => updateMeal(index, "ingredients", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Instructions</Label>
                    <Textarea
                      placeholder="How to prepare this meal..."
                      value={meal.instructions}
                      onChange={(e) => updateMeal(index, "instructions", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-lime-700 bg-lime-50 dark:bg-lime-950/20 p-3 rounded-lg border border-lime-200 dark:border-lime-900">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-lime-500 hover:bg-lime-600" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Meal Plan"}
        </Button>
      </div>
    </form>
  )
}
