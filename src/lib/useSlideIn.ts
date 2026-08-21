"use client";

import type { RefObject } from "react";

/**
 * Which edge a frame arrives from as it covers the frame before it.
 *
 * `up` is the plain stack — the frame rises from the bottom, which is what
 * scrolling already does and needs no code at all.
 */
export type FrameEnter = "up" | "left" | "right";

/**
 * Slide-in-from-side effect removed: every frame now uses the plain upward
 * stack regardless of `enter`. Kept as a no-op so callers passing `enter`
 * don't need to change.
 */
export function useSlideIn(_ref: RefObject<HTMLElement | null>, _enter: FrameEnter) {}
