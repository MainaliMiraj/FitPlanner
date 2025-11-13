"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import type { Question } from "./types";

interface QuestionCardProps {
  question: Question;
  value: string | string[];
  onAnswer: (value: string | string[]) => void;
}

export default function QuestionCard({
  question,
  value,
  onAnswer,
}: QuestionCardProps) {
  const [otherText, setOtherText] = useState("");

  const isCheckbox = question.type === "checkbox";
  const isInput = question.type === "input";
  const options = question.options ?? [];
  const values = Array.isArray(value) ? value : [];
  const selectedValue = !isCheckbox ? (value as string) : "";

  const isOtherSelected = isCheckbox
    ? values.includes("Other")
    : selectedValue === "Other";

  // ✅ Keep “Other” input stable while typing
  useEffect(() => {
    if (!isOtherSelected && otherText !== "") {
      const timeout = setTimeout(() => setOtherText(""), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOtherSelected]);

  const handleRadioChange = (val: string) => {
    onAnswer(val);
  };

  const handleCheckboxChange = (option: string) => {
    let updated = [...values];

    // Handle “Select All”
    if (question.allowSelectAll && option === "Select All") {
      const allSelected = values.length === options.length;
      updated = allSelected ? [] : [...options];
      onAnswer(updated);
      return;
    }

    // Individual toggle
    if (updated.includes(option)) {
      updated = updated.filter((v) => v !== option);
    } else {
      updated.push(option);
    }

    onAnswer(updated);
  };

  const handleOtherInput = (text: string) => {
    setOtherText(text);

    if (isCheckbox) {
      const updated = values.includes("Other")
        ? [...values]
        : [...values, "Other"];
      onAnswer(updated);
    } else if (isOtherSelected || text.trim() !== "") {
      onAnswer(text);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-bold text-black text-center">
        {question.question}
      </h3>

      {/* ✅ INPUT TYPE (for height, weight, etc.) */}
      {isInput ? (
        <div className="flex flex-col items-center mt-6">
          <Input
            type="number"
            placeholder={question.placeholder || "Enter your answer"}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onAnswer(e.target.value)}
            className="w-1/2 min-w-[200px] text-center bg-white border-gray-300 text-black placeholder:text-gray-500"
          />

          {question.id === "height" && (
            <p className="text-sm text-gray-500 mt-2">
              Tip: Enter your height in centimeters (e.g., 175)
            </p>
          )}
          {question.id === "weight" && (
            <p className="text-sm text-gray-500 mt-2">
              Tip: Enter your weight in kilograms (e.g., 70)
            </p>
          )}
        </div>
      ) : isCheckbox ? (
        /* ✅ CHECKBOX TYPE */
        <div className="flex flex-col gap-3 mt-6">
          {question.allowSelectAll && (
            <div
              className={cn(
                "flex items-center gap-3 p-3 border rounded-lg transition-all cursor-pointer",
                values.length === options.length
                  ? "border-rose-500 bg-rose-50"
                  : "border-gray-200 hover:bg-gray-50"
              )}
              onClick={() => handleCheckboxChange("Select All")}
            >
              <Checkbox
                checked={values.length === options.length}
                id={`${question.id}-selectAll`}
              />
              <Label
                htmlFor={`${question.id}-selectAll`}
                className="flex-1 text-black text-base md:text-lg font-semibold"
              >
                Select All
              </Label>
            </div>
          )}

          {options.map((option) => {
            const checked = values.includes(option);
            return (
              <div
                key={option}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                  checked
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:bg-gray-50"
                )}
                onClick={() => handleCheckboxChange(option)}
              >
                <Checkbox checked={checked} id={`${question.id}-${option}`} />
                <Label
                  htmlFor={`${question.id}-${option}`}
                  className="flex-1 text-black text-base md:text-lg"
                >
                  {option}
                </Label>
                {checked && <CheckCircle2 className="w-5 h-5 text-rose-500" />}
              </div>
            );
          })}

          {/* “Other” Option for checkboxes */}
          <div
            className={cn(
              "flex flex-col gap-2 p-3 rounded-lg border transition-all cursor-pointer",
              isOtherSelected
                ? "border-rose-500 bg-rose-50"
                : "border-gray-200 hover:bg-gray-50"
            )}
            onClick={() => handleCheckboxChange("Other")}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={isOtherSelected} id={`${question.id}-Other`} />
              <Label
                htmlFor={`${question.id}-Other`}
                className="flex-1 text-black text-base md:text-lg"
              >
                Other
              </Label>
            </div>

            {isOtherSelected && (
              <Input
                type="text"
                placeholder="Please specify..."
                className="mt-2 bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                value={otherText}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()} // ✅ prevent collapse
                onChange={(e) => handleOtherInput(e.target.value)}
              />
            )}
          </div>
        </div>
      ) : (
        /* ✅ RADIO TYPE */
        <RadioGroup
          value={isOtherSelected ? "Other" : selectedValue}
          onValueChange={handleRadioChange}
          className="flex flex-col gap-3 mt-6"
        >
          {options.map((option) => {
            const selected = selectedValue === option;
            return (
              <div
                key={option}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                  selected
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:bg-gray-50"
                )}
                onClick={() => handleRadioChange(option)}
              >
                <RadioGroupItem
                  value={option}
                  id={`${question.id}-${option}`}
                />
                <Label
                  htmlFor={`${question.id}-${option}`}
                  className="flex-1 text-black cursor-pointer text-base md:text-lg"
                >
                  {option}
                </Label>
                {selected && <CheckCircle2 className="w-5 h-5 text-rose-600" />}
              </div>
            );
          })}

          {/* “Other” Option for radio */}
          <div
            className={cn(
              "flex flex-col gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer",
              isOtherSelected
                ? "border-rose-500 bg-rose-50"
                : "border-gray-200 hover:bg-gray-50"
            )}
            onClick={() => handleRadioChange("Other")}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="Other" id={`${question.id}-Other`} />
              <Label
                htmlFor={`${question.id}-Other`}
                className="flex-1 text-black text-base md:text-lg cursor-pointer"
              >
                Other
              </Label>
              {isOtherSelected && (
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
              )}
            </div>

            {isOtherSelected && (
              <Input
                type="text"
                placeholder="Please specify..."
                className="mt-2 bg-white border-gray-200 text-black placeholder:text-gray-500"
                value={otherText}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()} // ✅ prevent collapse
                onChange={(e) => handleOtherInput(e.target.value)}
              />
            )}
          </div>
        </RadioGroup>
      )}
    </div>
  );
}
