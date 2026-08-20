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

type ChitProps = {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  tapeClass: string;
  rotate: string;
};

// Each contact detail is a torn note taped to the page, echoing the notepad
// and masking-tape motifs in the videos above.
function Chit({ href, label, value, icon, tapeClass, rotate }: ChitProps) {
  return (
    <li className="relative" style={{ transform: rotate }}>
      {/* Tape strip. Purely decorative, so it is hidden from assistive tech
          and never intercepts the link's clicks. */}
      <span
        aria-hidden="true"
        className={`tape absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-2 opacity-70 mix-blend-multiply ${tapeClass}`}
      />
      <a
        href={href}
        target="_blank"
        // noopener denies the opened page access to window.opener (reverse
        // tabnabbing); noreferrer additionally withholds the referrer. Required
        // on any target="_blank" pointing somewhere we do not control.
        rel="noopener noreferrer"
        className="paper-chit group flex h-full flex-col gap-2 px-5 py-5 text-[#1a1a1a] transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b3403a] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-[#6b5f4a]">
          {icon}
          {label}
        </span>
        <span className="break-words text-[0.95rem] leading-snug underline decoration-[#1a1a1a]/25 decoration-1 underline-offset-4 transition-colors group-hover:decoration-[#b3403a] sm:text-base">
          {value}
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

        <ul className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-5">
          <Chit
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            label="Instagram"
            value={`@${INSTAGRAM_HANDLE}`}
            icon={<InstagramIcon />}
            tapeClass="bg-[#4a6fd4]"
            rotate="rotate(-1.2deg)"
          />
          <Chit
            href={`mailto:${EMAIL}`}
            label="Email"
            value={EMAIL}
            icon={<MailIcon />}
            tapeClass="bg-[#9b6fc4]"
            rotate="rotate(0.7deg)"
          />
          <Chit
            href={`tel:${PHONE_DIAL}`}
            label="Team Prayrak"
            value={PHONE_DISPLAY}
            icon={<PhoneIcon />}
            tapeClass="bg-[#d4a24a]"
            rotate="rotate(-0.5deg)"
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
