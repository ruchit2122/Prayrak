"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// One track per film, keyed by the `data-name` that is already on every frame.
// Keeping the table here rather than threading an `audioSrc` prop through six
// section components means the sections do not change at all, and the whole
// soundtrack can be read in one place. A frame with no entry is silence, which
// is what the intro, work, co-founder, contact and upcoming-releases frames
// want — the bed fades out as they arrive rather than carrying over.
const SECTION_TRACKS: Record<string, { src: string; title: string }> = {
  "black warrant": { src: "/section-audio/black-warrant.mp3", title: "Black Warrant" },
  "holy curse": { src: "/section-audio/holy-curse.mp3", title: "Holy Curse" },
  kohrra: { src: "/section-audio/kohrra.mp3", title: "Kohrra" },
  "shadows of the moonless nights": {
    src: "/section-audio/shadows.mp3",
    title: "Shadows of the Moonless Nights",
  },
  sisterhood: { src: "/section-audio/sisterhood.mp3", title: "Sisterhood" },
  "ziddi girls": { src: "/section-audio/ziddi-girls.mp3", title: "Ziddi Girls" },
};

// Loud enough to sit under the frame, quiet enough that it is never the reason
// someone reaches for the volume key.
const FULL_VOLUME = 0.55;

// The only duration in here. Volume is otherwise a function of scroll position
// rather than of elapsed time — see `sectionGain`. This covers the very first
// note only: arriving already deep in the page (a refresh partway down, or a
// link into the middle) puts the envelope at full the instant the track opens,
// and without this that lands as a blast rather than as a start.
const OPENING_RAMP_MS = 500;

// The page's own foley. Every one of these is paper or desk — the same material
// the collage is made of — so they read as the page handling itself rather than
// as interface feedback. Kept well under the score: these punctuate, they do not
// perform.
const SFX = {
  slide: "/sfx/paper-slide.mp3",
  flip: "/sfx/paper-flip.mp3",
  drop: "/sfx/desk-drop.mp3",
  snap: "/sfx/pencil-snap.mp3",
} as const;

type SfxName = keyof typeof SFX;

const SFX_VOLUME = 0.38;

// How long the score waits after a frame turns.
//
// Every frame that carries a score is also one that slides in, so the paper and
// the music would otherwise start on the same beat and arrive as one muddled
// sound. Letting the paper land first puts them in sequence: the frame is
// dragged into place, and then it starts playing. Short enough that it reads as
// one gesture rather than two events — the paper-slide transient is ~25ms in
// and its body runs ~300ms, so the music enters underneath its tail.
const SCORE_ENTRY_DELAY_MS = 260;

/**
 * Which frame the soundtrack currently belongs to, and where that frame rests.
 *
 * Read off the `.frame-snap` markers, never off the sections. The sections are
 * `position: sticky`, and a pinned sticky element reports an `offsetTop` equal
 * to the current scroll position rather than its resting one — measured, not
 * assumed — so every frame the reader has already passed looks like it is
 * exactly here. The markers are the fix: they are deliberately static (see
 * `.frame-snap` in globals.css), one immediately before each section, so their
 * offsets are a fixed ladder that says where each frame actually lives.
 *
 * The handover point is half a frame, not the frame's edge: that is exactly
 * where `sectionGain` below has taken the outgoing track to silence, so the two
 * meet at zero and one element can carry both without a crossfade.
 */
function activeFrame(): { name: string | null; top: number } {
  const marks = document.querySelectorAll<HTMLElement>(".frame-snap");
  const half = framePitch() / 2;
  let name: string | null = null;
  let top = 0;
  for (const mark of marks) {
    if (mark.offsetTop > window.scrollY + half) break;
    name = mark.nextElementSibling?.querySelector<HTMLElement>("[data-name]")?.dataset.name ?? null;
    top = mark.offsetTop;
  }
  return { name, top };
}

