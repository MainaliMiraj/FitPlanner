"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FitnessQuiz, type QuizAnswer } from "@/components/fitness-quiz";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const QUIZ_STORAGE_KEY = "fitplanner_quiz_answers";

export default function OnboardingQuizPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleQuizComplete = (answers: QuizAnswer) => {
    try {
      setIsSaving(true);
      sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(answers));
      router.push("/auth/sign-up");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-background via-background to-rose-500/5 px-4 py-6 md:px-6 md:py-10">
      <div className="w-full max-w-md md:max-w-lg">
        <Card className="border-none shadow-lg ring-1 ring-border/40">
          <CardHeader className="pb-2 pt-4 text-center md:pb-3">
            <CardTitle className="text-2xl font-semibold md:text-3xl">
              Let&apos;s Get to Know You Better
            </CardTitle>
            <CardDescription className="pt-1 text-base text-muted-foreground md:text-lg">
              Answer a few quick questions so we can personalize your workouts,
              nutrition, and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4 md:pb-5">
            <div className="mx-auto max-w-sm">
              <FitnessQuiz
                onComplete={handleQuizComplete}
                isLoading={isSaving}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
