"use client";

import SingleSelect from "../../components/onBoarding/SingleSelect";
import MultiSelect from "../../components/onBoarding/MultiSelect";
import InputQuestion from "../../components/onBoarding/InputQuestion";
import type { Question } from "../../types/types";

export default function QuestionCard({
  question,
  value,
  onAnswer,
  onNext,
}: {
  question: Question;
  value: string | string[];
  onAnswer: (v: string | string[]) => void;
  onNext: () => void;
}) {
  return (
    <div className="w-full space-y-3">
      {/* Question Title */}
      <h3 className="text-2xl md:text-3xl font-bold text-black text-center">
        {question.question}
      </h3>

      {/* 🟢 Multi-select hint */}
      {question.type === "checkbox" && (
        <p className="text-sm text-gray-600 text-center bold">
          You can select multiple options
        </p>
      )}

      {/* Render Components */}
      {question.type === "input" && (
        <InputQuestion
          value={value as string}
          placeholder={question.placeholder}
          onAnswer={(v) => onAnswer(v)}
        />
      )}

      {question.type === "checkbox" && (
        <MultiSelect
          question={question}
          value={value as string[]}
          onAnswer={(v) => onAnswer(v)}
        />
      )}

      {question.type === "single" && (
        <SingleSelect
          question={question}
          value={value as string}
          onAnswer={(v) => onAnswer(v)}
          onNext={onNext}
        />
      )}
    </div>
  );
}
