export interface MacroBreakdown {
  calories: number
  protein: number
  carbs: number
  fats: number
}

export interface MealPlanMeal {
  name: string
  type?: string
  calories?: number
  macros: Partial<MacroBreakdown>
  ingredients?: string[]
  instructions?: string[]
}

export interface DailyMealPlan {
  day: string
  focus?: string
  meals: MealPlanMeal[]
  snacks?: string[]
}

export interface RecipeRecommendation {
  title: string
  summary?: string
  macros: MacroBreakdown
  ingredients: string[]
  instructions: string[]
}

export interface ShoppingListItem {
  name: string
  quantity?: string
  notes?: string
}

export interface ShoppingListCategory {
  category: string
  items: ShoppingListItem[]
}

export interface NutritionPlan {
  generatedAt: string
  dailyCalories: number
  dietType: string
  macros: MacroBreakdown
  weeklyPlan: DailyMealPlan[]
  snacks: string[]
  recipes: RecipeRecommendation[]
  shoppingList: ShoppingListCategory[]
  notes: string[]
}

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord => typeof value === "object" && value !== null
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value)
const isString = (value: unknown): value is string => typeof value === "string"

const emptyMacros: MacroBreakdown = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
}

function parseMacros(value: unknown): MacroBreakdown {
  if (!isRecord(value)) {
    return { ...emptyMacros }
  }

  return {
    calories: isNumber(value.calories) ? value.calories : 0,
    protein: isNumber(value.protein) ? value.protein : 0,
    carbs: isNumber(value.carbs) ? value.carbs : 0,
    fats: isNumber(value.fats) ? value.fats : 0,
  }
}

function parsePartialMacros(value: unknown): Partial<MacroBreakdown> {
  if (!isRecord(value)) return {}
  const partial: Partial<MacroBreakdown> = {}
  if (isNumber(value.calories)) partial.calories = value.calories
  if (isNumber(value.protein)) partial.protein = value.protein
  if (isNumber(value.carbs)) partial.carbs = value.carbs
  if (isNumber(value.fats)) partial.fats = value.fats
  return partial
}

function parseMeal(value: unknown): MealPlanMeal | null {
  if (!isRecord(value)) return null
  if (!isString(value.name) || !value.name.trim()) return null

  const meal: MealPlanMeal = {
    name: value.name,
    type: isString(value.type) ? value.type : undefined,
    calories: isNumber(value.calories) ? value.calories : undefined,
    macros: parsePartialMacros(value.macros),
  }

  const ingredients = toStringArray(value.ingredients)
  if (ingredients.length > 0) meal.ingredients = ingredients

  const instructions = toStringArray(value.instructions)
  if (instructions.length > 0) meal.instructions = instructions

  return meal
}

function parseDailyPlan(value: unknown): DailyMealPlan | null {
  if (!isRecord(value)) return null
  if (!isString(value.day) || !value.day.trim()) return null
  if (!Array.isArray(value.meals)) return null

  const meals = value.meals
    .map((meal) => parseMeal(meal))
    .filter((meal): meal is MealPlanMeal => Boolean(meal))

  if (meals.length === 0) return null

  const plan: DailyMealPlan = {
    day: value.day,
    meals,
  }

  if (isString(value.focus)) {
    plan.focus = value.focus
  }

  const snacks = toStringArray(value.snacks)
  if (snacks.length > 0) {
    plan.snacks = snacks
  }

  return plan
}

function parseRecipe(value: unknown): RecipeRecommendation | null {
  if (!isRecord(value)) return null
  if (!isString(value.title) || !value.title.trim()) return null

  const recipe: RecipeRecommendation = {
    title: value.title,
    summary: isString(value.summary) ? value.summary : undefined,
    macros: parseMacros(value.macros),
    ingredients: toStringArray(value.ingredients),
    instructions: toStringArray(value.instructions),
  }

  return recipe
}

function parseShoppingCategory(value: unknown): ShoppingListCategory | null {
  if (!isRecord(value)) return null
  if (!isString(value.category) || !value.category.trim()) return null
  if (!Array.isArray(value.items)) return null

  const items: ShoppingListItem[] = value.items
    .filter((item): item is UnknownRecord => isRecord(item))
    .map((item) => ({
      name: isString(item.name) ? item.name : "",
      quantity: isString(item.quantity) ? item.quantity : undefined,
      notes: isString(item.notes) ? item.notes : undefined,
    }))
    .filter((item) => Boolean(item.name))

  if (items.length === 0) return null

  return { category: value.category, items }
}

export function normalizeNutritionPlan(payload: unknown): NutritionPlan | null {
  if (!isRecord(payload)) return null

  const weeklyPlan = Array.isArray(payload.weeklyPlan)
    ? payload.weeklyPlan
        .map((day) => parseDailyPlan(day))
        .filter((day): day is DailyMealPlan => Boolean(day))
    : []

  if (weeklyPlan.length === 0) {
    return null
  }

  return {
    generatedAt: isString(payload.generatedAt) ? payload.generatedAt : new Date().toISOString(),
    dailyCalories: isNumber(payload.dailyCalories) ? payload.dailyCalories : 0,
    dietType: isString(payload.dietType) ? payload.dietType : "Custom Plan",
    macros: parseMacros(payload.macros),
    weeklyPlan,
    snacks: toStringArray(payload.snacks),
    recipes: Array.isArray(payload.recipes)
      ? payload.recipes
          .map((recipe) => parseRecipe(recipe))
          .filter((recipe): recipe is RecipeRecommendation => Boolean(recipe))
      : [],
    shoppingList: Array.isArray(payload.shoppingList)
      ? payload.shoppingList
          .map((category) => parseShoppingCategory(category))
          .filter((category): category is ShoppingListCategory => Boolean(category))
      : [],
    notes: toStringArray(payload.notes),
  }
}
