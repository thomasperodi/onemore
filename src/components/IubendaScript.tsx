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

    // Inizializza _iub e push della configurazione
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

    // Script caricato solo DOPO la configurazione
    const iubendaScript = document.createElement("script");
    iubendaScript.src = "https://cdn.iubenda.com/cs/iubenda_cs.js";
    iubendaScript.type = "text/javascript";
    iubendaScript.async = true;
    document.body.appendChild(iubendaScript);
  }, []);

  return null;
}
