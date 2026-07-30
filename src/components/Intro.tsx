"use client";

import { useEffect, useRef } from "react";
import { useIsDesktop } from "@/lib/useIsDesktop";

// The intro is the LCP element, so unlike every other section it does not wait
// on an intersection — it starts fetching as soon as the viewport is known.
export default function Intro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDesktop = useIsDesktop();

  const src =
    isDesktop === null ? undefined : isDesktop ? "/desktop-sections/intro.mp4" : "/mobile-sections/start.mp4";

  useEffect(() => {
    if (!src) return;
    videoRef.current?.play().catch(() => {});
  }, [src]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative" data-name="intro">
        <video
          ref={videoRef}
          className="block w-full h-auto aspect-[760/1352] md:aspect-[1440/1024]"
          src={src}
          preload="auto"
          autoPlay
          muted
          playsInline
        />
      </div>
    </section>
  );
}
