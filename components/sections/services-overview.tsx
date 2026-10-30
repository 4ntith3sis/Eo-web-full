import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { normalizeMediaUrl } from "@/lib/media";

export function ServicesOverview({
  title = "Layanan EasyOffice",
  description = "Tiga layanan utama untuk mendukung operasional dan citra profesional bisnis Anda.",
  tone = "white",
  items = [],
}: {
  title?: string;
  description?: string;
  tone?: "white" | "gray";
  items?: Service[];
}) {
  const services = items ?? [];
  return (
    <Section eyebrow="Layanan" title={title} description={description} tone={tone} className="pt-5 sm:pt-7 lg:pt-9">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          return (
            <div
              key={service.slug}
              className="flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={normalizeMediaUrl(service.image)}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <h3 className="mt-5 text-lg font-semibold text-navy">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {service.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Button href={service.href} variant="outline" size="sm">
                    Lihat {service.shortTitle}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
