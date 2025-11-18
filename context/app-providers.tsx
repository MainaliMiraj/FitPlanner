"use client"

import type { ReactNode } from "react"

import { NutritionProvider } from "@/context/nutrition-context"
import { OnboardingProvider } from "@/context/onboarding-context"
import { UserProvider } from "@/context/user-context"

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <UserProvider>
      <NutritionProvider>
        <OnboardingProvider>{children}</OnboardingProvider>
      </NutritionProvider>
    </UserProvider>
  )
}
