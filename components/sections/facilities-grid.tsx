import {
  Bell,
  Car,
  Clock,
  Coffee,
  DoorOpen,
  MapPin,
  Printer,
  Wifi,
} from "lucide-react";
import type { Facility } from "@/types";
import { allFacilities } from "@/lib/data/mock-data";
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
};

export function FacilitiesGrid({
  title = "Fasilitas & Keunggulan",
  description = "Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda.",
  items = allFacilities,
  tone = "white",
}: {
  title?: string;
  description?: string;
  tone?: "white" | "gray";
  items?: Facility[];
}) {
  return (
    <Section eyebrow="Fasilitas" title={title} description={description} tone={tone}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => {
          const Icon = icons[f.icon] ?? Wifi;
          return (
            <div
              key={f.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/30 hover:shadow-card"
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
