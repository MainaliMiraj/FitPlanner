import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect authenticated users to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">FitPlanner</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-rose-500 hover:bg-rose-600">
              <Link href="/onboarding">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 to-purple-500">
                <Dumbbell className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
              Your AI-Powered Fitness Journey Starts Here
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Transform your fitness goals into reality with personalized
              workout plans, nutrition tracking, and AI-powered recommendations
              tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-rose-500 hover:bg-rose-600 text-lg px-8"
              >
                <Link href="/onboarding">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Everything You Need to Succeed
            </h2>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/30 mx-auto mb-4">
                  <Dumbbell className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Smart Workout Plans
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-generated workouts customized to your fitness level and
                  goals
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-100 dark:bg-lime-950/30 mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-lime-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Nutrition Guidance
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Personalized meal plans with macro tracking and AI suggestions
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-950/30 mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Progress Tracking
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Visualize your transformation with detailed metrics and charts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users achieving their fitness goals with
            FitPlanner
          </p>
          <Button
            asChild
            size="lg"
            className="bg-rose-500 hover:bg-rose-600 text-lg px-8"
          >
            <Link href="/onboarding">Get Started Free</Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 FitPlanner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
