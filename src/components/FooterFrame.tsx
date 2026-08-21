"use client";

import { useIsDesktop } from "@/lib/useIsDesktop";
import SectionVideo from "@/components/SectionVideo";
import ContactHotspots from "@/components/ContactHotspots";

/**
 * The closing frame of the reel on a phone, in place of the paper footer.
 *
 * The desktop contact cut was reshot with a credit bar drawn into it, which is
 * what let the paper footer go on desktop — the credits were in the film. This
 * is the same move for phones: `Footer.mp4` ends on the note, the three icons
 * and the credit bar, so the page can end on a frame like every other screen
 * rather than on a sheet of markup pretending to be one.
 *
 * Mobile only, and gated in JS rather than CSS. `display: none` would be
 * simpler but the point is not to hide it on desktop, it is not to *load* it —
 * a hidden `<video>` still has a `src`, and `SectionVideo` would go on fetching
 * a clip nobody can see. Returning null renders no element at all, so there is
 * nothing to fetch and no snap point in the ladder either, which is what keeps
 * the desktop scroll exactly as long as it was.
 *
 * `desktopSrc` is the same file as `mobileSrc` and is never reached: the
 * component only renders when `isDesktop` is false. `SectionVideo` requires
 * both, and pointing it at the same clip is more honest than a desktop cut that
 * does not exist.
 */
export default function FooterFrame() {
  const isDesktop = useIsDesktop();
  if (isDesktop !== false) return null;

  return (
    <SectionVideo
      dataName="footer"
      desktopSrc="/mobile-sections/footer.mp4"
      mobileSrc="/mobile-sections/footer.mp4"
    >
      {/* The handset, the envelope, the Instagram mark and the two credits
          along the bottom, all made tappable. */}
      <ContactHotspots cut="footer" />
    </SectionVideo>
  );
}
