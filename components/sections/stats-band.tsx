import { Award, BadgeCheck, Banknote, Building2, CalendarDays, Check, Clock3, Globe2, Headphones, MapPin, MessageCircle, Rocket, ShieldCheck, ShoppingBag, Star, Target, Trophy, Users, BriefcaseBusiness, Zap, Handshake, Heart, WalletCards } from "lucide-react";

const stats = [
  { value: "13.000+", label: "Bisnis Terlayani", icon: "users" },
  { value: "5 Menit", label: "Respon WhatsApp", icon: "check" },
  { value: "4.9 ★", label: "Rating Google (700+)", icon: "star" },
  { value: "100%", label: "Legal & Resmi", icon: "shield" },
];

export function StatsBand({ items = stats }: { items?: Array<{ value: string; label: string; icon?: string }> }) {
  const iconForStat = (label: string, index: number, configuredIcon?: string) => {
    const configured = { location: MapPin, users: Users, briefcase: BriefcaseBusiness, star: Star, shield: ShieldCheck, check: Check, message: MessageCircle, clock: Clock3, target: Target, building: Building2, award: Award, banknote: Banknote, calendar: CalendarDays, globe: Globe2, headset: Headphones, rocket: Rocket, shopping: ShoppingBag, trophy: Trophy, zap: Zap, handshake: Handshake, heart: Heart, wallet: WalletCards }[configuredIcon ?? ""];
    if (configuredIcon && configuredIcon !== "auto" && configured) return configured;
    const normalized = label.toLowerCase();
    if (normalized.includes("kota") || normalized.includes("lokasi")) return MapPin;
    if (normalized.includes("client") || normalized.includes("bisnis")) return Users;
    if (normalized.includes("rating") || normalized.includes("google")) return Star;
    if (normalized.includes("legal") || normalized.includes("resmi")) return ShieldCheck;
    return [Users, BadgeCheck, Star, ShieldCheck][index % 4];
  };
  return (
      <section className="relative z-10 -mt-8 bg-gradient-to-b from-navy-950/5 via-white to-white pb-8 pt-0 sm:-mt-10 sm:pb-10">
        <div className="mx-auto w-full max-w-[1150px] px-6">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/95 shadow-card backdrop-blur-sm lg:grid-cols-4">
          {items.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative flex items-center gap-3.5 border-b border-r border-neutral-200/80 p-4 transition-colors duration-300 hover:bg-navy/[0.025] sm:p-5 lg:border-b-0"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy/5 text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                 {(() => { const Icon = iconForStat(stat.label, index, stat.icon); return <Icon className="h-5 w-5" aria-hidden />; })()}
              </span>
              <div className="min-w-0">
                <strong className="font-display block text-xl font-bold tracking-tight text-navy sm:text-2xl">
                  {stat.value}
                </strong>
                <span className="mt-0.5 block truncate text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
