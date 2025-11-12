import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dumbbell, Clock, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { StartWorkoutButton } from "@/components/start-workout-button"

export default async function WorkoutDetailPage({
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

  // Fetch workout with exercises
  const { data: workout, error } = await supabase
    .from("workouts")
    .select("*, exercises(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !workout) {
    notFound()
  }

  // Sort exercises by order_index
  const exercises =
    workout.exercises?.sort(
      (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index,
    ) || []

  const difficultyColors = {
    beginner: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
    advanced: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard/workouts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workouts
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{workout.name}</h1>
            {workout.description && <p className="text-muted-foreground mt-2">{workout.description}</p>}
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
      </div>

      {/* Metadata */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-rose-200 dark:border-rose-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-rose-500" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workout.duration_minutes || 0} <span className="text-sm text-muted-foreground">min</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 dark:border-rose-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-rose-500" />
              Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exercises.length}</div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 dark:border-rose-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-rose-500" />
              Muscle Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workout.target_muscle_groups?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Muscle Groups */}
      {workout.target_muscle_groups && workout.target_muscle_groups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Target Muscle Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {workout.target_muscle_groups.map((group: string) => (
                <Badge key={group} variant="outline">
                  {group}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercises */}
      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          {exercises.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No exercises added yet</p>
          ) : (
            <div className="space-y-4">
              {exercises.map(
                (
                  exercise: {
                    id: string
                    name: string
                    sets: number
                    reps: number
                    weight_kg: number | null
                    rest_seconds: number
                    notes: string | null
                  },
                  index: number,
                ) => (
                  <div
                    key={exercise.id}
                    className="flex gap-4 p-4 rounded-lg border border-rose-200 dark:border-rose-900/20"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/30 shrink-0">
                      <span className="text-lg font-bold text-rose-500">{index + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{exercise.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>
                          <strong>{exercise.sets}</strong> sets
                        </span>
                        <span>
                          <strong>{exercise.reps}</strong> reps
                        </span>
                        {exercise.weight_kg && (
                          <span>
                            <strong>{exercise.weight_kg}</strong> kg
                          </span>
                        )}
                        <span>
                          <strong>{exercise.rest_seconds}</strong>s rest
                        </span>
                      </div>
                      {exercise.notes && <p className="text-sm text-muted-foreground italic">{exercise.notes}</p>}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <StartWorkoutButton workoutId={workout.id} workoutName={workout.name} />
      </div>
    </div>
  )
}
