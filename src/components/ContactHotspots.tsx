"use client";

import { EMAIL, INSTAGRAM_HANDLE, PHONE_DIAL, PHONE_DISPLAY, STUDIO_DOMAIN, VHS_HANDLE } from "@/lib/contact";

/**
 * Where each contact sits inside a cut of the contact frame, in that frame's
 * own pixels — measured off the last frame of the clip, which is where the ink
 * has finished being written.
 *
 * They are in frame coordinates rather than percentages of the screen because
 * the video is `object-fit: cover` (see `.frame-video`): it is scaled to fill
 * the window and the overhang is cropped, and how much is cropped changes with
 * the shape of the window. A box at "32% across" would sit on the email in one
 * window and beside it in the next. `globals.css` turns these numbers back into
 * screen positions by redoing the same cover arithmetic.
 *
 * `rect` is the clickable area: [x1, y1, x2, y2].
 * `icon` is where the artwork has drawn its own icon: [cx, cy, radius]; where
 * one is given, the affordance is a ring around that icon rather than a button
 * of ours.
 * A target with neither `icon` nor a button is one the artwork has already
 * underlined — the two credits in the bar along the bottom. An underline is
 * what a link looks like; adding anything to it would be saying it twice.
 *
 * The cuts are different compositions, not one composition at three sizes, so
 * the lists genuinely differ — in where things are, and in how many there are:
 *
 * - `desktop` was reshot in "Contact Update": three separate notes, each with an
 *   icon under it, and a credits bar along the bottom.
 * - `mobile` is still the older single-notepad cut, with no icons of its own.
 * - `footer` is the closing frame of the mobile reel, which has icons and a
 *   credit bar like the desktop one but at a quarter of the size.
 */
const CUTS = {
  desktop: {
    art: [1920, 1078],
    targets: [
      { kind: "email", rect: [100, 262, 436, 338], icon: [264, 319, 30] },
      { kind: "phone", rect: [672, 398, 1295, 518], icon: [967, 494, 32] },
      { kind: "instagram", rect: [112, 650, 375, 735], icon: [259, 715, 30] },
      // The credit bar the reshoot baked along the bottom of the frame. Both
      // names are drawn underlined, so they are already dressed as links.
      { kind: "studio", rect: [826, 956, 1092, 1012] },
      { kind: "vhs", rect: [1658, 950, 1748, 1010] },
    ],
  },
  /**
   * The closing frame on a phone — `Footer.mp4`, the last section of the
   * mobile reel and the one that replaced the paper footer.
   *
   * It is the mobile answer to the reshot desktop contact cut, and it is built
   * the same way: the artwork draws its own handset, envelope and Instagram
   * mark under "For work and otherwise -", and prints an underlined credit bar
   * along the bottom. So it takes the same treatment — a ring around each icon,
   * nothing added to the two credits.
   *
   * The numbers are measured, not estimated: the icons are black on cream, so
   * their bounding boxes come straight off the pixels of the closing frame, and
   * the two credits are bounded by the underlines the artwork already draws
   * under them.
   *
   * The rects are padded out to about 48px square around each icon. In this
   * frame's coordinates that is nearly the same as CSS pixels — the art is 404
   * wide and a phone is 390-430 — so 48 here really is a 48px tap target, which
   * is the smallest one worth offering a thumb.
   */
  footer: {
    art: [404, 738],
    targets: [
      { kind: "phone", rect: [47, 196, 95, 244], icon: [71, 220, 22] },
      { kind: "email", rect: [126, 206, 174, 254], icon: [150, 230, 22] },
      { kind: "instagram", rect: [206, 214, 254, 262], icon: [230, 238, 23] },
      // Both underlined by the artwork, so both are already dressed as links.
      { kind: "studio", rect: [160, 666, 318, 692] },
      { kind: "vhs", rect: [242, 699, 304, 724] },
    ],
  },
} as const;

type Kind = "email" | "phone" | "instagram" | "studio" | "vhs";

const LINKS: Record<Kind, { href: string; label: string; text: string }> = {
  email: { href: `mailto:${EMAIL}`, label: `Email ${EMAIL}`, text: EMAIL },
  phone: { href: `tel:${PHONE_DIAL}`, label: `Call ${PHONE_DISPLAY}`, text: PHONE_DISPLAY },
  instagram: {
    href: `https://instagram.com/${INSTAGRAM_HANDLE}`,
    label: `Instagram, @${INSTAGRAM_HANDLE}`,
    text: `@${INSTAGRAM_HANDLE}`,
  },
  studio: {
    href: `https://${STUDIO_DOMAIN}`,
    label: `Logam Digital, ${STUDIO_DOMAIN}`,
    text: "Logam Digital",
  },
  vhs: {
    href: `https://instagram.com/${VHS_HANDLE}`,
    label: `VHS on Instagram, @${VHS_HANDLE}`,
    text: `@${VHS_HANDLE}`,
  },
};

