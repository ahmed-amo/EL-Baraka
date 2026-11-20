import type { MetadataRoute } from "next";
import { serviceSeed } from "@/lib/seed-data";
import { getSiteData } from "@/lib/site-data";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const site = await getSiteData();
  const services = site.services.length > 0 ? site.services : serviceSeed;
  const paths = ["", "/galerie", "/recrutement", "/contact", "/politique-de-confidentialite", "/cookies", ...services.map((service) => `/services/${service.slug}`)];
  return paths.flatMap((path) => [
    { url: `${base}${path || "/"}`, lastModified: new Date(), alternates: { languages: { fr: `${base}${path || "/"}`, ar: `${base}/ar${path}` } } },
    { url: `${base}/ar${path}`, lastModified: new Date() },
  ]);
}
