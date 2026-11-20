import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5">
      <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)]">Page introuvable</h1>
      <p className="mt-4">Cette page n&apos;existe pas.</p>
      <Link href="/" className="btn not-found-link">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
