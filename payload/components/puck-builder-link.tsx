"use client";

import { useRouter } from "next/navigation";

export function PuckBuilderLink() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="nav__link"
      onClick={() => router.push("/admin/collections/homepage-layout")}
    >
      Puck Builder
    </button>
  );
}
