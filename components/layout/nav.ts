export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  /** Omitted for dropdown parents that toggle instead of navigating. */
  href?: string;
  children?: NavChild[];
}

export const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Layanan",
    children: [
      {
        label: "Virtual Office",
        href: "/layanan/virtual-office",
        description: "Alamat bisnis profesional",
      },
      {
        label: "Coworking Space",
        href: "/layanan/coworking-space",
        description: "Ruang kerja fleksibel",
      },
      {
        label: "Meeting Room",
        href: "/layanan/meeting-room",
        description: "Ruang meeting per jam",
      },
    ],
  },
  { label: "Promo", href: "/promo" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Kontak", href: "/kontak" },
];