/**
 * The distance between one frame and the next, which is what the envelope is
 * measured against.
 *
 * Read off a frame rather than from `window.innerHeight`. The frames are sized
 * in `svh` — the *small* viewport height, i.e. with mobile browser chrome
 * expanded — precisely so they do not resize mid-scroll as the address bar
 * hides. `innerHeight` is the current height, so on a phone the two disagree by
 * the height of that chrome, and an envelope built on it would drift out of
 * step with the ladder it is supposed to track. They are the same number on a
 * desktop, which is exactly why this is worth stating.
 */
function framePitch(): number {
  const frame = document.querySelector<HTMLElement>(".frame-section");
  return frame?.offsetHeight || window.innerHeight;
}

/**
 * How loud this frame's bed should be, from where the scroll is standing.
 *
 * Everything else that moves on this page is driven by the scroll rather than
 * by a timer — see `useSlideIn` — and a fixed-length fade is the one thing that
 * would not be. Scroll slowly and a timed fade finishes long before the frame
 * arrives; flick past and it is still fading up on a frame already gone.
 *
 * So the bed is a function of position, not of elapsed time: full when the
 * frame is pinned, nothing half a frame either side, straight-line between.
 * The frames sit one screen apart on the snap ladder, so each track reaches
 * zero exactly where its neighbour leaves zero — the handover is silent, needs
 * no overlap, and reverses correctly on the way back up because it never had a
 * direction to begin with.
 */
function sectionGain(restingTop: number): number {
  const half = framePitch() / 2;
  return Math.max(0, 1 - Math.abs(window.scrollY - restingTop) / half);
}

/**
 * `asking` — the entry card is up and nothing plays yet.
 * `on`     — the reader chose sound; beds follow the frames.
 * `off`    — the reader declined; the page stays silent for this visit.
 *
 * The card on the way in is the only thing that asks, and it asks once. That
 * moment is not arbitrary: the click answering it is also the user activation
 * every browser requires before audio may be audible at all, and nothing later
 * — a scroll, a frame arriving, a synthetic event — can grant that.
 *
 * The one route back is `off` → `on`, offered by the cue card once it is
 * showing a pause glyph. It is deliberately one-way. Silence is a decision the
 * reader made and the page does not keep asking them to revisit it, but a
 * change of mind should not require a reload.
 */
type SoundMode = "asking" | "on" | "off";

// Remembered for the visit, not beyond it. `sessionStorage` rather than
// `localStorage` on purpose: a reader who refreshes, or follows a link out and
// comes back, should not be asked the same question again — but someone
// returning next week is a new arrival and the card is part of the way in.
//
// It cannot cache the browser's permission, only the reader's answer. User
// activation is per page load, so a restored "on" still needs a gesture before
// anything is audible; that is what the pointerdown/keydown arming is for.
const MODE_KEY = "prayrak:sound-mode";

// Read through an external store rather than mirrored into state by an effect,
// matching `useIsDesktop`: the value is correct on the first client render
// instead of one paint later, so a returning reader never sees the entry card
// flash up before it is dismissed again.
const modeListeners = new Set<() => void>();

function emitModeChange() {
  for (const listener of modeListeners) listener();
}

function subscribeMode(onStoreChange: () => void) {
  modeListeners.add(onStoreChange);
  return () => {
    modeListeners.delete(onStoreChange);
  };
}

function getModeSnapshot(): SoundMode {
  const saved = window.sessionStorage.getItem(MODE_KEY);
  return saved === "on" || saved === "off" ? saved : "asking";
}

