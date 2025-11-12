"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

export function AIWorkoutForm() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedWorkout, setGeneratedWorkout] = useState<{
    name: string
    description: string
    exercises: {
      name: string
      sets: number
      reps: number
      weight_kg?: number
      rest_seconds: number
      notes?: string
    }[]
  } | null>(null)

  const [goal, setGoal] = useState("strength training")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [duration, setDuration] = useState("45")
  const [equipment, setEquipment] = useState("full gym")

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedWorkout(null)

    try {
      const response = await fetch("/api/ai/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, difficulty, duration, equipment }),
      })

      if (!response.ok) throw new Error("Failed to generate workout")

      const data = await response.json()
      setGeneratedWorkout(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate workout")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedWorkout) return

    setIsSaving(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Create workout
      const { data: workout, error: workoutError } = await supabase
        .from("workouts")
        .insert({
          user_id: user.id,
          name: generatedWorkout.name,
          description: generatedWorkout.description,
          difficulty,
          duration_minutes: Number.parseInt(duration),
        })
        .select()
        .single()

      if (workoutError) throw workoutError

      // Create exercises
      const exercisesData = generatedWorkout.exercises.map((ex, idx) => ({
        workout_id: workout.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight_kg: ex.weight_kg || null,
        rest_seconds: ex.rest_seconds,
        notes: ex.notes || null,
        order_index: idx,
      }))

      const { error: exercisesError } = await supabase.from("exercises").insert(exercisesData)

      if (exercisesError) throw exercisesError

      router.push("/dashboard/workouts")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save workout")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      {!generatedWorkout && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="goal">Workout Goal</Label>
            <Input
              id="goal"
              placeholder="e.g., strength training, cardio, HIIT"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="120"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="equipment">Available Equipment</Label>
            <Textarea
              id="equipment"
              placeholder="e.g., dumbbells, barbell, bench, pull-up bar"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              rows={2}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Workout...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Workout
              </>
            )}
          </Button>
        </div>
      )}

      {/* Generated Workout */}
      {generatedWorkout && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">{generatedWorkout.name}</h3>
            <Button variant="outline" onClick={() => setGeneratedWorkout(null)} disabled={isSaving}>
              Regenerate
            </Button>
          </div>

          <p className="text-muted-foreground">{generatedWorkout.description}</p>

          <div className="space-y-4">
            {generatedWorkout.exercises.map((exercise, index) => (
              <Card key={index} className="border-rose-200 dark:border-rose-900/20">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/30 shrink-0">
                      <span className="text-lg font-bold text-rose-500">{index + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-lg">{exercise.name}</h4>
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
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-rose-500 hover:bg-rose-600">
              {isSaving ? "Saving..." : "Save Workout"}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200 dark:border-rose-900">
          {error}
        </div>
      )}
    </div>
  )
}
