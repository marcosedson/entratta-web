import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.entratta.com.br" }],
        destination: "https://entratta.com.br/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          { type: "host", value: "entratta.com.br" },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: "https://entratta.com.br/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
