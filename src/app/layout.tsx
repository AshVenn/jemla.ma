"use client"
import "./globals.css";
import { ThemeProvider } from "./(cpnotrouted)/theme-provider";
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Toaster } from "@/components/ui/toaster"

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel='icon' href='/jemla.maIcon.svg' type="image/svg+xml" />
      </head>
      <body className="w-full min-h-screen bg-background font-sans antialiased">
        <SessionProvider>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster/>
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
