import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Scale, Calendar } from "lucide-react"
import Link from "next/link"

export default async function ProgressPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch workout logs
  const { data: workoutLogs } = await supabase
    .from("workout_logs")
    .select("*, workouts(name)")
    .eq("user_id", user?.id)
    .order("completed_at", { ascending: false })
    .limit(10)

  // Fetch body measurements
  const { data: measurements } = await supabase
    .from("body_measurements")
    .select("*")
    .eq("user_id", user?.id)
    .order("measured_at", { ascending: false })
    .limit(10)

  // Get latest measurement
  const latestMeasurement = measurements?.[0]

  // Calculate stats
  const totalWorkouts = workoutLogs?.length || 0
  const totalTime = workoutLogs?.reduce((acc, log) => acc + (log.duration_minutes || 0), 0) || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/30">
              <TrendingUp className="h-6 w-6 text-sky-500" />
            </div>
            Progress
          </h1>
          <p className="text-muted-foreground mt-2">Track your fitness journey and achievements</p>
        </div>
        <Button asChild className="bg-sky-500 hover:bg-sky-600">
          <Link href="/dashboard/progress/add-measurement">
            <Plus className="h-4 w-4 mr-2" />
            Log Measurement
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-sky-200 dark:border-sky-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sky-500" />
              Workouts Logged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground mt-1">Recent activity</p>
          </CardContent>
        </Card>

        <Card className="border-sky-200 dark:border-sky-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-sky-500" />
              Total Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalTime}
              <span className="text-lg text-muted-foreground ml-1">min</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Time spent training</p>
          </CardContent>
        </Card>

        <Card className="border-sky-200 dark:border-sky-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Scale className="h-4 w-4 text-sky-500" />
              Current Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {latestMeasurement?.weight_kg || 0}
              <span className="text-lg text-muted-foreground ml-1">kg</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Latest measurement</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Measurements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Body Measurements</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/progress/add-measurement">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Link>
            </Button>
          </div>
          <CardDescription>Track your body composition over time</CardDescription>
        </CardHeader>
        <CardContent>
          {!measurements || measurements.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-950/30">
                  <Scale className="h-8 w-8 text-sky-500" />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">No measurements recorded yet</p>
              <Button asChild className="bg-sky-500 hover:bg-sky-600">
                <Link href="/dashboard/progress/add-measurement">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Your First Measurement
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {measurements.map((measurement) => (
                <div
                  key={measurement.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-sky-200 dark:border-sky-900/20"
                >
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      {new Date(measurement.measured_at).toLocaleDateString()}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {measurement.weight_kg && (
                        <span>
                          Weight: <strong>{measurement.weight_kg} kg</strong>
                        </span>
                      )}
                      {measurement.body_fat_percentage && (
                        <span>
                          Body Fat: <strong>{measurement.body_fat_percentage}%</strong>
                        </span>
                      )}
                      {measurement.muscle_mass_kg && (
                        <span>
                          Muscle: <strong>{measurement.muscle_mass_kg} kg</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>Your latest training sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {!workoutLogs || workoutLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No workouts logged yet</p>
              <Button asChild variant="outline">
                <Link href="/dashboard/workouts">Go to Workouts</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {workoutLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-sky-200 dark:border-sky-900/20"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{log.workouts?.name || "Workout"}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(log.completed_at).toLocaleDateString()} •{" "}
                      {log.duration_minutes ? `${log.duration_minutes} min` : "No duration"}
                    </div>
                    {log.notes && <div className="text-sm text-muted-foreground italic">{log.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
