// app/head.tsx
export default function Head() {
    return (
      <>
        {/* 1) Configurazione – DEVE girare prima del loader */}
        <script
          id="iubenda-cs-config"
          dangerouslySetInnerHTML={{
            __html: `
              // Mettiamo tutto su window in modo sicuro
              window._iub = window._iub || [];
              window._iub.csConfiguration = {
                cookiePolicyId: 37922822,
                siteId:         4005541,
  
                // flag di test
                enableRemoteConsent: false,
                invalidateConsentWithoutLog: true,
                skipSaveConsent: true,
                consentOnContinuedBrowsing: false,
  
                lang: "it",
                banner: {
                  position:            "bottom",
                  backgroundColor:     "#fff",
                  textColor:           "#000",
                  acceptButtonDisplay: true,
                  acceptButtonColor:   "#4EA1D3",
                  acceptButtonCaption: "Accetta",
                  rejectButtonDisplay: true,
                  rejectButtonColor:   "#aaa",
                  rejectButtonCaption: "Rifiuta"
                }
              };
            `,
          }}
        />
  
        {/* 2) Loader – IL vero script di iubenda */}
        <script
          src="https://cdn.iubenda.com/cs/iubenda_cs.js"
          defer
        />
      </>
    );
  }
  