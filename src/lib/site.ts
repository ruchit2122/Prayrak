/**
 * The site's own address, confirmed by the owner.
 *
 * Three things resolve against it, and all three fail quietly rather than
 * loudly if it is ever wrong: `og:image` becomes a url that does not exist, so
 * shared links render as bare links with no card; `robots.txt` points crawlers
 * at a sitemap on the wrong host; and every url in the sitemap is wrong.
 *
 * It lives here rather than inline in `layout.tsx` so there is one place to
 * change if the domain ever moves, instead of three to keep in step.
 */
export const SITE_URL = "https://prayrakmehta.com";
