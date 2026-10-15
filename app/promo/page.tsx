import type { Metadata } from "next";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Hero } from "@/components/sections/hero";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { promotions } from "@/lib/data/mock-data";
import { whatsappFor } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Promo",
  description:
    "Promo EasyOffice: penawaran spesial untuk Virtual Office, Coworking Space, dan Meeting Room.",
};

export default function PromoPage() {
  return (
    <>
      <Hero
        eyebrow="Penawaran"
        title="Promo EasyOffice"
        description="Penawaran spesial untuk membantu Anda memulai dengan biaya lebih hemat. Klaim penawaran melalui WhatsApp."
        image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Grafik perencanaan bisnis dan kalkulasi promo layanan EasyOffice"
        primaryCta={{
          label: "Klaim via WhatsApp",
          href: whatsappFor("promo"),
          external: true,
        }}
        secondaryCta={{ label: "Lihat Layanan", href: "/layanan/virtual-office" }}
      />

      <section className="bg-surface">
        <Container className="py-10 sm:py-12 lg:py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo, i) => (
              <Card key={promo.title} className="flex flex-col">
                <Badge>{promo.badge}</Badge>
                <h2 className="mt-4 text-lg font-semibold leading-snug text-navy">
                  {i + 1}. {promo.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                  {promo.description}
                </p>
                <div className="mt-4 border-t border-neutral-100 pt-4">
                  <p className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <CalendarDays className="h-4 w-4" aria-hidden />
                    {promo.period}
                  </p>
                  <h3 className="mt-3 text-sm font-semibold text-navy">
                    Cara klaim
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                    Klik tombol di bawah, sebutkan nama promo, dan tim kami akan
                    memandu proses selanjutnya via WhatsApp.
                  </p>
                  <div className="mt-4">
                    <Button
                      href={whatsappFor(`promo "${promo.title}"`)}
                      external
                      size="sm"
                      fullWidth
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      Klaim via WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <WhatsappCta
        title="Ada Promo yang Menarik?"
        description="Jangan sampai terlewat — tanyakan ketersediaan dan syarat penawaran langsung ke tim kami."
        topic="promo"
      />
    </>
  );
}
