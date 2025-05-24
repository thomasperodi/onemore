// components/ClientAnalytics.tsx
"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Cookies from "js-cookie";

export default function ClientAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    try {
      const cookie = Cookies.get("cookie-preferences");
      if (cookie) {
        const parsed = JSON.parse(cookie);
        if (parsed.analytics === true) {
          setConsentGiven(true);
        }
      }
    } catch (e) {
      console.error("Errore nel parsing del cookie:", e);
    }
  }, []);

  if (!consentGiven) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
