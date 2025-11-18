"use client"

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react"

import { readJSONStorage, removeStorageItem, writeJSONStorage } from "@/lib/storage"

type AnswerValue = string | string[]

interface OnboardingState {
  currentQuestion: number
  answers: Record<string, AnswerValue>
}

interface OnboardingContextValue extends OnboardingState {
  setAnswer: (id: string, value: AnswerValue) => void
  nextQuestion: () => void
  prevQuestion: () => void
  resetQuiz: () => void
}

type Action =
  | { type: "HYDRATE"; payload: OnboardingState }
  | { type: "SET_ANSWER"; payload: { id: string; value: AnswerValue } }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "RESET" }

const STORAGE_KEY = "onboarding-storage"

const initialState: OnboardingState = {
  currentQuestion: 0,
  answers: {},
}

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload }
    case "SET_ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.id]: action.payload.value,
        },
      }
    case "NEXT":
      return { ...state, currentQuestion: state.currentQuestion + 1 }
    case "PREV":
      return { ...state, currentQuestion: Math.max(0, state.currentQuestion - 1) }
    case "RESET":
      return initialState
    default:
      return state
  }
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const hasHydrated = useRef(false)

  useEffect(() => {
    if (hasHydrated.current) return
    const stored = readJSONStorage<OnboardingState>(STORAGE_KEY, initialState)
    dispatch({ type: "HYDRATE", payload: stored })
    hasHydrated.current = true
  }, [])

  useEffect(() => {
    if (!hasHydrated.current) return
    if (state.currentQuestion === 0 && Object.keys(state.answers).length === 0) {
      removeStorageItem(STORAGE_KEY)
      return
    }
    writeJSONStorage(STORAGE_KEY, state)
  }, [state])

  const value = useMemo<OnboardingContextValue>(
    () => ({
      ...state,
      setAnswer: (id, value) => dispatch({ type: "SET_ANSWER", payload: { id, value } }),
      nextQuestion: () => dispatch({ type: "NEXT" }),
      prevQuestion: () => dispatch({ type: "PREV" }),
      resetQuiz: () => {
        dispatch({ type: "RESET" })
        removeStorageItem(STORAGE_KEY)
      },
    }),
    [state],
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
