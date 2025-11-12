import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Dumbbell, Clock, Target, Sparkles } from "lucide-react"
import Link from "next/link"
import { WorkoutCard } from "@/components/workout-card"

export default async function WorkoutsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's workouts
  const { data: workouts } = await supabase
    .from("workouts")
    .select("*, exercises(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/30">
              <Dumbbell className="h-6 w-6 text-rose-500" />
            </div>
            Workouts
          </h1>
          <p className="text-muted-foreground mt-2">Create and manage your workout routines</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="border-purple-200 dark:border-purple-900/20 bg-transparent">
            <Link href="/dashboard/workouts/ai-generate">
              <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
              AI Generate
            </Link>
          </Button>
          <Button asChild className="bg-rose-500 hover:bg-rose-600">
            <Link href="/dashboard/workouts/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Workout
            </Link>
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {!workouts || workouts.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/30">
                <Dumbbell className="h-8 w-8 text-rose-500" />
              </div>
            </div>
            <CardTitle className="text-2xl">No Workouts Yet</CardTitle>
            <CardDescription className="text-base">
              Create your first workout plan to get started with your fitness journey
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-rose-500 hover:bg-rose-600">
              <Link href="/dashboard/workouts/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workout
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {workouts && workouts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-rose-200 dark:border-rose-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-rose-500" />
                Total Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{workouts.length}</div>
            </CardContent>
          </Card>

          <Card className="border-rose-200 dark:border-rose-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-rose-500" />
                Total Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {workouts.reduce((acc, w) => acc + (w.exercises?.length || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-200 dark:border-rose-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-rose-500" />
                Avg Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {workouts.length > 0
                  ? Math.round(workouts.reduce((acc, w) => acc + (w.duration_minutes || 0), 0) / workouts.length)
                  : 0}
                <span className="text-lg text-muted-foreground ml-1">min</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
