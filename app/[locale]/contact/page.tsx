import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/site/forms";
import { PageHero } from "@/components/site/page-hero";
import { PhoneLink } from "@/components/site/phone-link";
import { WhatsAppTextLink } from "@/components/site/whatsapp-button";
import { SiteMap } from "@/components/site/site-map";
import { MAPS_URL } from "@/lib/seed-data";
import { getSiteData } from "@/lib/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return { title: t("title"), description: t("intro") };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const whatsapp = await getTranslations("whatsapp");
  const site = await getSiteData();
  const { settings } = site;
  const directions = MAPS_URL;
  return (
    <>
      <PageHero title={t("title")} crumb={t("title")} />
      <div className="page-body">
        <p className="max-w-xl text-[var(--ink-2)]">{t("intro")}</p>
        <div className="contact-box">
          <ContactForm services={site.services.map((item) => ({ slug: item.slug, title: item.title }))} />
          <div className="coords">
          <ul className="coord-list">
            <li>
              {t("phone")}{" "}
              <PhoneLink className="text-portail" href={settings.phoneHref}>
                {settings.phone}
              </PhoneLink>
            </li>
            <li>
              {t("fax")} {settings.fax}
            </li>
            <li>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                {settings.address}
              </a>
            </li>
            <li>
              <a className="text-portail" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </li>
            <li>{settings.hours}</li>
          </ul>
          <a href={directions} className="btn ghost" target="_blank" rel="noopener noreferrer">
            {t("route")}
          </a>
          {settings.whatsappNumber ? (
            <WhatsAppTextLink className="btn ghost" number={settings.whatsappNumber} message={settings.whatsappMessage}>
              {whatsapp("open")}
            </WhatsAppTextLink>
          ) : null}
          <SiteMap lat={settings.lat} lng={settings.lng} label={settings.address} />
          </div>
        </div>
      </div>
    </>
  );
}
