"use client";

import { useEffect, useRef, useState } from "react";

function useCount(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);
  return value;
}

export function Counters({
  items,
}: {
  items: { value: number; label: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative z-10 mx-auto -mt-16 grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/15 bg-white/10 px-2 shadow-2xl shadow-black/30 backdrop-blur-md md:grid-cols-4">
      {items.map((item) => (
        <Count key={item.label} value={item.value} label={item.label} active={active} />
      ))}
    </div>
  );
}

function Count({ value, label, active }: { value: number; label: string; active: boolean }) {
  const current = useCount(value, active);
  return (
    <div className="px-4 py-6 text-white">
      <p className="font-display text-4xl text-gold-2">
        {current}
        <span className="text-2xl">+</span>
      </p>
      <p className="mt-1 text-sm text-white/70">{label}</p>
    </div>
  );
}
