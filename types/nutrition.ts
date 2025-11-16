import { z } from "zod"

export const macroBreakdownSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
})

export const mealSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  calories: z.number().nonnegative().optional(),
  macros: macroBreakdownSchema.partial(),
  ingredients: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
})

export const dailyPlanSchema = z.object({
  day: z.string(),
  focus: z.string().optional(),
  meals: z.array(mealSchema),
  snacks: z.array(z.string()).optional(),
})

export const recipeSchema = z.object({
  title: z.string(),
  summary: z.string().optional(),
  macros: macroBreakdownSchema,
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
})

export const shoppingListSchema = z.object({
  category: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.string().optional(),
      notes: z.string().optional(),
    }),
  ),
})

export const nutritionPlanSchema = z.object({
  generatedAt: z.string(),
  dailyCalories: z.number(),
  dietType: z.string(),
  macros: macroBreakdownSchema,
  weeklyPlan: z.array(dailyPlanSchema).min(1),
  snacks: z.array(z.string()).default([]),
  recipes: z.array(recipeSchema).default([]),
  shoppingList: z.array(shoppingListSchema).default([]),
  notes: z.array(z.string()).default([]),
})

export type MacroBreakdown = z.infer<typeof macroBreakdownSchema>
export type MealPlanMeal = z.infer<typeof mealSchema>
export type DailyMealPlan = z.infer<typeof dailyPlanSchema>
export type RecipeRecommendation = z.infer<typeof recipeSchema>
export type ShoppingListCategory = z.infer<typeof shoppingListSchema>
export type NutritionPlan = z.infer<typeof nutritionPlanSchema>
