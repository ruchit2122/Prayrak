"use client";

import { useEffect, type RefObject } from "react";

/**
 * Which edge a frame arrives from as it covers the frame before it.
 *
 * `up` is the plain stack — the frame rises from the bottom, which is what
 * scrolling already does and needs no code at all.
 */
export type FrameEnter = "up" | "left" | "right";

// Matches Tailwind's `md` and DESKTOP_QUERY in useIsDesktop.ts. On a phone the
// frame is nearly as tall as the window and a sideways gesture has no room to
// read as anything but a wobble, so phones keep the upward stack.
const DESKTOP_QUERY = "(min-width: 48rem)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Slides a frame in from the left or right as it takes over the screen.
 *
 * Why this is JS at all, on a page that otherwise has no scroll listener: the
 * CSS way to tie an animation to the scroll is `animation-timeline: view()`,
 * and a view timeline measures where its subject sits inside the scrollport.
 * These sections are `position: sticky`, so the moment one pins to the top of
 * the window it stops moving, the timeline freezes, and the animation holds its
 * first keyframe — the frame parks off-screen and never arrives. That was
 * measured, not assumed: the same rule animates correctly the instant the
 * section is made `position: static`. Reading `scrollY` sidesteps it entirely,
 * because the scroll position keeps changing whether or not the element does.
 *
 * The transform carries both axes, and both are needed. A section that has not
 * reached the top of the window yet sits `remaining` screens below it, so the Y
 * term cancels exactly that and holds the incoming frame against the top for
 * the whole slide while X carries it in from the edge. Both reach 0 together at
 * the moment the frame would naturally have arrived — which is also where
 * sticky takes over and where the scroll snaps. Animate X alone and the frame
 * comes in diagonally.
 */
export function useSlideIn(ref: RefObject<HTMLElement | null>, enter: FrameEnter) {
  useEffect(() => {
    const el = ref.current;
    if (!el || enter === "up") return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const sign = enter === "left" ? -1 : 1;

    // The section's resting offset in the document. Read once per layout rather
    // than per frame: `offsetTop` forces a reflow, and doing that inside a
    // scroll handler is how a smooth page becomes a janky one. It is also the
    // element's *layout* position, unaffected by the sticky offset that pins
    // it, which is exactly the anchor this needs.
    let restingTop = 0;
    let viewport = 0;
    let queued = 0;

    const measure = () => {
      restingTop = el.offsetTop;
      viewport = window.innerHeight;
    };

    const paint = () => {
      queued = 0;
      // 0 when the frame's top edge is at the bottom of the window, 1 when it
      // has fully arrived. Outside that window there is nothing to animate.
      const progress = (window.scrollY - (restingTop - viewport)) / viewport;
      const remaining = Math.min(1, Math.max(0, 1 - progress));

      // Clearing rather than writing `translate3d(0,0,0)` at rest leaves the
      // element with no transform at all, so it is not needlessly promoted to
      // its own compositor layer for the entire time it sits pinned.
      if (remaining === 0) {
        el.style.transform = "";
        return;
      }
      el.style.transform = `translate3d(${sign * remaining * 100}%, ${-remaining * viewport}px, 0)`;
    };

    const schedule = () => {
      if (!queued) queued = requestAnimationFrame(paint);
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      if (queued) cancelAnimationFrame(queued);
      queued = 0;
      el.style.transform = "";
    };

    const start = () => {
      // addEventListener with the same reference twice is a no-op, so calling
      // this again on a media-query change cannot stack up listeners.
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", remeasure, { passive: true });
      remeasure();
    };

    const sync = () => {
      if (desktop.matches && !reduced.matches) start();
      else stop();
    };

    sync();
    desktop.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      stop();
      desktop.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [ref, enter]);
}
