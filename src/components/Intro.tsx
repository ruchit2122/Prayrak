"use client";

import { useEffect, useRef } from "react";
import { useIsDesktop } from "@/lib/useIsDesktop";

// The intro is the LCP element, so unlike every other section it does not wait
// on an intersection — it starts fetching as soon as the viewport is known.
export default function Intro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDesktop = useIsDesktop();

  const src =
    isDesktop === null ? undefined : isDesktop ? "/desktop-sections/Intro-D.mp4" : "/mobile-sections/start.mp4";

  useEffect(() => {
    if (!src) return;
    videoRef.current?.play().catch(() => {});
  }, [src]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative" data-name="intro">
        <video
          ref={videoRef}
          className="block w-full h-auto"
          src={src}
          preload="auto"
          onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.5)}
          autoPlay
          muted
          playsInline
        />
      </div>
    </section>
  );
}
