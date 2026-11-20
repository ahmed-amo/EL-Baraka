import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { PageHero } from "@/components/site/page-hero";
import { getSiteData } from "@/lib/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("gallery");
  return { title: t("title"), description: t("intro") };
}

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const site = await getSiteData();
  return (
    <>
      <PageHero title={t("title")} crumb={t("title")} />
      <div className="page-body">
        <p className="max-w-xl text-[var(--ink-2)]">{t("intro")}</p>
        <div className="mt-8">
          <GalleryGrid
            images={site.gallery}
            labels={{
              all: t("all"),
              field: t("field"),
              inside: t("inside"),
              close: t("close"),
              prev: t("prev"),
              next: t("next"),
              empty: t("empty"),
            }}
          />
        </div>
      </div>
    </>
  );
}
