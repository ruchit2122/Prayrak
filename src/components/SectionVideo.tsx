"use client";

import { useEffect, useRef, useState } from "react";
import { useIsDesktop } from "@/lib/useIsDesktop";

type SectionVideoProps = {
  dataName: string;
  desktopSrc: string;
  mobileSrc: string;
  /** Playback speed for both videos. Defaults to half speed. */
  rate?: number;
};

// Videos are not attached to the DOM (no `src`) until the section scrolls
// near the viewport, so the browser never fetches bytes for off-screen
// sections. Each video plays once, muted, the moment it's ready.
export default function SectionVideo({ dataName, desktopSrc, mobileSrc, rate = 0.5 }: SectionVideoProps) {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!shouldLoad) return;
    for (const v of [desktopRef.current, mobileRef.current]) {
      if (!v) continue;
      v.playbackRate = rate;
      v.play();
    }
  }, [shouldLoad, rate]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <motion.div
        className="relative"
        data-name={dataName}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        onViewportEnter={() => setShouldLoad(true)}
        viewport={{ once: true, amount: 0.2, margin: "200px 0px" }}
        transition={{ duration: 1.2, delay: 0.25, ease: "easeOut" }}
      >
        <video
          ref={desktopRef}
          className="hidden w-full h-auto md:block"
          style={{ aspectRatio: "1920 / 1078" }}
          src={shouldLoad ? desktopSrc : undefined}
          preload="none"
          muted
          playsInline
        />
      </div>
    </section>
  );
}
