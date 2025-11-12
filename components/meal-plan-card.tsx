"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Utensils, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Meal {
  id: string
  name: string
  meal_type: string
  calories: number | null
}

interface MealPlan {
  id: string
  name: string
  description: string | null
  target_calories: number | null
  target_protein_g: number | null
  target_carbs_g: number | null
  target_fat_g: number | null
  start_date: string | null
  end_date: string | null
  meals?: Meal[]
}

interface MealPlanCardProps {
  mealPlan: MealPlan
}

export function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${mealPlan.name}"?`)) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase.from("meal_plans").delete().eq("id", mealPlan.id)

    if (error) {
      alert("Failed to delete meal plan")
      setIsDeleting(false)
      return
    }

    router.refresh()
  }

  const isActive =
    mealPlan.start_date &&
    mealPlan.end_date &&
    new Date(mealPlan.start_date) <= new Date() &&
    new Date(mealPlan.end_date) >= new Date()

  return (
    <Card className="group hover:shadow-lg transition-all border-lime-200 dark:border-lime-900/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1 flex items-center gap-2">
              {mealPlan.name}
              {isActive && <Badge className="bg-lime-500 hover:bg-lime-600">Active</Badge>}
            </CardTitle>
            {mealPlan.description && <CardDescription className="line-clamp-2">{mealPlan.description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Metadata */}
          <div className="space-y-2 text-sm">
            {(mealPlan.start_date || mealPlan.end_date) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {mealPlan.start_date ? new Date(mealPlan.start_date).toLocaleDateString() : "?"} -{" "}
                  {mealPlan.end_date ? new Date(mealPlan.end_date).toLocaleDateString() : "?"}
                </span>
              </div>
            )}
            {mealPlan.meals && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Utensils className="h-4 w-4" />
                <span>{mealPlan.meals.length} meals</span>
              </div>
            )}
          </div>

          {/* Macros */}
          {(mealPlan.target_calories ||
            mealPlan.target_protein_g ||
            mealPlan.target_carbs_g ||
            mealPlan.target_fat_g) && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              {mealPlan.target_calories && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Calories:</span>
                  <span className="ml-1 font-semibold">{mealPlan.target_calories}</span>
                </div>
              )}
              {mealPlan.target_protein_g && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Protein:</span>
                  <span className="ml-1 font-semibold">{mealPlan.target_protein_g}g</span>
                </div>
              )}
              {mealPlan.target_carbs_g && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Carbs:</span>
                  <span className="ml-1 font-semibold">{mealPlan.target_carbs_g}g</span>
                </div>
              )}
              {mealPlan.target_fat_g && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Fat:</span>
                  <span className="ml-1 font-semibold">{mealPlan.target_fat_g}g</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" className="flex-1 bg-transparent" size="sm">
              <Link href={`/dashboard/nutrition/${mealPlan.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-lime-600 hover:text-lime-700 hover:bg-lime-50 dark:hover:bg-lime-950/20 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
