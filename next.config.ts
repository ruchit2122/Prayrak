import type { NextConfig } from "next";

// The frames are the page: ~9MB of clips and posters against a few hundred KB
// of everything else. A repeat visitor should never fetch them twice, so they
// get the longest cache there is.
//
// `immutable` is the strong claim, and it is only honest because these URLs are
// content-hashed — `scripts/hash-media.mjs` puts a hash of each file's bytes in
// its name, so a given URL genuinely can never change. That is what makes a
// year safe, and it is what the old 30-day rule could not say: those URLs were
// stable names over changeable content, which is why replacing a cut left every
// returning browser playing the previous one for a month.
//
// `immutable` also spares the browser the revalidation request it would
// otherwise make once the max-age lapses.
const FRAME_CACHE_CONTROL = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        // Everything under here is generated and hashed. Nothing else in
        // `public/` gets this treatment: the rail thumbnails, the footer paper
        // and the audio are all served under their own names, so they keep the
        // default revalidate-every-time behaviour and update on a reload.
        source: "/frames/:path*",
        headers: [{ key: "Cache-Control", value: FRAME_CACHE_CONTROL }],
      },
    ];
  },
};

export default nextConfig;
