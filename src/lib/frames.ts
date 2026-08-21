/**
 * Where each frame rests, read off the page rather than worked out from the
 * window.
 *
 * The `.frame-snap` markers (see `globals.css`) are the page's ladder: a
 * zero-height element in normal flow immediately before each section, plus the
 * footer at the end. Their offsets are the scroll positions the snap ladder
 * actually uses, so anything scrolling the page itself should aim at one of
 * them and land exactly where a swipe would.
 *
 * The tempting shortcut is `window.innerHeight * n`, and it is wrong on a
 * phone: the frames are sized in `svh` while `innerHeight` is the current
 * height, so the two disagree by the height of a retracted address bar and
 * every jump overshoots by that much per frame — landing between two stacked
 * sticky frames, which is the one resting position on this page that looks
 * broken. They agree on a desktop, which is exactly why it survives being
 * tested there. `SoundProvider` reads the same markers for the same reason.
 */
export function frameTops(): number[] {
  return Array.from(document.querySelectorAll<HTMLElement>(".frame-snap"), (m) => m.offsetTop);
}

/**
 * Scroll to frame `index` (0 is the intro), or as near as the ladder goes.
 *
 * `scroll-behavior: smooth` on `html` does the easing; the snap ladder catches
 * the landing. Nothing here animates anything itself.
 */
export function scrollToFrame(index: number) {
  const tops = frameTops();
  const top = tops[Math.min(Math.max(index, 0), tops.length - 1)];
  if (top === undefined) return;
  window.scrollTo({ top });
}
