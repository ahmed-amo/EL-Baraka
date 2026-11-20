import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/site/page-hero";
import { DotButton } from "@/components/site/dot-button";
import { ViewBeacon } from "@/components/site/view-beacon";
import { serviceSeed } from "@/lib/seed-data";
import { getService, getSiteData } from "@/lib/site-data";

export function generateStaticParams() {
  return serviceSeed.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return { title: service.title, description: service.shortDescription, openGraph: { title: service.title, description: service.shortDescription } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();
  const t = await getTranslations("servicesSection");
  const contact = await getTranslations("nav");
  const site = await getSiteData();
  const others = site.services.filter((item) => item.slug !== service.slug);
  return (
    <article>
      <ViewBeacon name="service_view" service={service.slug} />
      <PageHero title={service.title} crumb={t("back")} />
      <div className="page-body mx-auto max-w-3xl">
        <Image src={service.imageUrl} alt={service.title} width={1200} height={800} className="mb-8 max-h-[70vh] w-full rounded-[24px] object-cover" />
        <Link href="/#services" className="text-sm">
          {t("back")}
        </Link>
        {service.content.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="measure mt-4">
            {paragraph}
          </p>
        ))}
        <div className="mt-8">
          <DotButton href={`/contact?service=${encodeURIComponent(service.title)}`}>{contact("contact")}</DotButton>
        </div>
      </div>
      {others.length > 0 ? (
        <ul className="border-t border-nuit">
          {others.map((item) => (
            <li key={item.id} className="border-b border-nuit">
              <Link href={`/services/${item.slug}`} className="block px-5 py-5 font-display text-3xl sm:px-8">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
