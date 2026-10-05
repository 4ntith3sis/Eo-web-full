import {
  Building2,
  Clock,
  Headset,
  Laptop,
  MapPin,
  Presentation,
  Users,
  Video,
  Wallet,
  Wifi,
} from "lucide-react";
import { Section } from "@/components/ui/section";

interface Benefit {
  icon: typeof Wallet;
  title: string;
  description: string;
}

const voBenefits: Benefit[] = [
  {
    icon: Wallet,
    title: "Hemat Biaya",
    description:
      "Menghemat biaya signifikan karena tidak perlu menyewa ruang kantor fisik, membeli peralatan kantor, atau membayar utilitas dan biaya pemeliharaan lainnya.",
  },
  {
    icon: Laptop,
    title: "Fleksibilitas Kerja",
    description:
      "Virtual office memungkinkan Anda dan tim Anda bekerja dari mana saja, memberikan fleksibilitas untuk bekerja dari rumah atau lokasi lain yang lebih nyaman.",
  },
  {
    icon: Building2,
    title: "Naikan Citra Perusahaan",
    description:
      "Easy Office memberikan alamat di lokasi strategis yang dapat meningkatkan citra profesional perusahaan Anda. Alamat ini bisa digunakan untuk kartu bisnis dan registrasi perusahaan.",
  },
  {
    icon: Headset,
    title: "Layanan Pendukung Bisnis",
    description:
      "Menyediakan berbagai layanan pendukung seperti pengelolaan surat, penanganan panggilan telepon, dan resepsionis profesional yang meningkatkan efisiensi operasional.",
  },
  {
    icon: MapPin,
    title: "Jangkauan Bisnis Luas",
    description:
      "Dengan alamat di kota-kota strategis, bisnis Anda lebih mudah dijangkau klien dan mitra di Jakarta, Bandung, dan Bekasi.",
  },
  {
    icon: Presentation,
    title: "Fasilitas Meeting Room",
    description:
      "Akses ke fasilitas meeting room yang bisa digunakan untuk pertemuan dengan klien atau sesi brainstorming dengan tim, dilengkapi dengan peralatan modern.",
  },
];

const coworkingBenefits: Benefit[] = [
  {
    icon: Wallet,
    title: "Biaya Fleksibel",
    description:
      "Bayar sesuai kebutuhan — harian, mingguan, atau bulanan — tanpa komitmen sewa jangka panjang dan tanpa biaya peralatan kantor.",
  },
  {
    icon: Wifi,
    title: "Fasilitas Lengkap",
    description:
      "Internet berkecepatan tinggi, area kerja nyaman, pantry, dan fasilitas pendukung lainnya siap digunakan kapan saja.",
  },
  {
    icon: Users,
    title: "Komunitas Profesional",
    description:
      "Bekerja berdampingan dengan profesional dan pelaku bisnis lain membuka peluang kolaborasi dan networking.",
  },
  {
    icon: Clock,
    title: "Jam Operasional Luas",
    description:
      "Akses fleksibel sesuai jam kerja Anda, dengan staf yang membantu kebutuhan harian di area kerja.",
  },
  {
    icon: MapPin,
    title: "Lokasi Strategis",
    description:
      "Berada di pusat bisnis kota, memudahkan Anda bertemu klien dan mengakses transportasi umum.",
  },
  {
    icon: Headset,
    title: "Dukungan Harian",
    description:
      "Resepsionis dan tim pendukung membantu urusan resepsionis, surat-menyurat, dan kebutuhan operasional lainnya.",
  },
];

const meetingRoomBenefits: Benefit[] = [
  {
    icon: Presentation,
    title: "Ruang Profesional",
    description:
      "Ruang meeting representatif dengan tata ruang nyaman untuk presentasi, wawancara, dan rapat bisnis.",
  },
  {
    icon: Video,
    title: "Peralatan Modern",
    description:
      "Dilengkapi proyektor, layar presentasi, whiteboard, dan koneksi internet stabil untuk meeting yang produktif.",
  },
  {
    icon: Clock,
    title: "Pesan Per Jam",
    description:
      "Sewa fleksibel per jam sesuai kebutuhan — efisien untuk pertemuan singkat maupun sesi workshop panjang.",
  },
  {
    icon: Wallet,
    title: "Harga Terjangkau",
    description:
      "Biaya lebih hemat dibanding menyewa ruang rapat permanen, tanpa komitmen jangka panjang.",
  },
  {
    icon: MapPin,
    title: "Lokasi Mudah Dijangkau",
    description:
      "Alamat prestisius di pusat kota memudahkan klien dan tim menemukan lokasi pertemuan.",
  },
  {
    icon: Laptop,
    title: "Konektivitas Terjamin",
    description:
      "Wi-Fi cepat dan colokan listrik di setiap kursi memastikan perangkat tetap terhubung selama meeting.",
  },
];

const benefitsByService: Record<string, { title: string; description: string; items: Benefit[] }> = {
  "virtual-office": {
    title: "Manfaat Virtual Office Untuk Bisnis Anda",
    description:
      "Pahami lebih lanjut tentang pentingnya virtual office untuk keperluan bisnis Anda.",
    items: voBenefits,
  },
  "coworking-space": {
    title: "Manfaat Coworking Space Untuk Bisnis Anda",
    description:
      "Pahami lebih lanjut tentang pentingnya coworking space untuk keperluan bisnis Anda.",
    items: coworkingBenefits,
  },
  "meeting-room": {
    title: "Manfaat Meeting Room Untuk Bisnis Anda",
    description:
      "Pahami lebih lanjut tentang pentingnya meeting room untuk keperluan bisnis Anda.",
    items: meetingRoomBenefits,
  },
};

export function BenefitsSection({ serviceSlug = "virtual-office" }: { serviceSlug?: string }) {
  const content = benefitsByService[serviceSlug] ?? benefitsByService["virtual-office"];
  return (
    <Section
      eyebrow="Manfaat"
      title={content.title}
      description={content.description}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((b) => (
          <div
            key={b.title}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/30 hover:shadow-card"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
              <b.icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 font-display text-sm font-bold text-navy">
              {b.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
              {b.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
