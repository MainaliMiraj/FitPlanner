"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight_kg: number | null
}

interface Workout {
  id: string
  name: string
  description: string | null
  difficulty: string | null
  duration_minutes: number | null
  target_muscle_groups: string[] | null
  exercises?: Exercise[]
}

interface WorkoutCardProps {
  workout: Workout
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${workout.name}"?`)) return

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase.from("workouts").delete().eq("id", workout.id)

    if (error) {
      alert("Failed to delete workout")
      setIsDeleting(false)
      return
    }

    router.refresh()
  }

  return (
    <Card className="group hover:shadow-lg transition-all border-rose-200 dark:border-rose-900/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{workout.name}</CardTitle>
            {workout.description && <CardDescription className="line-clamp-2">{workout.description}</CardDescription>}
          </div>
          {workout.difficulty && (
            <Badge
              variant="secondary"
              className={difficultyColors[workout.difficulty as keyof typeof difficultyColors] || ""}
            >
              {workout.difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {workout.duration_minutes && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{workout.duration_minutes} min</span>
              </div>
            )}
            {workout.exercises && (
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{workout.exercises.length} exercises</span>
              </div>
            )}
          </div>

          {/* Muscle Groups */}
          {workout.target_muscle_groups && workout.target_muscle_groups.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {workout.target_muscle_groups.slice(0, 3).map((group) => (
                <Badge key={group} variant="outline" className="text-xs">
                  {group}
                </Badge>
              ))}
              {workout.target_muscle_groups.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{workout.target_muscle_groups.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" className="flex-1 bg-transparent" size="sm">
              <Link href={`/dashboard/workouts/${workout.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
