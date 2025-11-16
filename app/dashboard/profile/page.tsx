import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProfileForm } from "@/components/profile-form";
import { Sparkles } from "lucide-react";
import type { ProfileData } from "@/types/user";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  const profileData = (profile as ProfileData | null) ?? null;

  const quickStats = [
    { label: "Goal", value: formatValue(profileData?.fitness_goal) },
    { label: "Diet", value: formatValue(profileData?.diet_preference) },
    {
      label: "Activity",
      value: formatValue(
        profileData?.activity_level ?? profileData?.daily_routine
      ),
    },
  ];

  const essentials = [
    {
      label: "Height",
      value: profileData?.height_cm
        ? `${profileData.height_cm} cm`
        : formatValue(profileData?.height),
    },
    {
      label: "Current weight",
      value: profileData?.weight_kg
        ? `${profileData.weight_kg} kg`
        : formatValue(profileData?.weight),
    },
    {
      label: "Target weight",
      value: profileData?.target_weight_kg
        ? `${profileData.target_weight_kg} kg`
        : formatValue(profileData?.target_weight),
    },
    {
      label: "Age",
      value: formatValue(profileData?.age),
    },
  ];

  const preferenceSections = buildPreferenceSections(profileData);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-rose-100 bg-linear-to-br from-white via-rose-50/40 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-2xl font-semibold text-rose-600">
              {getInitials(profileData?.display_name || user.email || "FP")}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-rose-500">
                Profile
              </p>
              <h1 className="text-3xl font-semibold">
                {profileData?.display_name || "FitPlanner athlete"}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
              {profileData?.fitness_goal && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Focused on {formatValue(profileData.fitness_goal)}
                </p>
              )}
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:max-w-xl">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-rose-100 bg-white/80 p-3 text-center"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-rose-500" />
              Preferences & Lifestyle
            </CardTitle>
            <CardDescription>
              Your onboarding quiz answers live here for quick reference.
            </CardDescription>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <Link href="/onboarding">Edit Preferences</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {preferenceSections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-muted/50 p-6 text-center text-sm text-muted-foreground">
              Complete the onboarding quiz to personalize your recommendations.
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={preferenceSections.map((section) => section.id)}
            >
              {preferenceSections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="flex flex-col items-start gap-1 text-left text-base font-semibold md:flex-row md:items-center md:justify-between">
                    {section.title}
                    <span className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
                      {section.description}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {section.items.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-muted/40 bg-muted/5 p-3"
                        >
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {item.label}
                          </p>
                          {"values" in item ? (
                            item.values && item.values.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.values.map((value) => (
                                  <Badge
                                    key={value}
                                    variant="secondary"
                                    className="bg-white text-foreground"
                                  >
                                    {formatValue(value)}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-2 text-sm text-muted-foreground">
                                Not set
                              </p>
                            )
                          ) : (
                            <p className="mt-2 text-sm font-medium text-foreground">
                              {formatValue(item.value)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatValue(value?: string | null): string {
  if (!value || value.trim().length === 0) return "Not set";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getInitials(input: string) {
  return input
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

type PreferenceItem =
  | {
      label: string;
      value?: string | null;
      values?: never;
    }
  | {
      label: string;
      value?: never;
      values?: string[];
    };

type PreferenceSection = {
  id: string;
  title: string;
  description: string;
  items: PreferenceItem[];
};

function buildPreferenceSections(
  profile: ProfileData | null
): PreferenceSection[] {
  if (!profile) return [];

  const toArray = (value?: string[] | null) =>
    Array.isArray(value) ? value.filter(Boolean) : [];

  return [
    {
      id: "nutrition",
      title: "Nutrition & Food",
      description: "Diet style, cuisines, and eating habits.",
      items: [
        { label: "Diet preference", value: profile.diet_preference },
        {
          label: "Popular cuisines",
          values: toArray(profile.popular_cuisines),
        },
        { label: "Nutrition habits", value: profile.nutrition_habits },
        { label: "Cooking time", value: profile.cooking_time },
      ],
    },
    {
      id: "lifestyle",
      title: "Lifestyle & Routine",
      description: "Daily rhythm and wellbeing signals.",
      items: [
        { label: "Daily routine", value: profile.daily_routine },
        { label: "Energy level", value: profile.energy_level },
        { label: "Water intake", value: profile.water_intake },
        { label: "Bad habits", values: toArray(profile.bad_habits) },
      ],
    },
    {
      id: "training",
      title: "Training Insights",
      description: "How you like to move and train.",
      items: [
        { label: "Body type", value: profile.body_type },
        { label: "Dream body", value: profile.dream_body },
        { label: "Sports experience", value: profile.sports_experience },
        { label: "Best condition", value: profile.best_condition },
        { label: "Workout frequency", value: profile.workout_frequency },
      ],
    },
  ];
}
