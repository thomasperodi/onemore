/* app/layout.tsx */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/landing/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieBanner from '@/components/CookieBanner'
import Cookies from 'js-cookie'
// app/layout.tsx
import { ViewportHeightFix } from '@/components/ViewportHeightFix';




const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Onemoreandfam",
  description:
    "OneMore&Fam è l'organizzazione di eventi che porta i TikToker più popolari nelle serate più esclusive, creando esperienze uniche e coinvolgenti per tutti i partecipanti.",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasConsent = typeof window !== 'undefined' && Cookies.get('cookie-preferences')
  const consent = hasConsent ? JSON.parse(Cookies.get('cookie-preferences')!) : null
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ViewportHeightFix/>


        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
            <CookieBanner />
            {consent?.analytics && (

              <>
                <Analytics />
                <SpeedInsights />
              </>
            )}
            
          </main>
          <Footer />
        </div>
        
      </body>
    </html>
  );
}
