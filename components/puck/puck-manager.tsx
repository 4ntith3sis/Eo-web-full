"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LayoutDoc = { id: string | number; name: string; status: "draft" | "published"; updatedAt?: string; isActive?: boolean };

export function PuckManager() {
  const [docs, setDocs] = useState<LayoutDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => fetch("/api/homepage-layout?limit=100&sort=-updatedAt").then((r) => r.json()).then((d) => setDocs(Array.isArray(d.docs) ? d.docs : [])).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);
  const publish = async (doc: LayoutDoc) => {
    if (!doc) return;
    await fetch(`/api/homepage-layout/${doc.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "published", isActive: true }) });
    await load();
  };
  return <main className="min-h-screen bg-slate-50 p-8"><div className="mx-auto max-w-5xl"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Puck Builder</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Halaman</h1><p className="mt-2 text-slate-600">Pilih halaman yang ingin diedit dengan Puck.</p></div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="grid grid-cols-[1fr_auto_auto] items-center gap-6 border-b border-slate-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"><span>Halaman</span><span>Status</span><span>Aksi</span></div>{loading ? <p className="p-6">Memuat...</p> : docs.length ? docs.map((doc) => <div key={doc.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-6 border-b border-slate-100 px-6 py-6 last:border-b-0"><div><h2 className="font-semibold text-slate-900">{doc.name}</h2><p className="mt-1 text-sm text-slate-500">Layout visual halaman {doc.name.toLowerCase()} EasyOffice.</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${doc.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{doc.status === "published" ? "Published" : "Draft"}</span><div className="flex items-center gap-2"><Link href={`/admin/puck-builder/edit?id=${doc.id}`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Edit</Link><button onClick={() => publish(doc)} disabled={doc.status === "published"} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Publish</button></div></div>) : <p className="p-6 text-slate-600">Belum ada halaman Puck di CMS.</p>}</div></div></main>;
}
