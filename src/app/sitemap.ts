import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// One page, so one entry. Worth having anyway: it is what `robots.txt` points
// at, and it gives the single url a `lastModified` a crawler can act on instead
// of re-fetching blind.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
