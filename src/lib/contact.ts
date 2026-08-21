/**
 * The two ways to reach Prayrak, and the one place they are written down.
 *
 * Both are read off the notepad in the final frame of the contact section. They
 * are used twice over — by the hotspots laid on that notepad
 * (`ContactHotspots`), and by the tickets in the footer — and those two must
 * never disagree, because they are quoting the same piece of paper. Anything
 * else that needs them should import from here rather than retype them.
 */
export const EMAIL = "prayrakmehta@gmail.com";

/** As written on the notepad, spaces and all. */
export const PHONE_DISPLAY = "+91 99535 91413";

/** The same number as a `tel:` will take it: no spaces, country code kept. */
export const PHONE_DIAL = "+919953591413";

/**
 * The Instagram handle, without the `@`.
 *
 * This used to be a guess in `Footer.tsx`, flagged as unverified because it was
 * inferred from the email address. It is not a guess any more: the reshot
 * contact frame ("Contact Update") writes `@prayrakmehta` on a note of its own,
 * with the Instagram mark under it, so the artwork itself is the source.
 */
export const INSTAGRAM_HANDLE = "prayrakmehta";

/**
 * The studio credit and the production house, both of which the reshot contact
 * frame prints along the bottom in its own credit bar — underlined, so the
 * artwork is already presenting them as links. `ContactHotspots` makes them
 * ones; the footer used to be where they lived.
 */
export const STUDIO_DOMAIN = "logamdigital.com";

/**
 * VHS — the production house Prayrak co-founded. An Instagram handle, not a
 * domain (there is no `.mumbai` TLD), so it resolves through instagram.com.
 */
export const VHS_HANDLE = "vhs.mumbai";
