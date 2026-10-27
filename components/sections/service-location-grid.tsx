"use client";

import { useRef } from "react";
import type { Location, Service, ServiceLocation } from "@/types";
import { LocationCard } from "./location-card";

interface Item {
  location: Location;
  combo: ServiceLocation;
  office?: NonNullable<ServiceLocation["offices"]>[number];
}

export function ServiceLocationGrid({
  service,
  items,
}: {
  service: Service;
  items: Item[];
}) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const officeItems = items.flatMap(({ location, combo, office: fallbackOffice }) =>
    (combo.offices?.length
      ? combo.offices
          : [fallbackOffice ?? {
           slug: location.slug,
           name: `EasyOffice ${location.name}`,
           description: "",
           address: "",
         }]
    ).map((office) => ({ location, combo, office })),
  );
  const cards = officeItems;
  return (
    <>
      <div>
        <div
          ref={cardsRef}
          className="grid items-stretch gap-6 pb-2 sm:grid-cols-2 lg:grid-cols-3"
          role="region"
          aria-label={`${service.title} - lokasi dan kantor`}
        >
          {cards.map(({ location, combo, office }) => (
            <div
              key={office.slug}
              className="h-full snap-start"
            >
              <LocationCard
                location={location}
                service={service}
                combo={combo}
                office={office}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
