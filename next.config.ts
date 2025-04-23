// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jmvacxdzxlfcrwibtkbb.supabase.co",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Applica a tutte le pagine
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              // fallback per font/img/file ecc.
              "default-src 'self';",

              // permetti inline-script (Next.js inline config) e loader Iubenda
              "script-src 'self' 'unsafe-inline' https://cdn.iubenda.com https://onemore-delta.vercel.app;",

              // per sicurezza, esplicita anche script-src-elem
              "script-src-elem 'self' 'unsafe-inline' https://cdn.iubenda.com https://onemore-delta.vercel.app;",

              // stili inline (Next font, Iubenda core-it.js)
              "style-src 'self' 'unsafe-inline';",

              // font via data:URI (Next Font)
              "font-src 'self' data:;",

              // connessioni per salvataggio consenso (IndexedDB)
              "connect-src 'self' https://idb.iubenda.com;",

              // immagini inline o da CDN
              "img-src 'self' data: https://cdn.iubenda.com;",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
