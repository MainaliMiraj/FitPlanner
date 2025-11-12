import { CreateMealPlanForm } from "@/components/create-meal-plan-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Apple } from "lucide-react"

export default function NewMealPlanPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-100 dark:bg-lime-950/30">
            <Apple className="h-6 w-6 text-lime-500" />
          </div>
          Create Meal Plan
        </h1>
        <p className="text-muted-foreground mt-2">Design a custom meal plan with your nutrition goals</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Plan Details</CardTitle>
          <CardDescription>Add meals and configure your nutrition targets</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateMealPlanForm />
        </CardContent>
      </Card>
    </div>
  )
}
