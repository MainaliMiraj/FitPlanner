"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import type { ProfileData, QuizAnswers } from "@/types/user"
import { extractQuizData } from "@/lib/nutrition/utils"

interface UserStoreState {
  profile: ProfileData | null
  quizData: QuizAnswers | null
  setProfile: (profile: ProfileData | null) => void
  setQuizData: (quizData: QuizAnswers | null) => void
  hydrateFromProfile: (profile: ProfileData | null) => void
  reset: () => void
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      profile: null,
      quizData: null,
      setProfile: (profile) => set({ profile }),
      setQuizData: (quizData) => set({ quizData }),
      hydrateFromProfile: (profile) =>
        set({
          profile,
          quizData: extractQuizData(profile),
        }),
      reset: () =>
        set({
          profile: null,
          quizData: null,
        }),
    }),
    {
      name: "fp-user-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
