"use client";

import { useState, useEffect } from "react";
import OptionCard from "./OptionCard";
import { Input } from "@/components/ui/input";
import type { Question } from "../types";

export default function MultiSelect({
  question,
  value,
  onAnswer,
}: {
  question: Question;
  value: string[] | string;
  onAnswer: (v: string[]) => void;
}) {
  const selectedValues = Array.isArray(value) ? value : [];
  const { options = [], allowSelectAll, otherOption } = question;

  const otherValue = otherOption?.value ?? "Other";

  const finalOptions = [...options];
  if (otherOption?.enabled && !finalOptions.includes(otherValue)) {
    finalOptions.push(otherValue);
  }

  const [otherText, setOtherText] = useState("");

  useEffect(() => {
    const custom = selectedValues.find(
      (v) => !finalOptions.includes(v) && v !== otherText
    );
    if (custom) setOtherText(custom);
  }, [selectedValues]);

  const toggleOption = (option: string) => {
    let updated = [...selectedValues];

    if (allowSelectAll && option === "Select All") {
      updated =
        selectedValues.length === finalOptions.length ? [] : [...finalOptions];
      onAnswer(updated);
      return;
    }

    if (option === otherValue) {
      const exists =
        updated.includes(otherValue) || updated.includes(otherText);

      if (!exists) {
        updated.push(otherValue);
      } else {
        updated = updated.filter((v) => v !== otherValue && v !== otherText);
        setOtherText("");
      }

      onAnswer(updated);
      return;
    }

    if (updated.includes(option)) {
      updated = updated.filter((v) => v !== option);
    } else {
      updated.push(option);
    }

    onAnswer(updated);
  };

  const handleOtherInput = (text: string) => {
    setOtherText(text);
    let updated = selectedValues.filter((v) => v !== otherText);

    if (text === "") {
      if (!updated.includes(otherValue)) updated.push(otherValue);
    } else {
      updated = updated.filter((v) => v !== otherValue);
      updated.push(text);
    }

    onAnswer(updated);
  };

  return (
    <div className="flex flex-col gap-3 mt-6">
      {allowSelectAll && (
        <OptionCard
          label="Select All"
          selected={selectedValues.length === finalOptions.length}
          onClick={() => toggleOption("Select All")}
        />
      )}

      {finalOptions.map((option) => {
        const isOther = option === otherValue;
        const selected = isOther
          ? selectedValues.includes(otherValue) ||
            selectedValues.includes(otherText)
          : selectedValues.includes(option);

        return (
          <OptionCard
            key={option}
            label={isOther ? otherOption?.label ?? "Other" : option}
            selected={selected}
            onClick={() => toggleOption(option)}
          >
            <div
              className={
                isOther
                  ? selected
                    ? "mt-2"
                    : "opacity-0 pointer-events-none h-0 overflow-hidden mt-2"
                  : "hidden"
              }
              //onMouseDown={(e) => e.stopPropagation()}
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
