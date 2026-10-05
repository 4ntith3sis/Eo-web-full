"use client";

import { useState } from "react";
import { ArrowRight, Clock, MapPin, MessageCircle } from "lucide-react";
import { locations } from "@/lib/data/mock-data";
import { whatsappFor } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function LocationSelector({
  title = "Pilih Lokasi EasyOffice",
  description = "Tiga lokasi strategis untuk kebutuhan bisnis Anda. Pilih lokasi untuk melihat detail layanan, harga, dan fasilitas.",
}: {
  title?: string;
  description?: string;
}) {
  const [active, setActive] = useState(locations[0].slug);
  const current = locations.find((l) => l.slug === active) ?? locations[0];

  return (
    <Section eyebrow="Lokasi" title={title} description={description} tone="gray">
      <div role="tablist" aria-label="Pilih lokasi" className="flex flex-wrap justify-center gap-2">
        {locations.map((loc) => (
          <button
            key={loc.slug}
            role="tab"
            aria-selected={active === loc.slug}
            type="button"
            onClick={() => setActive(loc.slug)}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors",
              active === loc.slug
                ? "bg-navy text-white"
                : "border border-neutral-300 bg-white text-neutral-700 hover:border-navy hover:text-navy",
            )}
          >
            {loc.name}
          </button>
        ))}
      </div>

      <Card className="mx-auto mt-8 max-w-3xl">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
            <MapPin className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-navy">
              EasyOffice {current.name}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              {current.shortDescription}
            </p>
          </div>
        </div>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 font-semibold text-navy">Alamat</dt>
            <dd className="text-neutral-600">{current.address}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 font-semibold text-navy">Jam Operasional</dt>
            <dd className="inline-flex items-center gap-1.5 text-neutral-600">
              <Clock className="h-4 w-4" aria-hidden />
              {current.operatingHours}
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href={whatsappFor("layanan", current.name, current.whatsapp)} external>
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp {current.name}
          </Button>
          <Button href={`/layanan/virtual-office/${current.slug}`} variant="outline">
            Lihat Halaman {current.name}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </Card>
    </Section>
  );
}
