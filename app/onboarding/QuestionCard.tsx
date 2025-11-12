"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  category: string;
}

interface QuestionCardProps {
  question: Question;
  value: string;
  onAnswer: (value: string) => void;
}

export default function QuestionCard({
  question,
  value,
  onAnswer,
}: QuestionCardProps) {
  const [otherText, setOtherText] = useState("");

  // Handle when user selects "Other"
  const isOtherSelected =
    value === "Other" || (!question.options.includes(value) && value !== "");

  useEffect(() => {
    if (!isOtherSelected) setOtherText("");
  }, [isOtherSelected]);

  const handleChange = (val: string) => {
    if (val !== "Other") onAnswer(val);
    else onAnswer("Other");
  };

  const handleOtherInput = (text: string) => {
    setOtherText(text);
    onAnswer(text); // Save custom text as the actual answer
  };

  return (
    <div className="w-full space-y-6">
      {/* Question Title */}
      <h3 className="text-2xl md:text-3xl font-semibold text-white text-center">
        {question.question}
      </h3>

      {/* Options */}
      <RadioGroup
        value={isOtherSelected ? "Other" : value}
        onValueChange={handleChange}
        className="flex flex-col gap-3 mt-6"
      >
        {question.options.map((option) => {
          const selected = value === option;
          return (
            <div
              key={option}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                selected
                  ? "border-rose-500 bg-white/10 text-white"
                  : "border-white/20 hover:bg-white/10"
              )}
              onClick={() => handleChange(option)}
            >
              <RadioGroupItem
                value={option}
                id={`${question.id}-${option}`}
                className="text-rose-500"
              />
              <Label
                htmlFor={`${question.id}-${option}`}
                className="flex-1 text-white cursor-pointer text-base md:text-lg"
              >
                {option}
              </Label>
              {selected && <CheckCircle2 className="w-5 h-5 text-rose-400" />}
            </div>
          );
        })}

        {/* “Other” Option */}
        <div
          className={cn(
            "flex flex-col gap-2 p-3 rounded-lg border transition-all cursor-pointer",
            isOtherSelected
              ? "border-rose-500 bg-white/10 text-white"
              : "border-white/20 hover:bg-white/10"
          )}
          onClick={() => handleChange("Other")}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="Other"
              id={`${question.id}-Other`}
              className="text-rose-500"
            />
            <Label
              htmlFor={`${question.id}-Other`}
              className="flex-1 text-white cursor-pointer text-base md:text-lg"
            >
              Other
            </Label>
            {isOtherSelected && (
              <CheckCircle2 className="w-5 h-5 text-rose-400" />
            )}
          </div>

          {/* Conditionally Render Text Input */}
          {isOtherSelected && (
            <Input
              type="text"
              placeholder="Please specify..."
              className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-white/50"
              value={otherText}
              onChange={(e) => handleOtherInput(e.target.value)}
            />
          )}
        </div>
      </RadioGroup>
    </div>
  );
}
