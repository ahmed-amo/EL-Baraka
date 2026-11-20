import type { SiteSettingsData } from "@/lib/types";
import { siteUrl } from "@/lib/utils";

export function JsonLd({ settings }: { settings: SiteSettingsData }) {
  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SecurityService"],
    name: "EL BARAKA CONSEIL",
    legalName: settings.legalName,
    foundingDate: String(settings.foundedYear),
    url: siteUrl(),
    image: `${siteUrl()}/Elbaraka-Logo.png`,
    logo: `${siteUrl()}/Elbaraka-Logo.png`,
    telephone: "+21321595959",
    faxNumber: "+21321585858",
    email: settings.email,
    description: settings.metaDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Jijel",
      addressCountry: "DZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.lat,
      longitude: settings.lng,
    },
    areaServed: { "@type": "Country", name: "Algérie" },
    knowsAbout: ["Gardiennage", "Sécurité privée", "Transport de fonds", "Télésurveillance", "Produits sensibles"],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
