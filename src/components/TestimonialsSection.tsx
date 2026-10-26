"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS_DATA } from "@/data/garindoData";

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionY = useTransform(scrollYProgress, [0, 0.25], [45, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative z-10 py-28 sm:py-40 bg-white"
    >
      <motion.div
        style={{ y: sectionY, opacity: sectionOpacity }}
        className="max-w-6xl mx-auto px-6"
      >
        <div className="mb-12 sm:mb-16">
          <p className="text-sm font-semibold tracking-tight text-[#F56300] mb-2">
            Kemitraan B2B
          </p>
          <h2 className="text-4xl sm:text-6xl font-semibold text-[#1D1D1F] tracking-[-0.035em] leading-[1.04]">
            Dipercaya rekanan daerah.
          </h2>
        </div>

        {/* Clean Apple Light Tile Slider (Supports Touch Swipe on Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="rounded-[28px] sm:rounded-[32px] bg-[#FAFAF9] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-14 min-h-[340px] sm:min-h-[360px] flex flex-col justify-between overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) {
                  setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
                } else if (info.offset.x > 50) {
                  setCurrentIndex((prev) =>
                    prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1
                  );
                }
              }}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="cursor-grab active:cursor-grabbing"
            >
              <div className="flex flex-wrap items-center gap-2 mb-5 sm:mb-6">
                <span className="px-3 py-1 rounded-full bg-white border border-black/[0.08] text-[11px] sm:text-xs font-semibold text-[#1D1D1F] shadow-xs">
                  {current.partnerType}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#F56300]/10 border border-[#F56300]/20 text-[11px] sm:text-xs font-semibold text-[#D9381E]">
                  {current.verifiedYear}
                </span>
              </div>

              <blockquote className="text-lg sm:text-3xl font-medium text-[#1D1D1F] tracking-[-0.02em] leading-relaxed">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div className="mt-8 pt-6 border-t border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-base font-semibold text-[#1D1D1F]">
                    {current.author}
                  </div>
                  <div className="text-sm text-[#6E6E73]">
                    {current.role}, {current.company} • {current.location}
                  </div>
                </div>
                <div className="text-xs font-medium text-[#1D1D1F] bg-white border border-black/[0.08] px-3.5 py-1.5 rounded-full shadow-xs self-start sm:self-auto">
                  {current.contractScope}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Apple Minimalist Dots & Arrow Controls */}
          <div className="mt-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {TESTIMONIALS_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? "w-7 bg-gradient-to-r from-[#FF7A29] to-[#F56300]"
                      : "w-2 bg-black/15 hover:bg-black/30"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1
                  )
                }
                aria-label="Sebelumnya"
                className="w-10 h-10 rounded-full bg-white border border-black/[0.1] hover:bg-black/[0.04] text-[#1D1D1F] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length)
                }
                aria-label="Selanjutnya"
                className="w-10 h-10 rounded-full bg-white border border-black/[0.1] hover:bg-black/[0.04] text-[#1D1D1F] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
