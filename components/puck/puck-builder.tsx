"use client";

import { DropZone, Puck, type Config, type Data } from "@measured/puck";
export type { Data } from "@measured/puck";
import "@measured/puck/puck.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { normalizeMediaUrl } from "@/lib/media";
import type { ReactNode } from "react";
export type PuckBuilderInitialData = { data: Data };

class PuckEditorErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? <div className="p-8 text-center text-red-700">Komponen editor gagal dirender. Silakan muat ulang halaman.</div> : this.props.children; }
}

function validateLayout(data: Data): string | null {
  const content = Array.isArray(data.content) ? data.content : [];
  const walk = (items: unknown[], depth = 0): string | null => {
    if (depth > 6) return "Struktur halaman terlalu dalam.";
    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      const node = item as { type?: string; props?: Record<string, unknown> };
      const props = node.props ?? {};
      if (node.type === "Heading" && !String(props.children ?? "").trim()) return "Heading tidak boleh kosong.";
      if (node.type === "Button" && (!String(props.label ?? "").trim() || /^javascript:/i.test(String(props.href ?? "")))) return "Button harus memiliki label dan link yang aman.";
      if (node.type === "Image" && !String(props.alt ?? "").trim()) return "Setiap gambar wajib memiliki alt text.";
      for (const value of Object.values(props)) if (Array.isArray(value)) { const error = walk(value, depth + 1); if (error) return error; }
    }
    return null;
  };
  return walk(content);
}

function MediaPickerField({ value, onChange }: { value: unknown; onChange: (value: string) => void }) {
  const [media, setMedia] = useState<Array<{ url?: string; alt?: string; filename?: string }>>([]);
  const [open, setOpen] = useState(false);
  const load = async () => {
    const response = await fetch("/api/media?limit=50&sort=-createdAt");
     if (response.ok) { const result = await response.json() as { docs?: Array<{ url?: string; alt?: string; filename?: string }> }; setMedia((result.docs ?? []).map((item) => ({ ...item, url: item.filename ? normalizeMediaUrl(`/api/media/file/${item.filename}`) : item.url }))); }
    setOpen(true);
  };
  const upload = async (file: File) => { const form = new FormData(); form.append("file", file); form.append("alt", file.name); const response = await fetch("/api/media", { method: "POST", body: form }); if (response.ok) { const result = await response.json() as { doc?: { url?: string } }; if (result.doc?.url) onChange(result.doc.url); await load(); } };
  return <div><input type="text" value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} placeholder="/media/gambar.webp" /><div className="mt-2 flex gap-2"><button type="button" onClick={() => void load()} className="rounded border px-2 py-1 text-xs">Pilih dari Media CMS</button><label className="cursor-pointer rounded border px-2 py-1 text-xs">Upload<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></label></div>{open ? <div className="mt-2 grid max-h-48 grid-cols-2 gap-2 overflow-auto">{media.map((item) => <button type="button" key={item.url ?? item.filename} onClick={() => { onChange(item.url ?? ""); setOpen(false); }} className="rounded border p-1 text-left"><Image src={item.url ?? "/media/placeholder.webp"} alt={item.alt ?? ""} width={240} height={96} unoptimized className="h-16 w-full object-cover" /><span className="block truncate text-xs">{item.filename ?? item.url}</span></button>)}</div> : null}</div>;
}

const starterComponents: Config["components"] = {
  Heading: {
    fields: { children: { type: "text" }, level: { type: "select", options: [{ label: "H1", value: "h1" }, { label: "H2", value: "h2" }, { label: "H3", value: "h3" }] } },
    defaultProps: { children: "Judul halaman", level: "h1" },
    render: ({ children, level }: Record<string, unknown>) => {
      const Tag = level === "h2" || level === "h3" ? level : "h1";
      return <Tag className="mb-4 text-4xl font-bold text-slate-900">{String(children ?? "")}</Tag>;
    },
  },
  Text: {
    fields: { children: { type: "textarea" } },
    defaultProps: { children: "Tulis isi konten halaman di sini." },
    render: ({ children }: Record<string, unknown>) => <p className="mb-4 text-base leading-7 text-slate-700">{String(children ?? "")}</p>,
  },
  Button: {
    fields: { label: { type: "text" }, href: { type: "text" }, variant: { type: "select", options: [{ label: "Primary", value: "primary" }, { label: "Secondary", value: "secondary" }] }, newTab: { type: "radio", options: [{ label: "Tab sama", value: false }, { label: "Tab baru", value: true }] } },
    defaultProps: { label: "Pelajari lebih lanjut", href: "#", variant: "primary" },
    render: ({ label, href, variant, newTab }: Record<string, unknown>) => <a href={String(href ?? "#")} target={newTab ? "_blank" : undefined} rel={newTab ? "noreferrer" : undefined} className={`mb-4 inline-flex rounded-lg px-5 py-3 font-semibold ${variant === "secondary" ? "border border-slate-300 text-slate-800" : "bg-blue-600 text-white"}`}>{String(label ?? "Button")}</a>,
  },
  Image: {
    fields: { src: { type: "custom", label: "Media CMS", render: MediaPickerField }, alt: { type: "text" } },
    defaultProps: { src: "/media/placeholder.webp", alt: "Gambar halaman" },
     render: ({ src, alt }: Record<string, unknown>) => <Image src={normalizeMediaUrl(String(src ?? "/media/placeholder.webp"))} alt={String(alt ?? "")} width={1200} height={675} unoptimized className="mb-6 h-auto w-full rounded-xl object-cover" />,
  },
  Section: {
    fields: { title: { type: "text" }, background: { type: "text" }, padding: { type: "number" }, radius: { type: "number" }, content: { type: "slot" } },
    defaultProps: { title: "Section" },
    render: ({ title, background, padding, radius }: Record<string, unknown>) => <section className="mb-6" style={{ background: String(background ?? "#f8fafc"), padding: `${Number(padding ?? 32)}px`, borderRadius: `${Number(radius ?? 12)}px` }}><h2 className="mb-3 text-2xl font-bold text-slate-900">{String(title ?? "Section")}</h2><DropZone zone="content" minEmptyHeight={120} className="puck-dropzone" /> </section>,
  },
  Columns: {
    fields: { columns: { type: "select", options: [{ label: "2 kolom", value: 2 }, { label: "3 kolom", value: 3 }] }, gap: { type: "number" }, left: { type: "slot" }, middle: { type: "slot" }, right: { type: "slot" } },
    defaultProps: { columns: 2 },
    render: ({ columns, gap }: Record<string, unknown>) => <div className={`mb-6 grid ${Number(columns) === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`} style={{ gap: `${Number(gap ?? 24)}px` }}><div><DropZone zone="left" minEmptyHeight={120} className="puck-dropzone" /></div><div><DropZone zone="middle" minEmptyHeight={120} className="puck-dropzone" /></div>{Number(columns) === 3 ? <div><DropZone zone="right" minEmptyHeight={120} className="puck-dropzone" /></div> : null}</div>,
  },
  Spacer: {
    fields: { height: { type: "number" } },
    defaultProps: { height: 32 },
    render: ({ height }: Record<string, unknown>) => <div style={{ height: `${Number(height ?? 32)}px` }} aria-hidden="true" />,
  },
};

