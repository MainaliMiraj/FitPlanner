import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile-form"
import { User } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <User className="h-6 w-6" />
          </div>
          Profile
        </h1>
        <p className="text-muted-foreground mt-2">Manage your account and fitness information</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Fitness Profile</CardTitle>
          <CardDescription>
            Your personal fitness information helps us provide better AI recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
