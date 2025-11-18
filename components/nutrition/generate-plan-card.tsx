"use client";

import { Sparkles, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GeneratePlanCardProps {
  isGenerating: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
}

export function GeneratePlanCard({
  isGenerating,
  onGenerate,
  canGenerate,
}: GeneratePlanCardProps) {
  return (
    <Card className="border-rose-200/50 bg-white/60 backdrop-blur-xl shadow-xl">
      <CardHeader className="gap-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
          <Sparkles className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-semibold">
          Your AI Nutrition Strategist
        </CardTitle>
        <CardDescription className="text-base">
          Get a 7-day hyper-personalized nutrition plan with calories, macros,
          meals, snacks, recipes, and a smart shopping list in seconds.
        </CardDescription>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          <Badge variant="outline" className="border-rose-200 text-rose-500">
            Tailored to your onboarding data
          </Badge>
          <Badge variant="outline" className="border-rose-200 text-rose-500">
            Instant grocery list
          </Badge>
          <Badge variant="outline" className="border-rose-200 text-rose-500">
            7-day calendar
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {!canGenerate && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            <ShieldCheck className="h-4 w-4" />
            Complete your profile and onboarding quiz to unlock AI nutrition
            planning.
          </div>
        )}
        <Button
          size="lg"
          className="h-14 w-full max-w-md rounded-2xl bg-rose-500 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 cursor-pointer"
          onClick={onGenerate}
          disabled={isGenerating || !canGenerate}
        >
          {isGenerating ? "Generating your plan..." : "Generate Nutrition Plan"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          The plan is saved securely to your profile and can be regenerated
          anytime.
        </p>
      </CardContent>
    </Card>
  );
}
