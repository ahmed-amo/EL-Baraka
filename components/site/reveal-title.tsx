import type { ReactNode } from "react";

/** Plain heading — no per-letter DOM (that left text stuck at opacity 0). */
export function RevealTitle({
  as: Tag = "h2",
  id,
  className,
  onDark = false,
  children,
}: {
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  onDark?: boolean;
  children: ReactNode;
}) {
  return (
    <Tag id={id} className={className} data-on={onDark ? "dark" : undefined}>
      {children}
    </Tag>
  );
}
