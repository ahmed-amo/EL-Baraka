"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { DotButton } from "./dot-button";
import { trackEvent } from "./tracker";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClass = "pill-input";

export function ContactForm({ services }: { services: { slug: string; title: string }[] }) {
  const t = useTranslations("forms");
  const serviceRef = useRef<HTMLSelectElement>(null);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get("service");
    if (service && serviceRef.current) serviceRef.current.value = service;
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (!data.get("consent")) {
      setStatus("err");
      setError(t("invalid"));
      return;
    }
    setPending(true);
    setStatus("idle");
    const token = form.querySelector<HTMLTextAreaElement | HTMLInputElement>("[name=cf-turnstile-response]")?.value || "";
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        company: data.get("company"),
        phone: data.get("phone"),
        email: data.get("email"),
        city: data.get("city"),
        message: data.get("message"),
        service: data.get("service") || "",
        companyWebsite: data.get("companyWebsite") || "",
        turnstileToken: token,
      }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus("err");
      setError(body.error === "rate" ? t("rate") : t("error"));
      return;
    }
    setStatus("ok");
    form.reset();
    trackEvent("contact_submit");
  }

  return (
    <form className="site-form" onSubmit={onSubmit} noValidate={false}>
      <div className="pair">
        <Field label={t("name")}>
          <input className={inputClass} name="name" required minLength={2} autoComplete="name" />
        </Field>
        <Field label={t("company")}>
          <input className={inputClass} name="company" required minLength={2} autoComplete="organization" />
        </Field>
      </div>
      <div className="pair">
        <Field label={t("phone")}>
          <input className={inputClass} name="phone" type="tel" required minLength={6} autoComplete="tel" />
        </Field>
        <Field label={t("email")}>
          <input
            className={inputClass}
            name="email"
            type="email"
            required
            autoComplete="email"
            title={t("emailInvalid")}
            onInvalid={(event) => event.currentTarget.setCustomValidity(t("emailInvalid"))}
            onInput={(event) => event.currentTarget.setCustomValidity("")}
          />
        </Field>
      </div>
      <div className="pair">
        <Field label={t("city")}>
          <input className={inputClass} name="city" required minLength={2} autoComplete="address-level2" />
        </Field>
        <Field label={t("need")}>
          <select ref={serviceRef} className={inputClass} name="service" defaultValue="">
            <option value="">{t("serviceAny")}</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={t("message")}>
        <textarea className="pill-area" name="message" required minLength={10} />
      </Field>
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Site
        <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </label>
      {siteKey ? <div className="cf-turnstile" data-sitekey={siteKey} /> : null}
      {siteKey ? <TurnstileScript /> : null}
      <label className="consent">
        <input name="consent" type="checkbox" required className="mt-1 accent-navy" />
        <span>{t("consent")}</span>
      </label>
      <div>
        <DotButton type="submit" large disabled={pending}>
          {pending ? t("sending") : t("quote")}
        </DotButton>
      </div>
      <p className="form-status" role="status">
        {status === "ok" ? t("contactOk") : null}
        {status === "err" ? error : null}
      </p>
    </form>
  );
}

export function JobForm({ positions }: { positions: string[] }) {
  const t = useTranslations("forms");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setPending(true);
    setStatus("idle");
    const response = await fetch("/api/recruitment", { method: "POST", body: data });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus("err");
      setError(body.error === "rate" ? t("rate") : body.error === "invalid" ? t("invalid") : t("error"));
      return;
    }
    setStatus("ok");
    form.reset();
    trackEvent("cv_submit");
  }

  return (
    <form className="site-form" onSubmit={onSubmit}>
      <Field label={t("name")}>
        <input className={inputClass} name="name" required minLength={2} autoComplete="name" />
      </Field>
      <Field label={t("email")}>
        <input
          className={inputClass}
          name="email"
          type="email"
          required
          autoComplete="email"
          title={t("emailInvalid")}
          onInvalid={(event) => event.currentTarget.setCustomValidity(t("emailInvalid"))}
          onInput={(event) => event.currentTarget.setCustomValidity("")}
        />
      </Field>
      <Field label={t("phone")}>
        <input className={inputClass} name="phone" type="tel" required minLength={6} autoComplete="tel" />
      </Field>
      <Field label={t("position")}>
        <input className={inputClass} name="position" required minLength={2} list="positions" />
        <datalist id="positions">
          {positions.map((position) => (
            <option key={position} value={position} />
          ))}
        </datalist>
      </Field>
      <Field label={t("message")}>
        <textarea className="pill-area" name="message" required minLength={10} />
      </Field>
      <Field label={t("cv")}>
        <input className="file-input" name="cv" type="file" accept="application/pdf,.pdf" required />
      </Field>
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Site
        <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent">
        <input name="consent" type="checkbox" required className="mt-1 accent-navy" />
        <span>{t("jobConsent")}</span>
      </label>
      <div>
        <DotButton type="submit" disabled={pending}>
          {pending ? t("sending") : t("apply")}
        </DotButton>
      </div>
      <p className="form-status" role="status">
        {status === "ok" ? t("jobOk") : null}
        {status === "err" ? error : null}
      </p>
    </form>
  );
}

function TurnstileScript() {
  return <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />;
}
