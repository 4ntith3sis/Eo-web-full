import { Check, X } from "lucide-react";
import type { ComparisonRow } from "@/types";
import { Section } from "@/components/ui/section";

export function ComparisonTable({
  title = "Mengapa EasyOffice?",
  description = "Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice.",
  rows = [],
  showPkpNote = false,
}: {
  title?: string;
  description?: string;
  rows?: ComparisonRow[];
  showPkpNote?: boolean;
}) {
  const comparisonRows = rows ?? [];
  return (
    <Section eyebrow="Perbandingan" title={title} description={description} tone="gray">
      <div className="mx-auto w-full min-w-0 max-w-4xl">
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
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
                  {row.easyoffice === "true" || row.easyoffice === true ? (
                    <Check className="mx-auto h-5 w-5 text-navy" aria-label="Tersedia" />
                  ) : row.easyoffice === "false" || row.easyoffice === false ? (
                    <X className="mx-auto h-5 w-5 text-red-500" aria-label="Tidak tersedia" />
                  ) : (
                    <span className="text-xs font-medium text-neutral-500">Belum tentu tersedia</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-center">
                  {row.typical === "true" || row.typical === true ? (
                    <Check className="mx-auto h-5 w-5 text-neutral-400" aria-label="Tersedia" />
                  ) : row.typical === "false" || row.typical === false ? (
                    <X className="mx-auto h-5 w-5 text-red-400" aria-label="Tidak tersedia" />
                  ) : (
                    <span className="text-xs font-medium text-neutral-500">Belum tentu tersedia</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-neutral-400 lg:hidden">Geser tabel ke samping untuk melihat semua kolom.</p>
        {showPkpNote ? <p className="mt-3 text-xs text-neutral-400">* Pengajuan PKP mengikuti ketentuan perpajakan dan hasil verifikasi KPP.</p> : null}
      </div>
    </Section>
  );
}
