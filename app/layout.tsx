import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // you can customize weights
  variable: "--font-barlow", // optional, useful for Tailwind integration
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
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
