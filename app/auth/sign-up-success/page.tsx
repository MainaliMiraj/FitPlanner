import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-rose-500/5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/30">
                  <Mail className="h-8 w-8 text-rose-500" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
              <CardDescription className="text-center">We&apos;ve sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Please check your email and click the confirmation link to activate your account. Once confirmed, you
                can sign in and start your fitness journey.
              </p>
              <Button asChild className="w-full bg-rose-500 hover:bg-rose-600">
                <Link href="/auth/login">Go to Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
