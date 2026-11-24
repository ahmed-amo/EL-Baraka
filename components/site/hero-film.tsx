"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** 16:9 card video — object-contain so burned-in logo + subtitles stay intact. */
export function HeroFilm({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduceMotion(media.matches);
      const el = videoRef.current;
      if (!el) return;
      if (media.matches) el.pause();
      else void el.play().catch(() => undefined);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!src || reduceMotion) return;
    const el = videoRef.current;
    if (!el) return;

    const markReady = () => {
      setReady(true);
      void el.play().catch(() => undefined);
    };

    if (el.readyState >= 2) markReady();
    else {
      el.addEventListener("loadeddata", markReady, { once: true });
      el.addEventListener("canplay", markReady, { once: true });
    }

    // Kick buffering immediately (preload=auto alone can wait on some browsers).
    el.load();

    return () => {
      el.removeEventListener("loadeddata", markReady);
      el.removeEventListener("canplay", markReady);
    };
  }, [src, reduceMotion]);

  function toggleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }

  if (!src || reduceMotion) {
    return (
      <div className="hero-media-stack">
        <div className="hero-card">
          <Image src={poster} alt={alt} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-contain bg-black" />
        </div>
      </div>
    );
  }

  return (
    <div className="hero-media-stack">
      <link rel="preload" href={src} as="video" type="video/mp4" />
      <div className="hero-card">
        <video
          ref={videoRef}
          className={`hero-card-video${ready ? " is-ready" : ""}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={alt}
        >
          <source src={src} type="video/mp4" />
        </video>
        <div className="hero-card-vignette" aria-hidden />
      </div>
      <button type="button" className="hero-mute" onClick={toggleMute} aria-pressed={!muted}>
        {muted ? "Activer le son" : "Couper le son"}
      </button>
    </div>
  );
}
