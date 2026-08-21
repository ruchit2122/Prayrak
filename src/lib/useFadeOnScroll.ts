"use client";

import { useEffect, type RefObject } from "react";

/**
 * Fades an element out over the first fraction of a screen of scrolling, and
 * sends it off its own right edge as it goes.
 *
 * Both things that sit on top of the intro — the slide rail and the scroll cue
 * — are answers to the same question ("is there more below?"), and that
 * question is answered the moment the reader starts scrolling. They also both
 * have to be clear before the second frame slides over the intro, or they read
 * as furniture cut in half by the incoming video.
 *
 * Driven from `scrollY` rather than an IntersectionObserver because there is
 * nothing here for an observer to watch: the intro is `position: sticky`, so it
 * never leaves the viewport — it pins and gets covered. The scroll position is
 * the only thing in this arrangement that keeps changing, which is the same
 * reason `useSlideIn` reads it.
 *
 * @param span how much of a screen of scrolling takes it from full to gone
 * @param drift how far it travels as it leaves, in percent of its own width
 */
export function useFadeOnScroll(ref: RefObject<HTMLElement | null>, span: number, drift: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let queued = 0;

    const paint = () => {
      queued = 0;
      const gone = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * span)));

      el.style.opacity = String(1 - gone);
      el.style.transform = `translate3d(${gone * drift}%, 0, 0)`;
      // Anything at 2% opacity is invisible and still swallows clicks meant for
      // the frame behind it.
      el.style.pointerEvents = gone > 0.9 ? "none" : "";
    };

    const schedule = () => {
      if (!queued) queued = requestAnimationFrame(paint);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    // Paint once up front: a reload part-way down the page must not start at
    // full strength and then jump.
    paint();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (queued) cancelAnimationFrame(queued);
    };
  }, [ref, span, drift]);
}
