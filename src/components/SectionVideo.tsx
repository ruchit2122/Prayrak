"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const v = videoRef.current;
    if (!shouldLoad || !v) return;
    v.playbackRate = rate;
    v.play();
  }, [shouldLoad, rate, isDesktop]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <motion.div
        className="relative"
        data-name={dataName}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        onViewportEnter={() => setShouldLoad(true)}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, delay: 0.25, ease: "easeOut" }}
      >
        {/* isDesktop is null until the client knows the viewport: render
            nothing rather than fetch the variant that would be hidden. */}
        {isDesktop !== null && (
          <video
            ref={videoRef}
            className="block w-full h-auto"
            style={{ aspectRatio: isDesktop ? "1920 / 1078" : "760 / 1352" }}
            src={shouldLoad ? (isDesktop ? desktopSrc : mobileSrc) : undefined}
            preload="none"
            muted
            playsInline
          />
        )}
      </motion.div>
    </section>
  );
}
