import Image from "next/image";
import type { CompanyData } from "@/lib/types";

export function Marquee({ title, companies }: { title: string; companies: CompanyData[] }) {
  if (companies.length === 0) return null;
  const loop = [...companies, ...companies];
  return (
    <section className="bg-paper py-16" aria-labelledby="trust-title">
      <h2 id="trust-title" className="mx-auto max-w-3xl px-5 text-center font-display text-3xl text-balance text-navy">
        {title}
      </h2>
      <div className="marquee mt-10 overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-6 px-4">
          {loop.map((company, index) => (
            <div
              key={`${company.id}-${index}`}
              className="flex h-44 w-80 shrink-0 items-center justify-center rounded-2xl border border-line bg-white px-6 py-5"
            >
              <Image
                src={company.logoUrl}
                alt={company.name}
                width={280}
                height={140}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
