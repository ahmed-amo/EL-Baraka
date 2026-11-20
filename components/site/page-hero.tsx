import { Link } from "@/i18n/navigation";

export function PageHero({ title, crumb }: { title: string; crumb?: string }) {
  return (
    <header className="page-hero">
      {crumb ? (
        <p>
          <Link href="/">Accueil</Link>
          {" / "}
          {crumb}
        </p>
      ) : null}
      <h1>{title}</h1>
    </header>
  );
}
