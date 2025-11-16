"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { OptionCardProps } from "../types";

export default function OptionCard({
  label,
  selected,
  onClick,
  children,
}: OptionCardProps) {
  return (
    <div className="flex flex-col">
      {/* CLICKABLE CARD */}
      <div
        className={cn(
          "flex items-center justify-between p-3 border-2 rounded-lg transition-all cursor-pointer",
          selected
            ? "border-rose-500 bg-rose-50"
            : "border-gray-200 hover:bg-gray-50"
        )}
        onClick={onClick}
      >
        <Label className="text-black text-base md:text-lg">{label}</Label>

        {selected && (
          <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0" />
        )}
      </div>

      {/* ALWAYS-MOUNTED INPUT FIX — prevents space blur */}
      {children && (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="mt-2"
        >
          {children}
        </div>
      )}
    </div>
  );
}
