"use client";

import { useEffect, useRef, useState } from "react";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { useSlideIn, type FrameEnter } from "@/lib/useSlideIn";
import { mediaSrc } from "@/lib/media";

type SectionVideoProps = {
  dataName: string;
  desktopSrc: string;
  mobileSrc: string;
  /** Which edge this frame arrives from. Defaults to the plain upward stack. */
  enter?: FrameEnter;
  /**
   * Anything laid over the video — currently only the contact frame's two
   * hotspots. It renders inside the same box as the `<video>`, which is what
   * lets an overlay be positioned against the frame rather than the window.
   */
  children?: React.ReactNode;
};

// Loading and revealing are deliberately two different triggers. Bytes start
// arriving a viewport and a half out, long before anything is on screen, so by
// the time a section is close enough to reveal it has already buffered. A
// single trigger can't do both: early enough to preload is far too early to
// play, and close enough to play leaves no time to download.
const LOAD_AHEAD = "150% 0px";

// Reveal is measured as a share of the element actually on screen, not as a
// margin. A margin fires the moment the top edge peeks in — which is why these
// ~2s clips felt finished on arrival: playback began while the section was
// still a sliver at the bottom of the screen. At 30% the section has genuinely
// arrived, so the fade and the first frame land together with the viewer
// looking at them.
const REVEAL_RATIO = 0.3;

export default function SectionVideo({
  dataName,
  desktopSrc,
  mobileSrc,
  enter = "up",
  children,
}: SectionVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isDesktop = useIsDesktop();

  useSlideIn(sectionRef, enter);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Each observer disconnects on its first hit — these are one-way latches,
    // so there is no reason to keep paying for callbacks on every scroll.
    const loader = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: LOAD_AHEAD },
    );

    const revealer = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry.isIntersecting) return;

        // A section taller than ~3x the viewport can never reach REVEAL_RATIO
        // of itself — on a short, very wide window these full-bleed videos can
        // hit that. Filling half the screen counts as arrived too, so the
        // trigger degrades instead of never firing.
        const viewportHeight = entry.rootBounds?.height ?? 0;
        const fillsViewport =
          viewportHeight > 0 && entry.intersectionRect.height >= viewportHeight * 0.5;

        if (entry.intersectionRatio < REVEAL_RATIO && !fillsViewport) return;

        setRevealed(true);
        observer.disconnect();
      },
      // Sampled rather than a single threshold so the callback still runs as
      // the section crosses the screen, letting the checks above decide.
      { threshold: [0, 0.1, REVEAL_RATIO, 0.5] },
    );

    loader.observe(container);
    revealer.observe(container);

    return () => {
      loader.disconnect();
      revealer.disconnect();
    };
  }, []);

  // Only ever one src, and only the variant this viewport actually displays.
  // Rendering both and hiding one with CSS still downloads both.
  const variant = isDesktop === null ? undefined : isDesktop ? desktopSrc : mobileSrc;
  // Resolved to its content-hashed URL on the way out. The props stay readable
  // paths; `mediaSrc` is what turns one into something a 30-day cache can hold
  // safely — see `scripts/hash-media.mjs`.
  const src = shouldLoad && variant ? mediaSrc(variant) : undefined;

  // The first frame of the clip, sitting beside it as a .webp of the same name.
  // Without it a section is flat black until the video has decoded, so on a slow
  // connection you scroll onto nothing and the frame pops in late.
  //
  // Gated on `shouldLoad` alongside the video rather than set as soon as the
  // viewport is known: hanging all twelve posters on the page up front would
  // undo the lazy loading these observers exist to do. Sharing the trigger
  // costs nothing, because a ~40KB poster lands long before the ~1MB clip
  // beside it — which is exactly the gap it is there to cover.
  //
  // Derived first, hashed second: the poster is a separate file with a hash of
  // its own, so the `.mp4`->`.webp` swap has to happen before the lookup.
  const poster = shouldLoad && variant ? mediaSrc(variant.replace(/\.mp4$/, ".webp")) : undefined;

  // Playback is tied to `revealed`, NOT to `src`. Loading starts a viewport and
  // a half early so the clip is buffered on arrival, but these clips are only
  // ~2s long — starting playback at load time meant every section had already
  // played itself out off-screen, and you scrolled onto a frozen last frame.
  // Buffer early, play on arrival.
  // Depends on `src` as well as `revealed`: a section already on screen at load
  // can latch revealed before the media query has resolved, and without `src`
  // in the deps there would be nothing to play and no second attempt.
  useEffect(() => {
    if (!revealed || !src) return;
    const video = videoRef.current;
    if (!video) return;

    // Guard against a rewind-and-replay if this ever fires twice: the observer
    // latches, but React may re-run the effect.
    if (!video.paused) return;

    video.currentTime = 0;
    // play() rejects when autoplay is refused or the element is torn down
    // mid-load. Neither is actionable, and neither deserves an unhandled
    // rejection in the console.
    video.play().catch(() => {});
  }, [revealed, src]);

  return (
    <>
      {/* The section's snap point. A sibling rather than a child, and not
          sticky, so it stays at this frame's resting offset while the frame
          itself pins and stacks — see `.frame-snap` in globals.css. */}
      <div className="frame-snap" aria-hidden="true" />
      <section
        ref={sectionRef}
        // The entry direction is put on the element as well as used by the
        // hook, so the soundtrack layer can tell a frame that slides in from
        // one that stacks upward without the prop being threaded to it.
        data-enter={enter}
        className="frame-section relative w-full overflow-hidden bg-black"
      >
        <div
          ref={containerRef}
          className="reveal relative h-full w-full"
          data-name={dataName}
          data-revealed={revealed}
        >
          {/* `frame-video` (globals.css) stretches the frame to the window:
              whole composition, nothing cropped, no bars. */}
          <video
            ref={videoRef}
            className="frame-video"
            src={src}
            poster={poster}
            preload="auto"
            muted
            playsInline
          />
          {children}
        </div>
      </section>
    </>
  );
}
