import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { Location, Service, ServiceLocation } from "@/types";
import { Button } from "@/components/ui/button";

interface LocationCardProps {
  location: Location;
  service: Service;
  combo: ServiceLocation;
}

/**
 * Location picker card: shows a service's availability in one location
 * with its starting price, linking to the [service]/[location] detail.
 */
export function LocationCard({ location, service, combo }: LocationCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
      <div className="relative h-44 w-full">
        <Image
          src={combo.image}
          alt={combo.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-navy shadow-sm">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {location.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <p className="text-sm font-medium text-neutral-500">{service.title}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
          {combo.tagline}
        </p>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-neutral-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden />
          <span>{location.address}</span>
        </p>
        <p className="mt-4 text-sm text-neutral-500">
          Mulai dari{" "}
          <span className="font-display text-lg font-bold text-navy">{combo.startingPrice}</span>
        </p>
        <div className="mt-5">
          <Button href={`/layanan/${service.slug}/${location.slug}`} fullWidth>
            Lihat Detail
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
