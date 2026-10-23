import type { Metadata } from "next";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { FacilitiesGrid } from "@/components/sections/facilities-grid";
import { allFacilities } from "@/lib/data/mock-data";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PromoSection } from "@/components/sections/promo-section";
import { ServicesOverview } from "@/components/sections/services-overview";
import { StatsBand } from "@/components/sections/stats-band";
import { Testimonials } from "@/components/sections/testimonials";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { whatsappFor } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "EasyOffice — Virtual Office, Coworking Space & Meeting Room",
};

export default function Home() {
  return (
    <>
      <Hero
        eyebrow="EasyOffice"
        title="Solusi Ruang Kerja Profesional untuk Bisnis Anda"
        description="Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional."
        primaryCta={{
          label: "Hubungi Kami",
          href: whatsappFor("layanan"),
          external: true,
        }}
        secondaryCta={{ label: "Lihat Layanan", href: "/layanan/virtual-office" }}
      />
      <StatsBand />
      <FacilitiesGrid
        items={allFacilities.slice(0, 6)}
        title="Mengapa Pilih EasyOffice?"
        description="Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda."
      />
      <PromoSection />
      <ServicesOverview tone="gray" />
      <HowItWorks />
      <ComparisonTable
        title="Perbandingan dengan Office Lain"
        description="Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice."
      />
      <Testimonials />
      <WhatsappCta />
    </>
  );
}
