import { MessageCircle } from "lucide-react";
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
    <section className="bg-navy text-white">
      <Container className="py-20 text-center sm:py-24">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
          {description}
        </p>
        <div className="mt-8">
          <Button href={whatsappFor(topic, locationName, whatsappNumber)} external variant="white" size="lg">
            <MessageCircle className="h-5 w-5" aria-hidden />
            Hubungi Kami
          </Button>
        </div>
      </Container>
    </section>
  );
}
