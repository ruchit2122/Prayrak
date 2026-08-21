"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFadeOnScroll } from "@/lib/useFadeOnScroll";
import { scrollToFrame } from "@/lib/frames";
import { playFoley } from "@/components/SoundProvider";

/**
 * Every frame after the intro, in the order `page.tsx` renders them.
 *
 * The index here is also how far down the page each one lives — frame n sits at
 * n screens — which is the whole reason a card can scroll to its frame without
 * measuring anything.
 *
 * These are NOT the `-D.webp` posters that sit beside each clip. A poster is
 * the clip's *first* frame, and every one of these sections animates its
 * collage together over ~2s, so the posters show a half-built composition — the
 * work frame's poster is a bare card with the title still being painted onto
 * it. A navigator has to show the slide, not the slide mid-assembly, so these
 * are the *last* frame of each clip, pulled with:
 *
 *     ffmpeg -sseof -0.15 -i "<clip>.mp4" -update 1 -frames:v 1 \
 *       -vf scale=480:-2 -q:v 78 public/rail/<name>.webp
 *
 * 480px wide because they are drawn at ~170px and never more than ~210px, so
 * that is still two device pixels per CSS pixel on a retina screen with room to
 * spare — 228KB for the whole set against ~1.4MB of full-size posters.
 *
 * Keep this in step with the order in `page.tsx`.
 */
const FRAMES = [
  { name: "About this guy", art: "/rail/about-this-guy.webp" },
  // No Work frame: `page.tsx` has `<WorkSection />` commented out. It has to be
  // absent here too, and not merely hidden — the rail scrolls by *index*, one
  // frame per screen, so a slide listed that the page does not render puts
  // every frame after it one screen out. Put the section back in `page.tsx` and
  // this line comes back with it (`/rail/work.webp` is still on disk).
  { name: "Shadows of the moonless nights", art: "/rail/shadows.webp" },
  { name: "Holy curse", art: "/rail/holy-curse.webp" },
  { name: "Black warrant", art: "/rail/black-warrant.webp" },
  { name: "Kohrra", art: "/rail/kohrra.webp" },
  { name: "Ziddi girls", art: "/rail/ziddi-girls.webp" },
  { name: "Sisterhood", art: "/rail/sisterhood.webp" },
  { name: "Upcoming releases", art: "/rail/upcoming-releases.webp" },
  { name: "Co-founder", art: "/rail/cofounder.webp" },
  { name: "Contact", art: "/rail/contact.webp" },
];

// Every frame gets an equal slice of a full turn around the arc, so the ones
// that do not fit in the visible stretch of it are not missing — they are round
// the far side, and a drag carries them back into view.
const STEP = 360 / FRAMES.length;

// Vertical travel, in pixels, that carries the rail by one slide. Roughly the
// on-screen gap between two cards at the middle of the arc, so the rail keeps
// pace with the hand dragging it rather than racing ahead of it.
const PX_PER_STEP = 84;

// Past this the pointer was dragging the drum, not pressing a card, and the
// click that follows the drag must not navigate.
const DRAG_SLOP = 6;

// The rail is gone by the time the page has scrolled a third of a screen. It
// says "there are more of these" — a question the reader answers themselves the
// moment they start scrolling — and it has to be clear before the second frame
// slides over the intro or it reads as a strip cut in half by the incoming
// video. It leaves the way the frames do: sideways, off its own edge.
const FADE_SPAN = 0.35;
const FADE_DRIFT = 60;

// Stills are held back until the intro has had the connection to itself: the
// intro clip is ~2MB and it is what the LCP is measured on. After that, only
// the cards within reach of the front are fetched — the drum holds eleven, and
// the ones round the back are not worth a byte until they are turned toward
// the reader.
const ART_DELAY = 800;
const ART_REACH = 3;

// The cards deal themselves onto the page one at a time rather than arriving as
// a block: a block reads as a panel appearing, one at a time reads as a hand
// laying slides down, which is the gesture the frames below make as they stack.
// `RAIL_DELAY` is the wait before the first, long enough for the intro frame to
// register; `STAGGER` is the beat between each. Only the cards in the opening
// arc are dealt — the rest are behind the drum and have nothing to announce.
const RAIL_DELAY = 900;
const STAGGER = 150;
const DEALT = 4;

// The rail carries itself round one slide at a time, slowly, so a reader who
// does nothing still sees that there is more here than the arc holds. A step
// every few seconds rather than a continuous creep: continuous motion beside a
// video reads as a second video, and a card that never stops moving is a card
// that is awkward to click.
const AUTO_EVERY = 3600;
// Nothing moves on its own until the opening deal has finished and the frame
// has been allowed to be still for a moment.
const AUTO_START = 2600;
// After the reader touches the rail it is theirs. It picks itself up again only
// once they have left it alone for this long.
const AUTO_RESUME = 7000;

/** Shortest distance between two slots around the drum, in slides. */
function around(a: number, b: number) {
  const raw = Math.abs(a - b) % FRAMES.length;
  return Math.min(raw, FRAMES.length - raw);
}

