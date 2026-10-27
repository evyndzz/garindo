"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ChevronRight,
  Package,
  Sparkles,
  Search,
  X,
  Clock,
  MapPin,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { COMMODITIES_DATA } from "@/data/garindoData";
import { CommodityItem } from "@/types";

interface ProductCardProps {
  item: CommodityItem;
  index: number;
  onOpenSpecs?: (item: CommodityItem) => void;
}

function ProductCard({
  item,
  index,
}: ProductCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  // Subtle 3D Studio Tilt & Cursor Spotlight
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [2.5, -2.5]), {
    stiffness: 260,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-2.5, 2.5]), {
    stiffness: 260,
    damping: 28,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.04, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className="group relative rounded-[28px] bg-white border border-[#E5E5EA] hover:border-[#F56300]/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(245,99,0,0.08)] transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 overflow-hidden"
    >
      {/* Top Subtle Specular Line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#F56300]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Product Image Stage */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-[#F6F6F8] border border-black/[0.04] flex items-center justify-center p-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </div>

      {/* Product Title */}
      <div className="mt-5 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight leading-snug hover:text-[#F56300] transition-colors">
          {item.name}
        </h3>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-black/[0.06]">
        <a
          href={`https://wa.me/628114567890?text=${encodeURIComponent(
            `Halo CV. Garindo Palu, saya ingin menanyakan pemesanan untuk komoditas ${item.name}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF7A29] via-[#F56300] to-[#D9381E] hover:brightness-110 text-white text-xs sm:text-sm font-semibold text-center shadow-sm shadow-[#F56300]/25 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Pesan Sekarang</span>
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </motion.article>
  );
}

// Modal Datasheet & Certificate of Analysis (CoA)
function DatasheetModal({
  item,
  onClose,
}: {
  item: CommodityItem;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 40 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[88dvh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-t-[28px] sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-black/10"
      >
        {/* Mobile Bottom-Sheet Drag Handle Pill */}
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4 sm:hidden" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-neutral-200 text-[#1D1D1F] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F56300]/10 text-[#D9381E] border border-[#F56300]/20">
            {item.subCategory || item.category}
          </span>
          {item.certification && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {item.certification}
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
          {item.name}
        </h2>
        <p className="text-xs font-semibold text-[#86868B] uppercase tracking-wider mt-1">
          {item.brand}
        </p>

        {/* Image & Description */}
        <div className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F7F7F8] border border-black/[0.06]">
          <div className="sm:col-span-1 h-36 rounded-xl overflow-hidden bg-white border border-black/[0.04] flex items-center justify-center p-2">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="sm:col-span-2 flex flex-col justify-center">
            <p className="text-xs sm:text-sm text-[#48484A] leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Technical Specification Table */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F56300]" />
            <span>Spesifikasi Teknis &amp; Lembar Analisis (CoA)</span>
          </h4>

          <div className="rounded-2xl border border-black/[0.08] overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F5F5F7] text-[#6E6E73] font-semibold border-b border-black/[0.08]">
                <tr>
                  <th className="py-2.5 px-4">Parameter Mutu</th>
                  <th className="py-2.5 px-4">Nilai / Standar Garindo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {item.fullSpecs?.map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF9]"}>
                    <td className="py-2.5 px-4 font-medium text-[#1D1D1F]">
                      {spec.label}
                    </td>
                    <td className="py-2.5 px-4 text-[#48484A] font-semibold">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Logistics & Dispatch Info */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FAFAF9] border border-black/[0.06]">
            <div className="font-semibold text-[#1D1D1F] flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#F56300]" />
              <span>Gudang Asal &amp; Pengambilan:</span>
            </div>
            <p className="text-[#6E6E73]">{item.originWarehouse || "Hub Gudang Palu Barat"}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAF9] border border-black/[0.06]">
            <div className="font-semibold text-[#1D1D1F] flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-[#F56300]" />
              <span>Estimasi Waktu Kirim (Lead Time):</span>
            </div>
            <p className="text-[#6E6E73]">{item.leadTime || "Pengiriman Harian 24 Jam"}</p>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="mt-6 pt-4 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6E6E73]">
            <span>Perlu sampel fisik atau faktur pajak resmi? Hubungi tim logistik.</span>
          </div>

          <a
            href={`https://wa.me/628114567890?text=${encodeURIComponent(
              `Halo CV. Garindo Palu, saya ingin meminta Lembar Analisis Resmi (CoA), sertifikasi, dan penawaran harga kontrak untuk komoditas ${item.name}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF7A29] via-[#F56300] to-[#D9381E] hover:brightness-110 text-white text-xs font-semibold shadow-sm shadow-[#F56300]/25 transition-transform active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Minta Penawaran Resmi &amp; CoA</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function BentoGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "sembako" | "bahan-bangunan" | "kebutuhan-harian"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<CommodityItem | null>(null);

  // Smooth scroll-linked entrance for header
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.25], [30, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const categoryCounts = useMemo(() => {
    return {
      all: COMMODITIES_DATA.length,
      "bahan-bangunan": COMMODITIES_DATA.filter((i) => i.category === "bahan-bangunan").length,
      sembako: COMMODITIES_DATA.filter((i) => i.category === "sembako").length,
      "kebutuhan-harian": COMMODITIES_DATA.filter((i) => i.category === "kebutuhan-harian").length,
    };
  }, []);

  const filteredItems = useMemo(() => {
    return COMMODITIES_DATA.filter((item) => {
      // 1. Category filter
      if (activeCategory !== "all" && item.category !== activeCategory) return false;

      // 2. Search query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchBrand = item.brand.toLowerCase().includes(q);
        const matchCategory = item.subCategory?.toLowerCase().includes(q);
        const matchSpecs = item.specs.some((s) => s.toLowerCase().includes(q));
        return matchName || matchBrand || matchCategory || matchSpecs;
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section
      ref={sectionRef}
      id="divisions"
      className="relative z-10 py-24 sm:py-36 bg-gradient-to-b from-[#FAFAF9] via-white to-[#FAFAF9]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* 1. Catalog Section Header (Apple / Dua Kelinci Style) */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-14 gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F56300]/10 text-[#D9381E] border border-[#F56300]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F56300]" />
              <span>KATALOG PRODUK &amp; KOMODITAS B2B</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#1D1D1F] tracking-tight leading-[1.08]">
              Pilihan Komoditas &amp; Pasokan Terpadu.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#6E6E73] leading-relaxed">
              Pasokan tangan pertama semen konstruksi, tepung terigu, gula pasir kristal, dan kebutuhan harian langsung dari gudang distribusi Palu Barat.
            </p>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/628114567890?text=Halo%20Garindo,%20saya%20ingin%20meminta%20katalog%20lengkap%20dan%20profil%20pasokan%20komoditas."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-[#1D1D1F] border border-black/10 shadow-sm text-xs font-semibold transition-all hover:border-[#F56300]/30 cursor-pointer"
            >
              <span>Katalog &amp; Profil Pasokan (PDF)</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#F56300]" />
            </a>
          </div>
        </motion.div>

        {/* 2. Interactive Navigation Bar (Category Tabs + Live Search) */}
        <div className="mb-8 sm:mb-10 p-3.5 sm:p-5 rounded-3xl bg-white border border-[#E5E5EA] shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 sm:gap-4">
          {/* Category Tabs (Horizontal Swipeable on Mobile) */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] overflow-x-auto no-scrollbar flex-nowrap">
            {[
              { id: "all", label: "Semua Produk" },
              { id: "bahan-bangunan", label: "Bahan Bangunan" },
              { id: "sembako", label: "Divisi Sembako" },
              { id: "kebutuhan-harian", label: "Kebutuhan Harian" },
            ].map((tab) => {
              const active = activeCategory === tab.id;
              const count = categoryCounts[tab.id as keyof typeof categoryCounts];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      tab.id as "all" | "sembako" | "bahan-bangunan" | "kebutuhan-harian"
                    )
                  }
                  className={`relative shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    active
                      ? "text-white shadow-sm"
                      : "text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="active-catalog-category"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF7A29] to-[#F56300]"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                        active
                          ? "bg-white/25 text-white"
                          : "bg-black/[0.06] text-[#86868B]"
                      }`}
                    >
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komoditas, merk, atau spesifikasi..."
              className="w-full pl-10 pr-9 py-2 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#F56300]/30 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between px-2 mb-6 text-xs text-[#86868B]">
          <span>
            Menampilkan <strong className="text-[#1D1D1F]">{filteredItems.length}</strong> produk komoditas
            {searchQuery && ` untuk kata kunci "${searchQuery}"`}
          </span>
        </div>

        {/* 3. Product Cards Grid (Clean 3-column reference style) */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-black/[0.08] p-8">
            <Package className="w-12 h-12 text-[#86868B] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-[#1D1D1F]">Tidak ada produk yang cocok</h3>
            <p className="text-xs text-[#6E6E73] mt-1 mb-4">
              Coba gunakan kata kunci pencarian lain atau pilih kategori Semua Produk.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-4 py-2 rounded-full bg-[#1D1D1F] text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onOpenSpecs={(selected) => setSelectedProduct(selected)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* 4. Bottom Commercial Guarantee & Legal Notes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 rounded-2xl bg-white border border-[#E5E5EA] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#6E6E73]"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#F56300] shrink-0" />
            <span>
              * Seluruh komoditas dijamin standar mutu SNI / BPOM, dilengkapi Faktur Pajak PKP resmi, dan proteksi asuransi muatan ekspedisi gudang Palu Barat.
            </span>
          </div>

          <a
            href="https://wa.me/628114567890?text=Halo%20Garindo,%20saya%20ingin%20konsultasi%20kontrak%20tahunan%20proyek."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1D1D1F] hover:text-[#F56300] font-semibold inline-flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
          >
            <span>Minta Kontrak Suplai Proyek Skala Besar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>

      {/* 5. Datasheet & CoA Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <DatasheetModal
            item={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
