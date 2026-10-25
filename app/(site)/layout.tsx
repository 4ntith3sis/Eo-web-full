import { MessageCircle } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { whatsappUrl } from "@/lib/whatsapp";
import { getCmsServices, getCmsSite } from "@/lib/data/cms-data";
import { routedWhatsappNumber } from "@/lib/whatsapp";
import "../globals.css";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, services] = await Promise.all([getCmsSite(), getCmsServices()]);
  const whatsappNumber = routedWhatsappNumber(site.whatsappNumbers, typeof site.defaultWhatsapp === "string" ? site.defaultWhatsapp : undefined, site.primaryWhatsapp);
  return (
    <div className="flex min-h-screen flex-col bg-white">
       <Header whatsappNumber={whatsappNumber} ctaLabel={site.headerCtaLabel} ctaMessage={site.headerCtaMessage} logoUrl={site.logoUrl} navItems={site.navigation} />
      <main className="flex-1">{children}</main>
       <Footer site={site} services={services} navItems={site.navigation} />
      <a
         href={whatsappUrl("Halo EasyOffice, saya ingin bertanya tentang layanan Anda.", whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi EasyOffice via WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex h-13 w-13 items-center justify-center rounded-full bg-navy p-3.5 text-white shadow-lg transition-colors hover:bg-navy/90"
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
      </a>
    </div>
  );
}