/**
 * The reel's navigator: a drum of slide thumbnails turning down the right-hand
 * side of the opening screen.
 *
 * The page is a stack of full-bleed videos with nothing on screen to say there
 * is more than one of them — the intro fills the window edge to edge and looks,
 * at rest, like the whole site. This says otherwise the way a deck does: here
 * are the slides, click one to go there. Every frame is on the drum, so the
 * four or five in the visible arc are a window onto the whole page rather than
 * an arbitrary first few; the rest are round the back until dragged forward.
 *
 * Desktop only, and the gate for that is in `Intro` rather than here: a
 * component that returns `null` after its hooks have run leaves those hooks
 * watching an element that was never mounted, and the fade would then be wired
 * to nothing on a window resized up across the breakpoint. Not rendering it at
 * all has no such seam. (On a phone a rail wide enough to read covers a third
 * of the frame it is advertising, which is why it is gated.)
 */
export default function SlideRail() {
  const railRef = useRef<HTMLElement>(null);
  const drumRef = useRef<HTMLUListElement>(null);

  // The drum's angle lives in a ref, not in state, and is written straight to
  // the element as a custom property. A drag would otherwise re-render eleven
  // cards on every pointermove to move one transform. React is told only where
  // the drum came to rest, which is all it needs to decide what to load and
  // what to put in the tab order.
  const turnRef = useRef(0);
  const [front, setFront] = useState(0);

  // Which cards have their picture. Monotonic: one that has been fetched stays
  // fetched, because dropping the art of a card that turned away would only
  // re-request it the next time round. It grows in the two places that can
  // bring a card within reach — the drum turning, and the delay expiring —
  // rather than from an effect watching `front`, which would mean a second
  // render for something the first one already knew.
  const [fetched, setFetched] = useState<number[]>([]);
  const artOpen = useRef(false);

  const drag = useRef<{ id: number; from: number; y: number; moved: number } | null>(null);
  const dragged = useRef(false);

  // Auto-rotation yields to the reader in two ways: it holds off entirely while
  // the pointer is over the rail or the focus is inside it, and it stands back
  // for a while after any deliberate move — a drag, a chevron, an arrow key.
  const engaged = useRef(false);
  const resumeAt = useRef(0);

  useFadeOnScroll(railRef, FADE_SPAN, FADE_DRIFT);

  // Everything within reach of a given slot, added to what is already held.
  const reach = useCallback((slot: number) => {
    setFetched((held) => {
      const add = FRAMES.map((_, i) => i).filter(
        (i) => around(i, slot) <= ART_REACH && !held.includes(i),
      );
      return add.length ? [...held, ...add] : held;
    });
  }, []);

  const turn = useCallback((to: number, settle: boolean) => {
    turnRef.current = to;
    const drum = drumRef.current;
    if (!drum) return;
    // `is-turning` is what carries the transition. It is off during a drag so
    // the rail tracks the pointer exactly, and on for a snap or a step so it
    // eases into place.
    drum.classList.toggle("is-turning", settle);
    // One number, written straight to the element, and every card works out its
    // own place on the arc from it in CSS. The alternative — computing eleven
    // positions in React — is eleven re-renders per pointermove to move one
    // rail.
    drum.style.setProperty("--turn", String(to));
    // Negative turns are legal — the drum is a circle and spins both ways
    // without end — so the slot has to be brought back into range.
    const slot = ((Math.round(to) % FRAMES.length) + FRAMES.length) % FRAMES.length;
    setFront(slot);
    if (artOpen.current) reach(slot);
  }, [reach]);

  useEffect(() => {
    turn(0, false);
  }, [turn]);

  useEffect(() => {
    const id = setTimeout(() => {
      artOpen.current = true;
      reach(Math.round(turnRef.current));
    }, ART_DELAY);
    return () => clearTimeout(id);
  }, [reach]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Capture so the drum keeps receiving the drag after the pointer leaves the
    // stage — a turn of any size crosses that edge. It throws if the pointer is
    // already gone by the time this runs, which is not worth failing the drag
    // over: without capture the drag simply ends at the edge.
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* no capture; the drag still tracks while the pointer is over the rail */
    }
    drag.current = { id: e.pointerId, from: turnRef.current, y: e.clientY, moved: 0 };
    dragged.current = false;
    hold();
    drumRef.current?.classList.remove("is-turning");
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dy = e.clientY - d.y;
    d.moved = Math.max(d.moved, Math.abs(dy));
    // Dragging down brings the slide above the front down into it, which is a
    // turn backwards — hence the minus. The drum follows the hand.
    turn(d.from - dy / PX_PER_STEP, false);
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    dragged.current = d.moved > DRAG_SLOP;
    // The flag exists for exactly one event: the click the browser fires on
    // whichever card the drag came to rest over. Clearing it on a timeout —
    // which runs after that click — rather than leaving it set until the next
    // pointerdown, because a card can also be activated from the keyboard, and
    // that click arrives with no pointerdown before it to reset anything. Left
    // standing, the flag would silently swallow the next Enter on a card.
    if (dragged.current) setTimeout(() => (dragged.current = false), 0);
    // Always come to rest on a slide, never between two. Same rule the page
    // itself follows with scroll snapping.
    turn(Math.round(turnRef.current), true);
  };

  // "The reader just did something; leave the rail alone."
  const hold = () => {
    resumeAt.current = Date.now() + AUTO_RESUME;
  };

  const step = (by: number) => {
    hold();
    playFoley("flip");
    turn(Math.round(turnRef.current) + by, true);
  };

  // Bound to the element itself rather than through React's `onMouseEnter`.
  // React derives enter/leave from delegated `mouseover`/`mouseout` at the root,
  // which is a lot of machinery between the pointer and a flag that decides
  // whether the page moves on its own; the native events fire on this element,
  // for this element, and nothing else can swallow them. `focusin`/`focusout`
  // are the keyboard's version of the same thing, and unlike `focus`/`blur`
  // they bubble, so one pair covers every card and both chevrons.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const enter = () => (engaged.current = true);
    const leave = () => {
      engaged.current = false;
      resumeAt.current = Date.now() + AUTO_RESUME;
    };

    rail.addEventListener("pointerenter", enter);
    rail.addEventListener("pointerleave", leave);
    rail.addEventListener("focusin", enter);
    rail.addEventListener("focusout", leave);

    return () => {
      rail.removeEventListener("pointerenter", enter);
      rail.removeEventListener("pointerleave", leave);
      rail.removeEventListener("focusin", enter);
      rail.removeEventListener("focusout", leave);
    };
  }, []);

  useEffect(() => {
    // Reads rather than subscribes: at one check every few seconds, asking the
    // media query each time costs nothing and cannot go stale.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    resumeAt.current = Date.now() + AUTO_START;

    const id = setInterval(() => {
      // Motion the reader did not ask for is exactly what this query is for.
      if (reduced.matches) return;
      // A background tab is not being read, and a rail that spent ten minutes
      // there would come back somewhere arbitrary.
      if (document.hidden) return;
      if (engaged.current || Date.now() < resumeAt.current) return;
      // Once the page has scrolled past the intro the rail is invisible (see
      // `useFadeOnScroll`), and turning something nobody can see is pure waste.
      if (window.scrollY > window.innerHeight * FADE_SPAN) return;

      // No foley on the drift. The paper is the sound of the rail being
      // handled, and nobody is handling it — a flip every few seconds from an
      // untouched page is a page with a fault, not a page with a texture.
      turn(Math.round(turnRef.current) + 1, true);
    }, AUTO_EVERY);

    return () => clearInterval(id);
  }, [turn]);

  return (
    <nav
      ref={railRef}
      className="slide-rail"
      aria-label="Slides"
      onKeyDown={(e) => {
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
        // Only the drum answers to the arrows; the page's own scrolling by
        // keyboard is left alone everywhere else.
        e.preventDefault();
        step(e.key === "ArrowDown" ? 1 : -1);
      }}
    >
      <button type="button" className="slide-rail-step paper-arrow" onClick={() => step(-1)} aria-label="Turn to earlier slides">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
          <path d="M5 15l7-7 7 7" strokeLinecap="square" />
        </svg>
      </button>

      <div
        className="slide-rail-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ul
          ref={drumRef}
          className="slide-rail-drum"
          // How wide a slice of the arc one slide takes. It depends on how many
          // slides there are, which CSS cannot count.
          style={{ ["--step" as string]: `${STEP}deg` }}
        >
          {FRAMES.map(({ name, art }, i) => {
            const off = around(i, front);

            return (
              <li
                key={name}
                className="slide-rail-slot"
                // Each card's own place in the order, fixed for the life of the
                // page. Where that lands on screen is `(--slot-i - --turn)`
                // slices around the arc, which the stylesheet works out.
                style={{
                  ["--slot-i" as string]: i,
                  ["--slot-deal" as string]: `${RAIL_DELAY + i * STAGGER}ms`,
                }}
              >
                <button
                  type="button"
                  className="slide-rail-card"
                  // A card faded out round the far side of the arc is not a
                  // target: without this the rail would take clicks meant for
                  // the frame behind it, from a card nobody can see.
                  data-reachable={off <= 2}
                  data-dealt={i < DEALT}
                  tabIndex={off <= 1 ? 0 : -1}
                  aria-hidden={off > 2}
                  onClick={() => {
                    // The pointer that just spun the drum also fires a click on
                    // whichever card it came to rest over. That is a turn, not
                    // a press.
                    if (dragged.current) return;
                    scrollToFrame(i + 1);
                  }}
                  aria-label={`Go to ${name}`}
                >
                  <span
                    className="slide-rail-art"
                    data-loaded={fetched.includes(i)}
                    style={fetched.includes(i) ? { backgroundImage: `url("${art}")` } : undefined}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button type="button" className="slide-rail-step paper-arrow" onClick={() => step(1)} aria-label="Turn to later slides">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
          <path d="M5 9l7 7 7-7" strokeLinecap="square" />
        </svg>
      </button>
    </nav>
  );
}
