import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { FaqSection } from "@/components/sections/faq";
import { ContactForm } from "@/components/sections/contact-form";
import { WhatsappCta } from "@/components/sections/whatsapp-cta";
import { Container } from "@/components/ui/container";
import { generalFaqs, site } from "@/lib/data/mock-data";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi EasyOffice di Bandung, Jakarta, dan Bekasi via WhatsApp atau email.",
};

const quickCards = [
  {
    icon: MessageCircle,
    eyebrow: "WHATSAPP · TERCEPAT",
    title: site.phoneDisplay,
    text: "Respons cepat via WhatsApp. Tersedia Senin–Jumat, 08.00–17.00 WIB.",
    action: "Mulai chat WhatsApp",
    href: whatsappUrl("Halo EasyOffice, saya ingin bertanya tentang layanan Anda."),
    external: true,
  },
  {
    icon: Mail,
    eyebrow: "EMAIL · FORMAL",
    title: site.email,
    text: "Untuk pertanyaan detail atau dokumen kerja sama. Pesan ditindaklanjuti tim kami.",
    action: "Kirim email",
    href: `mailto:${site.email}`,
    external: false,
  },
  {
    icon: Clock,
    eyebrow: "JAM KERJA",
    title: "Senin–Jumat",
    text: "Layanan operasional pukul 08.00–17.00 WIB untuk konsultasi dan survei lokasi.",
    action: "Lihat lokasi",
    href: "/layanan/virtual-office",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy py-14 sm:py-16 lg:py-20">
        <Container>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="text-white/60 hover:text-white">
              Beranda
            </Link>
            <span>&gt;</span>
            <strong className="text-white">Kontak</strong>
          </nav>
          <div className="mt-6 max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white/80">
              Hubungi Tim EasyOffice
            </p>
            <h1 className="font-display mt-5 text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl">
              Mari Bicarakan Kebutuhan{" "}
              <span className="text-white/70">Ruang Kerja Bisnis Anda.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Tim kami siap menjelaskan layanan, harga, dan lokasi yang paling sesuai. Pilih cara komunikasi yang paling nyaman untuk Anda.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {quickCards.map((card) => (
              <article
                key={card.eyebrow}
                className="flex min-h-[240px] flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-7 shadow-card"
              >
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-white">
                    <card.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-neutral-400">
                    {card.eyebrow}
                  </p>
                  <h3 className="font-display mt-1 text-xl font-bold text-navy">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
                    {card.text}
                  </p>
                </div>
                <a
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-navy"
                >
                  {card.action} →
                </a>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-soft sm:p-10">
              <h2 className="font-display text-2xl font-bold tracking-tight text-navy">
                Kirim pertanyaan Anda
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Isi form berikut dan tim kami akan menghubungi Anda kembali dalam 1×24 jam kerja.
              </p>
              <hr className="my-7 border-neutral-100" />
              <ContactForm />
            </div>

            <aside className="grid gap-5">
              <div className="flex items-center gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-500 text-white">
                  <CheckCircle2 className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <strong className="block font-display text-emerald-900">
                    Respons Cepat
                  </strong>
                  <span className="text-sm text-emerald-700">
                    Rata-rata kurang dari 5 menit via WhatsApp.
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-soft">
                <h3 className="flex items-center gap-2.5 font-display text-base font-bold text-navy">
                  <Clock className="h-5 w-5" aria-hidden /> Jam Operasional
                </h3>
                <dl className="mt-4 grid gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Senin – Jumat</dt>
                    <dd className="font-semibold text-navy">08.00 – 17.00</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Sabtu</dt>
                    <dd className="font-semibold text-navy">09.00 – 14.00</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Minggu & Libur</dt>
                    <dd className="font-semibold text-red-500">Tutup</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-soft">
                <h3 className="flex items-center gap-2.5 font-display text-base font-bold text-navy">
                  <MapPin className="h-5 w-5" aria-hidden /> Kantor & Layanan Online
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  Melayani konsultasi dan survei lokasi di Bandung, Jakarta, dan
                  Bekasi — juga online untuk seluruh Indonesia.
                </p>
                <Link
                  href="/layanan/virtual-office"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy"
                >
                  Lihat lokasi layanan →
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <FaqSection faqs={generalFaqs} />

      <WhatsappCta
        title="Masih Ragu Memilih Layanan?"
        description="Ceritakan kebutuhan bisnis Anda — kami bantu pilihkan layanan dan lokasi yang paling sesuai."
        topic="konsultasi layanan"
      />
    </>
  );
}
