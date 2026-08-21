"use client";

import { useRef } from "react";
import { useFadeOnScroll } from "@/lib/useFadeOnScroll";
import { scrollToFrame } from "@/lib/frames";

// Same span the rail uses: gone within a third of a screen, well before the
// second frame arrives over the intro.
const FADE_SPAN = 0.35;

/**
 * The scroll cue at the foot of the first frame.
 *
 * The slide rail says *what* is below; this says *that* something is, and it
 * says it to everyone — unlike the rail it renders on phones too, where it is
 * the only hint the page has more than one screen.
 *
 * It is a button rather than a decoration because it is the one thing on this
 * page a first-time reader might press before scrolling, and pressing it should
 * do what it depicts.
 */
export default function ScrollCue() {
  const ref = useRef<HTMLButtonElement>(null);

  // Straight down and out, with no sideways drift: this one sits in the middle
  // of the frame, and anything that leaves sideways from there crosses the
  // composition on its way off.
  useFadeOnScroll(ref, FADE_SPAN, 0);

  return (
    <button
      ref={ref}
      type="button"
      className="scroll-cue paper-arrow"
      // One frame down — aimed at that frame's own snap marker rather than at
      // `window.innerHeight`, which on a phone is a different number and would
      // overshoot by the height of a retracted address bar. See `frames.ts`.
      onClick={() => scrollToFrame(1)}
      aria-label="Scroll to the next frame"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <path d="M12 4v14M5.5 12l6.5 6.5 6.5-6.5" strokeLinecap="square" />
      </svg>
    </button>
  );
}
