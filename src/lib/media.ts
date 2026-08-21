import { MEDIA } from "@/lib/media-manifest";

/**
 * The published URL for a frame, given the readable path it is stored under.
 *
 * Frames live in `media/` under names a person chose — `/desktop-sections/holy
 * curse-D.mp4` — and are served from `public/frames/` under names a cache can
 * trust, with a hash of the file's own contents in them. This is the join
 * between the two, so components go on naming frames the readable way and the
 * hashing stays invisible to them.
 *
 * Paths arrive percent-encoded, because that is what they have to be in an
 * attribute: `holy%20curse-D.mp4`. The manifest is keyed by the real filename,
 * spaces and all, so the encoding comes off first.
 *
 * An unknown path is returned unchanged rather than thrown on. A missing hash
 * costs cache-busting; a throw during render costs the whole page, and the
 * manifest can legitimately be a build behind while a new frame is being added.
 */
export function mediaSrc(path: string): string {
  return MEDIA[decodeURIComponent(path)] ?? path;
}