// The server cannot know what this visit already answered, and guessing "on"
// would render a page with no entry card that then has to grow one.
function getModeServerSnapshot(): SoundMode {
  return "asking";
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribeMode, getModeSnapshot, getModeServerSnapshot);

  const setMode = useCallback((next: SoundMode) => {
    window.sessionStorage.setItem(MODE_KEY, next);
    emitModeChange();
  }, []);

  // The title on the card, and whether sound is genuinely coming out. The card
  // claims "Now playing", so it is only honest if it tracks real playback
  // rather than intent — a refused `play()` must not read as playing.
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const [audible, setAudible] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<string | null>(null);

  // Two gains multiplied on the way to the element: the scroll envelope, and a
  // one-off ramp on the opening note (see OPENING_RAMP_MS).
  // What the scroll says should be playing, which runs ahead of what actually is
  // during the entry delay above.
  const pendingTrackRef = useRef<string | null>(null);
  const trackTimerRef = useRef(0);

  const scrollGainRef = useRef(0);
  const openingGainRef = useRef(0);
  const rampRef = useRef(0);
  const openedRef = useRef(false);

  // One element per sound, made once and rewound on each use. These are 8-17KB
  // apiece, so holding all four costs less than a single poster frame — and a
  // fresh `new Audio()` per trigger would be a decode every time a frame turns.
  const sfxRef = useRef<Partial<Record<SfxName, HTMLAudioElement>>>({});
  // Which frame the foley has already announced, and where the scroll was last
  // seen — together they give the direction of travel and stop one transition
  // from firing twice.
  const lastEntered = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const pool = sfxRef.current;
    for (const [name, src] of Object.entries(SFX) as [SfxName, string][]) {
      const el = new Audio(src);
      el.preload = "auto";
      el.volume = SFX_VOLUME;
      pool[name] = el;
    }
    return () => {
      for (const el of Object.values(pool)) el?.pause();
      sfxRef.current = {};
    };
  }, []);

  const playSfx = useCallback((name: SfxName) => {
    const el = sfxRef.current[name];
    if (!el) return;
    // Rewind rather than waiting: two frames turned in quick succession should
    // retrigger the sound, not be swallowed because the first is still running.
    el.currentTime = 0;
    el.play().catch(() => {});
  }, []);

  const applyVolume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(
      0,
      Math.min(1, FULL_VOLUME * scrollGainRef.current * openingGainRef.current),
    );
  }, []);

  const openRamp = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / OPENING_RAMP_MS);
      openingGainRef.current = t;
      applyVolume();
      if (t < 1) rampRef.current = requestAnimationFrame(step);
    };
    rampRef.current = requestAnimationFrame(step);
  }, [applyVolume]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !trackRef.current) return;
    trackRef.current = null;
    setAudible(false);
    audio.pause();
    // Dropping the src frees the decoder and stops any buffering still in
    // flight for a frame the reader has already scrolled past.
    audio.removeAttribute("src");
    audio.load();
  }, []);

  // Every browser refuses audible playback until the visitor has interacted
  // with the page, and a scroll does not count. There is no control to press
  // here by design, so the fallback is silent: if the first attempt is refused,
  // wait for the first real gesture — a tap, a click, a key — and start then.
  // The reader is never asked for anything, and the page is never mute for
  // someone who does interact.
  const armOnGesture = useCallback(() => {
    // These three specifically, because they are what the spec counts as
    // activation-triggering. `pointerdown` is the one that matters most: a
    // swipe to scroll opens with it, so a phone reader gets the music from
    // their first scroll without pressing anything. `keydown` covers scrolling
    // by space or arrow key. `touchend` is here and `touchstart` deliberately
    // is not — touchstart does not grant activation, so listening for it would
    // fire this handler early and waste the attempt.
    //
    // A mouse wheel is the gap, and nothing can be added here to close it: the
    // wheel is excluded from activation by every engine on purpose.
    const events = ["pointerdown", "keydown", "touchend"] as const;

    function arm() {
      for (const type of events) document.addEventListener(type, go, { once: true });
    }

    function go() {
      for (const type of events) document.removeEventListener(type, go);
      const audio = audioRef.current;
      if (!audio || !trackRef.current) return;
      // Re-arm on refusal rather than giving up, or one unlucky first gesture
      // leaves the page silent for the rest of the visit.
      audio.play()
        .then(() => {
          openRamp();
          setAudible(true);
        })
        .catch(arm);
    }

    arm();
  }, [openRamp]);

  const playTrack = useCallback(
    (src: string) => {
      const audio = audioRef.current;
      if (!audio) return;
      trackRef.current = src;
      audio.src = src;
      // Set before play(): the envelope is already whatever the current scroll
      // says it is, and starting at any other volume is an audible step.
      applyVolume();
      audio
        .play()
        .then(() => {
          openRamp();
          setAudible(true);
        })
        .catch(() => {
          setAudible(false);
          armOnGesture();
        });
    },
    [applyVolume, armOnGesture, openRamp],
  );

  // Watches the scroll for a change of frame, and swaps the bed to match.
  useEffect(() => {
    let queued = 0;

    // Reading the position and setting the volume are the whole loop. The swap
    // needs no fade of its own: the handover happens where the envelope is
    // already at zero, so changing `src` at that moment is inaudible. That also
    // means there is no in-flight transition to be left half-finished if the
    // tab is backgrounded mid-scroll — whatever the scroll says on the way back
    // is simply applied.
    const sync = () => {
      queued = 0;
      const { name, top } = activeFrame();
      const entry = name ? (SECTION_TRACKS[name] ?? null) : null;
      const next = entry?.src ?? null;

      // React bails out when the value is unchanged, so this is a render per
      // handover — not per scroll event.
      setNowPlaying(entry?.title ?? null);

      // Frame tracking runs in every mode so the card is correct the instant
      // the reader chooses; only playback waits on the answer.
      if (mode !== "on") return;

      // Foley fires at the START of the movement, not at the track handover.
      //
      // The two are a half-frame apart and that gap is audible. `useSlideIn`
      // runs a frame's entry across a full pitch — from `restingTop - pitch` to
      // `restingTop` — so the slide begins the instant the scroll leaves the
      // previous frame. The track handover, by contrast, is deliberately at the
      // half-pitch mark, because that is where the volume envelope crosses
      // zero. Hanging the paper sound on the handover put it halfway through a
      // slide that had already started: the frame moved, then it sounded.
      //
      // So this reads the scroll directly. Frames sit at exact multiples of the
      // pitch, so the position in frames is just `scrollY / pitch`; anything
      // more than a few percent off a whole number means a transition is under
      // way, and the frame being entered is the next one in the direction of
      // travel — `ceil` going down the page, `floor` coming back up.
      const pitch = framePitch();
      const position = window.scrollY / pitch;
      const settled = Math.abs(position - Math.round(position)) <= 0.06;

      if (settled) {
        // Re-arm at rest, so scrolling away again re-triggers.
        lastEntered.current = null;
      } else {
        const descending = window.scrollY >= lastScrollY.current;
        const entering = descending ? Math.ceil(position) : Math.floor(position);

        if (entering !== lastEntered.current) {
          lastEntered.current = entering;
          const marker = document.querySelectorAll<HTMLElement>(".frame-snap")[entering];
          const section = marker?.nextElementSibling as HTMLElement | null;
          const edge = section?.dataset.enter;
          playSfx(edge === "left" || edge === "right" ? "slide" : "flip");
        }
      }
      lastScrollY.current = window.scrollY;

      scrollGainRef.current = next ? sectionGain(top) : 0;

      if (next !== trackRef.current && next !== pendingTrackRef.current) {
        window.clearTimeout(trackTimerRef.current);
        pendingTrackRef.current = next;

        // The outgoing score is stopped immediately rather than left running
        // through the delay. It is inaudible at this point either way — the
        // envelope crosses zero exactly here — but leaving it attached would
        // let `applyVolume` swell it back up on the *incoming* frame's gain.
        stop();

        if (next) {
          trackTimerRef.current = window.setTimeout(() => {
            // The scroll may have moved on during the wait; only start what is
            // still wanted.
            if (pendingTrackRef.current === next) playTrack(next);
          }, SCORE_ENTRY_DELAY_MS);
        }
        return;
      }
      applyVolume();
    };

    const schedule = () => {
      if (!queued) queued = requestAnimationFrame(sync);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    // rAF is suspended while a tab is in the background, so the volume on the
    // way back reflects wherever the scroll was when it left. Re-syncing on the
    // way in re-reads the real position.
    document.addEventListener("visibilitychange", schedule);
    // `schedule()` rather than `sync()`: the first pass sets state, and doing
    // that synchronously in an effect body is a cascading render.
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      if (queued) cancelAnimationFrame(queued);
      cancelAnimationFrame(rampRef.current);
      window.clearTimeout(trackTimerRef.current);
    };
  }, [mode, applyVolume, playSfx, playTrack, stop]);

  // The footer is the one arrival that is not a frame turn: the film stack ends
  // and a desk of contact details is what is underneath. So it gets the object
  // sound rather than the paper one — the tickets put down. Once only, latched
  // by the observer disconnecting, or scrolling up and back down would keep
  // dropping them.
  useEffect(() => {
    if (mode !== "on") return;
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        playSfx("drop");
        obs.disconnect();
      },
      { threshold: 0.25 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [mode, playSfx]);

  return (
    <>
      {children}

      {/* `preload="none"`: six beds is ~2MB, and none of it is worth fetching
          before the reader has reached a frame that uses one. */}
      <audio ref={audioRef} preload="none" playsInline />

      <SoundCue
        title={nowPlaying}
        audible={audible}
        silenced={mode === "off"}
        onResume={() => {
          playSfx("snap");
          setMode("on");
        }}
      />

      {mode === "asking" && (
        <SoundEntry
          onChoose={(wants) => {
            // This handler runs inside the click, which is what makes it the
            // user activation the autoplay policy is waiting for. Everything
            // afterwards — every later frame, every later track — is permitted
            // because of this one gesture.
            // Inside the click, so this one is always permitted — it is the
            // gesture the whole autoplay policy was waiting for.
            if (wants) playSfx("snap");
            setMode(wants ? "on" : "off");
          }}
        />
      )}
    </>
  );
}

