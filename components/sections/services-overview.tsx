import Image from "next/image";
import { ArrowRight, Briefcase, DoorOpen, Users, Laptop, Wifi, MapPin, Headset, Presentation, Video, Clock, Wallet, Award, Handshake, Star, Sparkles } from "lucide-react";
import type { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

const icons: Record<string, typeof Briefcase> = {
  "virtual-office": Briefcase,
  "coworking-space": Users,
  "meeting-room": DoorOpen,
  briefcase: Briefcase, laptop: Laptop, wifi: Wifi, "map-pin": MapPin, headset: Headset,
  presentation: Presentation, video: Video, clock: Clock, wallet: Wallet, award: Award,
  handshake: Handshake, star: Star, sparkles: Sparkles,
};

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
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service) => {
          const Icon = icons[service.icon] ?? icons[service.slug] ?? Briefcase;
          return (
            <div
              key={service.slug}
              className="flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
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
                <div className="mt-6 pt-2">
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
