"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { STATS_DATA, REGENCY_COVERAGE } from "@/data/garindoData";
import { StatMetric } from "@/types";

interface AnimatedStatCardProps {
  stat: StatMetric;
  index: number;
}

function AnimatedStatCard({ stat, index }: AnimatedStatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let rafId: number;
    const duration = 2200; // 2.2s smooth count-up
    const delayMs = index * 140;

    const timeoutId = setTimeout(() => {
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Smooth easeOutExpo curve so it decelerates gracefully as it reaches the target
        const eased =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.round(eased * stat.value));

        if (progress < 1) {
          rafId = requestAnimationFrame(animateCount);
        } else {
          setCount(stat.value);
        }
      };

      rafId = requestAnimationFrame(animateCount);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isInView, stat.value, index]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{
        duration: 0.75,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative rounded-[24px] sm:rounded-[28px] bg-white border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4.5 sm:p-8 flex flex-col justify-between overflow-hidden hover:border-[#F56300]/30 transition-all"
    >
      <div>
        <div className="flex items-baseline gap-1 text-3xl sm:text-6xl font-semibold text-[#1D1D1F] tracking-[-0.04em] leading-none tabular-nums">
          <span>{count.toLocaleString("id-ID")}</span>
          {stat.suffix && (
            <span className="text-[#F56300]">{stat.suffix}</span>
          )}
        </div>

        {/* Smooth Animated Fill Bar Synced with Scroll Trigger */}
        <div className="mt-3.5 sm:mt-5 h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={
              isInView ? { width: `${stat.progressPercent}%` } : { width: "0%" }
            }
            transition={{
              duration: 2.1,
              delay: index * 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full rounded-full bg-gradient-to-r from-[#FF7A29] via-[#F56300] to-[#D9381E]"
          />
        </div>

        <div className="mt-3.5 sm:mt-5 text-sm sm:text-lg font-semibold text-[#1D1D1F] tracking-tight leading-snug">
          {stat.label}
        </div>
        <div className="mt-0.5 text-[11px] sm:text-xs font-semibold text-[#F56300]">
          {stat.sublabel}
        </div>
      </div>

      <p className="mt-2.5 sm:mt-4 text-xs sm:text-sm text-[#6E6E73] leading-relaxed line-clamp-3 sm:line-clamp-none">
        {stat.description}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const isTableInView = useInView(tableRef, { once: true, margin: "-60px" });
  const [selectedCorridor, setSelectedCorridor] = useState<string>("Semua");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.25], [45, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const corridors = [
    "Semua",
    "Pusat Hub",
    "Koridor Tengah",
    "Koridor Barat & Utara",
    "Koridor Timur & Kepulauan",
  ];

  const filteredRegencies = REGENCY_COVERAGE.filter((reg) => {
    if (selectedCorridor === "Semua") return true;
    return reg.corridor === selectedCorridor;
  });

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative z-10 py-28 sm:py-40 bg-[#FAFAF9]"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Scroll-Linked Section Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="max-w-2xl mb-16 sm:mb-20"
        >
          <p className="text-sm font-semibold tracking-tight text-[#F56300] mb-2">
            Skala &amp; Jangkauan
          </p>
          <h2 className="text-4xl sm:text-6xl font-semibold text-[#1D1D1F] tracking-[-0.035em] leading-[1.04]">
            Menjangkau seluruh Sulawesi Tengah.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#6E6E73] leading-relaxed">
            Dari Gudang Utama Palu Barat hingga kawasan industri Morowali dan
            kepulauan Banggai, armada kami bergerak terjadwal setiap hari.
          </p>
        </motion.div>

        {/* Animated Stat Cards with Count-Up & Progress Gauge (2x2 on Mobile, 4-col on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {STATS_DATA.map((stat, idx) => (
            <AnimatedStatCard key={stat.label} stat={stat} index={idx} />
          ))}
        </div>

        {/* Interactive 13-Regency Lead Time & Route Matrix */}
        <motion.div
          ref={tableRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-20 rounded-[28px] sm:rounded-[32px] bg-white border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 sm:pb-6 border-b border-black/[0.08] gap-4 sm:gap-5">
            <div>
              <h3 className="text-lg sm:text-2xl font-semibold text-[#1D1D1F] tracking-tight">
                Matriks Rute &amp; Estimasi Serah-Terima (SLA)
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#6E6E73]">
                Titik Keberangkatan: CV. Garindo Cab. Palu (Jl. Sungai Lariang No.23, Ujuna, Palu Barat)
              </p>
            </div>

            {/* Corridor Filter Pills (Swipeable horizontally on mobile) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap -mx-1 px-1 pb-1">
              {corridors.map((corridor) => {
                const active = selectedCorridor === corridor;
                return (
                  <button
                    key={corridor}
                    type="button"
                    onClick={() => setSelectedCorridor(corridor)}
                    className={`relative shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? "text-white font-semibold"
                        : "bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="corridor-filter-pill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF7A29] to-[#F56300] shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{corridor}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divide-y divide-black/[0.06] mt-2">
            <AnimatePresence mode="popLayout">
              {filteredRegencies.map((reg, idx) => (
                <motion.div
                  layout
                  key={reg.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="py-4 grid grid-cols-1 md:grid-cols-12 items-center gap-3 text-sm"
                >
                  {/* Regency Name & Distance */}
                  <div className="md:col-span-4">
                    <div className="font-semibold text-[#1D1D1F]">
                      {reg.name}
                    </div>
                    <div className="text-xs text-[#6E6E73]">
                      {reg.distanceKm} • {reg.minOrder}
                    </div>
                  </div>

                  {/* Animated Route Distance Bar */}
                  <div className="md:col-span-4 flex items-center gap-3">
                    <div className="h-1.5 flex-1 rounded-full bg-black/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={
                          isTableInView
                            ? { width: `${reg.distanceRatio}%` }
                            : { width: "0%" }
                        }
                        transition={{
                          duration: 1.4,
                          delay: 0.15 + idx * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-[#FF7A29] to-[#F56300]"
                      />
                    </div>
                    <span className="text-[11px] text-[#6E6E73] w-24 shrink-0 hidden sm:inline">
                      {reg.corridor}
                    </span>
                  </div>

                  {/* Fleet & Lead Time */}
                  <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-4">
                    <span className="text-xs text-[#6E6E73]">
                      {reg.fleetType}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#FAFAF9] border border-black/[0.08] text-xs text-[#1D1D1F] font-semibold tabular-nums shrink-0 shadow-xs">
                      {reg.leadTime}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
