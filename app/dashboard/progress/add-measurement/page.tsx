import { AddMeasurementForm } from "@/components/add-measurement-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Scale } from "lucide-react"

export default function AddMeasurementPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/30">
            <Scale className="h-6 w-6 text-sky-500" />
          </div>
          Log Measurement
        </h1>
        <p className="text-muted-foreground mt-2">Record your body measurements to track progress</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Body Measurements</CardTitle>
          <CardDescription>Fill in the measurements you want to track</CardDescription>
        </CardHeader>
        <CardContent>
          <AddMeasurementForm />
        </CardContent>
      </Card>
    </div>
  )
}
