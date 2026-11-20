import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MAPS_URL } from "@/lib/seed-data";
import type { PublicSite } from "@/lib/types";
import { ManageCookies } from "./manage-cookies";
import { PhoneLink } from "./phone-link";
import { SocialLinks } from "./social-links";

export async function Footer({ site }: { site: PublicSite }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = new Date().getFullYear();
  const { settings, services } = site;
  return (
    <footer className="site-footer">
      <div className="cols">
        <div className="footer-brand">
          <Image className="footer-logo" src="/Elbaraka-Logo.png" alt="El Baraka Conseil" width={160} height={160} />
          <div>
            <p className="max-w-xs text-sm text-white/70">{t("blurb")}</p>
            <p className="mt-3 text-sm">
              <PhoneLink href={settings.phoneHref}>{settings.phone}</PhoneLink>
              <br />
              Fax {settings.fax}
              <br />
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                {settings.address}
              </a>
            </p>
            <div className="mt-3">
              <SocialLinks facebookUrl={settings.facebookUrl} linkedinUrl={settings.linkedinUrl} instagramUrl={settings.instagramUrl} />
            </div>
          </div>
        </div>
        <div>
          <h2>{t("company")}</h2>
          <ul>
            <li><Link href="/#apropos">{nav("about")}</Link></li>
            <li><Link href="/contact">{nav("contact")}</Link></li>
            <li><Link href="/politique-de-confidentialite">{t("privacy")}</Link></li>
            <li><ManageCookies label={t("manage")} /></li>
          </ul>
        </div>
        <div>
          <h2>{nav("services")}</h2>
          <ul>
            {services.slice(0, 6).map((service) => (
              <li key={service.id}>
                <Link href={`/services/${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{nav("gallery")}</h2>
          <ul>
            <li><Link href="/galerie">{nav("gallery")}</Link></li>
            <li><Link href="/recrutement">{nav("recruitment")}</Link></li>
            <li><Link href="/cookies">{t("cookies")}</Link></li>
          </ul>
        </div>
      </div>
      <p className="mt-6 text-xs text-white/50">
        © {year} {settings.legalName}. {settings.capital}, {settings.foundedYear}
      </p>
    </footer>
  );
}
