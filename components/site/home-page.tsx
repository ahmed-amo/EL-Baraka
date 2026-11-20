import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GATE_PHOTO } from "@/lib/brand";
import { MAPS_URL } from "@/lib/seed-data";
import type { PublicSite } from "@/lib/types";
import { CountUp } from "./count-up";
import { DotButton } from "./dot-button";
import { ContactForm } from "./forms";
import { GalleryStrip } from "./gallery-strip";
import { HeroSection } from "./hero-section";
import { SiteMap } from "./site-map";
import { PhoneLink } from "./phone-link";
import { WhatsAppTextLink } from "./whatsapp-button";
import { FaqJsonLd } from "./json-ld";
import { RevealTitle } from "./reveal-title";

export async function HomePage({ site }: { site: PublicSite }) {
  const t = await getTranslations();
  const { settings, services, companies, gallery } = site;
  const faq = t.raw("faq.items") as { q: string; a: string }[];
  const splitTitle = t("home.splitTitle").split("\n");
  const poster = !settings.heroPosterUrl || settings.heroPosterUrl.endsWith(".svg") ? GATE_PHOTO : settings.heroPosterUrl;
  const heroVideo = settings.heroVideoUrl || "/videos/hero.mp4";
  const mid = Math.ceil(companies.length / 2);
  const logoRows = [companies.slice(0, mid), companies.slice(mid)].map((row) => {
    const base = row.length ? row : companies;
    const filled = [...base];
    while (filled.length && filled.length < 8) filled.push(...base);
    return [...filled, ...filled];
  });

  return (
    <>
      <HeroSection
        video={heroVideo}
        poster={poster}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />

      <section className="band" id="chiffres">
        <RevealTitle className="section-title js-reveal">En chiffres</RevealTitle>
        <div className="chiffres">
          <div>
            <p className="num">
              <CountUp value={settings.years} />
              <span className="plus">+</span>
            </p>
            <span className="label">{t("stats.years")}</span>
          </div>
          <div>
            <p className="num">
              <CountUp value={settings.employees} />
              <span className="plus">+</span>
            </p>
            <span className="label">{t("stats.employees")}</span>
          </div>
          <div>
            <p className="num">
              <CountUp value={settings.partners} />
              <span className="plus">+</span>
            </p>
            <span className="label">{t("stats.partners")}</span>
          </div>
          <div>
            <p className="num">
              <CountUp value={settings.servicesCount} />
              <span className="plus">+</span>
            </p>
            <span className="label">{t("stats.services")}</span>
          </div>
        </div>
        <div className="logo-rows" aria-label="Partenaires">
          {logoRows.map((row, index) => (
            <div key={index} className={index === 1 ? "marquee rev" : "marquee"}>
              <ul>
                {row.map((company, i) => (
                  <li key={`${company.id}-${i}`} aria-hidden={i >= row.length / 2}>
                    <Image src={company.logoUrl} alt={i >= row.length / 2 ? "" : company.name} width={340} height={170} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="split" id="split">
        <div className="l">
          <span className="guide" aria-hidden />
          <RevealTitle as="h2" id="h2">
            {splitTitle[0]}
            {splitTitle[1] ? (
              <>
                <br />
                {splitTitle[1]}
              </>
            ) : null}
          </RevealTitle>
          <div id="row">
            <h3>Nos services</h3>
            <div>
              <p>{t("home.servicesLead")}</p>
              <DotButton href="/#services" ghost dark>
                Voir tous les services
              </DotButton>
            </div>
          </div>
        </div>
        <div className="r">
          {settings.heroVideoUrl ? (
            <video id="ship" autoPlay muted loop playsInline preload="metadata" poster={poster}>
              {settings.heroVideoWebmUrl ? <source src={settings.heroVideoWebmUrl} type="video/webm" /> : null}
              <source src={settings.heroVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <div id="ship">
              <Image src={poster} alt="Agent de gardiennage devant un portail bleu à Jijel" fill priority sizes="42vw" />
            </div>
          )}
        </div>
      </section>

      <section className="band" id="services">
        <RevealTitle className="section-title js-reveal">Nos services</RevealTitle>
        <div className="tiles">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`} className="tile">
              <div className="pic">
                <Image src={service.imageUrl} alt={service.title} fill sizes="(max-width: 820px) 100vw, 25vw" />
              </div>
              <h3>{service.title}</h3>
              <p>{service.shortDescription}</p>
              <span className="mini" aria-hidden>
                <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                  <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="#0b1d3a" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="band" id="apropos">
        <RevealTitle className="section-title js-reveal">À propos</RevealTitle>
        <div className="about-grid">
          <Image src={settings.aboutImageUrl || GATE_PHOTO} alt={t("about.alt")} width={900} height={1100} className="rounded-[24px] object-cover" />
          <div>
            <p>{t.rich("about.p1", { b: (chunks) => <strong>{chunks}</strong> })}</p>
            <p className="mt-4">{t.rich("about.p2", { b: (chunks) => <strong>{chunks}</strong> })}</p>
            <DotButton href="/contact">{t("hero.quote")}</DotButton>
          </div>
        </div>
      </section>

      <section className="band" id="galerie">
        <RevealTitle className="section-title js-reveal">Sur le terrain</RevealTitle>
        <GalleryStrip images={gallery} field={t("gallery.field")} inside={t("gallery.inside")} />
        <div className="mt-8">
          <DotButton href="/galerie">Voir la galerie</DotButton>
        </div>
      </section>

      <section className="band dark">
        <RevealTitle className="section-title js-reveal" onDark>
          Rejoignez nos équipes
        </RevealTitle>
        <p className="mt-4 max-w-xl text-white/70">Des équipes formées, des véhicules aménagés, une mission claire. Envoyez votre candidature.</p>
        <div className="mt-8">
          <DotButton href="/recrutement" light>
            Postuler
          </DotButton>
        </div>
      </section>

      <section className="band" id="faq">
        <RevealTitle className="section-title js-reveal">{t("faq.title")}</RevealTitle>
        <p className="faq-intro">{t("faq.intro")}</p>
        <div className="faq">
          {faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <FaqJsonLd items={faq} />
      </section>

      <section className="band" id="contact">
        <RevealTitle className="section-title js-reveal">{t("contact.title")}</RevealTitle>
        <div className="contact-box">
          <ContactForm services={services.map((item) => ({ slug: item.slug, title: item.title }))} />
          <div className="coords">
            <SiteMap lat={settings.lat} lng={settings.lng} label={settings.address} />
            <ul className="coord-list">
              <li>
                {t("contact.phone")} <PhoneLink href={settings.phoneHref}>{settings.phone}</PhoneLink>
              </li>
              <li>
                {t("contact.fax")} {settings.fax}
              </li>
              <li>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                  {settings.address}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            </ul>
            {settings.whatsappNumber ? (
              <div className="mt-6">
                <WhatsAppTextLink className="btn ghost" number={settings.whatsappNumber} message={settings.whatsappMessage}>
                  {t("whatsapp.open")}
                </WhatsAppTextLink>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