/**
 * The cue card.
 *
 * A display, not a control — there is nothing to press. It exists to credit the
 * music: without it every bed is anonymous, and the reader has no way of
 * knowing what they are listening to. Built from the same stock as the footer
 * tickets so it reads as one more thing laid on the page rather than as browser
 * furniture: cream paper, a degree of tilt, a small-caps label over the display
 * face.
 */
function SoundCue({
  title,
  audible,
  silenced,
  onResume,
}: {
  title: string | null;
  audible: boolean;
  silenced: boolean;
  onResume: () => void;
}) {
  // Only the scored frames get a card. On the intro, the work frames and the
  // contact frame there is nothing to name, and a card announcing a soundtrack
  // over a frame that has none is clutter making a promise the page cannot
  // keep. It fades rather than vanishing, so a handover does not end with
  // something blinking out of the corner.
  const visible = title !== null;

  const shell = `paper-cue fixed bottom-5 right-5 z-50 flex w-[12.5rem] items-center gap-2.5 rounded-[3px] px-3 py-2 text-left text-[#1a1a1a] transition-opacity duration-500 motion-reduce:transition-none ${
    visible ? "opacity-100" : "opacity-0"
  }`;

  const body = (
    <>
      {silenced ? <PauseGlyph /> : <Levels playing={audible} />}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[0.5rem] uppercase tracking-[0.18em] text-[#6b5f4a]">
          {silenced ? "Paused" : audible ? "Now playing" : "Soundtrack"}
        </span>
        {/* Two lines, not an ellipsis: these are the films' real titles, and
            "Shadows of the Moonl…" is worse than a card one line taller. */}
        <span className="line-clamp-2 font-[family-name:var(--font-display)] text-[0.7rem] leading-[1.25]">
          {title ?? ""}
        </span>
      </span>
    </>
  );

  // While silenced the card is a button, because a pause glyph that does
  // nothing is a control that lies. It is also the only way back: the entry
  // card is answered once and never returns, so without this a reader who
  // chose silence and then changed their mind would have to reload the page.
  //
  // It is deliberately not a toggle — pressing it starts the soundtrack and
  // the card goes back to being a label. There is no path from here to silence
  // again, which is the asymmetry the brief asked for.
  if (silenced) {
    return (
      <button
        type="button"
        onClick={onResume}
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        aria-label="Play soundtrack"
        className={`${shell} ${visible ? "" : "pointer-events-none"} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b3403a]`}
      >
        {body}
      </button>
    );
  }

  return (
    <div
      // Hidden from assistive tech in full: it is decorative, its text changes
      // on every handover, and a live region that fires on scroll is a
      // nuisance. The film titles belong in the page's real content, not in a
      // corner ornament.
      aria-hidden="true"
      className={shell}
    >
      {body}
    </div>
  );
}

/** Two bars, in place of the level meter, when the reader chose silence. */
function PauseGlyph() {
  return (
    <span className="flex h-5 w-4 shrink-0 items-center justify-center gap-[3px]">
      <span className="h-3 w-[3px] bg-[#6b5f4a]" />
      <span className="h-3 w-[3px] bg-[#6b5f4a]" />
    </span>
  );
}

/** Four level bars, stepped rather than eased so they match the frames. */
function Levels({ playing }: { playing: boolean }) {
  return (
    <span className="flex h-5 w-4 shrink-0 items-end justify-between" data-playing={playing}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="cue-bar" />
      ))}
    </span>
  );
}

