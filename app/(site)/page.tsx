import type { Metadata } from "next";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { FacilitiesGrid } from "@/components/sections/facilities-grid";
import { getCmsComparisonRows, getCmsHomepageFacilities, getCmsPartners, getCmsPromotions, getCmsServices, getCmsSite, getCmsTestimonials } from "@/lib/data/cms-data";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PromoSection } from "@/components/sections/promo-section";
import { PartnersCarousel } from "@/components/sections/partners-carousel";
import { ShopeeSection } from "@/components/sections/shopee-section";
import { ServicesOverview } from "@/components/sections/services-overview";
import { StatsBand } from "@/components/sections/stats-band";
import { Testimonials } from "@/components/sections/testimonials";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCmsSite();
  return {
    title: site.defaultSeoTitle || "EasyOffice — Virtual Office, Coworking Space & Meeting Room",
    description: site.defaultSeoDescription || "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room profesional.",
  };
}

export default async function Home() {
  const [cmsServices, cmsTestimonials, cmsPromotions, cmsComparisonRows, homepageFacilities, partners, site] = await Promise.all([
    getCmsServices(),
    getCmsTestimonials(),
    getCmsPromotions(),
    getCmsComparisonRows(),
    getCmsHomepageFacilities(),
    getCmsPartners(),
    getCmsSite(),
  ]);
  return (
    <>
        <Hero
        eyebrow={site.homepageHeroEyebrow ?? "EasyOffice"}
        title={site.homepageHeroTitle ?? "Solusi Ruang Kerja Profesional untuk Bisnis Anda"}
        description={site.homepageHeroDescription ?? "Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional."}
        primaryCta={{
           label: site.homepageHeroPrimaryCtaLabel ?? "Hubungi Kami",
             href: whatsappUrl(site.homepageHeroPrimaryCtaMessage, site.whatsappNumber),
          external: true,
        }}
        secondaryCta={{ label: site.homepageHeroSecondaryCtaLabel ?? "Lihat Layanan", href: site.homepageHeroSecondaryCtaHref ?? "/layanan/virtual-office" }}
        image={site.homepageHeroImage}
        imageLabel={site.homepageHeroImageLabel}
        trustItems={Array.isArray(site.homepageHeroTrustItems) ? site.homepageHeroTrustItems.sort((a: { sortOrder?: number }, b: { sortOrder?: number }) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item: { text?: string }) => item.text ?? "").filter(Boolean) : undefined}
        />
      <StatsBand items={site.statsBanner} />
      <FacilitiesGrid
        eyebrow="Keunggulan"
        items={homepageFacilities.slice(0, 6)}
        title={site.homepageFacilitiesTitle ?? "Mengapa Pilih EasyOffice?"}
        description={site.homepageFacilitiesDescription ?? "Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda."}
      />
      <ShopeeSection
        title={site.homepageShopeeTitle ?? "Pesan Paket EasyOffice dengan Mudah"}
        description={site.homepageShopeeDescription ?? "Pembayaran layanan EasyOffice tersedia melalui marketplace Shopee dengan transaksi yang aman dan terpercaya."}
        image={site.homepageShopeeImage}
      />
      <PromoSection
        promotions={cmsPromotions}
        services={cmsServices}
        title={site.homepagePromoTitle ?? "Penawaran Spesial untuk Anda"}
        description={site.homepagePromoDescription ?? "Temukan penawaran EasyOffice untuk kebutuhan ruang kerja dan bisnis Anda."}
      />
      <ServicesOverview
        tone="gray"
        items={cmsServices}
        title={site.homepageServicesTitle ?? "Layanan EasyOffice"}
        description={site.homepageServicesDescription ?? "Berbagai layanan untuk mendukung operasional dan citra profesional bisnis Anda."}
      />
      <HowItWorks items={Array.isArray(site.howItWorks) && site.howItWorks.length ? site.howItWorks : undefined} />
      <ComparisonTable
        rows={cmsComparisonRows}
        title={site.homepageComparisonTitle ?? "Perbandingan dengan Office Lain"}
        description={site.homepageComparisonDescription ?? "Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice."}
        showPkpNote
      />
      <PartnersCarousel partners={partners} />
      <Testimonials items={cmsTestimonials} />
        <WhatsappCta whatsappNumber={site.whatsappNumber} title={site.homepageCtaTitle} description={site.homepageCtaDescription} buttonLabel={site.homepageCtaButtonLabel} secondaryButtonLabel={site.homepageCtaSecondaryButtonLabel} />
    </>
  );
}
