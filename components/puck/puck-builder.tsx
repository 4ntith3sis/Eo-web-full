"use client";

import { Puck, type Config, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FacilitiesGrid } from "@/components/sections/facilities-grid";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PromoSection } from "@/components/sections/promo-section";
import { ServicesOverview } from "@/components/sections/services-overview";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { Testimonials } from "@/components/sections/testimonials";
import { StatsBand } from "@/components/sections/stats-band";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { Hero } from "@/components/sections/hero";
import { whatsappFor } from "@/lib/whatsapp";
import type { ComparisonRow, Facility, Promotion, Service, Testimonial } from "@/types";

let previewData: { facilities: Facility[]; services: Service[]; promotions: Promotion[]; testimonials: Testimonial[]; comparisonRows: ComparisonRow[]; site: Record<string, unknown> } = { facilities: [], services: [], promotions: [], testimonials: [], comparisonRows: [], site: {} };

function createConfig(previewData: typeof defaultPreviewData): Config {
return {
  components: {
    Hero: { fields: { title: { type: "text" }, description: { type: "textarea" } }, defaultProps: { title: "Solusi Ruang Kerja Profesional untuk Bisnis Anda", description: "Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional." }, render: ({ title, description }) => <Hero eyebrow="EasyOffice" title={title} description={description} primaryCta={{ label: "Hubungi Kami", href: whatsappFor("layanan", undefined, previewData.site.whatsappNumber as string | undefined), external: true }} secondaryCta={{ label: "Lihat Layanan", href: "/layanan/virtual-office" }} /> },
    Section: { fields: { title: { type: "text" }, text: { type: "textarea" } }, defaultProps: { title: "Section", text: "Konten section homepage." }, render: ({ title, text }) => <section className="bg-white px-8 py-12 text-center"><span className="rounded-full border border-[#111a56]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#111a56]">Section</span><h2 className="mt-4 text-3xl font-bold text-[#111a56]">{title}</h2><p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">{text}</p></section> },
    CardContainer: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        cards: { type: "array", arrayFields: {
          title: { type: "text" },
          description: { type: "textarea" },
          image: { type: "text" },
        } },
      },
      defaultProps: { title: "Card Container", description: "Kumpulan card homepage.", cards: [{ title: "Card pertama", description: "Deskripsi card.", image: "" }] },
      render: (props) => { const { title = "Card Container", description = "", cards = [] } = props as { title?: string; description?: string; cards?: Array<{ title: string; description: string; image?: string }> }; return <section><h2>{title}</h2><p>{description}</p><div>{cards.map((card) => <article key={card.title}><h3>{card.title}</h3><p>{card.description}</p></article>)}</div></section>; },
    },
    HomepageSection: {
      fields: {
        section: { type: "select", options: [
          { label: "Hero", value: "hero" }, { label: "Stats", value: "stats" }, { label: "Fasilitas", value: "facilities" },
          { label: "Promo", value: "promotions" }, { label: "Layanan", value: "services" }, { label: "How It Works", value: "howItWorks" },
          { label: "Perbandingan", value: "comparison" }, { label: "Testimoni", value: "testimonials" }, { label: "WhatsApp CTA", value: "whatsapp" },
        ] },
      },
      defaultProps: { section: "hero" },
      render: (props) => { const section = String((props as { section?: string }).section ?? ""); if (section === "stats") return <StatsBand items={previewData.site.statsBanner as Array<{ value: string; label: string }> | undefined} />; if (section === "facilities") return <FacilitiesGrid items={previewData.facilities.slice(0, 6)} />; if (section === "promotions") return <PromoSection promotions={previewData.promotions} services={previewData.services} />; if (section === "services") return <ServicesOverview tone="gray" items={previewData.services} />; if (section === "howItWorks") return <HowItWorks items={previewData.site.howItWorks as Array<{ title: string; description: string }> | undefined} />; if (section === "comparison") return <ComparisonTable rows={previewData.comparisonRows} />; if (section === "testimonials") return <Testimonials items={previewData.testimonials} />; if (section === "whatsapp") return <WhatsappCta />; return <div className="p-8 text-slate-500">Section homepage</div>; },
    },
  },
};
}

const defaultPreviewData = { facilities: [], services: [], promotions: [], testimonials: [], comparisonRows: [], site: {} } as { facilities: Facility[]; services: Service[]; promotions: Promotion[]; testimonials: Testimonial[]; comparisonRows: ComparisonRow[]; site: Record<string, unknown> };

export const defaultHomepageData: Data = {
  content: [
    { type: "Hero", props: { title: "Solusi Ruang Kerja Profesional untuk Bisnis Anda", description: "Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional." } },
    { type: "HomepageSection", props: { section: "stats" } },
    { type: "HomepageSection", props: { section: "facilities" } },
    { type: "HomepageSection", props: { section: "promotions" } },
    { type: "HomepageSection", props: { section: "services" } },
    { type: "HomepageSection", props: { section: "howItWorks" } },
    { type: "HomepageSection", props: { section: "comparison" } },
    { type: "HomepageSection", props: { section: "testimonials" } },
    { type: "HomepageSection", props: { section: "whatsapp" } },
  ],
  root: {},
};

export function PuckBuilder() {
  const [data, setData] = useState<Data>(defaultHomepageData);
  const [config, setConfig] = useState<Config>(() => createConfig(defaultPreviewData));
  useEffect(() => {
    Promise.all([
      fetch("/api/homepage-facilities?limit=100&where[isActive][equals]=true").then((r) => r.json()),
      fetch("/api/services?limit=100&where[isActive][equals]=true&depth=1").then((r) => r.json()),
      fetch("/api/promotions?limit=100&where[isActive][equals]=true&depth=1").then((r) => r.json()),
      fetch("/api/testimonials?limit=100&where[isActive][equals]=true").then((r) => r.json()),
      fetch("/api/comparison-rows?limit=100&where[isActive][equals]=true&depth=1").then((r) => r.json()),
      fetch("/api/globals/site-settings?depth=1").then((r) => r.json()),
    ]).then(([facilities, services, promotions, testimonials, comparisonRows, site]) => {
      const nextPreviewData = { facilities: facilities.docs ?? [], services: services.docs ?? [], promotions: promotions.docs ?? [], testimonials: testimonials.docs ?? [], comparisonRows: comparisonRows.docs ?? [], site } as typeof defaultPreviewData;
      previewData = nextPreviewData;
      setConfig(createConfig(nextPreviewData));
      setData((current) => ({ ...current }));
    }).catch(() => undefined);
    const id = new URLSearchParams(window.location.search).get("id");
    fetch(id ? `/api/homepage-layout/${id}` : "/api/homepage-layout?limit=1&where[isActive][equals]=true")
      .then((response) => response.json())
      .then((result) => {
        const layout = result.layout ?? result.docs?.[0]?.layout;
        if (layout) setData(layout);
      })
      .catch(() => undefined);
  }, []);
  return <Puck config={config} data={data} onPublish={async (nextData) => {
    const existing = await fetch("/api/homepage-layout?limit=1").then((response) => response.json());
    const body = { name: "Homepage", layout: nextData, isActive: true };
    await fetch(existing.docs?.[0] ? `/api/homepage-layout/${existing.docs[0].id}` : "/api/homepage-layout", {
      method: existing.docs?.[0] ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, status: "draft" }),
    });
    setData(nextData);
  }} />;
}
