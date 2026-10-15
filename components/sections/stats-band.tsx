import { BadgeCheck, MessageCircle, ShieldCheck, Star } from "lucide-react";

const stats = [
  { value: "13.000+", label: "Bisnis Terlayani", icon: BadgeCheck },
  { value: "5 Menit", label: "Respon WhatsApp", icon: MessageCircle },
  { value: "4.9 ★", label: "Rating Google (700+)", icon: Star },
  { value: "100%", label: "Legal & Resmi", icon: ShieldCheck },
];

export function StatsBand() {
  return (
    <section className="relative z-10 -mt-8 sm:-mt-10 lg:-mt-12">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 shadow-card lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1.5 bg-white px-3 py-5 text-center sm:px-4 sm:py-6"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-navy text-white shadow-soft">
                <stat.icon className="h-4 w-4" aria-hidden />
              </span>
              <strong className="font-display text-xl font-bold leading-none text-navy sm:text-2xl">
                {stat.value}
              </strong>
              <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-neutral-500 sm:text-[11px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
