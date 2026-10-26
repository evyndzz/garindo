"use client";

import React from "react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#F5F5F7] border-t border-black/[0.08] text-[#6E6E73] text-xs">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-black/[0.08]">
          <div className="sm:col-span-2 space-y-3">
            <Logo size="sm" theme="light" />
            <p className="leading-relaxed max-w-sm mt-2 text-[#6E6E73]">
              Distributor skala besar komoditas sembako dan material bangunan di Sulawesi Tengah. Beroperasi dari Kompleks Pergudangan Palu Barat, Kota Palu.
            </p>
            <p className="text-[#1D1D1F] font-medium">
              Jl. Trans Sulawesi KM 7, Palu Barat, Kota Palu 94227
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="font-semibold text-[#1D1D1F]">Divisi Sembako</div>
            <ul className="space-y-2 text-[#6E6E73]">
              <li>Tepung Terigu Jawara</li>
              <li>Tepung Terigu Bola Salju</li>
              <li>Gula Kristal Bola Merah</li>
              <li>Minyak Goreng Rose Brand</li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="font-semibold text-[#1D1D1F]">Bahan Bangunan</div>
            <ul className="space-y-2 text-[#6E6E73]">
              <li>Semen Conch PCC</li>
              <li>Baja Ringan Galvalum</li>
              <li>Besi Beton Ulir &amp; Polos SNI</li>
              <li>Pengiriman 13 Kabupaten</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[#86868B]">
            Hak Cipta &copy; 2026 CV. Garindo. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-6">
            <a href="#hero-sequence" className="hover:text-[#F56300] transition-colors">
              Ikhtisar
            </a>
            <a href="#divisions" className="hover:text-[#F56300] transition-colors">
              Produk
            </a>
            <a href="#stats" className="hover:text-[#F56300] transition-colors">
              Jangkauan
            </a>
            <a href="#contact" className="hover:text-[#F56300] transition-colors">
              Kontak
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}