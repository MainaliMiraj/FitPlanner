import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  currentQuestion: number;
  setAnswer: (id: string, value: string | string[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  resetQuiz: () => void;
  answers: Record<string, string | string[]>; // ✅ simplified type
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      answers: {},

      setAnswer: (id, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [id]: value,
          },
        })),

      nextQuestion: () =>
        set((state) => ({
          currentQuestion: state.currentQuestion + 1,
        })),

      prevQuestion: () =>
        set((state) => ({
          currentQuestion: Math.max(0, state.currentQuestion - 1),
        })),

      resetQuiz: () =>
        set({
          currentQuestion: 0,
          answers: {},
        }),
    }),
    {
      name: "onboarding-storage",
    }
  )
);
