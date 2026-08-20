import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// There is nothing here to keep out of an index — one page, no accounts, no
// search results. So this exists to do the one thing its absence prevented:
// name the sitemap, which is how a crawler finds the page deliberately rather
// than by following a link to it.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
