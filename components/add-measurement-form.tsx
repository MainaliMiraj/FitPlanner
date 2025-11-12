"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddMeasurementForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [weightKg, setWeightKg] = useState("")
  const [bodyFatPercentage, setBodyFatPercentage] = useState("")
  const [muscleMassKg, setMuscleMassKg] = useState("")
  const [chestCm, setChestCm] = useState("")
  const [waistCm, setWaistCm] = useState("")
  const [hipsCm, setHipsCm] = useState("")
  const [bicepsCm, setBicepsCm] = useState("")
  const [thighsCm, setThighsCm] = useState("")
  const [measuredAt, setMeasuredAt] = useState(new Date().toISOString().split("T")[0])

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

      // Create measurement
      const { error: measurementError } = await supabase.from("body_measurements").insert({
        user_id: user.id,
        weight_kg: weightKg ? Number.parseFloat(weightKg) : null,
        body_fat_percentage: bodyFatPercentage ? Number.parseFloat(bodyFatPercentage) : null,
        muscle_mass_kg: muscleMassKg ? Number.parseFloat(muscleMassKg) : null,
        chest_cm: chestCm ? Number.parseFloat(chestCm) : null,
        waist_cm: waistCm ? Number.parseFloat(waistCm) : null,
        hips_cm: hipsCm ? Number.parseFloat(hipsCm) : null,
        biceps_cm: bicepsCm ? Number.parseFloat(bicepsCm) : null,
        thighs_cm: thighsCm ? Number.parseFloat(thighsCm) : null,
        measured_at: new Date(measuredAt).toISOString(),
      })

      if (measurementError) throw measurementError

      router.push("/dashboard/progress")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log measurement")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="measuredAt">Measurement Date *</Label>
        <Input
          id="measuredAt"
          type="date"
          value={measuredAt}
          onChange={(e) => setMeasuredAt(e.target.value)}
          required
        />
      </div>

      <div className="space-y-4">
        <Label className="text-base">Body Composition</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              placeholder="75.5"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bodyFat">Body Fat (%)</Label>
            <Input
              id="bodyFat"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="15.5"
              value={bodyFatPercentage}
              onChange={(e) => setBodyFatPercentage(e.target.value)}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="muscle">Muscle Mass (kg)</Label>
            <Input
              id="muscle"
              type="number"
              step="0.1"
              min="0"
              placeholder="60.0"
              value={muscleMassKg}
              onChange={(e) => setMuscleMassKg(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Body Measurements (cm)</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="chest">Chest</Label>
            <Input
              id="chest"
              type="number"
              step="0.1"
              min="0"
              placeholder="100.0"
              value={chestCm}
              onChange={(e) => setChestCm(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="waist">Waist</Label>
            <Input
              id="waist"
              type="number"
              step="0.1"
              min="0"
              placeholder="80.0"
              value={waistCm}
              onChange={(e) => setWaistCm(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hips">Hips</Label>
            <Input
              id="hips"
              type="number"
              step="0.1"
              min="0"
              placeholder="95.0"
              value={hipsCm}
              onChange={(e) => setHipsCm(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="biceps">Biceps</Label>
            <Input
              id="biceps"
              type="number"
              step="0.1"
              min="0"
              placeholder="35.0"
              value={bicepsCm}
              onChange={(e) => setBicepsCm(e.target.value)}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="thighs">Thighs</Label>
            <Input
              id="thighs"
              type="number"
              step="0.1"
              min="0"
              placeholder="55.0"
              value={thighsCm}
              onChange={(e) => setThighsCm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-sky-700 bg-sky-50 dark:bg-sky-950/20 p-3 rounded-lg border border-sky-200 dark:border-sky-900">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-sky-500 hover:bg-sky-600" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Measurement"}
        </Button>
      </div>
    </form>
  )
}
