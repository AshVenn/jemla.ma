import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "./Providers";
import { ThemeProvider } from "./(cpnotrouted)/theme-provider";

export const metadata = {
  metadataBase: new URL('https://jemla-ma.vercel.app'),
  title: {
    default: 'Jemla.ma',
    template: '%s - Jemla.ma',
  },
  description: "Découvrez notre plateforme dédiée aux vendeurs en gros au Maroc. Gérez facilement vos stocks, suivez les commandes, analysez les ventes et optimisez vos opérations commerciales. Une solution complète pour développer votre activité en toute simplicité.",
  twitter: {
    handle: '@jemla.ma',
    site: '@jemla.ma',
    card: 'summary_large_image',
  },
  openGraph: {
    title: 'Jemla.ma - Plateforme pour les grossistes au Maroc',
    description: "Jemla.ma est votre allié pour gérer efficacement votre commerce en gros au Maroc. De la gestion des stocks à l'analyse des ventes, découvrez une solution tout-en-un pour booster votre activité.",
    url: 'https://jemla-ma.vercel.app',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        alt: 'Jemla.ma - Plateforme pour les grossistes au Maroc',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
      <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
        <AuthProvider session={Session}>
            {children}
            <Toaster/>
            <Analytics />
            <SpeedInsights />
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
