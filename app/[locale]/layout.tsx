import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Atmosphere } from "@/components/site/atmosphere";
import { CookieBanner } from "@/components/site/cookie-banner";
import { Footer } from "@/components/site/footer";
import { LocaleHtml } from "@/components/site/locale-html";
import { GoogleAnalytics } from "@/components/site/google-analytics";
import { JsonLd } from "@/components/site/json-ld";
import { Navbar } from "@/components/site/navbar";
import { Tracker } from "@/components/site/tracker";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { routing, type AppLocale } from "@/i18n/routing";
import { getSiteData } from "@/lib/site-data";

/** Public shell: ISR indefinitely; admin writes call revalidateSite(). */
export const revalidate = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getSiteData();
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = locale === "ar" ? t("title") : site.settings.metaTitle || t("title");
  const description = locale === "ar" ? t("description") : site.settings.metaDescription || t("description");
  const verification = process.env.GOOGLE_SITE_VERIFICATION;
  return {
    title: { default: title, template: "%s · EL BARAKA CONSEIL" },
    description,
    keywords:
      locale === "ar"
        ? ["حراسة", "أمن خاص", "نقل الأموال", "الجزائر", "جيجل", "البركة كونساي"]
        : ["gardiennage", "sécurité privée", "transport de fonds", "Algérie", "Jijel", "EL BARAKA CONSEIL"],
    alternates: {
      canonical: locale === "ar" ? "/ar" : "/",
      languages: { fr: "/", ar: "/ar" },
    },
    openGraph: {
      title,
      description,
      locale: locale === "ar" ? "ar_DZ" : "fr_DZ",
      type: "website",
      images: ["/Elbaraka-Logo.png"],
    },
    twitter: { card: "summary_large_image", title, description },
    ...(verification ? { verification: { google: verification } } : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as AppLocale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("a11y");
  const site = await getSiteData();
  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtml />
      <div className={locale === "ar" ? "locale-ar" : undefined}>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-white focus:px-4 focus:py-2">
          {t("skip")}
        </a>
        <JsonLd settings={site.settings} />
        <Atmosphere />
        <Navbar
          contact={{
            phone: site.settings.phone,
            phoneHref: site.settings.phoneHref,
            email: site.settings.email,
            facebookUrl: site.settings.facebookUrl,
            linkedinUrl: site.settings.linkedinUrl,
            instagramUrl: site.settings.instagramUrl,
          }}
        />
        <main id="contenu">{children}</main>
        <Footer site={site} />
        {site.settings.whatsappNumber ? (
          <WhatsAppButton
            number={site.settings.whatsappNumber}
            message={site.settings.whatsappMessage}
            services={site.services.map((service) => ({ slug: service.slug, title: service.title }))}
          />
        ) : null}
        <CookieBanner />
        <Tracker />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} /> : null}
      </div>
    </NextIntlClientProvider>
  );
}
