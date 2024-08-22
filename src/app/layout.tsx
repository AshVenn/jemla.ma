"use client";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "./(cpnotrouted)/theme-provider";
import { cn } from "@/lib/utils";
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel='icon' href='/jemla.maIcon.svg' type="image/svg+xml" />
      </head>
      <body className={cn(
        "w-full min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <SessionProvider>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
