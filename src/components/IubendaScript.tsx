"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    _iub: Array<Record<string, unknown>>;
  }
}

export default function IubendaScript() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window._iub = window._iub || [];

    window._iub.push({
      csConfiguration: {
        lang: "it",
        siteId: 4005541,
        cookiePolicyId: 37922822,
        cookieDomain: window.location.hostname,
        banner: {
          acceptButtonDisplay: true,
          customizeButtonDisplay: true,
          position: "bottom"
        },
        invalidateConsentOnStorageMismatch: false,
        enableTcf: true,
        askConsentAtCookiePolicyUpdate: true,
        perPurposeConsent: true,
        cookiePolicyOnly: false
      }
    });

    const iubendaScript = document.createElement("script");
    iubendaScript.type = "text/javascript";
    iubendaScript.src = "https://cdn.iubenda.com/cs/iubenda_cs.js";
    iubendaScript.async = true;
    document.head.appendChild(iubendaScript);
  }, []);

  return null;
}
