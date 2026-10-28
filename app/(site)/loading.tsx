export default function SiteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-white" role="status" aria-label="Memuat halaman">
      <div className="flex items-center gap-3 text-sm font-medium text-navy/70">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy/15 border-t-navy" aria-hidden="true" />
        Memuat halaman...
      </div>
    </div>
  );
}
