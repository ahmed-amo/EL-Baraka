import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 pt-28">
      <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)]">{t("title")}</h1>
      <p className="mt-4">{t("body")}</p>
      <Link href="/" className="btn not-found-link">
        {t("back")}
      </Link>
    </div>
  );
}
