"use client"

import { RefreshCw, UtensilsCrossed, ShoppingBag, NotebookPen, Flame } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { NutritionPlan } from "@/types/nutrition"

interface NutritionDashboardProps {
  plan: NutritionPlan
  isRegenerating: boolean
  onRegenerate: () => void
}

export function NutritionDashboard({ plan, isRegenerating, onRegenerate }: NutritionDashboardProps) {
  return (
    <div className="space-y-8">
      <Card className="border border-rose-200/60 bg-white/70 shadow-lg">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">Nutrition Dashboard</CardTitle>
            <CardDescription className="mt-1 text-base text-muted-foreground">
              {plan.dietType} · Generated {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(plan.generatedAt))}
            </CardDescription>
          </div>
          <Button
            onClick={onRegenerate}
            disabled={isRegenerating}
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            {isRegenerating ? "Regenerating..." : "Regenerate Plan"}
          </Button>
        </CardHeader>
        <CardContent>
          <MacroHighlights plan={plan} />
        </CardContent>
      </Card>

      <WeeklyPlan weeklyPlan={plan.weeklyPlan} />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <RecipesCard recipes={plan.recipes} />
        <div className="space-y-6">
          <ShoppingListCard list={plan.shoppingList} />
          <SnacksAndNotesCard snacks={plan.snacks} notes={plan.notes} />
        </div>
      </div>
    </div>
  )
}

function MacroHighlights({ plan }: { plan: NutritionPlan }) {
  const macros = [
    { label: "Daily Calories", value: `${plan.dailyCalories.toLocaleString()} kcal`, accent: "text-rose-500" },
    { label: "Protein", value: `${plan.macros.protein} g` },
    { label: "Carbohydrates", value: `${plan.macros.carbs} g` },
    { label: "Fats", value: `${plan.macros.fats} g` },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {macros.map((macro) => (
        <div
          key={macro.label}
          className="rounded-2xl border border-rose-100/70 bg-rose-50/50 p-4 text-center shadow-sm dark:bg-rose-950/10"
        >
          <p className="text-sm font-medium text-muted-foreground">{macro.label}</p>
          <p className={`mt-2 text-2xl font-semibold ${macro.accent || ""}`}>{macro.value}</p>
        </div>
      ))}
    </div>
  )
}

function WeeklyPlan({ weeklyPlan }: Pick<NutritionPlan, "weeklyPlan">) {
  return (
    <Card className="border border-rose-100/70 bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-rose-500" />
          Weekly Meal Structure
        </CardTitle>
        <CardDescription>Every day is built around your caloric target with clear meals and snacks.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {weeklyPlan.map((day) => (
            <div key={day.day} className="rounded-2xl border border-rose-100/90 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-muted-foreground">{day.day}</p>
                  {day.focus && <p className="text-base font-semibold text-foreground">{day.focus}</p>}
                </div>
                <Badge variant="outline" className="border-rose-200 text-rose-500">
                  {day.meals.length} meals
                </Badge>
              </div>
              <div className="mt-4 space-y-3">
                {day.meals.map((meal) => (
                  <div key={meal.name + meal.type} className="rounded-xl bg-rose-50/70 p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold capitalize">{meal.name}</p>
                      {meal.calories && <span className="text-xs text-muted-foreground">{meal.calories} kcal</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{meal.type || "Meal"}</p>
                    <p className="text-xs text-muted-foreground">
                      P {meal.macros.protein ?? 0}g · C {meal.macros.carbs ?? 0}g · F {meal.macros.fats ?? 0}g
                    </p>
                  </div>
                ))}

                {day.snacks && day.snacks.length > 0 && (
                  <div className="rounded-xl border border-dashed border-rose-200/70 p-3 text-xs">
                    <p className="mb-1 font-semibold">Snacks</p>
                    <ul className="list-disc pl-4">
                      {day.snacks.map((snack) => (
                        <li key={snack}>{snack}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecipesCard({ recipes }: Pick<NutritionPlan, "recipes">) {
  return (
    <Card className="border border-rose-100/60 bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UtensilsCrossed className="h-5 w-5 text-rose-500" />
          Featured Recipes
        </CardTitle>
        <CardDescription>High-impact meals with macro details and instructions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[540px] pr-4">
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <div key={recipe.title} className="rounded-2xl border border-rose-100/70 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{recipe.title}</p>
                    {recipe.summary && <p className="text-sm text-muted-foreground">{recipe.summary}</p>}
                  </div>
                  <Badge variant="outline" className="border-rose-200 text-rose-500">
                    {recipe.macros.calories} kcal
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  P {recipe.macros.protein}g · C {recipe.macros.carbs}g · F {recipe.macros.fats}g
                </p>
                <Separator className="my-3" />
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Ingredients</p>
                    <ul className="mt-1 list-disc pl-4 text-muted-foreground">
                      {recipe.ingredients.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Instructions</p>
                    <ol className="mt-1 list-decimal pl-4 text-muted-foreground">
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
            {recipes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-rose-200/70 p-6 text-center text-sm text-muted-foreground">
                Recipes will appear here once your plan is generated.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function ShoppingListCard({ list }: { list: NutritionPlan["shoppingList"] }) {
  return (
    <Card className="border border-rose-100/60 bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingBag className="h-5 w-5 text-rose-500" />
          Smart Shopping List
        </CardTitle>
        <CardDescription>Organized by store aisle for faster grocery runs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {list.map((category) => (
          <div key={category.category} className="rounded-xl border border-rose-50 bg-rose-50/60 p-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-500">{category.category}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {category.items.map((item) => (
                <li key={item.name} className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {item.quantity && <span className="text-xs">{item.quantity}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {list.length === 0 && (
          <div className="rounded-xl border border-dashed border-rose-200/70 p-4 text-sm text-muted-foreground">
            Shopping list will be auto-generated with your next plan.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SnacksAndNotesCard({ snacks, notes }: Pick<NutritionPlan, "snacks" | "notes">) {
  return (
    <Card className="border border-rose-100/60 bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <NotebookPen className="h-5 w-5 text-rose-500" />
          Snacks & Guidance
        </CardTitle>
        <CardDescription>Actionable reminders and quick snack inspiration.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {snacks.length > 0 && (
          <div>
            <p className="font-semibold text-foreground">Snack Suggestions</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {snacks.map((snack) => (
                <Badge key={snack} variant="outline" className="border-rose-200 text-rose-600">
                  {snack}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {notes.length > 0 && (
          <div>
            <p className="font-semibold text-foreground">Coach Notes</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {snacks.length === 0 && notes.length === 0 && (
          <p className="text-muted-foreground">Regenerate your plan to receive snack ideas and strategic reminders.</p>
        )}
      </CardContent>
    </Card>
  )
}
