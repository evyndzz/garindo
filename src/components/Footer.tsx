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
              Distributor skala besar komoditas sembako dan material bangunan di Sulawesi Tengah.
            </p>
            <div className="pt-1">
              <p className="text-[#1D1D1F] font-semibold">
                CV. Garindo Cab. Palu
              </p>
              <a
                href="https://maps.google.com/?q=Jl.+Sungai+Lariang+No.23,+Ujuna,+Kec.+Palu+Bar.,+Kota+Palu,+Sulawesi+Tengah+94111"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6E6E73] hover:text-[#F56300] transition-colors leading-relaxed block mt-1"
              >
                Jl. Sungai Lariang No.23, Ujuna, Kec. Palu Bar., Kota Palu, Sulawesi Tengah 94111
              </a>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="font-semibold text-[#1D1D1F]">Divisi Sembako &amp; Kebutuhan Harian</div>
            <ul className="space-y-2 text-[#6E6E73]">
              <li>Tepung Terigu Jawara 1kg</li>
              <li>Tepung Terigu Bola Salju 1kg</li>
              <li>Gula Pasir Bola Merah 1kg</li>
              <li>Minyak Goreng Rose Brand 1/2L</li>
              <li>Sofita Tissue</li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="font-semibold text-[#1D1D1F]">Bahan Bangunan</div>
            <ul className="space-y-2 text-[#6E6E73]">
              <li>Semen Conch</li>
              <li>Semen Tonasa</li>
              <li>Layanan Tronton Proyek</li>
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