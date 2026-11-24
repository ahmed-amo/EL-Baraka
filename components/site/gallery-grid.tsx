"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { GalleryData } from "@/lib/types";

export function GalleryGrid({
  images,
  labels,
}: {
  images: GalleryData[];
  labels: { all: string; field: string; inside: string; close: string; prev: string; next: string; empty: string };
}) {
  const [filter, setFilter] = useState<"ALL" | "FIELD" | "INSIDE">("ALL");
  const [index, setIndex] = useState<number | null>(null);
  const visible = useMemo(
    () => images.filter((image) => filter === "ALL" || image.category === filter),
    [images, filter],
  );
  const current = index === null ? null : visible[index];

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((value) => (value === null ? 0 : (value + 1) % visible.length));
      if (event.key === "ArrowLeft") setIndex((value) => (value === null ? 0 : (value + visible.length - 1) % visible.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, visible.length]);

  return (
    <div>
      <div className="pills" role="group">
        {(
          [
            ["ALL", labels.all],
            ["FIELD", labels.field],
            ["INSIDE", labels.inside],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            className=""
            onClick={() => {
              setFilter(value);
              setIndex(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? <p className="mt-8">{labels.empty}</p> : null}
      <div className="mt-8 columns-1 gap-3 sm:columns-2 lg:columns-3">
        {visible.map((image, imageIndex) => (
          <button key={image.id} type="button" className="mb-3 block w-full" onClick={() => setIndex(imageIndex)}>
            <Image
              src={image.url}
              alt={image.alt}
              width={900}
              height={700}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={70}
              className="h-auto w-full rounded-[20px]"
            />
          </button>
        ))}
      </div>
      {current ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-nuit/95 p-4" role="dialog" aria-modal="true" aria-label={current.alt}>
          <button type="button" className="absolute right-4 top-4 border border-white px-4 py-2 text-white rounded-[2px]" onClick={() => setIndex(null)}>
            {labels.close}
          </button>
          <button type="button" className="absolute left-4 top-1/2 border border-white px-4 py-2 text-white rounded-[2px]" onClick={() => setIndex((index! + visible.length - 1) % visible.length)}>
            {labels.prev}
          </button>
          <figure className="relative max-h-[80vh] max-w-5xl">
            <Image
              src={current.url}
              alt={current.alt}
              width={1400}
              height={1000}
              sizes="90vw"
              quality={75}
              priority
              className="max-h-[75vh] w-auto object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-tenue">{current.alt}</figcaption>
          </figure>
          <button type="button" className="absolute right-4 top-1/2 border border-white px-4 py-2 text-white rounded-[2px]" onClick={() => setIndex((index! + 1) % visible.length)}>
            {labels.next}
          </button>
        </div>
      ) : null}
    </div>
  );
}
