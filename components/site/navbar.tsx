"use client";

import { ArrowLeft, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { DotButton } from "./dot-button";
import { PhoneLink } from "./phone-link";
import { SocialLinks } from "./social-links";

type NavContact = {
  phone: string;
  phoneHref: string;
  email: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
};

const links = [
  { href: "/#apropos", key: "about" },
  { href: "/#services", key: "services" },
  { href: "/#galerie", key: "gallery" },
  { href: "/recrutement", key: "recruitment" },
] as const;

export function Navbar({ contact }: { contact: NavContact }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function scrollToId(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const timer = window.setTimeout(() => scrollToId(id), 40);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  function onSectionClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    const id = href.split("#")[1];
    if (!id || pathname !== "/") return;
    event.preventDefault();
    window.history.pushState(null, "", `#${id}`);
    scrollToId(id);
  }

  function switchLocale(next: AppLocale) {
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  return (
    <>
      <header id="nav" className="nav">
        <Link href="/#accueil" className="brand" aria-label="El Baraka Conseil" scroll={false} onClick={(event) => onSectionClick(event, "/#accueil")}>
          <Image src="/Elbaraka-Logo.png" alt="" width={64} height={64} priority />
          El Baraka Conseil
        </Link>
        <nav className="navlinks" aria-label="Navigation principale">
          {links.map((link) => (
            <Link key={link.href} href={link.href} scroll={link.href.includes("#") ? false : undefined} className={pathname === link.href ? "active" : undefined} onClick={(event) => onSectionClick(event, link.href)}>
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <div className="langs" aria-label={t("language")}>
            <button type="button" aria-pressed={locale === "fr"} onClick={() => switchLocale("fr")}>
              FR
            </button>
            <button type="button" aria-pressed={locale === "ar"} onClick={() => switchLocale("ar")}>
              AR
            </button>
          </div>
          <div className="navcta">
            <DotButton href="/contact">{t("contact")}</DotButton>
          </div>
          <button type="button" className="burger" aria-expanded={open} aria-label={open ? t("close") : t("open")} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {open ? (
        <nav className="sheet" aria-label="Navigation principale">
          <button type="button" className="sheet-back" onClick={() => setOpen(false)}>
            <ArrowLeft aria-hidden />
            {t("back")}
          </button>
          {links.map((link) => (
            <Link key={link.href} href={link.href} scroll={link.href.includes("#") ? false : undefined} onClick={(event) => onSectionClick(event, link.href)}>
              {t(link.key)}
            </Link>
          ))}
          <DotButton href="/contact">{t("contact")}</DotButton>
          <div className="sheet-extra">
            <PhoneLink className="sheet-chip" href={contact.phoneHref}>
              {contact.phone}
            </PhoneLink>
            <a className="sheet-chip" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <SocialLinks
              facebookUrl={contact.facebookUrl}
              linkedinUrl={contact.linkedinUrl}
              instagramUrl={contact.instagramUrl}
            />
          </div>
        </nav>
      ) : null}
    </>
  );
}
