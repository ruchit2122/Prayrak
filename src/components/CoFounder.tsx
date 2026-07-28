"use client";

import { motion } from "motion/react";

export default function CoFounder() {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <motion.div
        className="relative"
        data-name="co-founder"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <video
          className="w-full h-auto"
          src="/cofounder.mp4"
          autoPlay
          muted
          playsInline
        />
      </motion.div>
    </section>
  );
}
