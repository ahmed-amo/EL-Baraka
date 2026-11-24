import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PhoneLink } from "./phone-link";
import { HeroFilm } from "./hero-film";

type Props = {
  video: string;
  poster: string;
  phone: string;
  phoneHref: string;
};

export async function HeroSection({ video, poster, phone, phoneHref }: Props) {
  const t = await getTranslations("hero");
  const locale = await getLocale();
  const rtl = locale === "ar";

  return (
    <section className="hero" id="accueil" data-rtl={rtl ? "1" : undefined}>
      <div className="hero-glow" aria-hidden />
      <div className="hero-noise" aria-hidden />
      <div className="hero-shell">
        <div className="hero-copy">
          <p className="hero-kicker hero-rise" style={{ ["--d" as string]: "0ms" }}>
            <span className="hero-kicker-line" aria-hidden />
            {t("kicker")}
          </p>
          <h1 id="h1" data-static="1" className="hero-title hero-rise" style={{ ["--d" as string]: "80ms" }}>
            <span className="hero-title-main">{t("titleA")}</span>
            <span className="hero-title-accent">{t("titleB")}</span>
          </h1>
          <p className="hero-sub hero-rise" style={{ ["--d" as string]: "160ms" }}>
            {t("subtitle")}
          </p>
          <ul className="hero-trust hero-rise" style={{ ["--d" as string]: "220ms" }}>
            <li>{t("trustSince")}</li>
            <li>{t("trustCity")}</li>
            <li>{t("trustLicensed")}</li>
            <li>{t("trustSensitive")}</li>
          </ul>
          <div className="hero-actions hero-rise" style={{ ["--d" as string]: "280ms" }}>
            <Link href="/contact" className="hero-btn-primary">
              <span>{t("quote")}</span>
              <span className="hero-btn-dot" aria-hidden>
                <svg viewBox="0 0 12 12" width="14" height="14" fill="none">
                  <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            <PhoneLink href={phoneHref} className="hero-btn-secondary">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
                <path
                  d="M6.6 3.8c.4-.4 1.1-.5 1.6-.2l2.3 1.4c.5.3.7.9.5 1.4l-1 2.3c-.1.4 0 .8.3 1.1l2.9 2.9c.3.3.7.4 1.1.3l2.3-1c.5-.2 1.1 0 1.4.5l1.4 2.3c.3.5.2 1.2-.2 1.6l-1.3 1.3c-.5.5-1.2.7-1.9.6-2-.3-4.8-1.7-7.5-4.4S4.5 9.2 4.2 7.2c-.1-.7.1-1.4.6-1.9L6.6 3.8Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                {t("call")}
                <em>{phone}</em>
              </span>
            </PhoneLink>
          </div>
        </div>
        <div className="hero-media hero-rise" style={{ ["--d" as string]: "120ms" }}>
          <HeroFilm src={video} poster={poster} alt="EL BARAKA CONSEIL — présentation" />
        </div>
      </div>
    </section>
  );
}
