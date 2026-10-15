import { BadgeCheck, MessageCircle, ShieldCheck, Star } from "lucide-react";

const stats = [
  { value: "13.000+", label: "Bisnis Terlayani", icon: BadgeCheck },
  { value: "5 Menit", label: "Respon WhatsApp", icon: MessageCircle },
  { value: "4.9 ★", label: "Rating Google (700+)", icon: Star },
  { value: "100%", label: "Legal & Resmi", icon: ShieldCheck },
];

export function StatsBand() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="mx-auto w-full max-w-[1150px] px-6">
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-surface p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-card sm:p-4.5"
            >
              <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
                <stat.icon className="h-5 w-5" aria-hidden />
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
