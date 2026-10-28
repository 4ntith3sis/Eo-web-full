"use client";

import { useRouter } from "next/navigation";

export function PuckBuilderLink() {
  const router = useRouter();
  return (
    <button
      type="button"
      style={{ background: "transparent", border: 0, borderRadius: 0, boxShadow: "none", padding: 0 }}
      onClick={() => router.push("/admin/collections/page-layout")}
    >
       Halaman
    </button>
  );
}
