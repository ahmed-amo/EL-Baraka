import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return { title: t("title"), description: t("intro") };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as { title: string; body: string }[];
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)]">{t("title")}</h1>
      <p className="measure mt-6">{t("intro")}</p>
      {sections.map((section) => (
        <section key={section.title} className="mt-10">
          <h2 className="font-display text-4xl">{section.title}</h2>
          <p className="mt-3 leading-relaxed text-muted">{section.body}</p>
        </section>
      ))}
    </article>
  );
}
