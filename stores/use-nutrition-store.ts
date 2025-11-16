"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import type { NutritionPlan } from "@/types/nutrition"

interface NutritionStoreState {
  plan: NutritionPlan | null
  isGenerating: boolean
  setPlan: (plan: NutritionPlan | null) => void
  setIsGenerating: (value: boolean) => void
  reset: () => void
}

export const useNutritionStore = create<NutritionStoreState>()(
  persist(
    (set) => ({
      plan: null,
      isGenerating: false,
      setPlan: (plan) => set({ plan }),
      setIsGenerating: (value) => set({ isGenerating: value }),
      reset: () =>
        set({
          plan: null,
          isGenerating: false,
        }),
    }),
    {
      name: "fp-nutrition-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        plan: state.plan,
      }),
    },
  ),
)
