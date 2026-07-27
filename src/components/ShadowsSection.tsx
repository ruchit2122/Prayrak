"use client";

import { motion } from "motion/react";

const imgCloth = "/images/shadows-cloth.png";
const imgCheckPattern = "/images/shadows-check-pattern.png";
const imgPoster = "/images/shadows-poster.png";
const imgTitleGraphic = "/images/shadows-title-graphic.png";
const imgPosterMask = "/images/shadows-poster-mask.svg";

export default function ShadowsSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#e9e9e9]"
      style={{ aspectRatio: "1440 / 1024" }}
    >
      <div
        className="absolute left-0 top-0 h-[1024px] w-[1440px] origin-top-left"
        style={{ transform: "scale(calc(100vw / 1440px))" }}
      >
        <motion.div
          className="relative size-full bg-[#e9e9e9]"
          data-name="shadows of moonless nights"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* cloth backdrop */}
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgCloth} />
          </div>

          {/* gingham check strip along the top */}
          <div className="absolute left-0 top-0 h-[60px] w-[1440px] overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgCheckPattern} />
          </div>

          {/* title text + Cannes selection envelope graphic */}
          <div className="pointer-events-none absolute left-0 top-[50px] h-[960px] w-[640px] overflow-hidden">
            <img
              alt="Shadows of the Moonless Nights — India's only official selection at Cannes Film Festival, 2026."
              className="absolute inset-0 size-full max-w-none object-cover object-top"
              src={imgTitleGraphic}
            />
          </div>

          {/* film poster */}
          <div className="absolute left-[790px] top-[120px] h-[820px] w-[610px] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                maskImage: `url("${imgPosterMask}")`,
                maskSize: "100% 100%",
                maskRepeat: "no-repeat",
              }}
            >
              <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgPoster} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
