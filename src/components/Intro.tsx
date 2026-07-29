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
          src="/videos/intro.mp4"
          preload="auto"
          autoPlay
          muted
          playsInline
        />
        <video
          ref={mobileVideoRef}
          className="block w-full h-auto md:hidden"
          src="/videos/mobile/intro.mp4"
          preload="auto"
          autoPlay
          muted
          playsInline
        />
      </div>
    </section>
  );
}
