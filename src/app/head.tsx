// app/head.tsx
import Script from "next/script";

export default function Head() {
  return (
    <>
      {/* 1) Configurazione Iubenda: inline, PRIMA di qualsiasi altro JS */}
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
            cookiePolicyOnly: false
          };
        `}
      </Script>

      {/* 2) Loader ufficiale Iubenda da CDN */}
      <Script
        id="iubenda-cs"
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
