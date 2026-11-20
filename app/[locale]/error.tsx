"use client";

import { useTranslations } from "next-intl";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("errorPage");
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 pt-28">
      <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)]">{t("title")}</h1>
      <p className="mt-4">{t("body")}</p>
      <button type="button" onClick={reset} className="mt-8 inline-flex h-12 items-center bg-portail px-5 text-white rounded-[2px]">
        {t("retry")}
      </button>
    </div>
  );
}
