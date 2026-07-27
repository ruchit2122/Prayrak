"use client";

import { motion } from "motion/react";

const imgBackground = "/images/bg-noise.png";
const imgLetterITopLeft = "/images/letter-i-topleft.png";
const imgHalftonePortrait = "/images/halftone-portrait.png";
const imgPortraitPhoto = "/images/portrait-photo.png";
const imgPaperBehindTitle = "/images/paper-behind-title.png";
const imgTopLeftCollage = "/images/top-left-collage.png";
const imgCassette = "/images/cassette.png";
const imgLetterIBadge = "/images/letter-i-badge.png";
const imgMaskEarth = "/images/mask-earth.svg";
const imgTornPaperStrip = "/images/torn-paper-strip.svg";
const imgMaskPortrait = "/images/mask-portrait.svg";

const EASE = "linear" as const;

export default function Intro() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#1d1d1d]"
      style={{ aspectRatio: "1440 / 1024" }}
    >
      {/*
        The design is authored at a fixed 1440x1024 canvas. Rather than hand
        converting every absolute px value to a responsive unit (and risking
        subtly breaking the collage composition), the whole canvas is scaled
        down uniformly to fit the section's width.
      */}
      <div
        className="absolute left-0 top-0 h-[1024px] w-[1440px] origin-top-left"
        style={{ transform: "scale(calc(100vw / 1440px))" }}
      >
        <div className="relative size-full bg-[#1d1d1d]" data-name="intro">
          <div
            className="absolute left-0 top-0 h-[1024px] w-[1440px] overflow-clip opacity-[0.18]"
            data-name="background"
          >
            <div className="absolute left-[-48.48px] top-0 h-[1024px] w-[1536.961px]">
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                src={imgBackground}
              />
            </div>
          </div>

          {/* "I" photo + halftone earth — slides in from the right */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: 1351.144, y: -15.69 }}
            animate={{
              x: [1351.144, 1351.144, 974.144, 974.144, 723.144, 723.144, 381.144, 381.144, 169.144, 169.144, 0, 0],
              y: [-15.69, -15.69, 0.31, 0.31, -5.69, -5.69, 0, 0],
            }}
            transition={{
              x: { duration: 2, ease: EASE, times: [0, 0.0724, 0.0725, 0.1479, 0.148, 0.2219, 0.222, 0.2864, 0.2865, 0.3724, 0.3725, 1] },
              y: { duration: 2, ease: EASE, times: [0, 0.0724, 0.0725, 0.1479, 0.148, 0.2219, 0.222, 1] },
            }}
          >
            <div
              className="absolute left-[88.86px] top-[-114.31px] h-[648px] w-[658.704px] overflow-clip"
              data-name="I"
            >
              <div className="absolute left-0 top-0 h-[648px] w-[658.704px]">
                <img
                  alt=""
                  className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                  src={imgLetterITopLeft}
                />
              </div>
            </div>
            <div
              className="absolute left-[590px] top-0 h-[1024px] w-[850px] overflow-clip"
              data-name="earth"
            >
              <div
                className="absolute left-[-49.78px] top-0 size-[1194.338px] overflow-clip"
                style={{
                  maskImage: `url("${imgMaskEarth}")`,
                  maskPosition: "49.983px 0px",
                  maskSize: "1094.371px 1194.338px",
                  maskRepeat: "no-repeat",
                }}
              >
                <div className="absolute inset-[0_0.34px_0.34px_0]">
                  <img
                    alt=""
                    className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                    src={imgHalftonePortrait}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* torn paper strip running along the lower half */}
          <div className="absolute left-[-160.91px] top-[211.94px] h-[645.75px] w-[1600.651px]">
            <div className="absolute inset-[-0.23%_0_0_0]">
              <img
                alt=""
                className="block size-full max-w-none"
                src={imgTornPaperStrip}
              />
            </div>
          </div>

          {/* Prayrak's portrait — slides up from below */}
          <motion.div
            className="absolute left-[815px] top-[190px] h-[834px] w-[645px] overflow-clip"
            data-name="prayrak"
            initial={{ y: 1034 }}
            animate={{ y: [1034, 1034, 868, 868, 653, 653, 517, 517, 329, 329, 204, 204, 0, 0] }}
            transition={{
              duration: 2,
              ease: EASE,
              times: [0, 0.0794, 0.0795, 0.1619, 0.162, 0.2199, 0.22, 0.2674, 0.2675, 0.3129, 0.313, 0.3389, 0.339, 1],
            }}
          >
            <div
              className="absolute left-[-537.45px] top-[-313.88px] h-[1147.877px] w-[1719.667px] overflow-clip"
              style={{
                maskImage: `url("${imgMaskPortrait}")`,
                maskPosition: "537.481px 0px",
                maskSize: "644.704px 1147.877px",
                maskRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-[0_-0.33px_-0.12px_0]">
                <img
                  alt=""
                  className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                  src={imgPortraitPhoto}
                />
              </div>
            </div>
          </motion.div>

          {/* torn paper card sitting behind the title — slides in from bottom-left */}
          <motion.div
            className="absolute left-0 top-[150.15px] h-[841.238px] w-[796.286px] overflow-clip"
            data-name="paper behind title"
            initial={{ x: -950, y: 746.854 }}
            animate={{
              x: [-950, -950, -718, -718, -664, -664, -457, -457, -262, -262, -200, -200, 0, 0],
              y: [746.854, 746.854, 499.854, 499.854, 304.854, 304.854, 271.854, 271.854, 220.854, 220.854, 170.854, 170.854, 0, 0],
            }}
            transition={{
              duration: 2,
              ease: EASE,
              times: [0, 0.0759, 0.076, 0.1374, 0.1375, 0.2024, 0.2025, 0.2629, 0.263, 0.3174, 0.3175, 0.3179, 0.318, 1],
            }}
          >
            <div className="absolute left-0 top-0 h-[841.238px] w-[796.286px]">
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                src={imgPaperBehindTitle}
              />
            </div>
          </motion.div>

          {/* top-left collage + cassette tape — slides in from the left */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: -741.61, y: 0 }}
            animate={{
              x: [-741.61, -741.61, -557.61, -557.61, -306.61, -306.61, -199.61, -199.61, 0, 0],
              y: [0, 0, -4, -4, -5, -5, 0, 0],
            }}
            transition={{
              x: { duration: 2, ease: EASE, times: [0, 0.0729, 0.073, 0.1394, 0.1395, 0.2169, 0.217, 0.2174, 0.2175, 1] },
              y: { duration: 2, ease: EASE, times: [0, 0.0729, 0.073, 0.1394, 0.1395, 1] },
            }}
          >
            <div
              className="absolute left-[-99.39px] top-0 h-[543.085px] w-[591.3px] overflow-clip"
              data-name="top left elements"
            >
              <div className="absolute left-0 top-0 h-[648px] w-[591.3px]">
                <img
                  alt=""
                  className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                  src={imgTopLeftCollage}
                />
              </div>
            </div>
            <div
              className="absolute left-[-8px] top-[608px] h-[368px] w-[226px]"
              data-name="cassette 1"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  alt=""
                  className="absolute left-0 top-0 size-full max-w-none"
                  src={imgCassette}
                />
              </div>
            </div>
          </motion.div>

          {/* title + "ACTOR" tape badge — slides in from the top-left */}
          <motion.div
            className="absolute inset-0"
            data-name="prayrak mehta title"
            initial={{ x: -1172.625, y: -1229.665 }}
            animate={{
              x: [-1172.625, -1172.625, -721.682, -721.682, -489.682, -489.682, -301.716, -301.716, -204.534, -204.534, 0, 0],
              y: [-1229.665, -1229.665, -955, -955, -672, -672, -526.511, -526.511, -181.542, -181.542, 0, 0],
            }}
            transition={{
              duration: 2,
              ease: EASE,
              times: [0, 0.0809, 0.081, 0.1584, 0.1585, 0.2354, 0.2355, 0.2939, 0.294, 0.2959, 0.296, 1],
            }}
          >
            <div className="absolute left-[-370.32px] top-[733.84px] flex h-[614px] w-[1330.328px] items-center justify-center">
              <div className="-scale-y-100 flex-none rotate-[-9.43deg]">
                <div className="relative h-[409.76px] w-[1280.499px] overflow-clip">
                  <div className="absolute left-0 top-0 h-[409.76px] w-[1280.499px]">
                    <img
                      alt=""
                      className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                      src={imgLetterIBadge}
                    />
                  </div>
                  <div className="absolute left-[1033.62px] top-[316.82px] flex h-[37.437px] w-[86.797px] -translate-x-1/2 items-center justify-center">
                    <div className="-scale-y-100 flex-none rotate-[-9.43deg]">
                      <p
                        className="h-[24px] w-[84px] text-center text-[24px] font-normal leading-[1.3] tracking-[1.596px] text-[#fffce8]"
                        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                      >
                        ACTOR
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute left-[-62px] top-[387px] h-[295px] w-[894px] overflow-clip text-center font-[family-name:var(--font-display)] text-[145px] uppercase tracking-[-1.9099px]"
              data-name="prayrak mehta title"
            >
              <div className="absolute left-[516px] top-[6.36px] w-[1008.352px] -translate-x-1/2 text-black">
                <p className="mb-0 leading-[1.07]">Prayrak</p>
                <p className="leading-[1.07]">Mehta</p>
              </div>
              <div className="absolute left-[504.18px] top-0 w-[1008.352px] -translate-x-1/2 text-[#fffce8]">
                <p className="mb-0 leading-[1.07]">Prayrak</p>
                <p className="leading-[1.07]">Mehta</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
