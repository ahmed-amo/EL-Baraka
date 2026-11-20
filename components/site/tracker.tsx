"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

export function readConsent() {
  const raw = document.cookie.split("; ").find((part) => part.startsWith("eb_consent="));
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw.slice("eb_consent=".length))) as {
      analytics?: boolean;
      marketing?: boolean;
    };
    if (typeof value.analytics !== "boolean") return null;
    return value;
  } catch {
    return null;
  }
}

export function trackEvent(name: string, meta?: Record<string, string>) {
  const gtag = (window as Window & { gtag?: (command: "event", eventName: string, params?: Record<string, string>) => void }).gtag;
  if (typeof gtag === "function") gtag("event", name, meta);
  const consent = readConsent();
  const body = JSON.stringify({
    type: "event",
    name,
    path: window.location.pathname,
    consent: consent?.analytics === true,
    meta,
    referrer: document.referrer,
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
}

export function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    const started = Date.now();
    const params = new URLSearchParams(window.location.search);
    const send = (type: "pageview" | "duration", duration?: number) => {
      const consent = readConsent();
      const body = JSON.stringify({
        type,
        path: pathname,
        referrer: document.referrer,
        utmSource: params.get("utm_source") || "",
        utmMedium: params.get("utm_medium") || "",
        utmCampaign: params.get("utm_campaign") || "",
        consent: consent?.analytics === true,
        duration,
      });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    };
    send("pageview");
    const sendDuration = () => {
      const seconds = Math.round((Date.now() - started) / 1000);
      // Skip short bounces — saves Railway CPU/DB on bounce traffic
      if (seconds < 5) return;
      if (readConsent()?.analytics !== true) return;
      send("duration", seconds);
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") sendDuration();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      sendDuration();
    };
  }, [pathname]);
  return null;
}
