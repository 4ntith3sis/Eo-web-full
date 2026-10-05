import { ArrowRight, MapPin } from "lucide-react";
import type { Location, Service, ServiceLocation } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <Card className="flex flex-col">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
        <MapPin className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-navy">
        {location.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-neutral-500">{service.title}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
        {combo.tagline}
      </p>
      <p className="mt-4 text-sm text-neutral-500">
        Mulai dari{" "}
        <span className="font-display text-lg font-bold text-navy">{combo.startingPrice}</span>
        {combo.pricing[0]?.period}*
      </p>
      <div className="mt-5">
        <Button href={`/layanan/${service.slug}/${location.slug}`} fullWidth>
          Lihat Detail
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </Card>
  );
}
