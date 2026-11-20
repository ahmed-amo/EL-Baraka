import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cookiePage");
  return { title: t("title"), description: t("intro") };
}

export default async function CookiesPage() {
  const t = await getTranslations("cookiePage");
  const sections = t.raw("sections") as { title: string; body: string }[];
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)]">{t("title")}</h1>
      <p className="mt-6 leading-relaxed text-muted">{t("intro")}</p>
      {sections.map((section) => (
        <section key={section.title} className="mt-10">
          <h2 className="font-display text-2xl text-navy">{section.title}</h2>
          <p className="mt-3 leading-relaxed text-muted">{section.body}</p>
        </section>
      ))}
    </article>
  );
}
