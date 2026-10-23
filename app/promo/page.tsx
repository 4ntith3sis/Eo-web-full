import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { promotions, services } from "@/lib/data/mock-data";
import { whatsappFor } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Promo",
  description:
    "Promo EasyOffice: penawaran spesial untuk Virtual Office, Coworking Space, dan Meeting Room.",
};

const promoServices = [services[0], services[2], services[1]];

export default function PromoPage() {
  return (
    <>
      <section className="bg-surface">
        <Container className="py-8 sm:py-10 lg:py-12">
          <div className="mb-8 max-w-2xl">
            <p className="inline-flex rounded-full border border-navy/15 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-navy">Promo Spesial</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">Penawaran Spesial untuk Anda</h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">Temukan promo EasyOffice untuk layanan Virtual Office, Meeting Room, dan Coworking Space.</p>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo, i) => (
              <Card key={promo.title} className="mx-auto flex h-full w-full max-w-[306px] flex-col rounded-[1.35rem] border border-neutral-200/80 bg-white !p-2.5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:!p-3">
                <div className="relative aspect-[0.92/1] overflow-hidden rounded-[1.15rem] bg-navy/10">
                  <Image
                    src={promoServices[i % promoServices.length].image}
                    alt={promoServices[i % promoServices.length].imageAlt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col px-1 pb-0.5 pt-3 sm:px-1.5">
                  <h2 className="line-clamp-2 min-h-12 font-display text-base font-semibold leading-snug text-navy sm:min-h-14 sm:text-lg">
                    {promo.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-relaxed text-neutral-600">{promo.description}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Button
                      href={promoServices[i % promoServices.length].href}
                      size="md"
                      fullWidth
                      className="!h-12 !min-h-12 rounded-full bg-navy px-4 text-xs hover:bg-navy/90 sm:text-sm"
                    >
                      Cek Selengkapnya <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                    <Button
                      href={whatsappFor(`promo "${promo.title}"`)}
                      external
                      size="md"
                      className="!h-12 !min-h-12 !w-12 shrink-0 !rounded-full !border-0 !bg-navy !p-0 !text-white shadow-md hover:!bg-navy/90"
                      aria-label={`Konsultasi promo ${promo.title}`}
                    >
                      <MessageCircle className="h-6 w-6" aria-hidden />
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