/**
 * The entry card.
 *
 * This exists for one technical reason and one editorial one. Technically, a
 * browser will not let a page make a sound until the reader has interacted with
 * it, and on a page you only ever scroll there is otherwise nothing that
 * qualifies — so without a moment like this the soundtrack would simply never
 * play for anyone on a mouse. Editorially, six films' scores are worth being
 * offered rather than sprung: the card says what is about to happen and lets
 * the reader decline it.
 *
 * Both choices are real gestures, which is why declining is a button and not
 * just an absence — the reader who wants silence gets it deliberately, and the
 * page never nags them again for the rest of the visit.
 */
function SoundEntry({ onChoose }: { onChoose: (wantsSound: boolean) => void }) {
  const playRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Focus lands on the affirmative, and Escape means silence — the two
    // things a keyboard reader will reach for first.
    playRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChoose(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onChoose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sound-entry-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-6 backdrop-blur-[2px]"
      // Clicking away is the quiet answer, and the quiet answer is silence.
      // Never the other way round: a stray click must not switch audio on.
      onClick={() => onChoose(false)}
    >
      <div
        className="entry-pop paper-cue w-full max-w-[19rem] rounded-[3px] px-6 py-6 text-center text-[#1a1a1a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Deliberately not explaining itself. The two buttons below already
            say what happens, so a paragraph describing the soundtrack is the
            page telling the reader something the next click would have told
            them anyway — and the more it explains, the more it sounds like a
            feature being sold rather than a film being shown. The word "sound"
            appears once, on the label. */}
        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[#6b5f4a]">Sound</p>
        {/* The headline and the button are one sentence in two halves: the card
            makes the claim, the reader answers it in their own voice. That is
            why the verb has to match — "wait for it" answered by "I want to
            feel it" is two different thoughts sharing a card. */}
        <h2
          id="sound-entry-title"
          className="mt-2 font-[family-name:var(--font-display)] text-[1.15rem] leading-snug"
        >
          Meant to be felt
        </h2>

        <button
          ref={playRef}
          type="button"
          onClick={() => onChoose(true)}
          // The accessible name opens with the visible label verbatim, then adds
          // what the card's headline supplies visually. WCAG 2.5.3 requires the
          // visible text to be contained in the accessible name — an aria-label
          // of just "Play with sound" over a button reading "I want to feel it"
          // would break voice control, which matches on what is on screen.
          aria-label="OK, I want to feel it — play with sound"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#1a1a1a] px-4 py-2.5 text-[0.72rem] uppercase tracking-[0.14em] text-[#efe7d6] transition-colors duration-200 hover:bg-[#b3403a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b3403a] motion-reduce:transition-none"
        >
          OK, I want to feel it
        </button>

        <button
          type="button"
          onClick={() => onChoose(false)}
          className="mt-3 text-[0.66rem] uppercase tracking-[0.14em] text-[#6b5f4a] underline decoration-[#6b5f4a]/40 decoration-1 underline-offset-4 transition-colors duration-200 hover:text-[#1a1a1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b3403a] motion-reduce:transition-none"
        >
          Continue silent
        </button>
      </div>
    </div>
  );
}
