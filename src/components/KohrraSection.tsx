"use client";

import { motion } from "motion/react";

const imgBg = "/images/kohrra-bg.png";
const imgIcons = "/images/kohrra-icons.png";
const imgTitleGraphic = "/images/kohrra-title-graphic.png";
const imgPhoto = "/images/kohrra-photo.png";

export default function KohrraSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#1e1514]"
      style={{ aspectRatio: "1440 / 1024" }}
    >
      <div
        className="absolute left-0 top-0 h-[1024px] w-[1440px] origin-top-left"
        style={{ transform: "scale(calc(100vw / 1440px))" }}
      >
        <motion.div
          className="relative size-full bg-[#1e1514]"
          data-name="kohrra"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgBg} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgIcons} />
          </div>

          {/* portrait, bleeding off the left edge */}
          <div className="absolute left-[-120px] top-0 h-[1024px] w-[760px] overflow-hidden">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              style={{ objectPosition: "60% 30%" }}
              src={imgPhoto}
            />
          </div>

          {/* NETFLIX / KOHRRA / SEASON 2 / dir. credit */}
          <div className="pointer-events-none absolute left-[640px] top-[280px] h-[460px] w-[830px] overflow-hidden">
            <img
              alt="Netflix — Kohrra Season 2, dir. Sudip Sharma"
              className="absolute left-[-6.95%] top-[-38.24%] w-[113.61%] max-w-none"
              style={{ height: "365.24%" }}
              src={imgTitleGraphic}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
