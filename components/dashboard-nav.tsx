"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Dumbbell, LayoutDashboard, Apple, TrendingUp, LogOut, Menu, X, User } from "lucide-react"
import { useState } from "react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Workouts",
    href: "/dashboard/workouts",
    icon: Dumbbell,
    color: "text-rose-500",
  },
  {
    title: "Nutrition",
    href: "/dashboard/nutrition",
    icon: Apple,
    color: "text-lime-500",
  },
  {
    title: "Progress",
    href: "/dashboard/progress",
    icon: TrendingUp,
    color: "text-sky-500",
  },
]

const profileNav = {
  title: "Profile",
  href: "/dashboard/profile",
  icon: User,
}

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const ProfileIcon = profileNav.icon
  const isProfileActive = pathname === profileNav.href

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">FitPlanner</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <nav className="fixed top-[57px] left-0 right-0 bottom-0 bg-background border-r p-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      isActive
                        ? "bg-rose-500 text-white"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn("h-5 w-5", isActive ? "" : item.color)}
                    />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t">
              <Link
                href={profileNav.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 mb-4 transition-colors",
                  isProfileActive
                    ? "bg-rose-500 text-white"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <ProfileIcon
                  className={cn(
                    "h-5 w-5",
                    isProfileActive ? "" : "text-muted-foreground"
                  )}
                />
                <span className="font-medium">{profileNav.title}</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex w-64 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 p-6 border-b">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">FitPlanner</span>
        </div>

        <div className="flex-1 p-4">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    isActive
                      ? "bg-rose-500 text-white"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "" : item.color)} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t">
          <Link
            href={profileNav.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 mb-4 transition-colors",
              isProfileActive
                ? "bg-rose-500 text-white"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <ProfileIcon
              className={cn(
                "h-5 w-5",
                isProfileActive ? "" : "text-muted-foreground"
              )}
            />
            <span className="font-medium">{profileNav.title}</span>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </nav>

      {/* Spacer for mobile */}
      <div className="lg:hidden h-[57px]" />
    </>
  );
}
