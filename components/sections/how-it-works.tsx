import { Container } from "@/components/ui/container";

const steps = [
  {
    step: "01",
    title: "Pilih Layanan & Lokasi",
    description:
      "Tentukan kebutuhan bisnis Anda — Virtual Office, Coworking Space, atau Meeting Room — di lokasi terdekat.",
  },
  {
    step: "02",
    title: "Hubungi via WhatsApp",
    description:
      "Tim kami membantu menjelaskan paket, harga, dan ketersediaan fasilitas sesuai kebutuhan Anda.",
  },
  {
    step: "03",
    title: "Konsultasi & Survei",
    description:
      "Jadwalkan kunjungan atau survei lokasi untuk memastikan fasilitas sesuai ekspektasi bisnis Anda.",
  },
  {
    step: "04",
    title: "Mulai Gunakan",
    description:
      "Proses selesai — alamat bisnis, ruang kerja, dan dukungan administrasi siap digunakan.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-[100px]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full border border-navy/15 bg-navy/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-navy">
            Cara Sewa
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Cara Kerja EasyOffice
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
            Proses sederhana untuk mulai menggunakan layanan ruang kerja profesional kami.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative rounded-3xl border border-neutral-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
            >
              <span className="font-display text-4xl font-bold text-navy/15">
                {s.step}
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-navy">
                {s.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
