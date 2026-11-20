import type { Metadata } from "next";
import { Poppins, Tajawal } from "next/font/google";
import { Toaster } from "sonner";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "EL BARAKA CONSEIL",
  description:
    "Gardiennage, sécurisation, transport de fonds et produits sensibles. Plus de 30 ans d'expertise. Siège social à Jijel.",
  icons: { icon: "/Elbaraka-Logo.png", apple: "/Elbaraka-Logo.png" },
};

/** Keep the root layout static. Locale lang/dir are set client-side by LocaleHtml. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className={`${poppins.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
