"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { REGENCY_COVERAGE } from "@/data/garindoData";

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [category, setCategory] = useState("Sembako & Bahan Bangunan");
  const [volume, setVolume] = useState("1 Tronton (15 – 25 Ton)");
  const [destination, setDestination] = useState("Kota Palu (Hub Utama)");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 0.3], [0.96, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const textMessage = `Halo CV. Garindo Palu,

Saya ingin mengajukan pemesanan / inkuiri distribusi B2B:
• Perusahaan / Toko: ${companyName || "-"}
• Penanggung Jawab: ${contactName || "-"}
• Divisi: ${category}
• Estimasi Volume: ${volume}
• Tujuan Pengiriman: ${destination}

Mohon informasi daftar harga distributor dan jadwal pengiriman terdekat.`;

    window.open(
      `https://wa.me/628114567890?text=${encodeURIComponent(textMessage)}`,
      "_blank"
    );
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-10 py-28 sm:py-40 bg-[#FAFAF9]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          style={{ y: cardY, scale: cardScale, opacity: cardOpacity }}
          className="rounded-[32px] bg-white border border-black/[0.08] shadow-[0_4px_32px_rgba(0,0,0,0.04)] p-8 sm:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-sm font-semibold tracking-tight text-[#F56300] mb-2">
                Pengadaan B2B
              </p>
              <h2 className="text-3xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-[-0.035em] leading-[1.06]">
                Mulai kemitraan distribusi.
              </h2>
              <p className="mt-4 text-base text-[#6E6E73] leading-relaxed">
                Hubungi tim distribusi kami di Palu Barat untuk mendapatkan
                daftar harga grosir pabrik dan jadwal keberangkatan armada.
              </p>
            </div>

            <div className="pt-6 border-t border-black/[0.08] space-y-3 text-sm text-[#6E6E73]">
              <div>
                <span className="block text-[#1D1D1F] font-semibold">
                  Gudang Utama Palu Barat
                </span>
                <span>
                  Jl. Trans Sulawesi KM 7, Kota Palu, Sulawesi Tengah 94227
                </span>
              </div>
              <div>
                <span className="block text-[#1D1D1F] font-semibold">
                  Hotline &amp; WhatsApp
                </span>
                <span>+62 451 489 1234 • +62 811 456 7890</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Minimal Form */}
          <form
            onSubmit={handleWhatsAppSubmit}
            className="lg:col-span-7 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Nama Perusahaan / Toko
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TB. Sumber Bangunan"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF9] border border-black/[0.1] text-[#1D1D1F] placeholder-[#86868B] text-sm focus:outline-none focus:border-[#F56300] focus:ring-1 focus:ring-[#F56300] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Nama Penanggung Jawab
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF9] border border-black/[0.1] text-[#1D1D1F] placeholder-[#86868B] text-sm focus:outline-none focus:border-[#F56300] focus:ring-1 focus:ring-[#F56300] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Divisi Produk
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF9] border border-black/[0.1] text-[#1D1D1F] text-sm focus:outline-none focus:border-[#F56300] focus:ring-1 focus:ring-[#F56300] transition-colors cursor-pointer"
                >
                  <option value="Divisi Sembako">Divisi Sembako</option>
                  <option value="Divisi Bahan Bangunan">
                    Divisi Bahan Bangunan
                  </option>
                  <option value="Sembako & Bahan Bangunan">
                    Keduanya (Sembako &amp; Bangunan)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Skala Armada
                </label>
                <select
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF9] border border-black/[0.1] text-[#1D1D1F] text-sm focus:outline-none focus:border-[#F56300] focus:ring-1 focus:ring-[#F56300] transition-colors cursor-pointer"
                >
                  <option value="Armada CDD (5 – 8 Ton)">
                    Armada CDD (5 – 8 Ton)
                  </option>
                  <option value="1 Tronton (15 – 25 Ton)">
                    1 Tronton (15 – 25 Ton)
                  </option>
                  <option value="Kontainer 20ft / 40ft">
                    Kontainer 20ft / 40ft
                  </option>
                  <option value="Kontrak Rutin Bulanan">
                    Kontrak Rutin Bulanan
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                Wilayah Tujuan di Sulawesi Tengah
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAFAF9] border border-black/[0.1] text-[#1D1D1F] text-sm focus:outline-none focus:border-[#F56300] focus:ring-1 focus:ring-[#F56300] transition-colors cursor-pointer"
              >
                {REGENCY_COVERAGE.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name} ({r.leadTime})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF7A29] via-[#F56300] to-[#D9381E] text-white shadow-lg shadow-[#F56300]/25 text-sm font-semibold tracking-tight transition-all hover:brightness-105 active:scale-95 cursor-pointer"
              >
                Lanjutkan ke WhatsApp
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