export function PuckBuilderClient({ initial }: { initial: PuckBuilderInitialData }) {
  const [data, setData] = useState<Data>(() => initial.data);
  const [dirty, setDirty] = useState(false);
  const [role, setRole] = useState<"admin" | "editor" | "unknown">("unknown");
  const [saving, setSaving] = useState(false);
  useEffect(() => { void fetch("/api/users/me").then((response) => response.ok ? response.json() : null).then((user: { role?: string } | null) => setRole(user?.role === "admin" ? "admin" : user?.role === "editor" ? "editor" : "unknown")); }, []);
  const config = useMemo<Config>(() => ({
    root: {
      fields: { background: { type: "text" }, maxWidth: { type: "number" } },
      defaultProps: { background: "#ffffff", maxWidth: 1200 },
      render: ({ children, background, maxWidth }: { children?: ReactNode; background?: string; maxWidth?: number }) => <main style={{ minHeight: "100vh", width: "100%", backgroundColor: background || "#ffffff", color: "#171717", padding: "40px 32px" }}><div style={{ maxWidth: `${Number(maxWidth ?? 1200)}px`, margin: "0 auto" }}>{children}</div></main>,
    },
    components: starterComponents,
  }), []);
  const current = initial.data as Data & { id?: string | number; name?: string; route?: string; status?: "draft" | "published"; seoTitle?: string; seoDescription?: string; previewToken?: string };
  const save = useCallback(async (nextData: Data, status: "draft" | "published") => { if (!current.id || !current.name || !current.route || saving) return; const validationError = status === "published" ? validateLayout(nextData) : null; if (validationError) return; setSaving(true); try { const response = await fetch(`/api/page-layout/${current.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: current.name, route: current.route, seoTitle: current.seoTitle ?? current.name, seoDescription: current.seoDescription ?? `Informasi ${current.name} EasyOffice.`, layout: nextData, status, isActive: true }) }); if (!response.ok) throw new Error("save failed"); setData(nextData); setDirty(false); if (typeof window !== "undefined") window.localStorage.removeItem(`puck-draft-${current.id}`); } catch { if (typeof window !== "undefined") window.localStorage.setItem(`puck-draft-${current.id}`, JSON.stringify(nextData)); } finally { setSaving(false); } }, [current.id, current.name, current.route, current.seoTitle, current.seoDescription, saving]);
  useEffect(() => { if (!dirty || current.status === "published") return; const timer = window.setTimeout(() => void save(data, "draft"), 8000); return () => window.clearTimeout(timer); }, [data, dirty, save, current.status]);
  useEffect(() => { const handler = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } }; window.addEventListener("beforeunload", handler); return () => window.removeEventListener("beforeunload", handler); }, [dirty]);
  useEffect(() => { const handler = (event: KeyboardEvent) => { if (!(event.metaKey || event.ctrlKey)) return; if (event.key.toLowerCase() === "s") { event.preventDefault(); void save(data, "draft"); } if (event.key.toLowerCase() === "p" && event.shiftKey && role === "admin") { event.preventDefault(); if (window.confirm("Publish halaman ini sekarang?")) void save(data, "published"); } }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, [data, role, save]);
  return <div className="puck-editor-frame"><PuckEditorErrorBoundary><Puck config={config} data={data} onChange={(nextData) => { setData(nextData); setDirty(true); }} onPublish={(nextData) => { if (role === "admin" && window.confirm("Publish halaman ini sekarang?")) void save(nextData, "published"); }} viewports={[{ width: 1440, height: "auto", label: "Desktop", icon: "Monitor" }, { width: 768, height: "auto", label: "Tablet", icon: "Tablet" }, { width: 390, height: "auto", label: "Mobile", icon: "Smartphone" }]} /></PuckEditorErrorBoundary></div>;
}
