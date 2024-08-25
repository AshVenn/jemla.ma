import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "./Providers";

interface RootLayoutProps {
  children: React.ReactNode;
}
export const metadata = {
  title: 'Jemla.ma',
  description: "Découvrez notre plateforme dédiée aux vendeurs en gros au Maroc. Gérez facilement vos stocks, suivez les commandes, analysez les ventes et optimisez vos opérations commerciales.Une solution complète pour développer votre activité en toute simplicité."
,
};
export default function RootLayout({
  children,
  Session
}: {
  children: React.ReactNode;
  Session: any
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel='icon' href='/jemla.maIcon.svg' type="image/svg+xml" />
      </head>
      <body className="w-full min-h-screen bg-background font-sans antialiased">
        <AuthProvider session={Session}>
            {children}
            <Toaster/>
            <Analytics />
            <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}
