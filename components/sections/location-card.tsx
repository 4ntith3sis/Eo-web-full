import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { Location, Office, Service, ServiceLocation } from "@/types";
import { Button } from "@/components/ui/button";

interface LocationCardProps {
  location: Location;
  service: Service;
  combo: ServiceLocation;
  office: Office;
}

/**
 * Location picker card: shows a service's availability in one location
 * with its starting price, linking to the [service]/[location] detail.
 */
export function LocationCard({ location, service, combo, office }: LocationCardProps) {
  const officeName = office.name;
  const firstPlan = combo.pricing[0];
  const firstPlanSale = firstPlan?.discountedPrice ?? (firstPlan?.discountPercent
    ? `Rp ${Math.round(Number(firstPlan.price.replace(/[^0-9]/g, "")) * (1 - firstPlan.discountPercent / 100)).toLocaleString("id-ID")}`
    : undefined);

  return (
    <div className="flex h-full min-h-[510px] flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
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
        <h3 className="min-h-7 font-display text-lg font-bold leading-7 text-navy line-clamp-1" title={officeName}>
          {officeName}
        </h3>
        <p className="mt-3 min-h-[4.5rem] text-sm leading-relaxed text-neutral-600 line-clamp-3">
          {combo.tagline}
        </p>
        <p className="mt-3 flex min-h-[2.5rem] items-start gap-2 text-xs leading-relaxed text-neutral-500 line-clamp-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden />
          <span>{office?.address ?? location.address}</span>
        </p>
        <p className="mt-4 text-sm text-neutral-500">
          Mulai dari{" "}
          {firstPlanSale ? (
            <span className="inline-flex flex-col align-middle leading-tight">
              <span className="text-xs text-neutral-400 line-through">
                {firstPlan.price} {firstPlan.period}
              </span>
              <span className="font-display text-lg font-bold text-navy">
                {firstPlanSale} {firstPlan.period}
              </span>
            </span>
          ) : (
            <span className="font-display text-lg font-bold text-navy">
              {firstPlan?.price ?? combo.startingPrice} {firstPlan?.period}
            </span>
          )}
        </p>
        <div className="mt-5">
          <Button href={`/layanan/${service.slug}/${office.slug}`} fullWidth>
            Lihat Detail
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
