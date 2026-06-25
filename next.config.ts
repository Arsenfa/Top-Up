import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  experimental: {
    cacheLife: {
      homepage: {
        stale: 60, // 1 menit sebelum dianggap stale
        revalidate: 300, // revalidate setiap 5 menit
        expire: 3600, // expire setelah 1 jam
      },
    },
  },
};

export default nextConfig;
