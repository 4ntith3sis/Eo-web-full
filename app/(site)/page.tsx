import type { Metadata } from "next";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { FacilitiesGrid } from "@/components/sections/facilities-grid";
import { getCmsComparisonRows, getCmsHomepageFacilities, getCmsPromotions, getCmsServices, getCmsSite, getCmsTestimonials } from "@/lib/data/cms-data";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PromoSection } from "@/components/sections/promo-section";
import { ServicesOverview } from "@/components/sections/services-overview";
import { StatsBand } from "@/components/sections/stats-band";
import { Testimonials } from "@/components/sections/testimonials";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { whatsappFor } from "@/lib/whatsapp";
import { getCmsHomepageLayout } from "@/lib/data/cms-data";
import { HomepageRenderer } from "@/components/puck/homepage-renderer";

export const metadata: Metadata = {
  title: "EasyOffice — Virtual Office, Coworking Space & Meeting Room",
};

export default async function Home() {
  const [cmsServices, cmsTestimonials, cmsPromotions, cmsComparisonRows, homepageLayout, homepageFacilities, site] = await Promise.all([
    getCmsServices(),
    getCmsTestimonials(),
    getCmsPromotions(),
    getCmsComparisonRows(),
    getCmsHomepageLayout(),
    getCmsHomepageFacilities(),
    getCmsSite(),
  ]);
  if (homepageLayout?.content?.length) {
    return <HomepageRenderer layout={homepageLayout} services={cmsServices} promotions={cmsPromotions} testimonials={cmsTestimonials} comparisonRows={cmsComparisonRows} facilities={homepageFacilities} site={site} />;
  }
  return (
    <>
        <Hero
        eyebrow="EasyOffice"
        title={site.homepageHeroTitle ?? "Solusi Ruang Kerja Profesional untuk Bisnis Anda"}
        description={site.homepageHeroDescription ?? "Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional."}
        primaryCta={{
          label: "Hubungi Kami",
           href: whatsappFor("layanan", undefined, site.whatsappNumber),
          external: true,
        }}
        secondaryCta={{ label: "Lihat Layanan", href: "/layanan/virtual-office" }}
      />
      <StatsBand items={site.statsBanner} />
      <FacilitiesGrid
        items={homepageFacilities.slice(0, 6)}
        title="Mengapa Pilih EasyOffice?"
        description="Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda."
      />
       <PromoSection promotions={cmsPromotions} services={cmsServices} whatsappNumber={site.whatsappNumber} />
      <ServicesOverview tone="gray" items={cmsServices} />
      <HowItWorks items={Array.isArray(site.howItWorks) && site.howItWorks.length ? site.howItWorks : undefined} />
      <ComparisonTable
        rows={cmsComparisonRows}
        title="Perbandingan dengan Office Lain"
        description="Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice."
      />
      <Testimonials items={cmsTestimonials} />
       <WhatsappCta whatsappNumber={site.whatsappNumber} />
    </>
  );
}
