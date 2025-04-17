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
};

export default nextConfig;
