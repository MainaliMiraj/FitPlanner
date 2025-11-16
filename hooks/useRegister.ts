import type React from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const useRegister = ({
  answers,
}: {
  answers: Record<string, string | string[]>;
}) => {
  const supabase = createClient();
  const router = useRouter();

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
        email,
        display_name: displayName,
        ...answers,
      };

      const { error: insertError } = await supabase
        .from("profiles")
        .insert({ id: user.id, ...profileData });

      if (insertError) throw insertError;

      // 4️⃣ Clear quiz state and redirect
      // resetQuiz();
      router.push("/auth/sign-up-success");
    } catch (err: any) {
      console.error("[sign-up] Error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSignUp,
    displayName,
    setDisplayName,
    repeatPassword,
    setRepeatPassword,
    email,
    setEmail,
    error,
    setError,
    isLoading,
    password,
    setPassword,
    setIsLoading,
  };
};
export default useRegister;
