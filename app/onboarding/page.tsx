"use client";

import OnBoardingQuiz from "./OnBoardingQuiz";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <main className="min-h-screen overflow-hidden relative bg-gray-100">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <OnBoardingQuiz />
        </div>
      </main>
    </motion.div>
  );
}
