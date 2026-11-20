"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** 16:9 card video — object-contain so burned-in logo + subtitles stay intact. */
export function HeroFilm({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [muted, setMuted] = useState(true);

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
      <div className="hero-card">
        <video
          ref={videoRef}
          className="hero-card-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
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
