import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Bevan } from "next/font/google";
import SoundProvider from "@/components/SoundProvider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// `preload: false` on both faces below is deliberate. next/font defaults to
// `preload: true`, which injected two `<link rel="preload" as="font">` tags and
// pulled ~53KB of woff2 on every visit, competing with the intro video for
// bandwidth during LCP.
//
// There *is* real text on the page now — the footer, and the soundtrack cards —
// but none of it is in the first viewport, so none of it should be racing the
// intro frame for the connection. The @font-face rules are still emitted, so
// both faces apply as normal; they just download when first needed. If text
// ever lands in the opening screen, flip the face that renders it back to
// `preload: true`.
const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  preload: false,
});

// "The Pixel Editorial" (used for the title in the Figma file) is a licensed
// display font not available via Google Fonts. Bevan is a heavy slab serif
// used here as a close free stand-in — swap in the real font file if you have
// a license for it.
const bevan = Bevan({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

// The share card is `opengraph-image.jpg` beside this file — Next picks it up
// by filename and emits the url, type and dimensions itself, so none of that is
// repeated here. What is left is the text that sits next to it in a preview.
//
// `metadataBase` only affects whether the generated image url is absolute.
// Relative og:image urls are ignored by most scrapers, so without it the card
// silently falls back to a bare link on exactly the surfaces this is for. The
// address itself is in `@/lib/site` — see the warning there, it is a guess.
// The page is `#1d1d1d` edge to edge, so without this a phone frames it in a
// default light bar and the first frame arrives inside a bright box. Set via
// the `viewport` export rather than `metadata.themeColor`, which Next
// deprecated in 14.
export const viewport: Viewport = {
  themeColor: "#1d1d1d",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Prayrak Mehta",
  description: "Actor. Co-founder @ VHS.",
  openGraph: {
    title: "Prayrak Mehta",
    description: "Actor. Co-founder @ VHS.",
    siteName: "Prayrak Mehta",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prayrak Mehta",
    description: "Actor. Co-founder @ VHS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${bevan.variable} h-full antialiased`}
    >
      <body className="bg-[#1d1d1d]">
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
