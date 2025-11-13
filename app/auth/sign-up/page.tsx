"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { useOnboardingStore } from "@/app/onboarding/store/useOnboardingStore";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  // ✅ Pull quiz data & BMI directly from Zustand
  const { answers,resetQuiz } = useOnboardingStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) return setError("Please enter your name");
    if (!email.trim()) return setError("Please enter your email");
    if (password !== repeatPassword) return setError("Passwords do not match");
    if (password.length < 8)
      return setError("Password must be at least 6 characters");

    // ✅ Ensure quiz data is present
    if (!answers || Object.keys(answers).length === 0) {
      setError("Please complete the personalization quiz before signing up.");
      router.replace("/onboarding");
      return;
    }

    setIsLoading(true);

    try {
      // 1️⃣ Create user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
          data: { display_name: displayName },
        },
      });

      if (authError) throw authError;
      const user = authData.user;
      if (!user) throw new Error("Failed to create user");

      // 2️⃣ Prepare profile data
      const profileData = {
        display_name: displayName,
        bmi,
        ...answers,
      };

      // 3️⃣ Upsert (insert or update) into `profiles`
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...profileData })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // 4️⃣ Clear quiz state and redirect
      resetQuiz();
      router.push("/auth/sign-up-success");
    } catch (err: any) {
      console.error("[sign-up] Error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-linear-to-br from-background via-background to-rose-500/5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* App Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">FitPlanner</h1>
          </div>

          {/* Signup Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Start your fitness transformation today
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Confirm Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200 dark:border-rose-900">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-rose-500 hover:bg-rose-600"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-rose-500 underline underline-offset-4 hover:text-rose-600"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
