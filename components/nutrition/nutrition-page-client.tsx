"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { GeneratePlanCard } from "@/components/nutrition/generate-plan-card";
import { NutritionDashboard } from "@/components/nutrition/nutrition-dashboard";
import { useUser } from "@/context/user-context";
import { useNutrition } from "@/context/nutrition-context";
import type { ProfileData } from "@/types/user";
import type { NutritionPlan } from "@/types/nutrition";
import { extractQuizData } from "@/lib/nutrition/utils";

interface NutritionPageClientProps {
  initialProfile: ProfileData | null;
  initialPlan: NutritionPlan | null;
}

export function NutritionPageClient({
  initialProfile,
  initialPlan,
}: NutritionPageClientProps) {
  const { profile, quizData, hydrateFromProfile } = useUser();
  const { plan, isGenerating, setPlan, setIsGenerating } = useNutrition();

  useEffect(() => {
    if (!profile && initialProfile) {
      hydrateFromProfile(initialProfile);
    }
  }, [profile, initialProfile, hydrateFromProfile]);

  useEffect(() => {
    if (!plan && initialPlan) {
      setPlan(initialPlan);
    }
  }, [plan, initialPlan, setPlan]);

  const mergedProfile = useMemo(
    () => profile ?? initialProfile,
    [profile, initialProfile]
  );
  const mergedQuizData = useMemo(
    () => quizData ?? extractQuizData(mergedProfile ?? null),
    [quizData, mergedProfile]
  );

  const handleGeneratePlan = async () => {
    if (isGenerating) return;
    if (!mergedProfile) {
      toast.error("Profile required", {
        description:
          "Complete your profile and onboarding quiz before generating a plan.",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch("/api/nutrition-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: mergedProfile,
          quizData: mergedQuizData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate nutrition plan");
      }

      const data = await response.json();
      setPlan(data.plan);
      toast.success("Nutrition plan ready", {
        description: "Your personalized nutrition dashboard is now available.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to generate plan", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const hasPlan = Boolean(plan);
  const planToRender = plan ?? initialPlan;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-500">
          Nutrition
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Your Personalized Nutrition Strategy
        </h1>
        <p className="text-muted-foreground text-base">
          AI-powered planning that adapts your calories, macros, meals, and
          grocery list to your lifestyle.
        </p>
      </div>

      {!hasPlan || !planToRender ? (
        <GeneratePlanCard
          isGenerating={isGenerating}
          onGenerate={handleGeneratePlan}
          canGenerate={Boolean(mergedProfile)}
        />
      ) : (
        <NutritionDashboard
          plan={planToRender}
          isRegenerating={isGenerating}
          onRegenerate={handleGeneratePlan}
        />
      )}
    </div>
  );
}
