"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  label?: string;
  className?: string;
}

export default function ProgressBar({
  progress,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className={cn("w-full mb-8", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm md:text-base text-rose-500 font-bold">
          {label ?? "Progress:"}
        </span>
        <span className="text-sm md:text-base font-extrabold text-rose-500 ">
          {pct}%
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
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
