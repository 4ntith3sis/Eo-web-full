import { ComparisonTable } from "@/components/sections/comparison-table";
import { FacilitiesGrid } from "@/components/sections/facilities-grid";
import type { Facility } from "@/types";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PromoSection } from "@/components/sections/promo-section";
import { ServicesOverview } from "@/components/sections/services-overview";
import { StatsBand } from "@/components/sections/stats-band";
import { Testimonials } from "@/components/sections/testimonials";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { whatsappFor } from "@/lib/whatsapp";
import Image from "next/image";
import type { ComparisonRow, Promotion, Service, Testimonial } from "@/types";

type Props = { layout: { content?: Array<{ type?: string; props?: Record<string, unknown> }> }; services: Service[]; promotions: Promotion[]; testimonials: Testimonial[]; comparisonRows: ComparisonRow[]; facilities?: Facility[]; site?: Record<string, unknown> };

export function HomepageRenderer({ layout, services, promotions, testimonials, comparisonRows, facilities = [], site = {} }: Props) {
  const renderContent = (content: Array<{ type?: string; props?: Record<string, unknown> }> = []) => content.map((item, index) => {
    const props = item.props ?? {};
    switch (item.type) {
      case "Heading": { const Tag = props.level === "h2" || props.level === "h3" ? props.level : "h1"; return <Tag key={index} className="mb-4 text-4xl font-bold text-slate-900">{String(props.children ?? "")}</Tag>; }
      case "Text": return <p key={index} className="mb-4 text-base leading-7 text-slate-700">{String(props.children ?? "")}</p>;
      case "Button": return <a key={index} href={String(props.href ?? "#")} className={`mb-4 inline-flex rounded-lg px-5 py-3 font-semibold ${props.variant === "secondary" ? "border border-slate-300 text-slate-800" : "bg-blue-600 text-white"}`}>{String(props.label ?? "Button")}</a>;
      case "Image": return <Image key={index} src={String(props.src ?? "")} alt={String(props.alt ?? "")} width={1200} height={675} className="mb-6 h-auto w-full rounded-xl object-cover" unoptimized />;
      case "Section": return <section key={index} className="mb-6 rounded-xl bg-slate-50 p-8"><h2 className="mb-3 text-2xl font-bold text-slate-900">{String(props.title ?? "Section")}</h2>{renderContent(Array.isArray(props.content) ? props.content as Array<{ type?: string; props?: Record<string, unknown> }> : [])}</section>;
      case "Columns": { const columns = Number(props.columns ?? 2); const renderSlot = (name: string) => renderContent(Array.isArray(props[name]) ? props[name] as Array<{ type?: string; props?: Record<string, unknown> }> : []); return <div key={index} className={`mb-6 grid gap-6 ${columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}><div>{renderSlot("left")}</div><div>{renderSlot("middle")}</div>{columns === 3 ? <div>{renderSlot("right")}</div> : null}</div>; }
      case "Spacer": return <div key={index} style={{ height: `${Number(props.height ?? 32)}px` }} aria-hidden="true" />;
       case "Hero": return <Hero key={index} eyebrow="EasyOffice" title={String(props.title ?? "Solusi Ruang Kerja Profesional untuk Bisnis Anda")} description={String(props.description ?? "")} primaryCta={{ label: "Hubungi Kami", href: whatsappFor("layanan", undefined, typeof site.whatsappNumber === "string" ? site.whatsappNumber : undefined), external: true }} secondaryCta={{ label: "Lihat Layanan", href: "/layanan/virtual-office" }} />;
      case "HomepageSection":
        switch (props.section) {
           case "stats": return <StatsBand key={index} items={Array.isArray(site.statsBanner) ? site.statsBanner as Array<{ value: string; label: string }> : undefined} />;
           case "facilities": return <FacilitiesGrid key={index} items={facilities.slice(0, 6)} />;
            case "promotions": return <PromoSection key={index} promotions={promotions} services={services} />;
          case "services": return <ServicesOverview key={index} tone="gray" items={services} />;
           case "howItWorks": return <HowItWorks key={index} items={Array.isArray(site.howItWorks) ? site.howItWorks as Array<{ title: string; description: string }> : undefined} />;
          case "comparison": return <ComparisonTable key={index} rows={comparisonRows} />;
          case "testimonials": return <Testimonials key={index} items={testimonials} />;
           case "whatsapp": return <WhatsappCta key={index} whatsappNumber={typeof site.whatsappNumber === "string" ? site.whatsappNumber : undefined} />;
          default: return null;
        }
      case "CardContainer": return <section key={index} className="bg-white py-10"><div className="mx-auto grid max-w-6xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">{Array.isArray(props.cards) ? props.cards.map((card, cardIndex) => <article key={cardIndex} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft"><h3 className="font-display text-lg font-bold text-navy">{String((card as Record<string, unknown>).title ?? "Card")}</h3><p className="mt-2 text-sm leading-relaxed text-neutral-600">{String((card as Record<string, unknown>).description ?? "")}</p></article>) : null}</div></section>;
      default: return null;
    }
  });
  return <>{renderContent(layout.content)}</>;
}
