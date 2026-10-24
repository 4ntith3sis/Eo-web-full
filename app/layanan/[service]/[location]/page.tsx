import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { FacilitiesGrid } from "@/components/sections/facilities-grid";
import { FaqSection } from "@/components/sections/faq";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { LocationDetailCard } from "@/components/sections/location-detail-card";
import { PricingTable } from "@/components/sections/pricing-table";
import { StatsBand } from "@/components/sections/stats-band";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import {
  getLocation,
  getService,
  getServiceLocation,
  serviceLocations,
} from "@/lib/data/mock-data";
import { locationWhatsappNumber, whatsappFor } from "@/lib/whatsapp";

export function generateStaticParams() {
  return serviceLocations.flatMap((combo) => [
    { service: combo.serviceSlug, location: combo.locationSlug },
    ...(combo.offices?.map((office) => ({
      service: combo.serviceSlug,
      location: office.slug,
    })) ?? []),
  ]);
}

function getRouteData(serviceSlug: string, routeSlug: string) {
  const combo = serviceLocations.find(
    (entry) =>
      entry.serviceSlug === serviceSlug &&
      (entry.locationSlug === routeSlug ||
        entry.offices?.some((office) => office.slug === routeSlug)),
  );
  const exactLocationCombo = getServiceLocation(serviceSlug, routeSlug);
  const resolvedCombo = exactLocationCombo ?? combo;
  const location = resolvedCombo ? getLocation(resolvedCombo.locationSlug) : undefined;
  const office = resolvedCombo?.offices?.find((entry) => entry.slug === routeSlug);
  return { combo: resolvedCombo, location, office };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; location: string }>;
}): Promise<Metadata> {
  const { service: serviceSlug, location: locationSlug } = await params;
  const service = getService(serviceSlug);
  const { location, combo, office } = getRouteData(serviceSlug, locationSlug);
  if (!service || !location || !combo) return { title: "Layanan" };
  const officeName = office?.name ?? `EasyOffice ${location.name}`;
  const officeDescription = office?.description ?? `${location.shortDescription} ${combo.tagline}`;
  return {
    title: `${service.title} ${officeName}`,
    description: officeDescription,
  };
}

export default async function ServiceLocationPage({
  params,
}: {
  params: Promise<{ service: string; location: string }>;
}) {
  const { service: serviceSlug, location: locationSlug } = await params;
  const service = getService(serviceSlug);
  const { location, combo, office } = getRouteData(serviceSlug, locationSlug);
  if (!service || !location || !combo) notFound();

  const officeName = office?.name ?? `EasyOffice ${location.name}`;
  const officeDescription = office?.description ?? `${location.shortDescription} ${combo.tagline}`;
  const address = office?.address ?? location.address;
  const waNumber = office?.whatsapp ?? combo.whatsapp ?? locationWhatsappNumber(location.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Layanan" },
          { label: service.title, href: `/layanan/${service.slug}` },
          { label: officeName },
        ]}
      />
      <Hero
        eyebrow={`${service.title} — ${location.name}`}
        title={officeName}
        description={officeDescription}
        image={combo.image}
        imageAlt={combo.imageAlt}
        imageLabel={officeName}
        primaryCta={{
          label: "Hubungi Kami",
          href: whatsappFor(service.title, officeName, waNumber),
          external: true,
        }}
        secondaryCta={{
          label: "Lihat Harga",
          href: `/layanan/${service.slug}/${locationSlug}#harga`,
        }}
      />
      <StatsBand />

      <section className="bg-surface">
        <Container className="grid gap-8 py-10 sm:py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-navy/70">
              Lokasi & Operasional
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-3xl">
              {service.title} {officeName}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              {service.intro}
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-neutral-700">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <LocationDetailCard location={{ ...location, address }} topic={service.title} />
        </Container>
      </section>

      <div id="harga">
        <PricingTable
          title={`Harga ${service.title} ${officeName}`}
          description="Harga khusus lokasi ini — hubungi kami untuk penawaran resmi."
          plans={combo.pricing}
          topic={service.title}
          locationName={officeName}
          whatsappNumber={waNumber}
        />
      </div>

      <Gallery
        title={`Detail Kantor ${service.title} ${officeName}`}
        description={`Foto ruang dan fasilitas ${service.title} di ${officeName}.`}
        images={combo.gallery}
      />

      <FacilitiesGrid
        title={`Fasilitas di ${officeName}`}
        description={`Fasilitas ${service.title} yang tersedia di kantor ini.`}
        items={combo.facilities}
      />
      <ComparisonTable />
      <FaqSection
          title={`FAQ ${service.title} ${officeName}`}
        faqs={combo.faqs}
      />
      <WhatsappCta
          title={`Siap Memulai di ${officeName}?`}
        description={`Hubungi tim ${officeName} melalui WhatsApp.`}
        topic={service.title}
        locationName={officeName}
        whatsappNumber={waNumber}
      />
    </>
  );
}
