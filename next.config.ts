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
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              // default
              "default-src 'self';",

              // script inline (Next) + loader e config Iubenda + altri host Iubenda
              "script-src 'self' 'unsafe-inline' https://cdn.iubenda.com https://cs.iubenda.com https://onemore-delta.vercel.app;",

              // esplicita script-src-elem per evitare fallback ambiguo
              "script-src-elem 'self' 'unsafe-inline' https://cdn.iubenda.com https://cs.iubenda.com https://onemore-delta.vercel.app;",

              // stile inline (Next fonts, Iubenda core-it.js)
              "style-src 'self' 'unsafe-inline';",

              // font base64
              "font-src 'self' data:;",

              // connessioni per salvataggio consenso (IndexedDB)
              "connect-src 'self' https://idb.iubenda.com;",

              // immagini
              "img-src 'self' data: https://cdn.iubenda.com;",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
