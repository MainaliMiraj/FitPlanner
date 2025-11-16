import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "FitPlanner",
  description: "For your fitness journey",
  icons: {
    icon: [
      {
        url: "/dumbbell.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={barlow.className}>
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}

        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            duration: 2500,
            className: "shadow-lg border border-rose-200",
            style: {
              backgroundColor: "#e11d48",
              color: "white",
              borderRadius: "0.75rem",
              fontSize: "0.95rem",
              fontWeight: 500,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            },
          }}
        />

        <Analytics />
      </body>
    </html>
  );
}
