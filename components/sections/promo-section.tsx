"use client";

import Image from "next/image";
import { normalizeMediaUrl } from "@/lib/media";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Promotion, Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function PromoSection({
  title = "Penawaran Spesial untuk Anda",
  description = "Temukan penawaran EasyOffice untuk kebutuhan ruang kerja dan bisnis Anda.",
  visible = true,
  promotions = [],
  services = [],
}: {
  title?: string;
  description?: string;
  /** Visibility can be controlled by a future homepage editor integration. */
  visible?: boolean;
  promotions?: Promotion[];
  services?: Service[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "promo" | "trial" | "diskon">("all");
  const filteredPromotions = useMemo(() => promotions.filter((promotion) => filter === "all" || promotion.badge === filter), [filter, promotions]);
  if (!visible) return null;
  if (!promotions.length) return null;
  const hasMultipleSlides = filteredPromotions.length > 1;

  const move = (direction: -1 | 1) => {
    if (!track.current) return;
    track.current.scrollBy({ left: direction * track.current.clientWidth * 0.82, behavior: "smooth" });
  };

  return (
    <Section eyebrow="Promo Spesial" title={title} description={description} tone="gray" id="promo" className="py-8 sm:py-10 lg:py-12">
      <div className="relative min-w-0">
        <div className="mb-5 flex flex-wrap justify-center gap-2" aria-label="Filter jenis promo">
          {(["all", "promo", "trial", "diskon"] as const).map((value) => {
            const count = value === "all" ? promotions.length : promotions.filter((promotion) => promotion.badge === value).length;
            return (
            <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize transition ${filter === value ? "border-navy bg-navy text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-navy hover:text-navy"}`}>
              {value === "all" ? "Semua" : value === "trial" ? "Trial Gratis" : value === "diskon" ? "Diskon" : "Promo"} ({count})
            </button>
            );
          })}
        </div>
        {hasMultipleSlides ? <button type="button" aria-label="Promo sebelumnya" onClick={() => move(-1)} className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-navy shadow-md transition hover:bg-navy hover:text-white sm:left-3">
            <ArrowLeft className="h-5 w-5" aria-hidden />
        </button> : null}
        {hasMultipleSlides ? <button type="button" aria-label="Promo berikutnya" onClick={() => move(1)} className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-navy shadow-md transition hover:bg-navy hover:text-white sm:right-3">
            <ArrowRight className="h-5 w-5" aria-hidden />
        </button> : null}
        <div ref={track} className="flex snap-x snap-mandatory justify-center gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Daftar promo">
          {filteredPromotions.map((promo) => {
            const service = services.find((item) => item.slug === promo.serviceSlug);
            if (!service) return null;
            return (
              <Card key={promo.title} className="flex w-[min(67vw,297px)] shrink-0 snap-start flex-col rounded-[1.35rem] border border-neutral-200/80 bg-white !p-2.5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:w-[min(44vw,306px)] sm:!p-3 lg:w-[31%]">
                <div className="relative aspect-[0.92/1] overflow-hidden rounded-[1.15rem] bg-navy/10">
                    <Image src={normalizeMediaUrl(promo.image ?? service.image)} alt={service.imageAlt} fill sizes="(max-width: 640px) 82vw, (max-width: 1024px) 65vw, 30vw" className="object-cover transition duration-500 hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col px-1 pb-0.5 pt-3 sm:px-1.5 sm:pt-3">
                   <span className="mb-2 inline-flex w-fit rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">{promo.badge}</span>
                   <h3 className="line-clamp-2 min-h-12 font-display text-base font-semibold leading-snug text-navy sm:min-h-14 sm:text-lg">{promo.title}</h3>
                   <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-relaxed text-neutral-600">{promo.description}</p>
                   {promo.period ? <p className="mt-2 text-[11px] font-semibold text-neutral-500">Periode: {promo.period}</p> : null}
                  <div className="mt-3 flex items-center gap-3">
                     <Button href={service.href} size="md" fullWidth className="!h-12 !min-h-12 rounded-full bg-navy px-4 text-xs hover:bg-navy/90 sm:text-sm">
                        {promo.ctaLabel || (promo.badge === "trial" ? "Coba Gratis" : promo.badge === "diskon" ? "Claim Diskon" : "Claim Promo")}
                    </Button>
          </div>
          {!filteredPromotions.length ? <p className="w-full py-10 text-center text-sm text-neutral-500">Belum ada penawaran untuk kategori ini.</p> : null}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
