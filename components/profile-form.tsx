"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Profile {
  id: string
  display_name: string
  height_cm: number | null
  weight_kg: number | null
  date_of_birth: string | null
  fitness_goal: string | null
  activity_level: string | null
}

interface ProfileFormProps {
  profile: Profile | null
  userId: string
}

export function ProfileForm({ profile, userId }: ProfileFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [heightCm, setHeightCm] = useState(profile?.height_cm?.toString() || "")
  const [weightKg, setWeightKg] = useState(profile?.weight_kg?.toString() || "")
  const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth || "")
  const [fitnessGoal, setFitnessGoal] = useState(profile?.fitness_goal || "maintain")
  const [activityLevel, setActivityLevel] = useState(profile?.activity_level || "moderately_active")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          height_cm: heightCm ? Number.parseInt(heightCm) : null,
          weight_kg: weightKg ? Number.parseFloat(weightKg) : null,
          date_of_birth: dateOfBirth || null,
          fitness_goal: fitnessGoal,
          activity_level: activityLevel,
        })
        .eq("id", userId)

      if (updateError) throw updateError

      setSuccess(true)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="displayName">Display Name *</Label>
        <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input id="height" type="number" min="0" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            min="0"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="fitnessGoal">Fitness Goal</Label>
        <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
          <SelectTrigger id="fitnessGoal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lose_weight">Lose Weight</SelectItem>
            <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
            <SelectItem value="maintain">Maintain</SelectItem>
            <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="activityLevel">Activity Level</Label>
        <Select value={activityLevel} onValueChange={setActivityLevel}>
          <SelectTrigger id="activityLevel">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">Sedentary</SelectItem>
            <SelectItem value="lightly_active">Lightly Active</SelectItem>
            <SelectItem value="moderately_active">Moderately Active</SelectItem>
            <SelectItem value="very_active">Very Active</SelectItem>
            <SelectItem value="extra_active">Extra Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200 dark:border-rose-900">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-700 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-900">
          Profile updated successfully!
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
