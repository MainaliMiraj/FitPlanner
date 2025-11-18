"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { readJSONStorage, removeStorageItem, writeJSONStorage } from "@/lib/storage"
import { extractQuizData } from "@/lib/nutrition/utils"
import type { ProfileData, QuizAnswers } from "@/types/user"

interface UserContextValue {
  profile: ProfileData | null
  quizData: QuizAnswers | null
  setProfile: (profile: ProfileData | null) => void
  setQuizData: (quizData: QuizAnswers | null) => void
  hydrateFromProfile: (profile: ProfileData | null) => void
  reset: () => void
}

const STORAGE_KEY = "fp-user-store"

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<ProfileData | null>(null)
  const [quizData, setQuizDataState] = useState<QuizAnswers | null>(null)
  const hasHydrated = useRef(false)

  useEffect(() => {
    if (hasHydrated.current) return
    const stored = readJSONStorage<{ profile: ProfileData | null; quizData: QuizAnswers | null }>(STORAGE_KEY, {
      profile: null,
      quizData: null,
    })
    if (stored.profile) {
      setProfileState(stored.profile)
    }
    if (stored.quizData) {
      setQuizDataState(stored.quizData)
    }
    hasHydrated.current = true
  }, [])

  useEffect(() => {
    if (!hasHydrated.current) return
    if (!profile && !quizData) {
      removeStorageItem(STORAGE_KEY)
      return
    }
    writeJSONStorage(STORAGE_KEY, { profile, quizData })
  }, [profile, quizData])

  const setProfile = useCallback((nextProfile: ProfileData | null) => {
    setProfileState(nextProfile)
  }, [])

  const setQuizData = useCallback((nextQuizData: QuizAnswers | null) => {
    setQuizDataState(nextQuizData)
  }, [])

  const hydrateFromProfile = useCallback((incomingProfile: ProfileData | null) => {
    setProfileState(incomingProfile)
    setQuizDataState(extractQuizData(incomingProfile))
  }, [])

  const reset = useCallback(() => {
    setProfileState(null)
    setQuizDataState(null)
    removeStorageItem(STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({
      profile,
      quizData,
      setProfile,
      setQuizData,
      hydrateFromProfile,
      reset,
    }),
    [profile, quizData, setProfile, setQuizData, hydrateFromProfile, reset],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
