"use client";

import { useEffect } from "react";
import { trackEvent } from "./tracker";

export function ViewBeacon({ name, service }: { name: string; service?: string }) {
  useEffect(() => {
    trackEvent(name, service ? { service } : undefined);
  }, [name, service]);
  return null;
}
