/* app/layout.tsx */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/landing/Footer";
import CookieBanner from '@/components/CookieBanner'
// app/layout.tsx
import { ViewportHeightFix } from '@/components/ViewportHeightFix';
import { Viewport } from "next"
import ClientAnalytics from "@/components/ClientAnalytics";




const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Onemoreandfam",
  description:
    "OneMore&Fam è l'organizzazione di eventi che porta i TikToker più popolari nelle serate più esclusive, creando esperienze uniche e coinvolgenti per tutti i partecipanti.",
  
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ViewportHeightFix/>


        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
            <CookieBanner />
            <ClientAnalytics />
            
          </main>
          <Footer />
        </div>
        
      </body>
    </html>
  );
}
