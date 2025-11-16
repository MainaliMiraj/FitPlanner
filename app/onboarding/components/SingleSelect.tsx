"use client";

import { useState, useEffect } from "react";
import OptionCard from "./OptionCard";
import { Input } from "@/components/ui/input";
import type { Question } from "../types";

export default function SingleSelect({
  question,
  value,
  onAnswer,
  onNext,
}: {
  question: Question;
  value: string;
  onAnswer: (v: string) => void;
  onNext: () => void;
}) {
  const { options = [], otherOption } = question;
  const otherValue = otherOption?.value ?? "Other";

  const finalOptions = [...options];
  if (otherOption?.enabled && !finalOptions.includes(otherValue)) {
    finalOptions.push(otherValue);
  }

  const [otherText, setOtherText] = useState("");

  useEffect(() => {
    if (value && value !== otherValue && !finalOptions.includes(value)) {
      setOtherText(value);
    }
  }, [value]);

  const handleSelect = (option: string) => {
    if (option !== otherValue) {
      onAnswer(option);
      setTimeout(onNext, 150);
      return;
    }
    onAnswer(otherValue);
  };

  const handleOtherInput = (text: string) => {
    setOtherText(text);
    if (text.trim() === "") onAnswer(otherValue);
    else onAnswer(text.trim());
  };

  return (
    <div className="flex flex-col gap-3 mt-6">
      {finalOptions.map((option) => {
        const isOther = option === otherValue;
        const selected = isOther
          ? value === otherValue || value === otherText
          : value === option;

        return (
          <OptionCard
            key={option}
            label={isOther ? otherOption?.label ?? "Other" : option}
            selected={selected}
            onClick={() => handleSelect(option)}
          >
            {/* Always mounted input → visually hidden but still DOM-present */}
            <div
              className={
                isOther
                  ? selected
                    ? "mt-2"
                    : "opacity-0 pointer-events-none h-0 overflow-hidden mt-2"
                  : "hidden"
              }
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                type="text"
                value={otherText}
                placeholder={otherOption?.placeholder ?? "Please specify..."}
                onChange={(e) => handleOtherInput(e.target.value)}
                className="bg-white border-gray-200 text-black"
              />
            </div>
          </OptionCard>
        );
      })}
    </div>
  );
}
