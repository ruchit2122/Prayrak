"use client";

import { motion } from "motion/react";

const imgNewsprintBg = "/images/about-newsprint-bg.png";
const imgPortrait = "/images/about-portrait-top.png";
const imgTitleGraphic = "/images/about-title-graphic.png";
const imgWhale = "/images/about-rotated-sticker.png";
const imgGridPaper = "/images/about-small-banner.png";
const imgLogoMask = "/images/about-logo-mask.png";
const imgLogoRound = "/images/about-logo-round.png";
const imgDriedFlower = "/images/about-dried-flower.png";
const imgArrow = "/images/about-arrow-doodle.svg";

const RING_COUNT = 22;

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
        <motion.div
          className="relative size-full bg-[#fffce8]"
          data-name="about this guy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* newsprint texture, right two-thirds */}
          <div className="absolute left-[600px] top-0 h-[1024px] w-[840px] overflow-clip opacity-90">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgNewsprintBg} />
          </div>

          {/* blue whale peeking top-left */}
          <div className="absolute left-[-40px] top-[60px] h-[260px] w-[210px] rotate-[-8deg]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgWhale} />
          </div>

          {/* portrait */}
          <div className="absolute left-[-40px] top-[20px] h-[1004px] w-[680px] overflow-hidden">
            <img
              alt="Prayrak Mehta"
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              style={{ objectPosition: "68% 32%" }}
              src={imgPortrait}
            />
          </div>

          {/* curved arrows framing the face */}
          <div className="absolute left-[358px] top-[400px] h-[190px] w-[95px] rotate-[-8deg]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgArrow} />
          </div>
          <div className="absolute left-[452px] top-[400px] h-[190px] w-[95px] rotate-[8deg] scale-x-[-1]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgArrow} />
          </div>

          {/* "ABOUT THIS GUY!" title graphic (flattened raster) */}
          <div className="pointer-events-none absolute left-[30px] top-[555px] h-[280px] w-[402px] overflow-hidden">
            <img
              alt="About this guy!"
              className="absolute left-0 top-[-244.4%] w-[221.97%] max-w-none"
              style={{ height: "566.8%" }}
              src={imgTitleGraphic}
            />
          </div>

          {/* spiral notebook binding divider */}
          <div className="absolute left-[698px] top-0 h-[1024px] w-[36px]">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#00000022]" />
            {Array.from({ length: RING_COUNT }).map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 size-[26px] -translate-x-1/2 rounded-full border-[3px] border-[#8a8a8a] bg-transparent"
                style={{ top: (1024 / RING_COUNT) * i + 6 }}
              />
            ))}
          </div>

          {/* grid paper torn piece, top */}
          <div className="absolute left-[712px] top-[-8px] h-[95px] w-[230px] overflow-hidden rotate-[1deg]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgGridPaper} />
          </div>

          {/* theatre mask logo */}
          <div className="absolute left-[1000px] top-[18px] h-[150px] w-[150px]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgLogoMask} />
          </div>

          {/* L'il Masters logo */}
          <div className="absolute left-[1280px] top-[-25px] h-[150px] w-[150px] rotate-[-12deg]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgLogoRound} />
          </div>

          {/* bio text */}
          <div className="absolute left-[790px] top-[378px] w-[610px]">
            <p className="mb-4 inline bg-[#e4d9ab] px-1 text-[26px] font-bold leading-[1.4] text-[#222a1f] box-decoration-clone">
              Prayrak Mehta is an Indian actor, trained dancer, and theatre practitioner.
            </p>
            <p className="mt-4 text-[26px] font-bold leading-[1.4] text-[#222a1f]">
              An alumnus of the <span className="text-[#b51515]">National School of Drama</span>&apos;s Theatre in Education
              program, he brings a rare emotional intelligence to the screen shaped by over a decade of contemporary
              dance, years of intensive theatre training, and a black belt in Karate.
            </p>
          </div>

          {/* dried flower, bottom-right (flattened asset — crop into its corner) */}
          <div className="pointer-events-none absolute left-[1170px] top-[700px] h-[324px] w-[270px] overflow-hidden">
            <img
              alt=""
              className="absolute left-[-145.06%] top-[-254.57%] w-[237.04%] max-w-none"
              style={{ height: "356.66%" }}
              src={imgDriedFlower}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
