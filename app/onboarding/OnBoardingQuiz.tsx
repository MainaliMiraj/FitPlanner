"use client";

import { useState } from "react";
import { useOnboardingStore } from "./store/useOnboardingStore";
import { QUESTIONS } from "./data/Questions";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export default function OnBoardingQuiz() {
  const {
    currentQuestion,
    answers,
    setAnswer,
    nextQuestion,
    prevQuestion,
    resetQuiz,
  } = useOnboardingStore();

  const [showFact, setShowFact] = useState(false);
  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) nextQuestion();
    else {
      console.log("Quiz complete ✅", answers);
      // TODO: redirect or call signup page
      // router.push("/auth/sign-up")
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) prevQuestion();
  };

  const handleAnswer = (value: string | string[]) => {
    setAnswer(question.id, value);
  };

  const isAnswered = !!answers[question.id];
  const isLast = currentQuestion === QUESTIONS.length - 1;

  return (
    <div className="relative min-h-[70vh] w-full s overflow-hidden transition-all duration-700">
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gray/60 backdrop-blur-sm" />

      {/* Main quiz card */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 md:p-10 text-white">
        <div className="w-full max-w-2xl bg-white backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-6 md:p-8">
          <ProgressBar progress={progress} />

          <QuestionCard
            key={question.id}
            question={question}
            value={answers[question.id] || ""}
            onAnswer={handleAnswer}
          />

          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 cursor-pointer text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
            >
              {isLast ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
