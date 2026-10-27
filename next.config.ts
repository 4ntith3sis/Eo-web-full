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
      // Legacy office-service slugs → canonical office-service slugs.
      {
        source: "/layanan/virtual-office/easyoffice-bandung",
        destination: "/layanan/virtual-office/bandung",
        permanent: true,
      },
      {
        source: "/layanan/virtual-office/bandung-bandung",
        destination: "/layanan/virtual-office/bandung",
        permanent: true,
      },
      {
        source: "/layanan/virtual-office/bekasi-bekasi",
        destination: "/layanan/virtual-office/bekasi",
        permanent: true,
      },
      {
        source: "/layanan/virtual-office/jakarta-jakarta",
        destination: "/layanan/virtual-office/jakarta",
        permanent: true,
      },
      {
        source: "/layanan/coworking-space/bandung-bandung",
        destination: "/layanan/coworking-space/bandung",
        permanent: true,
      },
      {
        source: "/layanan/coworking-space/bekasi-bekasi",
        destination: "/layanan/coworking-space/bekasi",
        permanent: true,
      },
      {
        source: "/layanan/coworking-space/jakarta-jakarta",
        destination: "/layanan/coworking-space/jakarta",
        permanent: true,
      },
      {
        source: "/layanan/meeting-room/bandung-bandung",
        destination: "/layanan/meeting-room/bandung",
        permanent: true,
      },
      {
        source: "/layanan/meeting-room/bekasi-bekasi",
        destination: "/layanan/meeting-room/bekasi",
        permanent: true,
      },
      {
        source: "/layanan/meeting-room/jakarta-jakarta",
        destination: "/layanan/meeting-room/jakarta",
        permanent: true,
      },
    ];
  },
};

export default withPayload(nextConfig);
