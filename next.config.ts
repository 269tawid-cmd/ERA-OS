import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/manifest.json',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
      ],
    },
    {
      source: '/icons/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
      ],
    },
    {
      source: '/favicon.svg',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
      ],
    },
    {
      source: '/sw.js',
      headers: [
        { key: 'Cache-Control', value: 'no-cache' },
      ],
    },
  ],
};

export default nextConfig;