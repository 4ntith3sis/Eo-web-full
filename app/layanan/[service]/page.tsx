import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Layers, MapPin, Shield, Sparkles, Users, Wifi } from "lucide-react";

const benefitIcons = [Sparkles, Layers, Users, Clock, MapPin, Shield, Wifi, CheckCircle2];
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { FacilitiesGrid } from "@/components/sections/facilities-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { FaqSection } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { ServiceLocationGrid } from "@/components/sections/service-location-grid";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import {
  getService,
  getServiceLocation,
  locationsForService,
  services,
} from "@/lib/data/mock-data";
import { whatsappFor } from "@/lib/whatsapp";

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug);
  return {
    title: service ? service.title : "Layanan",
    description: service
      ? `${service.title} EasyOffice: ${service.description}`
      : "Layanan EasyOffice.",
  };
}

export default async function ServiceLandingPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const availableLocations = locationsForService(service.slug);
  const preview = availableLocations.length
    ? getServiceLocation(service.slug, availableLocations[0].slug)
    : undefined;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Layanan" },
          { label: service.title },
        ]}
      />
      <Hero
        eyebrow="Layanan"
        title={service.title}
        description={service.intro}
        image={service.image}
        imageAlt={service.imageAlt}
        primaryCta={{
          label: "Hubungi Kami",
          href: whatsappFor(service.title),
          external: true,
        }}
        secondaryCta={{ label: "Pilih Lokasi", href: `/layanan/${service.slug}#lokasi` }}
      />

      <Section
        eyebrow="Keunggulan"
        title={`Mengapa ${service.title} EasyOffice?`}
        description={service.description}
      >
        <div
          className={
            service.benefits.length <= 4
              ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
              : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {service.benefits.map((b, i) => {
            const [title, ...rest] = b.split(" — ");
            const Icon = benefitIcons[i % benefitIcons.length];
            return (
              <div
                key={b}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/30 hover:shadow-card"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-sm font-bold text-navy">
                  {title}
                </h3>
                {rest.length ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                    {rest.join(" — ")}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </Section>

      <div id="lokasi">
        <Section
          eyebrow="Pilih Lokasi"
          title={`Lokasi ${service.title} Tersedia`}
          description="Pilih lokasi untuk melihat harga, fasilitas, dan kontak spesifik lokasi tersebut."
          tone="gray"
        >
          <ServiceLocationGrid
            service={service}
            items={availableLocations
              .map((loc) => {
                const combo = getServiceLocation(service.slug, loc.slug);
                return combo ? { location: loc, combo } : null;
              })
              .filter((item) => item !== null)}
          />
        </Section>
      </div>

      {preview ? (
        <FacilitiesGrid
          title={`Fasilitas ${service.title}`}
          description="Fasilitas yang tersedia — dapat berbeda di tiap lokasi."
          items={preview.facilities}
        />
      ) : null}

      <BenefitsSection serviceSlug={service.slug} />

      <Testimonials />

      {preview ? (
        <FaqSection
          title={`FAQ ${service.title}`}
          faqs={preview.faqs}
        />
      ) : null}

      <WhatsappCta
        title={`Tertarik dengan ${service.title}?`}
        topic={service.title}
      />
    </>
  );
}
