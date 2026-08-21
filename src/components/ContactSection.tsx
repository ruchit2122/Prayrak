"use client";

import { useIsDesktop } from "@/lib/useIsDesktop";
import SectionVideo from "@/components/SectionVideo";
import ContactHotspots from "@/components/ContactHotspots";

/**
 * The contact frame — desktop only.
 *
 * The mobile cut of this frame was never reshot: it is the older single-notepad
 * composition, carrying the address and the number and nothing else, with no
 * icons of its own and no credit bar. `Footer.mp4` says everything it said and
 * the rest besides — the handset, the envelope, the Instagram mark and both
 * credits — so on a phone that frame closes the reel in this one's place rather
 * than after it. Two contact screens back to back is one too many, and the
 * older one is the one with less on it.
 *
 * Gated in JS, not CSS, for the same reason as `FooterFrame`: `display: none`
 * would still leave a `<video src>` in the page and fetch a 194KB clip nobody
 * can see.
 */
export default function ContactSection() {
  const isDesktop = useIsDesktop();
  if (isDesktop !== true) return null;

  return (
    <SectionVideo
      dataName="contact"
      desktopSrc="/desktop-sections/contact-D.mp4"
      mobileSrc="/desktop-sections/contact-D.mp4"
    >
      {/* The email, the number, the handle and the two credits, made clickable. */}
      <ContactHotspots cut="desktop" />
    </SectionVideo>
  );
}
