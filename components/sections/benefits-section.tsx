import {
  Building2,
  Clock,
  Headset,
  Laptop,
  MapPin,
  Presentation,
  Sparkles,
  Users,
  Video,
  Wallet,
  Wifi,
} from "lucide-react";
import { Section } from "@/components/ui/section";

const icons = { wallet: Wallet, laptop: Laptop, building: Building2, headset: Headset, "map-pin": MapPin, presentation: Presentation, wifi: Wifi, users: Users, clock: Clock, video: Video } as Record<string, typeof Wallet>;

export function BenefitsSection({ items = [], title, description, eyebrow = "Manfaat" }: { serviceSlug?: string; items?: { icon: string; title: string; description: string }[]; title?: string; description?: string; eyebrow?: string }) {
  const displayItems = items.filter((item, index, list) => list.findIndex((candidate) => candidate.title.trim().toLowerCase() === item.title.trim().toLowerCase()) === index);
  const layoutClass = displayItems.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-6";
  return (
    <Section eyebrow={eyebrow} title={title ?? ""} description={description}>
      <div className={`grid gap-5 sm:grid-cols-2 ${layoutClass}`}>
        {displayItems.map((item, index) => {
          const Icon = icons[item.icon] ?? Sparkles;
          return <div key={item.title} className={`rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/30 hover:shadow-card ${displayItems.length !== 4 ? "lg:col-span-2" : ""} ${displayItems.length === 5 && index === 3 ? "lg:col-start-2" : ""} ${displayItems.length === 5 && index === 4 ? "lg:col-start-4" : ""}`}><span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-white shadow-soft"><Icon className="h-5 w-5" aria-hidden /></span><h3 className="mt-4 font-display text-sm font-bold text-navy">{item.title}</h3><p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{item.description}</p></div>;
        })}
      </div>
    </Section>
  );
}
