"use client";

import { motion } from "motion/react";

const imgBg = "/images/work-newsprint-large.png";
const imgTitleBacker = "/images/work-title-backer.png";
const imgTitleGraphic = "/images/work-title-graphic.png";
const imgPin = "/images/work-pin.png";
const imgClipImage2 = "/images/work-clip-image2.svg";
const imgPhotoLeft1 = "/images/work-photo-left1.png";
const imgPhotoLeft2 = "/images/work-photo-left2.png";
const imgPhotoRight1 = "/images/work-photo-right1.png";
const imgPhotoRight2 = "/images/work-photo-right2.png";
const imgShell = "/images/work-shell.png";
const imgTornStrip = "/images/work-torn-strip.png";

export default function WorkSection() {
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
          data-name="work"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* background newsprint texture */}
          <div className="absolute left-0 top-0 h-[420px] w-[1440px] overflow-hidden opacity-90">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-top" src={imgBg} />
          </div>
          <div className="absolute left-0 top-[340px] h-[684px] w-[1440px] overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgTornStrip} />
          </div>

          {/* gun/camera clip photo, top-right */}
          <div className="absolute left-[1020px] top-[18px] h-[320px] w-[245px] overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgClipImage2} />
          </div>

          {/* "WORK" title on its torn paper backer */}
          <div className="absolute left-[210px] top-[100px] h-[240px] w-[480px] overflow-hidden rotate-[-2deg]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgTitleBacker} />
            {/* work-title-graphic.png is a flattened 768x1366 canvas — crop into the text region */}
            <img
              alt="Work"
              className="pointer-events-none absolute left-[-19.3%] top-[-46.7%] w-[175.4%] max-w-none"
              style={{ height: "666.7%" }}
              src={imgTitleGraphic}
            />
          </div>

          {/* pushpin */}
          <div className="absolute left-[655px] top-[60px] h-[150px] w-[135px] rotate-[18deg]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgPin} />
          </div>

          {/* photo row */}
          <div className="absolute left-[-60px] top-[190px] h-[520px] w-[480px] overflow-hidden">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              style={{ objectPosition: "48% 48%" }}
              src={imgPhotoLeft1}
            />
          </div>
          <div className="absolute left-[280px] top-[390px] h-[290px] w-[230px] overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgPhotoLeft2} />
          </div>
          <div className="absolute left-[430px] top-[430px] h-[260px] w-[320px] overflow-hidden">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              style={{ objectPosition: "45% 40%" }}
              src={imgPhotoRight2}
            />
          </div>
          <div className="absolute left-[660px] top-[210px] h-[440px] w-[300px] overflow-hidden">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-top" src={imgPhotoRight1} />
          </div>

          {/* seashell */}
          <div className="absolute left-[95px] top-[500px] h-[90px] w-[220px]">
            <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-contain" src={imgShell} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
