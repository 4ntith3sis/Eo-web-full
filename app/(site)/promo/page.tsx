import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { PromoFilters } from "@/components/sections/promo-filters";
import { getCmsPromotions, getCmsServices, getCmsServiceLocations, getCmsSite } from "@/lib/data/cms-data";

export const metadata: Metadata = {
  title: "Promo",
  description:
    "Promo EasyOffice: penawaran spesial untuk Virtual Office, Coworking Space, dan Meeting Room.",
};

export default async function PromoPage() {
  const [promotions, promoServices, serviceLocations, site] = await Promise.all([getCmsPromotions(), getCmsServices(), getCmsServiceLocations(), getCmsSite()]);
  const offices = serviceLocations.flatMap((combo) => combo.offices ?? []);
  return (
    <>
      <section className="bg-surface">
        <Container className="py-8 sm:py-10 lg:py-12">
          <div className="mb-8 max-w-2xl">
            <p className="inline-flex rounded-full border border-navy/15 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-navy">Promo Spesial</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">Penawaran Spesial untuk Anda</h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">Temukan promo EasyOffice untuk layanan Virtual Office, Meeting Room, dan Coworking Space.</p>
          </div>
           <PromoFilters promotions={promotions} services={promoServices} offices={offices} serviceLocations={serviceLocations} whatsappNumber={site.whatsappNumber} />
        </Container>
      </section>

      <WhatsappCta
        title="Ada Promo yang Menarik?"
        description="Jangan sampai terlewat — tanyakan ketersediaan dan syarat penawaran langsung ke tim kami."
       topic="promo"
        whatsappNumber={site.whatsappNumber}
      />
    </>
  );
}
