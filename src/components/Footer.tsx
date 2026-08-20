// ---------------------------------------------------------------------------
// SET THIS BEFORE DEPLOYING.
//
// This is a guess derived from the email in the contact video
// (prayrakmehta@gmail.com) — it has NOT been verified. A wrong value here
// sends visitors to a stranger's profile, so confirm the real handle and
// update this one line. Everything else in this footer is taken from the
// contact video itself and is accurate.
const INSTAGRAM_HANDLE = "prayrakmehta";

// Both read off the notepad in the final frame of the contact section, so the
// footer and the video can never disagree.
const EMAIL = "prayrakmehta@gmail.com";
const PHONE_DISPLAY = "+91 99535 91413";
const PHONE_DIAL = "+919953591413";

// Studio credit in the bottom bar.
const STUDIO_NAME = "Logam Digital";
const STUDIO_DOMAIN = "logamdigital.com";

// VHS — the production house Prayrak co-founded. `vhs.mumbai` is an Instagram
// handle, not a domain (there is no `.mumbai` TLD), so it resolves through
// instagram.com like the handle above.
const VHS_HANDLE = "vhs.mumbai";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[1.15em] w-[1.15em] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[1.15em] w-[1.15em] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3.5 7 12 13 20.5 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[1.15em] w-[1.15em] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
    </svg>
  );
}

// Where the drawn ticket actually sits inside its box, measured off
// public/footer/ticket.webp rather than guessed. The artwork is 358x179, but the
// paper only occupies x 12..343 and y 16..155 of that — the rest is the heavy
// drop shadow it is drawn with, plus a little transparent margin.
//
// This is the whole reason the labels used to sit low and the icons drifted
// into the left scallop: laying content out against the element's box centres
// it on the shadow, not on the ticket. Content is positioned to these numbers
// instead. The background image still fills the full box, untouched, so the
// notches and scalloped edges keep the weight the designer drew.
const PAPER_TOP = "8.9%"; // 16/179
const PAPER_BOTTOM = "13.4%"; // 1 - 155/179

// The stub rule is drawn at x 99..108, i.e. 27.7%..30.2% of the width, and the
// semicircular notches bite the edges in to 9.2% and 90.2% at the exact height
// the content sits at. So the icon lives between 9.2% and 27.7%, and the text
// between 30.2% and 90.2% — anything wider runs under a notch.
const STUB_WIDTH = "27.7%";
const STUB_INSET = "9.2%"; // clears the left notch
const BODY_INSET = "7%"; // clears the rule at 30.2%, plus a gutter
const BODY_TAIL = "10%"; // the right notch bites to 90% at the value's height

type ChitProps = {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  tapeClass: string;
  /** Resting angle, e.g. "-1.2deg". Read by the weave keyframes as --chit-tilt. */
  tilt: string;
  /** Negative offset into the loop, so the three tickets never move together. */
  delay: string;
};

