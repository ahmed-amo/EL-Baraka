import Image from "next/image";
import { cn } from "@/lib/utils";

export function SmartImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!src || src.endsWith(".svg")) {
    return <Image src={src || "/placeholders/hero-poster.svg"} alt={alt} fill unoptimized className={cn("object-cover", className)} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
