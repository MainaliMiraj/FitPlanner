"use client";

import OnBoardingQuiz from "./OnBoardingQuiz";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen overflow-hidden relative bg-gray-100">
      {/* Optional: a subtle gradient overlay to blend backgrounds */}

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <OnBoardingQuiz />
      </div>
    </main>
  );
}
