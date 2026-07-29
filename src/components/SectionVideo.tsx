"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type SectionVideoProps = {
  dataName: string;
  desktopSrc: string;
  mobileSrc: string;
};

// Videos are not attached to the DOM (no `src`) until the section scrolls
// near the viewport, so the browser never fetches bytes for off-screen
// sections. Each video plays once, muted, the moment it's ready.
export default function SectionVideo({ dataName, desktopSrc, mobileSrc }: SectionVideoProps) {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  // preload="none" means nothing buffers until playback is explicitly
  // requested, so we call play() directly here rather than waiting on
  // onCanPlay (which would otherwise never fire).
  useEffect(() => {
    if (!shouldLoad) return;
    desktopRef.current?.play();
    mobileRef.current?.play();
  }, [shouldLoad]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <motion.div
        className="relative"
        data-name={dataName}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        onViewportEnter={() => setShouldLoad(true)}
        viewport={{ once: true, amount: 0.2, margin: "200px 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <video
          ref={desktopRef}
          className="hidden w-full h-auto md:block"
          style={{ aspectRatio: "1440 / 1024" }}
          src={shouldLoad ? desktopSrc : undefined}
          preload="none"
          muted
          playsInline
        />
        <video
          ref={mobileRef}
          className="block w-full h-auto md:hidden"
          style={{ aspectRatio: "760 / 1352" }}
          src={shouldLoad ? mobileSrc : undefined}
          preload="none"
          muted
          playsInline
        />
      </motion.div>
    </section>
  );
}
