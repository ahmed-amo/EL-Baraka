"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { readConsent } from "./tracker";

type Choice = { necessary: true; analytics: boolean; marketing: boolean; v: string };

async function save(choice: Choice) {
  document.cookie = `eb_consent=${encodeURIComponent(JSON.stringify(choice))}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  await fetch("/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analytics: choice.analytics, marketing: choice.marketing }),
  });
  window.dispatchEvent(new Event("eb:consent-changed"));
}

export function CookieBanner() {
  const t = useTranslations("consent");
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!readConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("eb:cookies", reopen);
    return () => window.removeEventListener("eb:cookies", reopen);
  }, []);

  if (!open) return null;

  return (
    <div className="cookie-card no-print" role="dialog" aria-labelledby="cookie-title">
      <h2 id="cookie-title" className="text-base font-medium">
        {t("title")}
      </h2>
      <p className="mt-2 leading-relaxed text-[var(--ink-2)]">{t("body")}</p>
      {custom ? (
        <div className="mt-4 space-y-3 text-sm">
          <ChoiceRow title={t("necessary")} help={t("necessaryHelp")} checked disabled onChange={() => undefined} />
          <ChoiceRow title={t("analytics")} help={t("analyticsHelp")} checked={analytics} onChange={setAnalytics} />
          <ChoiceRow title={t("marketing")} help={t("marketingHelp")} checked={marketing} onChange={setMarketing} />
        </div>
      ) : null}
      <div className="row">
        <button type="button" className="texty" onClick={() => void save({ necessary: true, analytics: false, marketing: false, v: "2026-10-29" }).then(() => setOpen(false))}>
          {t("reject")}
        </button>
        <button type="button" className="btn ghost" onClick={() => setCustom(true)}>
          {t("customize")}
        </button>
        {custom ? (
          <button type="button" className="btn" onClick={() => void save({ necessary: true, analytics, marketing, v: "2026-10-29" }).then(() => setOpen(false))}>
            {t("save")}
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => void save({ necessary: true, analytics: true, marketing: false, v: "2026-10-29" }).then(() => setOpen(false))}>
            {t("accept")}
          </button>
        )}
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
    <label className="flex items-start gap-3">
      <input type="checkbox" className="mt-1 accent-navy" checked={checked || !!disabled} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <span>
        <span className="block font-semibold text-navy">{title}</span>
        <span className="text-muted">{help}</span>
      </span>
    </label>
  );
}
