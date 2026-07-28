"use client";

import { motion } from "motion/react";

const imgCloth = "/images/shadows-cloth.png";
const imgCheckPattern = "/images/shadows-check-pattern.png";
const imgPoster = "/images/shadows-poster.png";
const imgTitleGraphic = "/images/shadows-title-graphic.png";
const imgPosterMask = "/images/shadows-poster-mask.svg";

const EASE = "linear" as const;

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
        <div className="relative size-full bg-[#e9e9e9]" data-name="shadows of moonless nights">
          {/* cloth backdrop — fades in first, sets the scene */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgCloth} />
          </motion.div>

          {/* gingham check strip — slides in from the left */}
          <motion.div
            className="absolute left-0 top-0 h-[60px] w-[1440px] overflow-hidden"
            initial={{ x: -1440 }}
            animate={{
              x: [-1440, -1440, -1030, -1030, -569, -569, -370, -370, 0, 0],
            }}
            transition={{
              duration: 2,
              ease: EASE,
              times: [0, 0.0729, 0.073, 0.1394, 0.1395, 0.2169, 0.217, 0.2174, 0.2175, 1],
            }}
          >
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgCheckPattern} />
          </motion.div>

          {/* title text + Cannes selection envelope graphic — slides in from the top-left */}
          <motion.div
            className="pointer-events-none absolute left-0 top-[50px] h-[960px] w-[640px] overflow-hidden"
            initial={{ x: -640, y: -300 }}
            animate={{
              x: [-640, -640, -393, -393, -267, -267, -164, -164, -111, -111, 0, 0],
              y: [-300, -300, -232, -232, -164, -164, -128, -128, -44, -44, 0, 0],
            }}
            transition={{
              duration: 2,
              ease: EASE,
              times: [0, 0.0809, 0.081, 0.1584, 0.1585, 0.2354, 0.2355, 0.2939, 0.294, 0.2959, 0.296, 1],
            }}
          >
            <img
              alt="Shadows of the Moonless Nights — India's only official selection at Cannes Film Festival, 2026."
              className="absolute inset-0 size-full max-w-none object-cover object-top"
              src={imgTitleGraphic}
            />
          </motion.div>

          {/* film poster — slides in from the right */}
          <motion.div
            className="absolute left-[790px] top-[120px] h-[820px] w-[610px] overflow-hidden"
            initial={{ x: 850, y: -20 }}
            animate={{
              x: [850, 850, 612, 612, 454, 454, 239, 239, 106, 106, 0, 0],
              y: [-20, -20, 0, 0, -4, -4, 0, 0],
            }}
            transition={{
              x: { duration: 2, ease: EASE, times: [0, 0.0724, 0.0725, 0.1479, 0.148, 0.2219, 0.222, 0.2864, 0.2865, 0.3724, 0.3725, 1] },
              y: { duration: 2, ease: EASE, times: [0, 0.0724, 0.0725, 0.1479, 0.148, 0.2219, 0.222, 1] },
            }}
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
