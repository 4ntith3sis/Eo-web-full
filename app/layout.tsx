import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"}/api/globals/site-settings`, { next: { revalidate: 30 } });
    const site = response.ok ? await response.json() : {};
    return { title: { default: site.defaultSeoTitle ?? "EasyOffice — Virtual Office, Coworking Space & Meeting Room", template: "%s | EasyOffice" }, description: site.defaultSeoDescription ?? "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room profesional di Bandung, Jakarta, dan Bekasi." };
  } catch {
    return { title: { default: "EasyOffice — Virtual Office, Coworking Space & Meeting Room", template: "%s | EasyOffice" }, description: "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room profesional di Bandung, Jakarta, dan Bekasi." };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body>{children}</body>
    </html>
  );
}
