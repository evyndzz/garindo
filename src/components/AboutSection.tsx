"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface CharProps {
  char: string;
  range: [number, number];
  progress: MotionValue<number>;
}

const Character = ({ char, range, progress }: CharProps) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block text-[#1D1D1F]">
      {char}
    </motion.span>
  );
};

interface WordRevealProps {
  word: string;
  wordStart: number;
  wordEnd: number;
  progress: MotionValue<number>;
}

const WordReveal = ({
  word,
  wordStart,
  wordEnd,
  progress,
}: WordRevealProps) => {
  const chars = word.split("");
  const step = (wordEnd - wordStart) / chars.length;

  return (
    <span className="inline-block mr-[0.26em] whitespace-nowrap">
      {chars.map((char, i) => {
        const cStart = wordStart + i * step;
        const cEnd = cStart + step;
        return (
          <Character
            key={i}
            char={char}
            range={[cStart, cEnd]}
            progress={progress}
          />
        );
      })}
    </span>
  );
};

const PILLARS = [
  {
    number: "01",
    title: "Prinsipal tangan pertama.",
    body: "Alokasi langsung dari pabrik nasional untuk Semen Conch, Terigu Jawara, Bola Salju, Gula Bola Merah, dan Minyak Rose Brand dengan jaminan keaslian dan harga pabrik.",
  },
  {
    number: "02",
    title: "Gudang modern Palu Barat.",
    body: "Penyimpanan tertutup berkapasitas 50.000 ton dengan sistem rotasi FIFO ketat dan paletisasi tinggi yang melindungi komoditas dari kelembaban udara pesisir.",
  },
  {
    number: "03",
    title: "Kedaulatan armada sendiri.",
    body: "Lebih dari 100 unit tronton wingbox, fuso, dan dump truck beroperasi harian menembus 13 kabupaten dan kota tanpa ketergantungan ekspedisi pihak ketiga.",
  },
];

// Highlight finishes at 85% of the pinned distance, then holds before unpinning.
const REVEAL_START = 0.04;
const REVEAL_END = 0.85;

export default function AboutSection() {
  const pinRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: enterProgress } = useScroll({
    target: pinRef,
    offset: ["start end", "start start"],
  });

  const contentY = useTransform(enterProgress, [0, 0.6], [40, 0]);
  const contentOpacity = useTransform(enterProgress, [0, 0.45], [0, 1]);

  const statement =
    "Berakar di Kota Palu, CV. Garindo menjadi tulang punggung distribusi Sulawesi Tengah. Kami menyatukan ketahanan pangan pokok dan material konstruksi berstandar nasional dalam satu ekosistem pergudangan modern dan armada mandiri.";

  const words = statement.split(" ");
  const span = (REVEAL_END - REVEAL_START) / words.length;

  return (
    <section
      id="about"
      className="relative z-10 pb-20 sm:pb-44 bg-white text-[#1D1D1F]"
    >
      {/* Seamless transition blend from Hero sequence black into clean White mode */}
      <div className="absolute top-0 inset-x-0 h-28 sm:h-40 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />

      {/* Pinned stage: shorter scroll distance on mobile (210vh) for effortless thumb scrolling */}
      <div ref={pinRef} className="relative h-[210vh] sm:h-[300vh]">
        <div className="sticky top-0 h-svh sm:h-screen flex items-center">
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="max-w-6xl mx-auto px-5 sm:px-6 w-full"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-tight text-[#F56300] mb-3.5 sm:mb-5">
              Infrastruktur &amp; Rantai Pasok
            </p>

            {/* Apple Scroll-Lit Typography in Crisp White Mode */}
            <p className="text-[1.6rem] sm:text-5xl md:text-[3.35rem] font-semibold leading-[1.22] sm:leading-[1.12] tracking-[-0.025em] sm:tracking-[-0.03em] select-none text-[#1D1D1F]">
              {words.map((word, i) => {
                const wordStart = REVEAL_START + i * span;
                const wordEnd = wordStart + span;
                return (
                  <WordReveal
                    key={i}
                    word={word}
                    wordStart={wordStart}
                    wordEnd={wordEnd}
                    progress={scrollYProgress}
                  />
                );
              })}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* Staggered Scroll-Triggered Editorial Pillars */}
        <div className="pt-10 sm:pt-14 border-t border-black/[0.08] grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-12">
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.65,
                delay: idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group p-5 sm:p-0 rounded-2xl sm:rounded-none bg-[#FAFAF9] sm:bg-transparent border border-black/[0.05] sm:border-0"
            >
              <span className="inline-block text-xs font-semibold text-[#F56300] tabular-nums mb-2 sm:mb-3">
                {pillar.number}
              </span>
              <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1F] tracking-tight group-hover:text-[#F56300] transition-colors">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
