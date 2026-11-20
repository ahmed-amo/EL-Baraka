"use client";

import { useEffect } from "react";
import { readConsent } from "./tracker";

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;
    const load = () => {
      if (readConsent()?.analytics !== true) return;
      if (document.getElementById("ga4")) return;
      const script = document.createElement("script");
      script.id = "ga4";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
      const inline = document.createElement("script");
      inline.id = "ga4-config";
      inline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`;
      document.head.appendChild(inline);
    };
    load();
    window.addEventListener("eb:consent-changed", load);
    return () => window.removeEventListener("eb:consent-changed", load);
  }, [measurementId]);
  return null;
}
