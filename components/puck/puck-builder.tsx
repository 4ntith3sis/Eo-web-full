"use client";

import { Puck, type Config, type Data } from "@measured/puck";
export type { Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Hero } from "@/components/sections/hero";
import { StatsBand } from "@/components/sections/stats-band";
import { FacilitiesGrid } from "@/components/sections/facilities-grid";
import { PromoSection } from "@/components/sections/promo-section";
import { ServicesOverview } from "@/components/sections/services-overview";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { Testimonials } from "@/components/sections/testimonials";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { whatsappFor } from "@/lib/whatsapp";
import type { ComparisonRow, Facility, Promotion, Service, Testimonial } from "@/types";

type PreviewData = { facilities: Facility[]; services: Service[]; promotions: Promotion[]; testimonials: Testimonial[]; comparisonRows: ComparisonRow[]; site: Record<string, unknown> };

export const defaultHomepageData: Data = {
  content: [
    { type: "Hero", props: { title: "Solusi Ruang Kerja Profesional untuk Bisnis Anda", description: "Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional." } },
    { type: "StatsBand", props: {} },
    { type: "FacilitiesGrid", props: { title: "Mengapa Pilih EasyOffice?", description: "Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda." } },
    { type: "PromoSection", props: {} },
    { type: "ServicesOverview", props: {} },
    { type: "HowItWorks", props: {} },
    { type: "ComparisonTable", props: { title: "Perbandingan dengan Office Lain", description: "Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice." } },
    { type: "Testimonials", props: {} },
    { type: "WhatsappCta", props: {} },
  ],
  root: {},
};

const legacySectionTypes: Record<string, string> = {
  stats: "StatsBand",
  facilities: "FacilitiesGrid",
  promotions: "PromoSection",
  services: "ServicesOverview",
  howItWorks: "HowItWorks",
  comparison: "ComparisonTable",
  testimonials: "Testimonials",
  whatsapp: "WhatsappCta",
};

export function normalizeHomepageLayout(data: Data | null | undefined): Data {
  if (!data) return { content: [], root: {} };
  if (!Array.isArray(data.content) || data.content.length === 0) return { ...data, content: data.content ?? [], root: data.root ?? {} };
  const content = data.content.flatMap((item) => {
    if (item.type !== "HomepageSection") return [item];
    const props = (item.props ?? {}) as Record<string, unknown>;
    const type = legacySectionTypes[String(props.section ?? "")];
    if (!type) return [];
    const rest = Object.fromEntries(Object.entries(props).filter(([key]) => key !== "section"));
    return [{ ...item, type, props: rest }];
  });
  return { ...data, content };
}

function makeConfig(preview: PreviewData): Config {
  const site = preview.site;
  const number = typeof site.whatsappNumber === "string" ? site.whatsappNumber : undefined;
  return {
    root: { render: ({ children }: { children: ReactNode }) => <main className="puck-canvas-shell min-h-screen bg-white">{children}</main> },
    components: {
      Hero: { fields: { title: { type: "text" }, description: { type: "textarea" } }, defaultProps: defaultHomepageData.content[0].props, render: ({ title, description }) => <Hero eyebrow="EasyOffice" title={title} description={description} primaryCta={{ label: "Hubungi Kami", href: whatsappFor("layanan", undefined, number), external: true }} secondaryCta={{ label: "Lihat Layanan", href: "/layanan/virtual-office" }} /> },
      StatsBand: { fields: {}, defaultProps: {}, render: () => <StatsBand items={Array.isArray(site.statsBanner) ? site.statsBanner as Array<{ value: string; label: string }> : undefined} /> },
      FacilitiesGrid: { fields: { title: { type: "text" }, description: { type: "textarea" } }, defaultProps: { title: "Mengapa Pilih EasyOffice?", description: "Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda." }, render: ({ title, description }) => <FacilitiesGrid items={preview.facilities.slice(0, 6)} title={title} description={description} /> },
      PromoSection: { fields: {}, defaultProps: {}, render: () => <PromoSection promotions={preview.promotions} services={preview.services} /> },
      ServicesOverview: { fields: {}, defaultProps: {}, render: () => <ServicesOverview tone="gray" items={preview.services} /> },
      HowItWorks: { fields: {}, defaultProps: {}, render: () => <HowItWorks items={Array.isArray(site.howItWorks) ? site.howItWorks as Array<{ title: string; description: string }> : undefined} /> },
      ComparisonTable: { fields: { title: { type: "text" }, description: { type: "textarea" } }, defaultProps: { title: "Perbandingan dengan Office Lain", description: "Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice." }, render: ({ title, description }) => <ComparisonTable rows={preview.comparisonRows} title={title} description={description} /> },
      Testimonials: { fields: {}, defaultProps: {}, render: () => <Testimonials items={preview.testimonials} /> },
      WhatsappCta: { fields: {}, defaultProps: {}, render: () => <WhatsappCta whatsappNumber={number} /> },
    },
  };
}

export type PuckBuilderInitialData = { preview: PreviewData; data: Data };

export function PuckBuilderClient({ initial }: { initial: PuckBuilderInitialData }) {
  const [preview] = useState(initial.preview);
  const [data, setData] = useState<Data>(() => initial.data.content?.length ? normalizeHomepageLayout(initial.data) : { content: [], root: {} });
  const config = useMemo(() => makeConfig(preview), [preview]);
  const current = initial.data as Data & { id?: string | number; name?: string; route?: string };
  return <div className="puck-editor-frame"><Puck config={config} data={data} onPublish={async (nextData) => { const layout = normalizeHomepageLayout(nextData); if (!current.id || !current.name || !current.route) return; const response = await fetch(`/api/homepage-layout/${current.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: current.name, route: current.route, layout, status: "published", isActive: true }) }); if (!response.ok) throw new Error("Halaman gagal dipublish"); setData(layout); }} /></div>;
}
