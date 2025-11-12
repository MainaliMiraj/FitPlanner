import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Apple, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Fetch recent workout logs count
  const { count: workoutCount } = await supabase
    .from("workout_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  // Fetch workouts count
  const { count: totalWorkouts } = await supabase
    .from("workouts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  // Fetch meal plans count
  const { count: mealPlansCount } = await supabase
    .from("meal_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-balance">
          Welcome back, {profile?.display_name || "User"}
        </h1>
        <p className="text-muted-foreground mt-2 text-pretty">Track your fitness journey and reach your goals</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Workouts Completed</CardTitle>
            <Dumbbell className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workoutCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Keep up the great work!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalWorkouts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Workout plans created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meal Plans</CardTitle>
            <Apple className="h-4 w-4 text-lime-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mealPlansCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Nutrition plans active</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-lg transition-shadow border-rose-200 dark:border-rose-900/20">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/30 mb-4">
              <Dumbbell className="h-6 w-6 text-rose-500" />
            </div>
            <CardTitle className="text-xl">Workout Planner</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Create custom workout routines or let AI generate personalized plans based on your goals and fitness
              level.
            </p>
            <Button asChild className="w-full bg-rose-500 hover:bg-rose-600">
              <Link href="/dashboard/workouts">View Workouts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-shadow border-lime-200 dark:border-lime-900/20">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-100 dark:bg-lime-950/30 mb-4">
              <Apple className="h-6 w-6 text-lime-500" />
            </div>
            <CardTitle className="text-xl">Nutrition Planner</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Plan your meals with macro tracking and get AI-powered meal suggestions tailored to your dietary needs.
            </p>
            <Button asChild className="w-full bg-lime-500 hover:bg-lime-600">
              <Link href="/dashboard/nutrition">View Nutrition</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-shadow border-sky-200 dark:border-sky-900/20">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/30 mb-4">
              <TrendingUp className="h-6 w-6 text-sky-500" />
            </div>
            <CardTitle className="text-xl">Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Monitor your body measurements, weight, and performance metrics to visualize your fitness journey.
            </p>
            <Button asChild className="w-full bg-sky-500 hover:bg-sky-600">
              <Link href="/dashboard/progress">View Progress</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
