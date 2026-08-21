"use client";

import { useEffect, useRef } from "react";
import { useIsDesktop } from "@/lib/useIsDesktop";
import SlideRail from "@/components/SlideRail";
import ScrollCue from "@/components/ScrollCue";
import { mediaSrc } from "@/lib/media";

// The intro is the LCP element, so unlike every other section it does not wait
// on an intersection — it starts fetching as soon as the viewport is known.
export default function Intro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDesktop = useIsDesktop();

  // Named the readable way and resolved to its content-hashed URL, same as
  // every other frame — see `src/lib/media.ts`.
  const path =
    isDesktop === null ? undefined : isDesktop ? "/desktop-sections/Intro-D.mp4" : "/mobile-sections/start.mp4";
  const src = path ? mediaSrc(path) : undefined;

  // Unlike the sections below, this poster is not gated on anything: it is the
  // first thing on the page, it is ~40KB against a ~2MB clip, and it decides
  // whether the first paint is the opening frame or a black rectangle.
  const poster = path ? mediaSrc(path.replace(/\.mp4$/, ".webp")) : undefined;

  useEffect(() => {
    if (!src) return;
    videoRef.current?.play().catch(() => {});
  }, [src]);

  return (
    <>
      {/* See `.frame-snap` in globals.css: snap points sit on static markers,
          never on the sticky sections themselves. */}
      <div className="frame-snap" aria-hidden="true" />
      <section className="frame-section relative w-full overflow-hidden bg-black">
        <div className="relative h-full w-full" data-name="intro">
          <video
            ref={videoRef}
            className="frame-video"
            src={src}
            poster={poster}
            preload="auto"
            autoPlay
            muted
            playsInline
          />
          {/* The deck navigator: thumbnails of the frames still to come,
              curving down the right-hand edge. Gated here rather than inside
              the component so that below `md` it is never mounted at all —
              see the note in `SlideRail`. */}
          {isDesktop && <SlideRail />}
          {/* The arrow at the foot of the frame. Not gated: on a phone, where
              there is no rail, it is the only thing saying the page goes on. */}
          <ScrollCue />
        </div>
      </section>
    </>
  );
}
