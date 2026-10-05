import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface HeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string };
  visual?: ReactNode;
}

const defaultTrustItems = [
  "3 Lokasi Strategis",
  "Alamat Bisnis Prestisius",
  "Layanan Profesional",
  "Harga Fleksibel",
];

export function Hero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  visual,
}: HeroProps) {
  return (
    <section className="bg-navy">
      <Container className="grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          {eyebrow ? (
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white/80">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-[570px] text-base leading-relaxed text-white/70 sm:text-lg">
            {description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              href={primaryCta.href}
              external={primaryCta.external}
              size="lg"
              variant="white"
              className="rounded-full px-9"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                href={secondaryCta.href}
                variant="outline-white"
                size="lg"
                className="rounded-full px-9"
              >
                {secondaryCta.label}
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Button>
            ) : null}
          </div>
          <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {defaultTrustItems.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-white/85"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          {visual ?? (
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10 shadow-card lg:min-h-[520px]">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="Ruang kerja EasyOffice"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-navy-950/90 px-5 py-4 text-white shadow-card backdrop-blur">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
                <div>
                  <p className="text-sm font-bold">EasyOffice</p>
                  <p className="text-xs text-white/60">
                    Virtual Office • Coworking • Meeting Room
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
