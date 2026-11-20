import type { Milestone } from "@/lib/types";

export function TimelineRail({ title, items }: { title: string; items: Milestone[] }) {
  return (
    <section className="bg-nuit py-16 text-mur" aria-labelledby="timeline-title">
      <h2 id="timeline-title" className="px-5 font-display text-[clamp(2.5rem,7vw,6rem)] sm:px-8">
        {title}
      </h2>
      <ol className="mt-10 flex gap-0 overflow-x-auto px-5 pb-6 sm:px-8">
        {items.map((item) => (
          <li key={`${item.year}-${item.title}`} className="w-72 shrink-0 border-s border-tenue ps-4">
            <span className="block h-8 w-px bg-tenue" aria-hidden />
            <p className="font-display text-5xl text-tenue">{item.year}</p>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt="" className="mt-4 h-40 w-full object-cover" />
            ) : null}
            <h3 className="mt-4 text-lg">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mur/80">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
