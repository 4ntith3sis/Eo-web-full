import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      // Legacy Phase 2 routes → canonical /layanan architecture.
      {
        source: "/virtual-office",
        destination: "/layanan/virtual-office",
        permanent: true,
      },
      {
        source: "/virtual-office/:slug",
        destination: "/layanan/virtual-office/:slug",
        permanent: true,
      },
      {
        source: "/coworking-space/:slug",
        destination: "/layanan/coworking-space/:slug",
        permanent: true,
      },
      {
        source: "/meeting-room/:slug",
        destination: "/layanan/meeting-room/:slug",
        permanent: true,
      },
    ];
  },
};

export default withPayload(nextConfig);
