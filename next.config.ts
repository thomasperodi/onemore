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
            // PERMETTE i due <script> (inline + CDN Iubenda)
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' https://cdn.iubenda.com;",
              // se usi immagini/font esterni aggiungili qui
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
