import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JobForm } from "@/components/site/forms";
import { PageHero } from "@/components/site/page-hero";
import { getSiteData } from "@/lib/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("recruitment");
  return { title: t("title"), description: t("intro") };
}

export default async function RecruitmentPage() {
  const t = await getTranslations("recruitment");
  const site = await getSiteData();
  return (
    <>
      <PageHero title={t("title")} crumb={t("title")} />
      <div className="page-body recruit">
        <div>
          <p className="max-w-xl text-[var(--ink-2)]">{t("intro")}</p>
          <h2 className="section-title mt-10 text-[32px]">{t("openings")}</h2>
          {site.jobs.length === 0 ? <p className="mt-3">{t("none")}</p> : null}
          <ul className="mt-4 divide-y divide-nuit border-y border-nuit">
            {site.jobs.map((job) => (
              <li key={job.id} className="py-4">
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-tenue">{job.location}</p>
                <p className="mt-2 text-sm">{job.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="section-title mb-4 text-[32px]">{t("apply")}</h2>
          <JobForm positions={site.jobs.map((job) => job.title)} />
        </div>
      </div>
    </>
  );
}
