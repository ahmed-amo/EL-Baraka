import { getRequestConfig } from "next-intl/server";
import { routing, type AppLocale } from "./routing";

function isLocale(value: string | undefined): value is AppLocale {
  return !!value && routing.locales.includes(value as AppLocale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;
  const messages = (await import(`../content/${locale}.json`)).default;
  return { locale, messages };
});
