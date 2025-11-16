"use client";

import { Input } from "@/components/ui/input";

export default function InputQuestion({
  value,
  placeholder,
  onAnswer,
}: {
  value: string;
  placeholder?: string;
  onAnswer: (val: string) => void;
}) {
  return (
    <div className="flex flex-col items-center mt-6">
      <Input
        type="number"
        placeholder={placeholder || "Enter your answer"}
        value={value}
        onChange={(e) => onAnswer(e.target.value)}
        className="w-1/2 min-w-[200px] text-center bg-white border-gray-300 text-black placeholder:text-gray-500"
      />
    </div>
  );
}
