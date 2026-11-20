"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/** Scroll polish only — no per-letter painting (it hid titles at opacity 0). */
export function Atmosphere() {
  const pathname = usePathname();
  const home = pathname === "/";

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("ready");

    if (!home || reduce) {
      document.querySelector(".chiffres")?.classList.add("in");
      return;
    }

    const chiffres = document.querySelector(".chiffres");
    const logos = document.querySelector(".logo-rows");
    const revealStats = () => {
      if (!chiffres || !logos) return;
      const top = logos.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.88) chiffres.classList.add("in");
    };

    let frame = 0;
    let running = true;

    const onVis = () => {
      if (!document.hidden && running) frame = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);

    const loop = () => {
      if (!running || document.hidden) return;
      const h = window.innerHeight;
      const split = document.getElementById("split");
      const top = split ? split.getBoundingClientRect().top : h;
      const p2 = clamp01((0.8 - top / h) / 0.65);
      document.getElementById("row")?.classList.toggle("in", p2 > 0.92);
      revealStats();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [home]);

  useEffect(() => {
    const right = document.querySelector(".glow-right") as HTMLElement | null;
    const left = document.querySelector(".glow-left") as HTMLElement | null;
    if (!right || !left) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = () => {
      const y = window.scrollY;
      const sway = Math.sin(y * 0.0014);
      right.style.transform = `translate3d(${sway * 150}px, ${y * 0.42}px, 0)`;
      left.style.transform = `translate3d(${Math.cos(y * 0.0011) * 130}px, ${y * 0.3}px, 0) rotate(${sway * -10}deg)`;
    };
    move();
    window.addEventListener("scroll", move, { passive: true });
    return () => window.removeEventListener("scroll", move);
  }, []);

  return (
    <>
      <div className="scroll-glow glow-right" aria-hidden />
      <div className="scroll-glow glow-left" aria-hidden />
    </>
  );
}
