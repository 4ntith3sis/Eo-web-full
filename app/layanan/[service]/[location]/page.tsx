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
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import {
  getLocation,
  getService,
  getServiceLocation,
  serviceLocations,
} from "@/lib/data/mock-data";
import { locationWhatsappNumber, whatsappFor } from "@/lib/whatsapp";

export function generateStaticParams() {
  return serviceLocations.map((s) => ({
    service: s.serviceSlug,
    location: s.locationSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; location: string }>;
}): Promise<Metadata> {
  const { service: serviceSlug, location: locationSlug } = await params;
  const service = getService(serviceSlug);
  const location = getLocation(locationSlug);
  const combo = getServiceLocation(serviceSlug, locationSlug);
  if (!service || !location || !combo) return { title: "Layanan" };
  return {
    title: `${service.title} ${location.name}`,
    description: `${service.title} EasyOffice di ${location.name}: ${combo.tagline}`,
  };
}

export default async function ServiceLocationPage({
  params,
}: {
  params: Promise<{ service: string; location: string }>;
}) {
  const { service: serviceSlug, location: locationSlug } = await params;
  const service = getService(serviceSlug);
  const location = getLocation(locationSlug);
  const combo = getServiceLocation(serviceSlug, locationSlug);
  if (!service || !location || !combo) notFound();

  const waNumber = combo.whatsapp ?? locationWhatsappNumber(location.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Layanan" },
          { label: service.title, href: `/layanan/${service.slug}` },
          { label: location.name },
        ]}
      />
      <Hero
        eyebrow={`${service.title} — ${location.name}`}
        title={`${service.title} di ${location.name}`}
        description={`${location.shortDescription} ${combo.tagline}`}
        image={combo.image}
        imageAlt={combo.imageAlt}
        primaryCta={{
          label: "Hubungi Kami",
          href: whatsappFor(service.title, location.name, waNumber),
          external: true,
        }}
        secondaryCta={{
          label: "Lihat Harga",
          href: `/layanan/${service.slug}/${location.slug}#harga`,
        }}
      />

      <Gallery
        title={`Detail Kantor ${service.title} ${location.name}`}
        description={`Foto ruang dan fasilitas ${service.title} di lokasi ${location.name}.`}
        images={combo.gallery}
      />

      <section className="bg-surface">
        <Container className="grid gap-8 py-10 sm:py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-navy/70">
              Lokasi & Operasional
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-3xl">
              {service.title} {location.name}
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
          <LocationDetailCard location={location} topic={service.title} />
        </Container>
      </section>

      <div id="harga">
        <PricingTable
          title={`Harga ${service.title} ${location.name}`}
          description="Harga khusus lokasi ini — hubungi kami untuk penawaran resmi."
          plans={combo.pricing}
          topic={service.title}
          locationName={location.name}
          whatsappNumber={waNumber}
        />
      </div>

      <FacilitiesGrid
        title={`Fasilitas di ${location.name}`}
        description={`Fasilitas ${service.title} yang tersedia di lokasi ini.`}
        items={combo.facilities}
      />
      <ComparisonTable />
      <FaqSection
        title={`FAQ ${service.title} ${location.name}`}
        faqs={combo.faqs}
      />
      <WhatsappCta
        title={`Siap Memulai di ${location.name}?`}
        description={`Hubungi tim EasyOffice ${location.name} melalui WhatsApp — Anda akan terhubung ke nomor khusus lokasi ini.`}
        topic={service.title}
        locationName={location.name}
        whatsappNumber={waNumber}
      />
    </>
  );
}
