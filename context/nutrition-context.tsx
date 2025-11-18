"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { readJSONStorage, removeStorageItem, writeJSONStorage } from "@/lib/storage"
import type { NutritionPlan } from "@/types/nutrition"

interface NutritionContextValue {
  plan: NutritionPlan | null
  isGenerating: boolean
  setPlan: (plan: NutritionPlan | null) => void
  setIsGenerating: (value: boolean) => void
  reset: () => void
}

const STORAGE_KEY = "fp-nutrition-store"

const NutritionContext = createContext<NutritionContextValue | undefined>(undefined)

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<NutritionPlan | null>(null)
  const [isGenerating, setIsGeneratingState] = useState(false)
  const hasHydrated = useRef(false)

  useEffect(() => {
    if (hasHydrated.current) return
    const stored = readJSONStorage<{ plan: NutritionPlan | null }>(STORAGE_KEY, { plan: null })
    if (stored.plan) {
      setPlanState(stored.plan)
    }
    hasHydrated.current = true
  }, [])

  useEffect(() => {
    if (!hasHydrated.current) return
    if (!plan) {
      removeStorageItem(STORAGE_KEY)
      return
    }
    writeJSONStorage(STORAGE_KEY, { plan })
  }, [plan])

  const setPlan = useCallback((nextPlan: NutritionPlan | null) => {
    setPlanState(nextPlan)
  }, [])

  const setIsGenerating = useCallback((value: boolean) => {
    setIsGeneratingState(value)
  }, [])

  const reset = useCallback(() => {
    setPlanState(null)
    setIsGeneratingState(false)
    removeStorageItem(STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({
      plan,
      isGenerating,
      setPlan,
      setIsGenerating,
      reset,
    }),
    [plan, isGenerating, setPlan, setIsGenerating, reset],
  )

  return <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>
}

export function useNutrition() {
  const context = useContext(NutritionContext)
  if (!context) {
    throw new Error("useNutrition must be used within a NutritionProvider")
  }
  return context
}
