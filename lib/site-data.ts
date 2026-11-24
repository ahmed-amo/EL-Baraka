import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import { resolveHeroVideoUrl } from "./brand";
import { getPrisma } from "./db";
import { companySeed, fallbackSite } from "./seed-data";
import type { Milestone, PublicSite, SiteSettingsData } from "./types";

function milestonesOf(value: Prisma.JsonValue): Milestone[] {
  if (!Array.isArray(value)) return [];
  const items: Milestone[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const row = entry as Record<string, Prisma.JsonValue>;
    if (typeof row.year === "string" && typeof row.title === "string" && typeof row.text === "string") {
      items.push({
        year: row.year,
        title: row.title,
        text: row.text,
        image: typeof row.image === "string" ? row.image : "",
      });
    }
  }
  return items;
}

async function loadSite(): Promise<PublicSite> {
  const fallback = fallbackSite();
  const db = getPrisma();
  if (!db) return fallback;
  try {
    const settings = await db.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) return fallback;
    const [services, gallery, jobs, milestones] = await Promise.all([
      db.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.galleryImage.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.jobOpening.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.milestone.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    ]);
    const shaped: SiteSettingsData = {
      phone: settings.phone,
      phoneHref: settings.phoneHref,
      fax: settings.fax,
      address: settings.address,
      email: settings.email,
      whatsappNumber: settings.whatsappNumber,
      whatsappMessage: settings.whatsappMessage,
      years: settings.years,
      employees: settings.employees,
      partners: settings.partners,
      servicesCount: settings.servicesCount,
      heroVideoUrl: resolveHeroVideoUrl(settings.heroVideoUrl),
      heroVideoWebmUrl: settings.heroVideoWebmUrl,
      heroPosterUrl: settings.heroPosterUrl,
      aboutImageUrl: settings.aboutImageUrl,
      lat: settings.lat,
      lng: settings.lng,
      hours: settings.hours,
      capital: settings.capital,
      foundedYear: settings.foundedYear,
      legalName: settings.legalName,
      facebookUrl: settings.facebookUrl,
      linkedinUrl: settings.linkedinUrl,
      instagramUrl: settings.instagramUrl,
      metaTitle: settings.metaTitle,
      metaDescription: settings.metaDescription,
      milestones:
        milestones.length > 0
          ? milestones.map((item) => ({
              year: item.year,
              title: item.title,
              text: item.text,
              image: item.imageUrl,
            }))
          : milestonesOf(settings.milestones),
      showLiveDot: settings.showLiveDot,
    };
    return {
      settings: shaped,
      services: services.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        shortDescription: item.shortDescription,
        content: item.content,
        imageUrl: item.imageUrl,
        icon: item.icon,
        order: item.order,
      })),
      // Partner logos are code-owned (lib/seed-data.ts + public/images/logos), not admin-managed.
      companies: companySeed,
      gallery: gallery.map((item) => ({
        id: item.id,
        url: item.url,
        alt: item.alt,
        category: item.category,
        order: item.order,
      })),
      jobs: jobs.map((item) => ({
        id: item.id,
        title: item.title,
        location: item.location,
        description: item.description,
        order: item.order,
      })),
    };
  } catch (error) {
    console.error("Lecture du site impossible, contenu de repli utilisé.", error);
    return fallback;
  }
}

/** Rarely written content: cache until admin calls revalidateSite() (tag "site"). */
export const getSiteData = unstable_cache(loadSite, ["site-public-v5"], {
  tags: ["site"],
  revalidate: false,
});

export async function getService(slug: string) {
  const site = await getSiteData();
  return site.services.find((service) => service.slug === slug) ?? null;
}
