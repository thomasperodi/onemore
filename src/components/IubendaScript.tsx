"use client";

export default function IubendaScriptTag() {
  return (
    <>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
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
            invalidateConsentOnStorageMismatch: false,
            enableTcf: true,
            askConsentAtCookiePolicyUpdate: true,
            perPurposeConsent: true,
            cookiePolicyOnly: false
          };
        `,
        }}
      />
      <script
        type="text/javascript"
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        async
      ></script>
    </>
  );
}
