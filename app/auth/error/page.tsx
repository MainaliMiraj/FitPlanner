import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-rose-500/5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/30">
                  <AlertCircle className="h-8 w-8 text-rose-500" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground text-center mb-6">Error: {params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground text-center mb-6">
                  An unexpected error occurred during authentication.
                </p>
              )}
              <Button asChild className="w-full bg-rose-500 hover:bg-rose-600">
                <Link href="/auth/login">Back to Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
