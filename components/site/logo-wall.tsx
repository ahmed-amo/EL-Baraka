import Image from "next/image";
import type { CompanyData } from "@/lib/types";

export function LogoWall({ title, companies, more }: { title: string; companies: CompanyData[]; more: string }) {
  if (companies.length === 0) return null;
  return (
    <section className="bg-mur py-16" aria-labelledby="trust-title">
      <h2 id="trust-title" className="measure px-5 font-display text-[clamp(2.5rem,7vw,6rem)] sm:px-8">
        {title}
      </h2>
      <ul className="mx-5 mt-10 grid grid-cols-2 gap-px border border-nuit bg-nuit sm:mx-8 sm:grid-cols-3 lg:grid-cols-5">
        {companies.map((company) => (
          <li key={company.id} className="logo-cell flex h-40 items-center justify-center bg-mur p-5">
            <Image src={company.logoUrl} alt={company.name} width={240} height={120} className="h-24 w-full object-contain" />
          </li>
        ))}
        <li className="flex h-40 items-center justify-center bg-mur p-5 text-center font-display text-3xl text-portail">{more}</li>
      </ul>
    </section>
  );
}
