/* app/layout.tsx */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/landing/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Onemoreandfam",
  description:
    "OneMore&Fam è l'organizzazione di eventi che porta i TikToker più popolari nelle serate più esclusive, creando esperienze uniche e coinvolgenti per tutti i partecipanti.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Analytics />

        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
            <SpeedInsights />
          </main>
          <Footer />
        </div>

        {/*
          1) Configurazione Iubenda: inline, prima del loader
        */}
        <Script id="iubenda-config" strategy="beforeInteractive">
          {`
            window._iub = window._iub || {};
            window._iub.csConfiguration = {
              siteId: 4005541,
              cookiePolicyId: 37922822,
              lang: "it",
              banner: {
                acceptButtonDisplay: true,
                customizeButtonDisplay: true,
                position: "bottom"
              },
              invalidateConsentOnStorageMismatch: false,
              enableTcf: false,
              askConsentAtCookiePolicyUpdate: true,
              perPurposeConsent: true,
              cookiePolicyOnly: false,
              skipSaveConsentWidget: false
            };
          `}
        </Script>

        {/*
          2) Loader ufficiale Iubenda: dopo la config ma comunque prima dell’interazione utente
        */}
        <Script
          id="iubenda-loader"
          src="https://cdn.iubenda.com/cs/iubenda_cs.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
