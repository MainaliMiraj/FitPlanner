"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dumbbell } from "lucide-react"
import type { QuizAnswer } from "@/components/fitness-quiz"

const QUIZ_STORAGE_KEY = "fitplanner_quiz_answers"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer | null>(null)
  const [isQuizReady, setIsQuizReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedAnswers = sessionStorage.getItem(QUIZ_STORAGE_KEY)

      if (!storedAnswers) {
        router.replace("/onboarding")
        return
      }

      const parsedAnswers = JSON.parse(storedAnswers) as QuizAnswer
      setQuizAnswers(parsedAnswers)
      setIsQuizReady(true)
    } catch (storageError) {
      console.error("[sign-up] Failed to load quiz answers", storageError)
      sessionStorage.removeItem(QUIZ_STORAGE_KEY)
      router.replace("/onboarding")
    }
  }, [router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!displayName.trim()) {
      setError("Please enter your name")
      return
    }

    if (!email.trim()) {
      setError("Please enter your email")
      return
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (!quizAnswers) {
      setError("Please complete the personalization quiz before signing up.")
      router.replace("/onboarding")
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            display_name: displayName,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("Failed to create user")

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          fitness_goal: quizAnswers.fitness_goal,
          current_fitness_level: quizAnswers.current_fitness_level,
          workout_frequency: quizAnswers.workout_frequency,
          workout_duration: quizAnswers.workout_duration,
          workout_preference: quizAnswers.workout_preference,
          activity_level: quizAnswers.activity_level,
          diet_preference: quizAnswers.diet_preference,
          health_conditions: quizAnswers.health_conditions,
          sleep_hours: quizAnswers.sleep_hours,
          stress_level: quizAnswers.stress_level,
        })
        .eq("id", authData.user.id)

      if (updateError) throw updateError

      sessionStorage.removeItem(QUIZ_STORAGE_KEY)
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isQuizReady) {
    return null
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-rose-500/5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">FitPlanner</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Start your fitness transformation today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Confirm Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200 dark:border-rose-900">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Continue to Quiz"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-rose-500 underline underline-offset-4 hover:text-rose-600">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
