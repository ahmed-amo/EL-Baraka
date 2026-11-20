"use client";

import { trackEvent } from "./tracker";

export function PhoneLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className} onClick={() => trackEvent("phone_click")}>
      {children}
    </a>
  );
}
