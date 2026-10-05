import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import type { Location } from "@/types";
import { whatsappFor } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LocationDetailCard({
  location,
  topic,
}: {
  location: Location;
  topic: string;
}) {
  return (
    <Card>
      <h2 className="font-display text-lg font-bold text-navy">
        EasyOffice {location.name}
      </h2>
      <dl className="mt-5 space-y-4 text-sm">
        <div className="flex gap-3">
          <MapPin className="h-5 w-5 shrink-0 text-navy" aria-hidden />
          <div>
            <dt className="font-semibold text-navy">Alamat</dt>
            <dd className="mt-1 text-neutral-600">{location.address}</dd>
          </div>
        </div>
        <div className="flex gap-3">
          <Clock className="h-5 w-5 shrink-0 text-navy" aria-hidden />
          <div>
            <dt className="font-semibold text-navy">Jam Operasional</dt>
            <dd className="mt-1 text-neutral-600">{location.operatingHours}</dd>
          </div>
        </div>
        <div className="flex gap-3">
          <Mail className="h-5 w-5 shrink-0 text-navy" aria-hidden />
          <div>
            <dt className="font-semibold text-navy">Email</dt>
            <dd className="mt-1 text-neutral-600">{location.email}</dd>
          </div>
        </div>
      </dl>
      <div className="mt-6">
        <Button href={whatsappFor(topic, location.name, location.whatsapp)} external fullWidth>
          <MessageCircle className="h-4 w-4" aria-hidden />
          WhatsApp {location.name}
        </Button>
      </div>
    </Card>
  );
}
