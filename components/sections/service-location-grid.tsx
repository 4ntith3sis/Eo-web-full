"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Location, Service, ServiceLocation } from "@/types";
import { cn } from "@/lib/utils";
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
  const [active, setActive] = useState<string>("all");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const officeItems = items.flatMap(({ location, combo, office: fallbackOffice }) =>
    (combo.offices?.length
      ? combo.offices
      : [fallbackOffice ?? {
          slug: location.slug,
          name: `EasyOffice ${location.name}`,
          description: location.shortDescription,
          address: location.address,
        }]
    ).map((office) => ({ location, combo, office })),
  );
  const filtered =
    active === "all"
      ? officeItems
      : officeItems.filter((item) => item.location.slug === active);

  const uniqueLocations = Array.from(
    new Map(officeItems.map((item) => [item.location.slug, item.location])).values(),
  );
  const cards = filtered;
  function updateScrollButtons() {
    const element = cardsRef.current;
    if (!element) return;
    const hasOverflow = element.scrollWidth > element.clientWidth + 1;
    setCanScrollLeft(hasOverflow && element.scrollLeft > 1);
    setCanScrollRight(
      hasOverflow && element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    );
  }

  function scrollCards(direction: -1 | 1) {
    const element = cardsRef.current;
    if (!element) return;
    const card = element.firstElementChild;
    if (!(card instanceof HTMLElement)) return;
    const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
    element.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  }

  function changeFilter(slug: string) {
    setActive(slug);
    if (cardsRef.current) cardsRef.current.scrollTo({ left: 0, behavior: "smooth" });
    setCanScrollLeft(false);
    setCanScrollRight(false);
  }

  useEffect(() => {
    const element = cardsRef.current;
    if (!element) return;

    const frame = requestAnimationFrame(updateScrollButtons);
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(element);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [active, cards.length]);

  return (
    <>
      <div className="flex flex-wrap justify-start gap-2" role="tablist" aria-label="Filter lokasi">
        {[{ slug: "all", name: "Semua" }, ...uniqueLocations].map(
          (loc) => (
            <button
              key={loc.slug}
              role="tab"
              aria-selected={active === loc.slug}
              type="button"
              onClick={() => changeFilter(loc.slug)}
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
      <div className="mt-8">
        <div
          ref={cardsRef}
          onScroll={updateScrollButtons}
          onLoad={updateScrollButtons}
          className="grid snap-x snap-mandatory auto-cols-[100%] grid-flow-col items-stretch gap-6 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 md:auto-cols-[calc((100%-3rem)/3)]"
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
        {cards.length > 0 ? (
          <div className="mt-6 flex min-h-10 items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Geser kartu ke kiri"
              onClick={() => scrollCards(-1)}
              disabled={!canScrollLeft}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-neutral-300 bg-white text-navy transition-colors hover:border-navy disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Geser kartu ke kanan"
              onClick={() => scrollCards(1)}
              disabled={!canScrollRight}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-neutral-300 bg-white text-navy transition-colors hover:border-navy disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