// Which of them leave the page. `mailto:` and `tel:` hand off to another app
// and should not open a tab; the rest are ordinary outbound links.
const OUTBOUND: ReadonlySet<Kind> = new Set<Kind>(["instagram", "studio", "vhs"]);

// When the affordance appears, measured from the frame being revealed. A clip
// spends its whole length writing the notes, so anything drawn on a line before
// that has finished is drawn on a blank rule. This waits for the pen to stop.
//
// Per cut, because the clips are not the same length: the section frames run
// ~2.03s, the closing footer frame 1.53s. Waiting 1.9s on a clip that finished
// at 1.53 is a third of a second of a frame that is done and still bare.
const PIN_AFTER = 1900;
const FOOTER_PIN_AFTER = 1450;
const PIN_STAGGER = 220;

/**
 * The contact details on the final frame, made clickable.
 *
 * The frame ends on notepaper with the address, the number and the handle
 * written out in longhand, and until now they were a picture of contact details
 * rather than contact details: you had to copy them out by eye, which on a
 * phone — the one device that can act on all three — is the worst place to do
 * it.
 *
 * How they are pointed out depends on the cut, because the two cuts differ:
 *
 * - The **desktop** cut draws its own icon under each note — an envelope, a
 *   handset, an Instagram mark. The affordance is already in the artwork, so
 *   this puts a ring round it rather than a button over it. Adding our own icon
 *   there would be two icons saying the same thing.
 * - The **mobile** cut is the older single-notepad composition with no icons of
 *   its own, so it keeps the cream paper button pinned at the end of each line.
 * - The **footer** cut — the closing frame of the mobile reel — draws its own
 *   icons, so it is ringed like the desktop one. It is asked for by name rather
 *   than picked by viewport, because the section that renders it is mobile-only
 *   already.
 *
 * Either way the whole line is the target, so what you can hit is much bigger
 * than what advertises it.
 *
 * (Recording the two attempts before this one, so they are not retried:
 * invisible-until-hovered — an affordance nobody can see is one nobody uses;
 * and a highlighter mark through each line — which read as decoration on the
 * artwork rather than as something to press.)
 */
export default function ContactHotspots({ cut: cutName }: { cut: keyof typeof CUTS }) {
  // No viewport check of its own any more. Each cut belongs to exactly one
  // section, and each of those sections is already the one that decided whether
  // it renders at all — so by the time this runs, which cut applies is settled.
  const cut = CUTS[cutName];
  const [artW, artH] = cut.art;
  const pinAfter = cutName === "footer" ? FOOTER_PIN_AFTER : PIN_AFTER;

  return (
    <div className="frame-hotspots" style={{ ["--art-w" as string]: artW, ["--art-h" as string]: artH }}>
      {cut.targets.map((target, i) => {
        const [x1, y1, x2, y2] = target.rect;
        const link = LINKS[target.kind as Kind];
        const icon = "icon" in target ? (target.icon as readonly number[]) : null;

        return (
          <a
            key={target.kind}
            className="frame-hotspot"
            href={link.href}
            {...(OUTBOUND.has(target.kind as Kind)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            style={{
              ["--x" as string]: x1,
              ["--y" as string]: y1,
              ["--w" as string]: x2 - x1,
              ["--h" as string]: y2 - y1,
              ["--pin-delay" as string]: `${pinAfter + i * PIN_STAGGER}ms`,
            }}
            aria-label={link.label}
          >
            {/* The link's visible content is a picture, so it needs to say what
                it is out loud — and `aria-label` alone is neither selectable
                nor translatable. */}
            <span className="sr-only">{link.text}</span>

            {icon ? (
              <span
                className="hotspot-ring"
                style={{
                  // Placed relative to this link's own box, since that is what
                  // the CSS positions everything against.
                  ["--ring-x" as string]: icon[0] - x1,
                  ["--ring-y" as string]: icon[1] - y1,
                  ["--ring-r" as string]: icon[2],
                }}
                aria-hidden="true"
              />
            ) : null}
          </a>
        );
      })}
    </div>
  );
}
