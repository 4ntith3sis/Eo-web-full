import Image from "next/image";
import { ArrowRight, MapPin, ImageIcon } from "lucide-react";
import type { Location, Office, Service, ServiceLocation } from "@/types";
import { Button } from "@/components/ui/button";
import { normalizeMediaUrl } from "@/lib/media";

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
  const firstRegular = firstPlan ? Number(firstPlan.price.replace(/[^0-9]/g, "")) : 0;
  const firstSale = firstPlan?.discountedPrice
    ? Number(firstPlan.discountedPrice.replace(/[^0-9]/g, ""))
    : firstPlan?.discountPercent
      ? Math.round(firstRegular * (1 - firstPlan.discountPercent / 100))
      : firstRegular;

  return (
    <div className="flex h-full min-h-[510px] flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
      <div className="relative h-44 w-full">
          {combo.image ? <Image src={normalizeMediaUrl(combo.image)} alt={combo.imageAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="flex h-full items-center justify-center bg-navy/5 text-navy/40"><ImageIcon className="h-10 w-10" aria-hidden /></div>}
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
           {office.description}
        </p>
        <p className="mt-3 flex min-h-[2.5rem] items-start gap-2 text-xs leading-relaxed text-neutral-500 line-clamp-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden />
           <span>{office.address}</span>
        </p>
        <p className="mt-4 text-sm text-neutral-500">
          Mulai dari{" "}
           <span className="font-display text-lg font-bold text-navy">
             {`Rp ${(firstPlan ? firstSale : Number(String(combo.startingPrice).replace(/[^0-9]/g, ""))).toLocaleString("id-ID")}`} {firstPlan?.period ?? "/bulan"}
           </span>
        </p>
        <div className="mt-auto pt-5">
          <Button href={`/layanan/${service.slug}/${office.slug}`} fullWidth>
            Lihat Detail
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
