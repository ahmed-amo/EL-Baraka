"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { readConsent } from "./tracker";

type Choice = { necessary: true; analytics: boolean; marketing: boolean; v: string };

const CONSENT_VERSION = "2026-10-29";

async function save(choice: Choice) {
  document.cookie = `eb_consent=${encodeURIComponent(JSON.stringify(choice))}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  try {
    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analytics: choice.analytics, marketing: choice.marketing }),
    });
  } catch {
    // Banner choice still applies via cookie even if the API is briefly unavailable.
  }
  window.dispatchEvent(new Event("eb:consent-changed"));
}

export function CookieBanner() {
  const t = useTranslations("consent");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setOpen(!readConsent());
    setReady(true);
    const reopen = () => {
      setCustom(false);
      setOpen(true);
    };
    window.addEventListener("eb:cookies", reopen);
    return () => window.removeEventListener("eb:cookies", reopen);
  }, []);

  if (!ready || !open) return null;

  return (
    <div className="cookie-card no-print" role="dialog" aria-labelledby="cookie-title" aria-live="polite">
      <h2 id="cookie-title" className="cookie-title">
        {t("title")}
      </h2>
      <p className="cookie-body">{t("body")}</p>
      {custom ? (
        <div className="cookie-choices">
          <ChoiceRow title={t("necessary")} help={t("necessaryHelp")} checked disabled onChange={() => undefined} />
          <ChoiceRow title={t("analytics")} help={t("analyticsHelp")} checked={analytics} onChange={setAnalytics} />
          <ChoiceRow title={t("marketing")} help={t("marketingHelp")} checked={marketing} onChange={setMarketing} />
        </div>
      ) : null}
      <div className="cookie-actions">
        <button
          type="button"
          className="cookie-btn is-primary"
          onClick={() =>
            void save(
              custom
                ? { necessary: true, analytics, marketing, v: CONSENT_VERSION }
                : { necessary: true, analytics: true, marketing: false, v: CONSENT_VERSION },
            ).then(() => setOpen(false))
          }
        >
          {custom ? t("save") : t("accept")}
        </button>
        <button type="button" className="cookie-btn is-ghost" onClick={() => setCustom((value) => !value)}>
          {t("customize")}
        </button>
        <button
          type="button"
          className="cookie-btn is-text"
          onClick={() => void save({ necessary: true, analytics: false, marketing: false, v: CONSENT_VERSION }).then(() => setOpen(false))}
        >
          {t("reject")}
        </button>
      </div>
    </div>
  );
}

function ChoiceRow({
  title,
  help,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  help: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="cookie-choice">
      <input type="checkbox" checked={checked || !!disabled} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <span>
        <strong>{title}</strong>
        <em>{help}</em>
      </span>
    </label>
  );
}
