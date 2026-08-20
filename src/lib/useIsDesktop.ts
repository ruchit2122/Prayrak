"use client";

import { useSyncExternalStore } from "react";

// Kept in the same unit as Tailwind's `md` breakpoint (48rem) so the source
// this hook picks can never disagree with the CSS that sizes the element.
const DESKTOP_QUERY = "(min-width: 48rem)";

function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

// `null` on the server: the viewport is unknowable during SSR, and guessing
// would mean shipping bytes for the variant that ends up hidden.
function getServerSnapshot(): boolean | null {
  return null;
}

/**
 * `true` on desktop widths, `false` on mobile, `null` until the client knows.
 *
 * `useSyncExternalStore` is used rather than `useEffect` so the value is
 * correct on the very first client render instead of one paint later, and so
 * a resize across the breakpoint swaps the source instead of leaving a
 * mismatched one in place.
 */
export function useIsDesktop(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
