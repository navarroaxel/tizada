import type { Metadata } from "next";
import { Literata, Schibsted_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/content/site";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tizada.vercel.app"),
  title: { default: `${site.name}: ${site.title}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: `${site.name}: ${site.title}`,
    description: site.description,
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${schibsted.variable} ${literata.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main id="contenido" className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
