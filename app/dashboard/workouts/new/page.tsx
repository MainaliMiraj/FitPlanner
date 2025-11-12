import { CreateWorkoutForm } from "@/components/create-workout-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"

export default function NewWorkoutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/30">
            <Dumbbell className="h-6 w-6 text-rose-500" />
          </div>
          Create Workout
        </h1>
        <p className="text-muted-foreground mt-2">Build a custom workout plan tailored to your goals</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
          <CardDescription>Add exercises and configure your workout routine</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateWorkoutForm />
        </CardContent>
      </Card>
    </div>
  )
}
