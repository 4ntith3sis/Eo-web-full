import { MessageCircle, Phone } from "lucide-react";
import { whatsappFor } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface WhatsappCtaProps {
  title?: string;
  description?: string;
  topic?: string;
  locationName?: string;
  whatsappNumber?: string;
}

export function WhatsappCta({
  title = "Siap Menemukan Ruang Kerja yang Tepat?",
  description = "Hubungi EasyOffice melalui WhatsApp — tim kami siap membantu memilih layanan dan lokasi yang sesuai dengan kebutuhan bisnis Anda.",
  topic = "layanan",
  locationName,
  whatsappNumber,
}: WhatsappCtaProps) {
  return (
    <section className="bg-white">
      <Container className="py-10 sm:py-12 lg:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-12 text-center text-white shadow-card sm:px-10 sm:py-14 lg:py-16">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/5"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-white/5"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-white/[0.04] blur-2xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
              {description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href={whatsappFor(topic, locationName, whatsappNumber)}
                external
                variant="white"
                size="lg"
                className="rounded-full px-9"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Hubungi via WhatsApp
              </Button>
              <Button
                href="/kontak"
                variant="outline-white"
                size="lg"
                className="rounded-full px-9"
              >
                <Phone className="h-5 w-5" aria-hidden />
                Lihat Info Kontak
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
