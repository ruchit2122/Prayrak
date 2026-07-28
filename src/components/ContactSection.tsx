"use client";

import { motion } from "motion/react";

const EASE = "linear" as const;

export default function ContactSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div
        className="relative aspect-[1440/1024] w-full"
        data-name="contact"
      >
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/contact/contactusbg%201.png"
          alt=""
        />

        {/* Prayrak on the phone + note — slides in from the right */}
        <motion.img
          className="absolute inset-0 h-full w-full object-cover"
          src="/contact/prayrakcontactus1%201.png"
          alt="Prayrak Mehta on the phone next to a note that reads For work and otherwise"
          initial={{ x: 1351.144, y: -15.69 }}
          animate={{
            x: [1351.144, 1351.144, 974.144, 974.144, 723.144, 723.144, 381.144, 381.144, 169.144, 169.144, 0, 0],
            y: [-15.69, -15.69, 0.31, 0.31, -5.69, -5.69, 0, 0],
          }}
          transition={{
            x: { duration: 0.6, ease: EASE, times: [0, 0.0724, 0.0725, 0.1479, 0.148, 0.2219, 0.222, 0.2864, 0.2865, 0.3724, 0.3725, 1] },
            y: { duration: 0.6, ease: EASE, times: [0, 0.0724, 0.0725, 0.1479, 0.148, 0.2219, 0.222, 1] },
          }}
        />

        {/* contact details — slides up from below */}
        <motion.img
          className="absolute left-[12.5%] top-[46%] w-[41.9%]"
          src="/contact/Group%206.png"
          alt="prayrakmehta@gmail.com — Team Prayrak: +91 9953591413"
          initial={{ y: 1034 }}
          animate={{ y: [1034, 1034, 868, 868, 653, 653, 517, 517, 329, 329, 204, 204, 0, 0] }}
          transition={{
            duration: 0.6,
            ease: EASE,
            times: [0, 0.0794, 0.0795, 0.1619, 0.162, 0.2199, 0.22, 0.2674, 0.2675, 0.3129, 0.313, 0.3389, 0.339, 1],
          }}
        />
      </div>
    </section>
  );
}
