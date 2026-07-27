import type { Metadata } from "next";
import { Bricolage_Grotesque, Bevan } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

// "The Pixel Editorial" (used for the title in the Figma file) is a licensed
// display font not available via Google Fonts. Bevan is a heavy slab serif
// used here as a close free stand-in — swap in the real font file if you have
// a license for it.
const bevan = Bevan({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prayrak Mehta",
  description: "Actor. Co-founder @ VHS.",
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
      <body className="bg-[#1d1d1d]">{children}</body>
    </html>
  );
}
