import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { whatsappUrl } from "@/lib/whatsapp";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "EasyOffice — Virtual Office, Coworking Space & Meeting Room",
    template: "%s | EasyOffice",
  },
  description:
    "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room profesional di Bandung, Jakarta, dan Bekasi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${outfit.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-neutral-800">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <a
          href={whatsappUrl("Halo EasyOffice, saya ingin bertanya tentang layanan Anda.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi EasyOffice via WhatsApp"
          className="fixed bottom-5 right-5 z-50 inline-flex h-13 w-13 items-center justify-center rounded-full bg-navy p-3.5 text-white shadow-lg transition-colors hover:bg-navy/90"
        >
          <MessageCircle className="h-6 w-6" aria-hidden />
        </a>
      </body>
    </html>
  );
}
