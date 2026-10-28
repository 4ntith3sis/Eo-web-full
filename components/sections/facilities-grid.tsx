import {
  Bell,
  Car,
  Clock,
  Coffee,
  DoorOpen,
  MapPin,
  Printer,
  Wifi,
  Laptop, Presentation, Video, Wallet, Headset, Award, Handshake, Star, Sparkles,
} from "lucide-react";
import type { Facility } from "@/types";
import { Section } from "@/components/ui/section";

const icons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  door: DoorOpen,
  bell: Bell,
  "map-pin": MapPin,
  printer: Printer,
  coffee: Coffee,
  car: Car,
  clock: Clock,
  laptop: Laptop, presentation: Presentation, video: Video, wallet: Wallet, headset: Headset,
  award: Award, handshake: Handshake, star: Star, sparkles: Sparkles,
};

export function FacilitiesGrid({
  title = "Fasilitas & Keunggulan",
  description = "Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda.",
  eyebrow = "Fasilitas",
  items = [],
  tone = "white",
}: {
  title?: string;
  description?: string;
  eyebrow?: string;
  tone?: "white" | "gray";
  items?: Facility[];
}) {
  return (
    <Section eyebrow={eyebrow} title={title} description={description} tone={tone}>
      <div className={`grid gap-5 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-6"}`}>
        {items.map((f, index) => {
          const Icon = icons[f.icon] ?? Wifi;
          return (
            <div
              key={f.title}
              className={`rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/30 hover:shadow-card ${items.length !== 4 ? "lg:col-span-2" : ""} ${items.length === 5 && index === 3 ? "lg:col-start-2" : ""} ${items.length === 5 && index === 4 ? "lg:col-start-4" : ""}`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-sm font-bold text-navy">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
