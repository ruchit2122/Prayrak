"use client";

import { motion } from "motion/react";

const imgTiharBg = "/images/warrant-tihar-bg.png";
const imgIndiaGate = "/images/warrant-india-gate.png";
const imgPhotoBw = "/images/warrant-photo-bw.png";
const imgPhotoColor = "/images/warrant-photo-color.png";
const imgTitleGraphic = "/images/warrant-title-graphic.png";
const imgDirectorGraphic = "/images/warrant-director-graphic.png";
const imgNetflixLogo = "/images/warrant-netflix-logo.png";

export default function BlackWarrantSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: "1440 / 1024" }}
    >
      <div
        className="absolute left-0 top-0 h-[1024px] w-[1440px] origin-top-left"
        style={{ transform: "scale(calc(100vw / 1440px))" }}
      >
        <motion.div
          className="relative size-full bg-black"
          data-name="black warrant"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Tihar jail backdrop, left/center */}
          <div className="absolute left-0 top-0 h-[1024px] w-[900px] overflow-hidden opacity-70">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgTiharBg} />
          </div>

          {/* India Gate line-art panel, right */}
          <div className="absolute left-[880px] top-0 h-[1024px] w-[560px] overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgIndiaGate} />
          </div>

          {/* Netflix logo */}
          <div className="absolute left-[50px] top-[65px] h-[65px] w-[240px]">
            <img alt="Netflix" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain object-left" src={imgNetflixLogo} />
          </div>

          {/* "BLACK WARRANT" title */}
          <div className="absolute left-[35px] top-[140px] h-[230px] w-[600px]">
            <img alt="Black Warrant" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain object-left" src={imgTitleGraphic} />
          </div>

          {/* director credit */}
          <div className="pointer-events-none absolute left-[45px] top-[390px] h-[70px] w-[420px] overflow-hidden">
            <img
              alt="dir. Vikramaditya Motwane"
              className="absolute left-0 top-[-715.94%] w-[255.15%] max-w-none"
              style={{ height: "1979.71%" }}
              src={imgDirectorGraphic}
            />
          </div>

          {/* main color portrait */}
          <div className="absolute left-[860px] top-[80px] h-[960px] w-[600px] overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-top" src={imgPhotoColor} />
          </div>

          {/* young Prayrak b/w photo, bottom-left */}
          <div className="absolute left-[-20px] top-[680px] h-[344px] w-[430px] overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgPhotoBw} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
