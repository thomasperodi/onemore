// components/ClientAnalytics.tsx
"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Cookies from "js-cookie";

export default function ClientAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const consentCookie = Cookies.get("cookie-preferences");
    if (consentCookie) {
      const parsed = JSON.parse(consentCookie);
      if (parsed?.analytics) {
        setEnabled(true);
      }
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
