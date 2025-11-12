"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface StartWorkoutButtonProps {
  workoutId: string
  workoutName: string
}

export function StartWorkoutButton({ workoutId, workoutName }: StartWorkoutButtonProps) {
  const [isLogging, setIsLogging] = useState(false)
  const router = useRouter()

  const handleStartWorkout = async () => {
    if (!confirm(`Start workout: ${workoutName}?`)) return

    setIsLogging(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Create workout log
      const { data, error } = await supabase
        .from("workout_logs")
        .insert({
          user_id: user.id,
          workout_id: workoutId,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      alert("Workout logged successfully!")
      router.push("/dashboard/progress")
      router.refresh()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to log workout")
    } finally {
      setIsLogging(false)
    }
  }

  return (
    <Button onClick={handleStartWorkout} disabled={isLogging} className="bg-rose-500 hover:bg-rose-600">
      <Play className="h-4 w-4 mr-2" />
      {isLogging ? "Logging..." : "Start Workout"}
    </Button>
  )
}
