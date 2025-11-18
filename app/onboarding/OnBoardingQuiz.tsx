"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useOnboarding } from "@/context/onboarding-context";
import { QUESTIONS } from "../../data/Questions";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import QuestionTransition from "../../components/onBoarding/QuestionTransition";

export default function OnBoardingQuiz() {
  const [completing, setCompleting] = useState(false);
  const { currentQuestion, answers, setAnswer, nextQuestion, prevQuestion } =
    useOnboarding();

  const router = useRouter();
  const question = QUESTIONS[currentQuestion];
  const answerValue = answers[question.id];

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const isLast = currentQuestion === QUESTIONS.length - 1;

  /* -----------------------------------------------------
   * Auto scroll to top when moving questions
   * --------------------------------------------------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQuestion]);

  /* -----------------------------------------------------
   * Validate if the question is answered
   * --------------------------------------------------- */
  const isAnswered = useMemo(() => {
    if (question.type === "input") {
      return typeof answerValue === "string" && answerValue.trim() !== "";
    }

    if (question.type === "checkbox") {
      return Array.isArray(answerValue) && answerValue.length > 0;
    }

    if (question.type === "single") {
      return typeof answerValue === "string" && answerValue.trim().length > 0;
    }

    return false;
  }, [answerValue, question.type]);

  /* -----------------------------------------------------
   * Should Next button be shown?
   * --------------------------------------------------- */
  const shouldShowNextButton = useMemo(() => {
    if (question.type === "input") return true;
    if (question.type === "checkbox") return true;

    // single select
    if (question.otherOption?.enabled) return true;

    // radio with no Other → use auto-next
    return false;
  }, [question.type, question.otherOption]);

  /* -----------------------------------------------------
   * Handlers
   * --------------------------------------------------- */
  const handleNext = () => {
    if (!isLast) {
      nextQuestion();
      return;
    }
    handleComplete();
  };

  const handleComplete = () => {
    toast.success(
      "Your preferences have been saved. Please sign up to continue."
    );

    setCompleting(true); // 🔥 Start fade-out animation

    setTimeout(() => {
      router.push("/auth/sign-up");
    }, 400); // match fade duration
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) prevQuestion();
  };

  const handleAnswer = (val: string | string[]) => {
    setAnswer(question.id, val);

    console.log({ question, val });
  };

  /* -----------------------------------------------------
   * RENDER
   * --------------------------------------------------- */
  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden transition-all duration-700">
      <div className="absolute inset-0 bg-gray/60 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center justify-center p-6 md:p-10 text-white">
        <div className="w-full max-w-2xl bg-white backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-6 md:p-8">
          <ProgressBar progress={progress} />

          <QuestionTransition index={currentQuestion}>
            <QuestionCard
              question={question}
              value={answerValue ?? ""}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          </QuestionTransition>

          <div className="flex items-center justify-between mt-8">
            {/* PREVIOUS BUTTON */}
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* NEXT / COMPLETE BUTTON */}
            {shouldShowNextButton && (
              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white cursor-pointer "
              >
                {isLast ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 p-2r" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5 p-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
