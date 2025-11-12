import { AIMealPlanForm } from "@/components/ai-meal-plan-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function AIGenerateMealPlanPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-lime-500 to-green-500">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          AI Meal Plan Generator
        </h1>
        <p className="text-muted-foreground mt-2">Let AI create a personalized meal plan for you</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Plan Preferences</CardTitle>
          <CardDescription>Tell us your nutrition goals and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <AIMealPlanForm />
        </CardContent>
      </Card>
    </div>
  )
}
