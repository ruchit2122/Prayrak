"use client";

import { motion } from "motion/react";

const imgBg = "/images/holy-bg.png";
const imgTextureOverlay = "/images/holy-texture-overlay.png";
const imgFamilyPhoto = "/images/holy-family-photo.png";
const imgGrungeScribble = "/images/holy-grunge-scribble.png";
const imgPoster = "/images/holy-poster.png";
const imgPosterMask = "/images/holy-poster-mask.svg";
const imgPrayrakPortrait = "/images/holy-prayrak-portrait.png";
const imgPin = "/images/holy-pin.png";

export default function HolyCurseSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#712420]"
      style={{ aspectRatio: "1440 / 1024" }}
    >
      <div
        className="absolute left-0 top-0 h-[1024px] w-[1440px] origin-top-left"
        style={{ transform: "scale(calc(100vw / 1440px))" }}
      >
        <motion.div
          className="relative size-full bg-[#712420]"
          data-name="holy curse"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* background texture */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.15]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgBg} />
          </div>
          <div className="absolute inset-0 overflow-hidden opacity-[0.08]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgTextureOverlay} />
          </div>

          {/* scribble texture behind family photo */}
          <div className="absolute left-[-60px] top-[-40px] h-[280px] w-[300px] opacity-90">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgGrungeScribble} />
          </div>

          {/* family cast photo */}
          <div className="absolute left-[20px] top-[30px] h-[110px] w-[430px] overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgFamilyPhoto} />
          </div>

          {/* "Holy Curse" poster */}
          <div className="absolute left-[20px] top-[150px] h-[590px] w-[420px] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{ maskImage: `url("${imgPosterMask}")`, maskSize: "100% 100%", maskRepeat: "no-repeat" }}
            >
              <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgPoster} />
            </div>
          </div>

          {/* Prayrak halftone portrait */}
          <div className="pointer-events-none absolute left-[830px] top-[-30px] h-[720px] w-[650px] overflow-hidden">
            <img alt="" className="absolute inset-0 size-full max-w-none object-cover object-left-top" src={imgPrayrakPortrait} />
          </div>

          {/* OSCARS long-list badge */}
          <div className="pointer-events-none absolute left-[660px] top-[370px] h-[660px] w-[660px] overflow-hidden">
            <img
              alt="Oscars Live Action Short Film long list 2025 — Holy Curse, directed by Snigdha Kapoor"
              className="absolute inset-0 size-full max-w-none object-contain"
              src={imgPin}
              style={{ objectPosition: "center bottom" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
