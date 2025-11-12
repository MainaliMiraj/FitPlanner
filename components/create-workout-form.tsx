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

interface Exercise {
  name: string
  sets: number
  reps: number
  weight_kg: number
  rest_seconds: number
  notes: string
  order_index: number
}

export function CreateWorkoutForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("beginner")
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [muscleGroups, setMuscleGroups] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      name: "",
      sets: 3,
      reps: 10,
      weight_kg: 0,
      rest_seconds: 60,
      notes: "",
      order_index: 0,
    },
  ])

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        name: "",
        sets: 3,
        reps: 10,
        weight_kg: 0,
        rest_seconds: 60,
        notes: "",
        order_index: exercises.length,
      },
    ])
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const updated = [...exercises]
    updated[index] = { ...updated[index], [field]: value }
    setExercises(updated)
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

      // Create workout
      const { data: workout, error: workoutError } = await supabase
        .from("workouts")
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          difficulty,
          duration_minutes: durationMinutes,
          target_muscle_groups: muscleGroups ? muscleGroups.split(",").map((g) => g.trim()) : null,
        })
        .select()
        .single()

      if (workoutError) throw workoutError

      // Create exercises
      const exercisesData = exercises
        .filter((ex) => ex.name.trim())
        .map((ex, idx) => ({
          workout_id: workout.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight_kg: ex.weight_kg || null,
          rest_seconds: ex.rest_seconds,
          notes: ex.notes || null,
          order_index: idx,
        }))

      if (exercisesData.length > 0) {
        const { error: exercisesError } = await supabase.from("exercises").insert(exercisesData)

        if (exercisesError) throw exercisesError
      }

      router.push("/dashboard/workouts")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create workout")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Workout Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Upper Body Strength"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your workout..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
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
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number.parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="muscleGroups">Target Muscle Groups</Label>
          <Input
            id="muscleGroups"
            placeholder="e.g., Chest, Shoulders, Triceps (comma-separated)"
            value={muscleGroups}
            onChange={(e) => setMuscleGroups(e.target.value)}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg">Exercises</Label>
          <Button type="button" variant="outline" size="sm" onClick={addExercise}>
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <Card key={index} className="border-rose-200 dark:border-rose-900/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 grid gap-2">
                      <Label>Exercise Name *</Label>
                      <Input
                        placeholder="e.g., Bench Press"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    {exercises.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(index)}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="grid gap-2">
                      <Label>Sets</Label>
                      <Input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, "sets", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Reps</Label>
                      <Input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, "reps", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight_kg}
                        onChange={(e) => updateExercise(index, "weight_kg", Number.parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Rest (sec)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={exercise.rest_seconds}
                        onChange={(e) => updateExercise(index, "rest_seconds", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Notes</Label>
                    <Input
                      placeholder="Optional notes..."
                      value={exercise.notes}
                      onChange={(e) => updateExercise(index, "notes", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200 dark:border-rose-900">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Workout"}
        </Button>
      </div>
    </form>
  )
}
