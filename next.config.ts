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
        // applica a tutte le route
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              // di default solo 'self'
              "default-src 'self';",

              // permetti inline-script (necessario per il config Iubenda e Next font)
              "script-src 'self' 'unsafe-inline' https://cdn.iubenda.com;",

              // permetti inline-style (Next font e core-it.js)
              "style-src 'self' 'unsafe-inline';",

              // permetti caricamento font base64
              "font-src 'self' data:;",

              // connessioni a Iubenda DB per salvare consenso
              "connect-src 'self' https://idb.iubenda.com;",

              // immagini inline e dal tuo dominio
              "img-src 'self' data: https://cdn.iubenda.com;",

              // opzionale, se usi fetch per altri domini
              // "connect-src 'self' https://api.tuodominio.com;"
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
