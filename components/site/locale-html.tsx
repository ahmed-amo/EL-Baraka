"use client";

import { useLocale } from "next-intl";
import { useLayoutEffect } from "react";

export function LocaleHtml() {
  const locale = useLocale();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
