import { AIWorkoutForm } from "@/components/ai-workout-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function AIGenerateWorkoutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-purple-500">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          AI Workout Generator
        </h1>
        <p className="text-muted-foreground mt-2">Let AI create a personalized workout plan for you</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Workout Preferences</CardTitle>
          <CardDescription>Tell us what you want and we'll generate a custom workout</CardDescription>
        </CardHeader>
        <CardContent>
          <AIWorkoutForm />
        </CardContent>
      </Card>
    </div>
  )
}
