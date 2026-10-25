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
import type { ComparisonRow, Promotion, Service, Testimonial } from "@/types";

type Props = { layout: { content?: Array<{ type?: string; props?: Record<string, unknown> }> }; services: Service[]; promotions: Promotion[]; testimonials: Testimonial[]; comparisonRows: ComparisonRow[]; facilities?: Facility[]; site?: Record<string, unknown> };

export function HomepageRenderer({ layout, services, promotions, testimonials, comparisonRows, facilities = [], site = {} }: Props) {
  return <>{layout.content?.map((item, index) => {
    const props = item.props ?? {};
    switch (item.type) {
       case "Hero": return <Hero key={index} eyebrow="EasyOffice" title={String(props.title ?? "Solusi Ruang Kerja Profesional untuk Bisnis Anda")} description={String(props.description ?? "")} primaryCta={{ label: "Hubungi Kami", href: whatsappFor("layanan", undefined, typeof site.whatsappNumber === "string" ? site.whatsappNumber : undefined), external: true }} secondaryCta={{ label: "Lihat Layanan", href: "/layanan/virtual-office" }} />;
      case "HomepageSection":
        switch (props.section) {
           case "stats": return <StatsBand key={index} items={Array.isArray(site.statsBanner) ? site.statsBanner as Array<{ value: string; label: string }> : undefined} />;
           case "facilities": return <FacilitiesGrid key={index} items={facilities.slice(0, 6)} />;
           case "promotions": return <PromoSection key={index} promotions={promotions} services={services} whatsappNumber={typeof site.whatsappNumber === "string" ? site.whatsappNumber : undefined} />;
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
  })}</>;
}
