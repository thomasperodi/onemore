"use client";

import { useEffect } from "react";

export default function IubendaScript() {
  useEffect(() => {
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      var _iub = _iub || [];
      _iub.csConfiguration = {
        lang: "it",
        siteId: 4005541,
        cookiePolicyId: 37922822,
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

    const csScript = document.createElement("script");
    csScript.src = "//cdn.iubenda.com/cs/iubenda_cs.js";
    csScript.async = true;
    document.head.appendChild(csScript);
  }, []);

  return null;
}
