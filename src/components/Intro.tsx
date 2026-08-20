"use client";

import { useRef } from "react";

export default function Intro() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative" data-name="intro">
        <video
          ref={desktopVideoRef}
          className="hidden w-full h-auto md:block"
          src="/desktop-sections/Intro-D.mp4"
          preload="auto"
          onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.5)}
          autoPlay
          muted
          playsInline
        />
        <video
          ref={mobileVideoRef}
          className="block w-full h-auto md:hidden"
          src="/mobile-sections/start.mp4"
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
