import { MessageCircle } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { whatsappUrl } from "@/lib/whatsapp";
import { getCmsServices, getCmsSite } from "@/lib/data/cms-data";
import { routedWhatsappNumber } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import Script from "next/script";
import "../globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = await getCmsSite();
  return {
    title: { default: site.defaultSeoTitle || "EasyOffice — Virtual Office, Coworking Space & Meeting Room", template: "%s | EasyOffice" },
    description: site.defaultSeoDescription || "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room profesional di Bandung, Jakarta, dan Bekasi.",
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, services] = await Promise.all([getCmsSite(), getCmsServices()]);
  const whatsappNumber = routedWhatsappNumber(site.whatsappNumbers, site.primaryWhatsapp);
  return (
    <div className="flex min-h-screen flex-col bg-white">
       <Header whatsappNumber={whatsappNumber} ctaLabel={site.headerCtaLabel} ctaMessage={site.headerCtaMessage} logoUrl={site.logoUrl} navItems={site.navigation} />
      <main className="flex-1"><ScrollReveal>{children}</ScrollReveal></main>
       <Footer site={site} services={services} navItems={site.navigation} />
      {typeof site.gtmContainerId === "string" && /^GTM-[A-Z0-9]+$/i.test(site.gtmContainerId) ? <>
        <Script id="google-tag-manager" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmContainerId}');`}</Script>
        <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(site.gtmContainerId)}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" /></noscript>
      </> : null}
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
