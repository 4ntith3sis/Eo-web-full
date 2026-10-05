"use client";

import { useState } from "react";
import type { Location, Service, ServiceLocation } from "@/types";
import { cn } from "@/lib/utils";
import { LocationCard } from "./location-card";

interface Item {
  location: Location;
  combo: ServiceLocation;
}

export function ServiceLocationGrid({
  service,
  items,
}: {
  service: Service;
  items: Item[];
}) {
  const [active, setActive] = useState<string>("all");
  const filtered =
    active === "all"
      ? items
      : items.filter((item) => item.location.slug === active);

  return (
    <>
      <div className="flex flex-wrap justify-start gap-2" role="tablist" aria-label="Filter lokasi">
        {[{ slug: "all", name: "Semua" }, ...items.map((i) => i.location)].map(
          (loc) => (
            <button
              key={loc.slug}
              role="tab"
              aria-selected={active === loc.slug}
              type="button"
              onClick={() => setActive(loc.slug)}
              className={cn(
                "rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors",
                active === loc.slug
                  ? "bg-navy text-white"
                  : "border border-neutral-300 bg-white text-neutral-700 hover:border-navy hover:text-navy",
              )}
            >
              {loc.name}
            </button>
          ),
        )}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {filtered.map(({ location, combo }) => (
          <LocationCard
            key={location.slug}
            location={location}
            service={service}
            combo={combo}
          />
        ))}
      </div>
    </>
  );
}
