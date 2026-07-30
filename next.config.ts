import type { NextConfig } from "next";

// Next serves everything in /public with `Cache-Control: public, max-age=0`,
// so without this every repeat visitor re-validates all 24 clips before a
// single frame plays. These filenames are stable and content never changes
// under the same name — to publish a new cut, rename the file.
const VIDEO_CACHE_CONTROL = "public, max-age=2592000, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/desktop-sections/:file*",
        headers: [{ key: "Cache-Control", value: VIDEO_CACHE_CONTROL }],
      },
      {
        source: "/mobile-sections/:file*",
        headers: [{ key: "Cache-Control", value: VIDEO_CACHE_CONTROL }],
      },
    ];
  },
};

export default nextConfig;
