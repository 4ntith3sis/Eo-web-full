import { ArrowRight, Briefcase, DoorOpen, Users } from "lucide-react";
import { services } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

const icons: Record<string, typeof Briefcase> = {
  "virtual-office": Briefcase,
  "coworking-space": Users,
  "meeting-room": DoorOpen,
};

export function ServicesOverview({
  title = "Layanan EasyOffice",
  description = "Tiga layanan utama untuk mendukung operasional dan citra profesional bisnis Anda.",
  tone = "white",
}: {
  title?: string;
  description?: string;
  tone?: "white" | "gray";
}) {
  return (
    <Section eyebrow="Layanan" title={title} description={description} tone={tone}>
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service) => {
          const Icon = icons[service.slug] ?? Briefcase;
          return (
            <Card key={service.slug} className="flex flex-col">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {service.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-2">
                <Button href={service.href} variant="outline" size="sm">
                  Lihat {service.shortTitle}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
