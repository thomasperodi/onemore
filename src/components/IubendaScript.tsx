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

    // Inizializza _iub
    window._iub = window._iub || [];

    // Prima configura csConfiguration
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

    // Poi carica lo script in modo asincrono con delay minimo
    setTimeout(() => {
      const iubendaScript = document.createElement("script");
      iubendaScript.src = "https://cdn.iubenda.com/cs/iubenda_cs.js";
      iubendaScript.type = "text/javascript";
      iubendaScript.async = true;
      document.body.appendChild(iubendaScript);
    }, 0); // Delay minimo per garantire che il push sia avvenuto
  }, []);

  return null;
}
