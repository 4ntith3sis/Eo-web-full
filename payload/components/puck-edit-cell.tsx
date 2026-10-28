"use client";

import { useRouter } from "next/navigation";

export function PuckEditCell({ rowData }: { rowData?: { id?: string | number } }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="rounded-lg border border-slate-400 px-3 py-1.5 text-sm font-semibold"
      onClick={() => rowData?.id && router.push(`/admin/puck-builder/edit?id=${rowData.id}`)}
      disabled={!rowData?.id}
      >
       Edit Visual dengan Puck
    </button>
  );
}
