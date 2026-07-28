"use client";

import { motion } from "motion/react";

const imgNewsprintTexture = "/images/about-blue-blob.jpg";
const imgPortrait = "/images/about-portrait-top.png";
const imgTitleGraphic = "/images/about-title-graphic.png";
const imgWideStrip = "/images/about-wide-strip.png";
const imgWhale = "/images/about-rotated-sticker.png";
const imgStarburst = "/images/about-doodle-sketch.svg";
const imgGridPaper = "/images/about-small-banner.png";
const imgLogoMask = "/images/about-logo-round.png";
const imgLogoRound = "/images/about-logo-mask.png";
const imgDriedFlower = "/images/about-dried-flower.png";
const imgArrow = "/images/about-arrow-doodle.svg";
const imgArrowLeft = "/images/about-arrow-left.png";

const RING_COUNT = 22;
const EASE = "linear" as const;

// Reproduces the stepped, stop-motion-style easing used in Intro.tsx —
// values hold, then snap to the next stop, rather than a smooth glide.
const STEP4_TIMES = [0, 0.0729, 0.073, 0.1394, 0.1395, 0.2169, 0.217, 0.2174, 0.2175, 1];
const STEP4_FRACS = [0.2481, 0.5865, 0.7308, 1];

const STEP5_TIMES = [0, 0.0724, 0.0725, 0.1479, 0.148, 0.2219, 0.222, 0.2864, 0.2865, 0.3724, 0.3725, 1];
const STEP5_FRACS = [0.2791, 0.4649, 0.7181, 0.8748, 1];

const PORTRAIT_TIMES = [0, 0.0794, 0.0795, 0.1619, 0.162, 0.2199, 0.22, 0.2674, 0.2675, 0.3129, 0.313, 0.3389, 0.339, 1];
const PORTRAIT_FRACS = [0.1605, 0.3684, 0.5, 0.6817, 0.8027, 1];

function stepValues(start: number, end: number, fracs: number[]) {
  const values = [start, start];
  for (const f of fracs) {
    const v = start + (end - start) * f;
    values.push(v, v);
  }
  return values;
}

