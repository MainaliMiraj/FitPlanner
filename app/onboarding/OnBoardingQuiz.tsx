"use client";

import { useEffect, useState } from "react";
import { QUESTIONS } from "./data/Question";
import { BACKGROUNDS } from "./data/background";
import { FUN_FACTS } from "./data/funFact";
import { useOnboardingStore } from "./store/useOnboardingStore";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import FunFactOverlay from "./FunFactOverlay";
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

  // Get current category
  const category = question?.category || "Fitness";
  const background = BACKGROUNDS[category];
  const randomFact =
    FUN_FACTS[category]?.[
      Math.floor(Math.random() * FUN_FACTS[category].length)
    ];

  // Show a fun fact for 1.5s when category changes
  useEffect(() => {
    setShowFact(true);
    const timeout = setTimeout(() => setShowFact(false), 1500);
    return () => clearTimeout(timeout);
  }, [category]);

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

  const handleAnswer = (value: string) => {
    setAnswer(question.id, value);
  };

  const isAnswered = !!answers[question.id];
  const isLast = currentQuestion === QUESTIONS.length - 1;

  return (
    <div
      className="relative min-h-[90vh] w-full rounded-xl overflow-hidden transition-all duration-700"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Fun Fact Transition */}
      {showFact && randomFact && (
        <FunFactOverlay key={category} fact={randomFact} />
      )}

      {/* Main quiz card */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 md:p-10 text-white">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-6 md:p-8">
          <ProgressBar progress={progress} />

          <QuestionCard
            key={question.id}
            question={question}
            value={answers[question.id] || ""}
            onAnswer={handleAnswer}
          />

          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 bg-white/20 text-white hover:bg-white/30 border-white/40"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white"
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
