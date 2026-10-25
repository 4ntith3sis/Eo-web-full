import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import type { Location } from "@/types";
import { whatsappFor } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LocationDetailCard({
  location,
  topic,
  whatsappNumber,
}: {
  location: Location;
  topic: string;
  whatsappNumber?: string;
}) {
  return (
    <Card className="rounded-[2rem] border-neutral-200/90 p-8 shadow-soft hover:translate-y-0 hover:shadow-soft sm:p-10">
      <h2 className="font-display text-2xl font-bold tracking-tight text-navy">
        EasyOffice {location.name}
      </h2>
      <dl className="mt-8 space-y-6 text-base">
        <div className="flex gap-3">
             <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-navy" aria-hidden />
          <div>
             <dt className="font-semibold text-navy">Alamat</dt>
            <dd className="mt-2 leading-relaxed text-neutral-600">
             {location.mapsUrl || (location.latitude && location.longitude) ? (
               <a
                 href={location.mapsUrl ?? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="underline decoration-navy/30 underline-offset-4 transition hover:text-navy"
               >
                 {location.address}
               </a>
             ) : location.address}
           </dd>
          </div>
        </div>
        <div className="flex gap-3">
           <Clock className="mt-0.5 h-6 w-6 shrink-0 text-navy" aria-hidden />
          <div>
            <dt className="font-semibold text-navy">Jam Operasional</dt>
           <dd className="mt-2 leading-relaxed text-neutral-600">{location.operatingHours}</dd>
          </div>
        </div>
        <div className="flex gap-3">
           <Mail className="mt-0.5 h-6 w-6 shrink-0 text-navy" aria-hidden />
          <div>
            <dt className="font-semibold text-navy">Email</dt>
           <dd className="mt-2 leading-relaxed text-neutral-600">{location.email}</dd>
          </div>
        </div>
      </dl>
      <div className="pt-8">
        <Button href={whatsappFor(topic, location.name, whatsappNumber ?? location.whatsapp)} external fullWidth className="h-16 rounded-2xl text-lg">
          <MessageCircle className="h-5 w-5" aria-hidden />
          WhatsApp {location.name}
        </Button>
      </div>
    </Card>
  );
}
