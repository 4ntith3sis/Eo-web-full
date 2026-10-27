"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Office, Promotion, Service, ServiceLocation } from "@/types";
import { PromoCard } from "./promo-card";

export function PromoFilters({ promotions, services, offices, serviceLocations, whatsappNumber }: { promotions: Promotion[]; services: Service[]; offices: Office[]; serviceLocations: ServiceLocation[]; whatsappNumber?: string }) {
  const [service, setService] = useState("all");
  const [office, setOffice] = useState("all");
  const officeServices = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const combo of serviceLocations) {
      for (const entry of combo.offices ?? []) {
        const serviceSlugs = map.get(entry.slug) ?? new Set<string>();
        serviceSlugs.add(combo.serviceSlug);
        map.set(entry.slug, serviceSlugs);
      }
    }
    return map;
  }, [serviceLocations]);
  const availableOffices = useMemo(
    () => offices.filter((entry) => service === "all" || officeServices.get(entry.slug)?.has(service)),
    [offices, officeServices, service],
  );
  const filtered = promotions.filter((promo) => {
    const matchesService = service === "all" || promo.serviceSlug === service;
    const matchesOffice = office === "all" || officeServices.get(office)?.has(promo.serviceSlug ?? "");
    return matchesService && matchesOffice;
  });

  function changeService(value: string) {
    setService(value);
    if (value !== "all" && office !== "all" && !officeServices.get(office)?.has(value)) setOffice("all");
  }
  return <>
    <div className="mb-10 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-4 shadow-sm sm:justify-between sm:px-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-navy">
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        <span>Filter promo</span>
      </div>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <label className="relative block min-w-0 sm:min-w-[205px]">
          <span className="sr-only">Filter layanan</span>
           <select value={service} onChange={(event) => changeService(event.target.value)} className="block h-11 w-full appearance-none rounded-full border border-neutral-200 bg-white px-4 pr-10 text-sm font-medium text-navy outline-none transition hover:border-navy/40 focus:border-navy focus:ring-2 focus:ring-navy/10">
            <option value="all">Semua layanan</option>
            {services.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy" aria-hidden />
        </label>
        <label className="relative block min-w-0 sm:min-w-[205px]">
          <span className="sr-only">Filter office</span>
          <select value={office} onChange={(event) => setOffice(event.target.value)} className="block h-11 w-full appearance-none rounded-full border border-neutral-200 bg-white px-4 pr-10 text-sm font-medium text-navy outline-none transition hover:border-navy/40 focus:border-navy focus:ring-2 focus:ring-navy/10">
            <option value="all">Semua office</option>
             {availableOffices.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy" aria-hidden />
        </label>
      </div>
    </div>
    <div className="mx-auto grid max-w-5xl items-stretch justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((promo, index) => <PromoCard key={promo.title} promo={promo} service={services.find((item) => item.slug === promo.serviceSlug) ?? services[index % services.length]} whatsappNumber={whatsappNumber} />)}</div>
    {!filtered.length ? <p className="py-12 text-center text-neutral-500">Tidak ada promo untuk filter yang dipilih.</p> : null}
  </>;
}
