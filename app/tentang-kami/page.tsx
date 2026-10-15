import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, CheckCircle2, Handshake, MapPinned } from "lucide-react";
import { ServicesOverview } from "@/components/sections/services-overview";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { whatsappFor } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Tentang EasyOffice: penyedia Virtual Office, Coworking Space, dan Meeting Room di Bandung, Jakarta, dan Bekasi.",
};

const values = [
  {
    icon: Award,
    title: "Profesional",
    description:
      "Layanan dan fasilitas setara standar kantor korporat untuk setiap skala bisnis.",
  },
  {
    icon: Handshake,
    title: "Terpercaya",
    description:
      "Proses transparan dan tim responsif yang mendampingi kebutuhan administrasi usaha Anda.",
  },
  {
    icon: MapPinned,
    title: "Terjangkau",
    description:
      "Lokasi-lokasi strategis dengan paket fleksibel yang menyesuaikan anggaran bisnis.",
  },
];

const stats = [
  { value: "100%", label: "Legal & Resmi" },
  { value: "5 Menit", label: "Respon WhatsApp" },
  { value: "4.9/5", label: "Rating" },
  { value: "13.000+", label: "Bisnis Terlayani" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy py-14 sm:py-16 lg:py-20">
        <Container>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="text-white/60 hover:text-white">
              Beranda
            </Link>
            <span>&gt;</span>
            <strong className="text-white">Tentang Kami</strong>
          </nav>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white/80">
                Tentang EasyOffice
              </p>
              <h1 className="font-display mt-5 text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl">
                Memudahkan Bisnis Indonesia{" "}
                <span className="text-white/70">Tampil Profesional.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                EasyOffice menyediakan Virtual Office, Coworking Space, dan
                Meeting Room di Bandung, Jakarta, dan Bekasi — membantu bisnis
                tampil profesional tanpa beban operasional kantor fisik.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={whatsappFor("informasi perusahaan")}
                  external
                  size="lg"
                  variant="white"
                  className="rounded-full px-9"
                >
                  Hubungi Kami
                </Button>
                <Button
                  href="#cerita"
                  variant="outline-white"
                  size="lg"
                  className="rounded-full px-9"
                >
                  Cerita Kami
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <li className="inline-flex items-center gap-2 text-sm font-semibold text-white/85">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />
                  Alamat Bisnis Prestisius
                </li>
                <li className="inline-flex items-center gap-2 text-sm font-semibold text-white/85">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />
                  Lokasi Strategis
                </li>
              </ul>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 shadow-card sm:min-h-[440px]">
              <Image
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
                alt="Ruang kerja EasyOffice"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                style={{ objectFit: "cover" }}
              />
              <div className="absolute left-5 top-5 rounded-2xl border border-white/15 bg-white/95 px-5 py-3.5 text-navy shadow-card">
                <strong className="font-display block text-lg font-bold leading-none">
                  Tim Profesional
                </strong>
                <small className="text-xs font-semibold text-neutral-500">
                  Siap Membantu Anda
                </small>
              </div>
              <div className="absolute bottom-5 right-5 rounded-2xl border border-white/15 bg-navy-950/90 px-5 py-3.5 text-white shadow-card backdrop-blur">
                <strong className="font-display block text-lg font-bold leading-none">
                  4.9 / 5.0
                </strong>
                <small className="text-xs font-semibold text-white/60">
                  Rating Google (700+)
                </small>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="cerita" className="bg-white py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-surface shadow-soft sm:min-h-[420px]">
              <Image
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
                alt="Tim EasyOffice"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                style={{ objectFit: "cover" }}
              />
              <div className="absolute bottom-5 left-5 rounded-2xl bg-navy px-5 py-3.5 text-white shadow-card">
                <strong className="font-display block text-lg font-bold leading-none">
                  Berdiri 2023
                </strong>
                <small className="text-xs font-semibold text-white/60">
                  Melayani Bisnis Indonesia
                </small>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-navy/60">
                Cerita Kami
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                Lahir dari kebutuhan akan ruang kerja{" "}
                <span className="text-navy/60">yang profesional.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-neutral-600">
                EasyOffice dibangun untuk membantu bisnis tampil profesional
                tanpa harus menanggung beban biaya dan operasional kantor fisik.
                Kami percaya setiap bisnis berhak memiliki alamat dan ruang kerja
                yang kredibel.
              </p>
              <ul className="mt-7 grid gap-3.5 border-t border-neutral-100 pt-6">
                {[
                  "Alamat prestisius di pusat kota",
                  "Tim responsif yang mudah dihubungi",
                  "Paket fleksibel untuk setiap skala bisnis",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-neutral-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-neutral-200 bg-white px-3 py-6 text-center shadow-soft sm:px-6 sm:py-8"
              >
                <strong className="font-display block text-2xl font-bold leading-none text-navy sm:text-3xl lg:text-4xl">
                  {s.value}
                </strong>
                <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500 sm:text-xs sm:tracking-[0.12em]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section
        eyebrow="Nilai-Nilai Kami"
        title="Prinsip yang menjadi fondasi kerja kami."
        description="Setiap layanan, biaya, dan komunikasi kami dipandu oleh nilai-nilai ini."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy text-white shadow-soft">
                <v.icon className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="font-display mt-6 text-lg font-bold text-navy">
                {v.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <ServicesOverview
        title="Apa yang Kami Tawarkan"
        description="Tiga layanan inti yang dapat digabungkan sesuai kebutuhan bisnis Anda."
        tone="gray"
      />

      <WhatsappCta
        title="Ingin Mengenal EasyOffice Lebih Dekat?"
        topic="informasi perusahaan"
      />
    </>
  );
}
