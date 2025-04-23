"use client";
import { useEffect } from "react";

export default function IubendaScript() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Configurazione dello script inline
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      var _iub = _iub || [];
      _iub.csConfiguration = {
        lang: "it",
        siteId: 4005541,
        cookiePolicyId: 37922822,
        cookieDomain: window.location.hostname,
        banner: {
          acceptButtonDisplay: true,
          customizeButtonDisplay: true,
          position: "bottom"
        },
        invalidateConsentOnStorageMismatch: true,
        enableTcf: true,
        askConsentAtCookiePolicyUpdate: true,
        perPurposeConsent: true,
        cookiePolicyOnly: false
      };
    `;
    document.head.appendChild(configScript);

    // Script da CDN
    const iubendaScript = document.createElement("script");
    iubendaScript.type = "text/javascript";
    iubendaScript.src = "https://cdn.iubenda.com/cs/iubenda_cs.js";
    iubendaScript.async = true;
    document.head.appendChild(iubendaScript);
  }, []);

  return null;
}
