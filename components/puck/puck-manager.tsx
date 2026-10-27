"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LayoutDoc = { id: string | number; name: string; route?: string; status: "draft" | "published"; updatedAt?: string; isActive?: boolean };

export function PuckManager() {
  const router = useRouter();
  const [docs, setDocs] = useState<LayoutDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [route, setRoute] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const load = () => fetch("/api/homepage-layout?limit=100&sort=-updatedAt").then((r) => r.json()).then((d) => setDocs(Array.isArray(d.docs) ? d.docs : [])).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);
  const publish = async (doc: LayoutDoc) => {
    if (!doc) return;
    await fetch(`/api/homepage-layout/${doc.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "published", isActive: true }) });
    await load();
  };
  const createPage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const normalizedRoute = route.trim().startsWith("/") ? route.trim() : `/${route.trim()}`;
    if (!name.trim() || !normalizedRoute || normalizedRoute === "/") {
      setError("Isi nama halaman dan route selain /. Contoh: /tentang-kami");
      return;
    }
    setCreating(true);
    const response = await fetch("/api/homepage-layout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), route: normalizedRoute, layout: { content: [], root: {} }, status: "draft", isActive: true }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.doc?.id) {
      setError(result.errors?.[0]?.message ?? "Halaman gagal dibuat. Pastikan route belum digunakan.");
      setCreating(false);
      return;
    }
    router.push(`/admin/puck-builder/edit?id=${result.doc.id}`);
  };
  return <main className="min-h-screen bg-slate-50 p-8"><div className="mx-auto max-w-5xl"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Puck Builder</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Halaman</h1><p className="mt-2 text-slate-600">Buat halaman baru, tentukan routing, lalu susun tampilannya dengan Puck.</p></div><button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Tambah Halaman</button></div>{showForm && <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5"><h2 className="text-xl font-bold text-slate-900">Tambah halaman baru</h2><p className="mt-1 text-sm text-slate-500">Isi identitas halaman terlebih dahulu. Setelah disimpan, Anda akan masuk ke Puck Builder.</p></div><form onSubmit={createPage} className="grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Nama halaman<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Tentang Kami" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-slate-900" /></label><label className="text-sm font-semibold text-slate-700">Routing halaman<input required value={route} onChange={(event) => setRoute(event.target.value)} placeholder="/tentang-kami" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-slate-900" /></label><div className="md:col-span-2 flex items-center gap-3">{error && <p className="mr-auto text-sm text-red-600">{error}</p>}<button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Batal</button><button type="submit" disabled={creating} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{creating ? "Menyimpan..." : "Simpan & Buka Editor"}</button></div></form></div>}<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-6 border-b border-slate-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"><span>Halaman</span><span>Routing</span><span>Status</span><span>Aksi</span></div>{loading ? <p className="p-6">Memuat...</p> : docs.length ? docs.map((doc) => <div key={doc.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-6 border-b border-slate-100 px-6 py-6 last:border-b-0"><div><h2 className="font-semibold text-slate-900">{doc.name}</h2></div><span className="text-sm text-slate-500">{doc.route ?? "-"}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${doc.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{doc.status === "published" ? "Published" : "Draft"}</span><div className="flex items-center gap-2"><Link href={`/admin/puck-builder/edit?id=${doc.id}`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Edit</Link><button onClick={() => publish(doc)} disabled={doc.status === "published"} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Publish</button></div></div>) : <p className="p-6 text-slate-600">Belum ada halaman. Klik “Tambah Halaman” untuk memulai.</p>}</div></div></main>;
}
