"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { GalleryData } from "@/lib/types";

export function GalleryStrip({
  images,
  field,
  inside,
}: {
  images: GalleryData[];
  field: string;
  inside: string;
}) {
  const [filter, setFilter] = useState<"FIELD" | "INSIDE">("FIELD");
  const visible = images.filter((image) => image.category === filter).slice(0, 6);

  return (
    <>
      <div className="pills" role="group" aria-label={field}>
        <button type="button" aria-pressed={filter === "FIELD"} onClick={() => setFilter("FIELD")}>
          {field}
        </button>
        <button type="button" aria-pressed={filter === "INSIDE"} onClick={() => setFilter("INSIDE")}>
          {inside}
        </button>
      </div>
      <div className="gallery-home">
        {visible.map((image) => (
          <Link key={image.id} href="/galerie">
            <Image
              src={image.url}
              alt={image.alt}
              width={800}
              height={600}
              sizes="(max-width: 820px) 100vw, 33vw"
              quality={70}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