// Each contact detail is a ticket stub taped to the page, echoing the VHS and
// screening motifs in the videos above.
function Chit({ href, label, value, icon, tapeClass, tilt, delay }: ChitProps) {
  return (
    // The ticket's own 358:179 lives here rather than on the link, so the
    // artwork's proportions are fixed by the artwork and the text inside can
    // never stretch them.
    //
    // The resting tilt is handed to CSS as a variable rather than set as an
    // inline transform: the weave keyframes animate `transform`, and a CSS
    // animation outranks an inline style, so an inline rotate would simply be
    // discarded the moment the animation ran. As a variable the keyframes can
    // compose the tilt into every pose instead.
    <li
      className="chit-weave relative aspect-[358/179] w-full max-w-[22rem] sm:max-w-none"
      style={
        { "--chit-tilt": tilt, "--chit-delay": delay } as React.CSSProperties
      }
    >
      {/* Tape strip, over the top-left corner at an angle. Not centred: the
          ticket is drawn with a notch at the middle of its top edge, and a
          centred strip covered the one detail that makes it read as a ticket.
          Across a corner it also looks stuck down rather than laid on.
          Positioned in percent off the paper's own corner (3.4%, 8.9%) rather
          than the box corner — in pixels off the box it floated clear of the
          ticket entirely at desktop widths, stuck to nothing.
          Purely decorative, so it is hidden from assistive tech and never
          intercepts the link's clicks. */}
      <span
        aria-hidden="true"
        className={`tape absolute -left-[3%] top-[1%] z-10 h-5 w-16 -rotate-[28deg] opacity-70 mix-blend-multiply ${tapeClass}`}
      />
      <a
        href={href}
        target="_blank"
        // noopener denies the opened page access to window.opener (reverse
        // tabnabbing); noreferrer additionally withholds the referrer. Required
        // on any target="_blank" pointing somewhere we do not control.
        rel="noopener noreferrer"
        // Laid out to the artwork rather than over it: the ticket is drawn with
        // a stub rule, the way a real torn ticket has one, so the icon takes the
        // stub and the details take the body. Centring a single text block
        // instead put every label straight on top of that rule.
        //
        // Stays at `inset-0`: the ticket image is stretched to exactly 100%
        // 100% of this element, so shrinking it to the paper would squash the
        // artwork. The paper rect is applied to the content wrapper inside.
        className="paper-chit group absolute inset-0 block text-[#1a1a1a] transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b3403a] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        {/* Everything readable lives in here, inset to the drawn paper. Because
            this box is the paper, `items-stretch` plus each child centring its
            own contents lands them on the paper's middle rather than the box's,
            which is what the shadow was pulling them off. */}
        <span
          className="absolute inset-x-0 flex items-stretch"
          style={{ top: PAPER_TOP, bottom: PAPER_BOTTOM }}
        >
          {/* The stub. Icon only — it is the part a ticket gets torn off at, so
              it carries the mark and nothing that has to be read. The left
              padding is what keeps the mark clear of the notch; without it the
              icon centres on the full stub and sits in the scallop. */}
          <span
            aria-hidden="true"
            className="flex shrink-0 items-center justify-center text-[1.35rem] text-[#6b5f4a]"
            style={{ width: STUB_WIDTH, paddingLeft: STUB_INSET }}
          >
            {icon}
          </span>
          {/* The body. Left-aligned, because ragged-right is steadier to read
              than centred text that changes width on every ticket. */}
          <span
            className="flex min-w-0 flex-1 flex-col justify-center gap-1"
            style={{ paddingLeft: BODY_INSET, paddingRight: BODY_TAIL }}
          >
            <span className="text-[0.58rem] uppercase tracking-[0.16em] text-[#6b5f4a]">
              {label}
            </span>
            {/* The ticket is a fixed shape, so the value fits it rather than the
                other way round: `break-all` keeps the long email inside the
                scalloped edge instead of running over the artwork, and `min-w-0`
                on the parent is what lets it wrap at all inside a flex row. */}
            <span className="break-all text-[0.74rem] leading-tight underline decoration-[#1a1a1a]/30 decoration-1 underline-offset-4 transition-colors group-hover:decoration-[#b3403a]">
              {value}
            </span>
          </span>
        </span>
        {/* A link that retargets the window has to say so, or screen reader and
            switch users get moved somewhere new with no warning. */}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="paper-footer relative w-full overflow-hidden text-[#1a1a1a]">
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-14 pt-20 sm:px-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-[#b3403a] sm:text-3xl">
          For work and otherwise
        </h2>
        <p className="mt-2 max-w-md text-sm text-[#6b5f4a]">
          Reach out any time — reply guaranteed, punctuality not.
        </p>

        {/* `items-start` matters: each ticket sets its own height from the art's
            proportions, and a stretch alignment would pull the shorter ones
            taller and bend the notches. On phones the tickets are capped and
            centred so a single stub does not span the whole screen and turn
            the artwork into a letterbox. */}
        <ul className="mt-10 grid items-start justify-items-center gap-9 sm:grid-cols-3 sm:gap-5">
          <Chit
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            label="Instagram"
            value={`@${INSTAGRAM_HANDLE}`}
            icon={<InstagramIcon />}
            tapeClass="bg-[#4a6fd4]"
            tilt="-1.2deg"
            delay="-0.4s"
          />
          <Chit
            href={`mailto:${EMAIL}`}
            label="Email"
            value={EMAIL}
            icon={<MailIcon />}
            tapeClass="bg-[#9b6fc4]"
            tilt="0.7deg"
            delay="-0.75s"
          />
          <Chit
            href={`tel:${PHONE_DIAL}`}
            label="Team Prayrak"
            value={PHONE_DISPLAY}
            icon={<PhoneIcon />}
            tapeClass="bg-[#d4a24a]"
            tilt="-0.5deg"
            delay="-1.15s"
          />
        </ul>

        <div className="mt-14 flex flex-col gap-1 border-t border-[#1a1a1a]/15 pt-5 text-[0.7rem] uppercase tracking-[0.18em] text-[#6b5f4a] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-[family-name:var(--font-display)] text-sm normal-case tracking-normal text-[#1a1a1a]">
            Prayrak Mehta
          </span>
          <span>
            Actor · Co-founder @{" "}
            <a
              href={`https://instagram.com/${VHS_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a1a1a] underline decoration-[#1a1a1a]/25 decoration-1 underline-offset-4 transition-colors hover:text-[#b3403a] hover:decoration-[#b3403a] focus-visible:text-[#b3403a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b3403a] motion-reduce:transition-none"
            >
              VHS
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </span>
        </div>

        <p className="mt-4 text-center text-[0.7rem] uppercase tracking-[0.18em] text-[#6b5f4a]">
          Powered by{" "}
          <a
            href={`https://${STUDIO_DOMAIN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a1a1a] underline decoration-[#1a1a1a]/25 decoration-1 underline-offset-4 transition-colors hover:text-[#b3403a] hover:decoration-[#b3403a] focus-visible:text-[#b3403a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b3403a] motion-reduce:transition-none"
          >
            {STUDIO_NAME}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
