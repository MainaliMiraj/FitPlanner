"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** Percentage from 0–100 */
  progress: number;
  /** Optional label (e.g., “Step 3 of 20”) */
  label?: string;
  /** Optional extra classes for the outer wrapper */
  className?: string;
}

export default function ProgressBar({
  progress,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm md:text-base text-white/80">
          {label ?? "Your Progress"}
        </span>
        <span className="text-sm md:text-base font-medium text-white">
          {pct}%
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-white/15"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={label ?? "Progress"}
      >
        {/* Fill */}
        <div
          className="h-full rounded-full bg-rose-500 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
        {/* Soft glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow: pct > 0 ? "0 0 24px rgba(244, 63, 94, 0.35)" : "none",
          }}
        />
      </div>
    </div>
  );
}
