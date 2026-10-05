import { locations } from "@/lib/data/mock-data";

const stats = [
  { value: "13.000+", label: "Bisnis Terlayani" },
  { value: "24/7", label: "Dukungan" },
  { value: "4.9 ★", label: "Rating Google (700+)" },
  { value: String(locations.length), label: "Kota" },
];

export function StatsBand() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="grid grid-cols-2 overflow-hidden rounded-3xl bg-navy shadow-card lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={
                "flex min-h-[112px] flex-col items-center justify-center px-6 py-6 text-center" +
                (i < stats.length - 1 ? " border-white/15 lg:border-r" : "") +
                (i < 2 ? " border-b border-white/15 lg:border-b-0" : "")
              }
            >
              <strong className="font-display text-4xl font-bold leading-none text-white">
                {stat.value}
              </strong>
              <span className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
