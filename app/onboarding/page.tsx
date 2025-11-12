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
    <div className="flex min-h-svh w-full items-center justify-center bg-linear-to-br from-background via-background to-rose-500/5 px-4 py-8 md:px-6 md:py-14">
      <div className="w-full max-w-lg md:max-w-xl">
        <Card className="border-none shadow-lg ring-1 ring-border/40">
          <CardHeader className="space-y-1 pb-4 text-center md:pb-5">
            <CardTitle className="text-2xl font-semibold md:text-3xl">
              Let&apos;s Get to Know You Better
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground md:text-lg">
              Answer a few quick questions so we can personalize your workouts,
              nutrition, and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-4 md:pb-6">
            <div className="mx-auto max-w-md">
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