export default function AboutThisGuy() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#fffce8]"
      style={{ aspectRatio: "1440 / 1024" }}
    >
      <div
        className="absolute left-0 top-0 h-[1024px] w-[1440px] origin-top-left"
        style={{ transform: "scale(calc(100vw / 1440px))" }}
      >
        <div
          className="relative size-full bg-[#fffce8]"
          data-name="about this guy"
        >
          {/* full-bleed aged newsprint texture, under everything */}
          <div className="absolute inset-0 overflow-hidden opacity-80">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgNewsprintTexture} />
          </div>

          {/* pink halftone starburst behind the head */}
          <motion.div
            className="absolute left-[45px] top-[60px] h-[470px] w-[470px] opacity-70"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 2, ease: EASE, times: [0, 0.25, 1] }}
          >
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgStarburst} />
          </motion.div>

          {/* blue whale peeking top-left */}
          <motion.div
            className="absolute left-[-40px] top-[90px] h-[220px] w-[200px] rotate-[-8deg]"
            initial={{ x: -260 }}
            animate={{ x: stepValues(-260, 0, STEP4_FRACS) }}
            transition={{ duration: 2, ease: EASE, times: STEP4_TIMES }}
          >
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgWhale} />
          </motion.div>

          {/* portrait */}
          <motion.div
            className="absolute left-[70px] top-[-205px] h-[1215px] w-[823px] overflow-hidden"
            initial={{ y: 1050 }}
            animate={{ y: stepValues(1050, 0, PORTRAIT_FRACS) }}
            transition={{ duration: 2, ease: EASE, times: PORTRAIT_TIMES }}
          >
            <img
              alt="Prayrak Mehta"
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              style={{ objectPosition: "68% 32%" }}
              src={imgPortrait}
            />
          </motion.div>

          {/* "ABOUT THIS GUY!" title graphic (flattened raster) */}
          <motion.div
            className="pointer-events-none absolute left-[95px] top-[425px] h-[280px] w-[402px] overflow-hidden"
            initial={{ x: -500, y: 240 }}
            animate={{ x: stepValues(-500, 0, STEP5_FRACS), y: stepValues(240, 0, STEP5_FRACS) }}
            transition={{ duration: 2, ease: EASE, times: STEP5_TIMES }}
          >
            <img
              alt="About this guy!"
              className="absolute left-0 top-[-244.4%] w-[221.97%] max-w-none"
              style={{ height: "566.8%" }}
              src={imgTitleGraphic}
            />
          </motion.div>

          {/* curved arrows framing the face, drawn on top of the title lettering */}
          <motion.div
            className="absolute left-[400px] top-[350px] h-[210px] w-[95px] rotate-[-8deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: EASE, delay: 0.45 }}
          >
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgArrow} />
          </motion.div>
          <motion.div
            className="absolute left-[56px] top-[348px] h-[215px] w-[95px] rotate-[8deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: EASE, delay: 0.5 }}
          >
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgArrowLeft} />
          </motion.div>

          {/* spiral notebook binding divider */}
          <motion.div
            className="absolute left-[698px] top-0 h-[1024px] w-[36px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: EASE, delay: 0.25 }}
          >
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#00000022]" />
            {Array.from({ length: RING_COUNT }).map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 size-[26px] -translate-x-1/2 rounded-full border-[3px] border-[#8a8a8a] bg-transparent"
                style={{ top: (1024 / RING_COUNT) * i + 6 }}
              />
            ))}
          </motion.div>

          {/* grid paper torn piece, top */}
          <motion.div
            className="absolute left-[712px] top-[-8px] h-[95px] w-[230px] overflow-hidden rotate-[1deg]"
            initial={{ y: -140 }}
            animate={{ y: stepValues(-140, 0, STEP4_FRACS) }}
            transition={{ duration: 2, ease: EASE, times: STEP4_TIMES }}
          >
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgGridPaper} />
          </motion.div>

          {/* theatre mask logo */}
          <motion.div
            className="absolute left-[1020px] top-[32px] h-[140px] w-[140px]"
            initial={{ y: -180 }}
            animate={{ y: stepValues(-180, 0, STEP4_FRACS) }}
            transition={{ duration: 2, ease: EASE, times: STEP4_TIMES }}
          >
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgLogoMask} />
          </motion.div>

          {/* L'il Masters logo */}
          <motion.div
            className="absolute left-[1200px] top-0 h-[150px] w-[240px] rotate-[-12deg] overflow-hidden"
            initial={{ x: 190, y: -120 }}
            animate={{ x: stepValues(190, 0, STEP5_FRACS), y: stepValues(-120, 0, STEP5_FRACS) }}
            transition={{ duration: 2, ease: EASE, times: STEP5_TIMES }}
          >
            <img alt="" className="pointer-events-none absolute left-0 top-[-60%] h-[284.67%] w-full max-w-none" src={imgLogoRound} />
          </motion.div>

          {/* bio text on a torn paper strip */}
          <motion.div
            className="absolute left-[800px] top-[350px] h-[94px] w-[530px] overflow-hidden"
            initial={{ x: 600 }}
            animate={{ x: stepValues(600, 0, STEP5_FRACS) }}
            transition={{ duration: 2, ease: EASE, times: STEP5_TIMES }}
          >
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgWideStrip} />
          </motion.div>
          <motion.div
            initial={{ x: 600 }}
            animate={{ x: stepValues(600, 0, STEP5_FRACS) }}
            transition={{ duration: 2, ease: EASE, times: STEP5_TIMES }}
          >
            <p className="absolute left-[822px] top-[370px] w-[530px] text-[23px] font-bold leading-[1.5] text-[#222a1f]">
              Prayrak Mehta is an Indian actor, trained dancer, and theatre practitioner.
            </p>
            <p className="absolute left-[822px] top-[478px] w-[510px] text-justify text-[23px] font-bold leading-[1.55] text-[#222a1f]">
              An alumnus of the <span className="text-[#b51515]">National School of Drama</span>&apos;s Theatre in Education
              program, he brings a rare emotional intelligence to the screen shaped by over a decade of contemporary
              dance, years of intensive theatre training, and a black belt in Karate.
            </p>
          </motion.div>

          {/* dried flower, bottom-right (flattened asset — crop into its corner) */}
          <motion.div
            className="pointer-events-none absolute left-[1170px] top-[700px] h-[324px] w-[270px] overflow-hidden"
            initial={{ x: 310, y: 260 }}
            animate={{ x: stepValues(310, 0, STEP5_FRACS), y: stepValues(260, 0, STEP5_FRACS) }}
            transition={{ duration: 2, ease: EASE, times: STEP5_TIMES }}
          >
            <img
              alt=""
              className="absolute left-[-145.06%] top-[-254.57%] w-[237.04%] max-w-none"
              style={{ height: "356.66%" }}
              src={imgDriedFlower}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
