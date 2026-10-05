import { Check, Minus } from "lucide-react";
import { comparisonRows } from "@/lib/data/mock-data";
import { Section } from "@/components/ui/section";

export function ComparisonTable({
  title = "Mengapa EasyOffice?",
  description = "Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Section eyebrow="Perbandingan" title={title} description={description} tone="gray">
      <div className="mx-auto max-w-4xl overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-navy text-white">
              <th scope="col" className="px-5 py-4 font-semibold">Fitur</th>
              <th scope="col" className="px-5 py-4 text-center font-semibold">EasyOffice</th>
              <th scope="col" className="px-5 py-4 text-center font-semibold">
                Penyedia Lain (Umumnya)
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, i) => (
              <tr key={row.feature} className={i % 2 === 1 ? "bg-surface" : "bg-white"}>
                <td className="px-5 py-3.5 font-medium text-neutral-800">{row.feature}</td>
                <td className="px-5 py-3.5 text-center">
                  {row.easyoffice ? (
                    <Check className="mx-auto h-5 w-5 text-navy" aria-label="Tersedia" />
                  ) : (
                    <Minus className="mx-auto h-5 w-5 text-neutral-300" aria-label="Tidak tersedia" />
                  )}
                </td>
                <td className="px-5 py-3.5 text-center">
                  {row.typical ? (
                    <Check className="mx-auto h-5 w-5 text-neutral-400" aria-label="Tersedia" />
                  ) : (
                    <Minus className="mx-auto h-5 w-5 text-neutral-300" aria-label="Tidak tersedia" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
