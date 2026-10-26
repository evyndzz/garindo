"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const firstLightSection =
        document.getElementById("about") || document.getElementById("divisions");
      if (firstLightSection) {
        const rect = firstLightSection.getBoundingClientRect();
        // Switch to light mode when white section top edge reaches near top of screen
        setIsLightMode(rect.top <= 60);
      } else {
        setIsLightMode(window.scrollY > window.innerHeight * 2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll and handle Escape key when fullscreen menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { title: "Ikhtisar", href: "#hero-sequence" },
    { title: "Profil", href: "#about" },
    { title: "Divisi Produk", href: "#divisions" },
    { title: "Jangkauan", href: "#stats" },
    { title: "Kemitraan", href: "#testimonials" },
    { title: "Kontak", href: "#contact" },
  ];

  const menuLinks = [
    { title: "Ikhtisar", href: "#hero-sequence" },
    { title: "Profil", href: "#about" },
    { title: "Divisi Produk", href: "#divisions" },
    { title: "Jangkauan", href: "#stats" },
    { title: "Kemitraan", href: "#testimonials" },
    { title: "Kontak", href: "#contact" },
    { title: "Pesan", href: "#contact" },
  ];

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Dynamic Navbar: Dark over cinematic Hero, Crisp White over subsequent sections */}
      {/* Dynamic Navbar: Dark over cinematic Hero, Crisp White over subsequent sections */}
      <header
        className={`fixed top-0 left-0 right-0 z-[110] h-12 transition-colors duration-300 ${
          isMenuOpen
            ? isLightMode
              ? "bg-transparent border-b border-black/[0.06]"
              : "bg-transparent border-b border-white/[0.08]"
            : isLightMode
            ? "bg-white/85 border-b border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md"
            : "bg-black/75 border-b border-white/[0.08] backdrop-blur-md"
        }`}
      >
        <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Standalone Logo Mark (no text "CV. Garindo") */}
          <button
            type="button"
            onClick={() => {
              if (isMenuOpen) setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="cursor-pointer flex items-center justify-center p-1 -ml-1 transition-transform hover:scale-105"
            aria-label="CV. Garindo Beranda"
          >
            <Logo size="md" showText={false} theme={isLightMode ? "light" : "dark"} />
          </button>

          {/* Center/Right: Apple Navigation Links (Desktop) */}
          <nav
            className={`${
              isMenuOpen ? "hidden" : "hidden md:flex"
            } items-center gap-7 font-[family-name:var(--font-montserrat)]`}
          >
            {navLinks.map((item) => (
              <a
                key={item.title}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className={`text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                  isLightMode
                    ? "text-[#1D1D1F]/70 hover:text-[#1D1D1F]"
                    : "text-[#F5F5F7]/75 hover:text-[#F5F5F7]"
                }`}
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* Right: Action Buttons & Animated Menu Toggle */}
          <div className="flex items-center gap-4">
            {!isMenuOpen && (
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("#contact");
                }}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF7A29] via-[#F56300] to-[#D9381E] hover:brightness-110 text-white text-[11px] font-semibold uppercase tracking-[0.14em] font-[family-name:var(--font-montserrat)] shadow-sm shadow-[#F56300]/25 transition-all"
              >
                Pesan
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Tutup Menu" : "Buka Menu"}
              className={`w-7 h-7 flex items-center justify-center relative cursor-pointer transition-colors ${
                isLightMode
                  ? "text-[#1D1D1F]/80 hover:text-black"
                  : "text-[#F5F5F7]/80 hover:text-white"
              }`}
            >
              <motion.span
                animate={
                  isMenuOpen
                    ? { rotate: 45, y: 0 }
                    : { rotate: 0, y: -4 }
                }
                transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                className="block absolute w-4 h-[1.5px] bg-current rounded-full"
              />
              <motion.span
                animate={
                  isMenuOpen
                    ? { rotate: -45, y: 0 }
                    : { rotate: 0, y: 4 }
                }
                transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                className="block absolute w-4 h-[1.5px] bg-current rounded-full"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Overlay Menu: Covers entire screen behind header */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              y: -20,
              filter: "blur(10px)",
              transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
            }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className={`fixed inset-0 z-[100] w-screen h-dvh flex flex-col justify-between overflow-y-auto px-4 sm:px-6 pt-12 pb-0 backdrop-blur-3xl transition-colors ${
              isLightMode
                ? "bg-white/98 text-[#1D1D1F]"
                : "bg-black/98 text-[#F5F5F7]"
            }`}
          >
            {/* Menu Links & Details Body */}
            <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 my-auto py-8">
              <div className="md:col-span-7 flex flex-col space-y-2 sm:space-y-3">
                {menuLinks.map((item, idx) => (
                  <motion.button
                    key={item.title}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      transition: {
                        duration: 0.2,
                        delay: (menuLinks.length - 1 - idx) * 0.02,
                        ease: [0.32, 0.72, 0, 1],
                      },
                    }}
                    transition={{
                      delay: 0.03 * idx,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => handleLinkClick(item.href)}
                    className={`text-left text-3xl sm:text-5xl font-semibold tracking-[-0.03em] transition-colors py-1 cursor-pointer flex items-center justify-between group ${
                      item.title === "Pesan"
                        ? "text-[#FF7A29] hover:text-[#F56300]"
                        : isLightMode
                        ? "text-[#86868B] hover:text-[#1D1D1F]"
                        : "text-[#86868B] hover:text-[#F5F5F7]"
                    }`}
                  >
                    <span>{item.title}</span>
                    <span className="text-xl sm:text-2xl opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF7A29]">
                      →
                    </span>
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -8,
                  transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
                }}
                transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`md:col-span-5 flex flex-col justify-end space-y-6 text-sm border-t md:border-t-0 md:border-l pt-8 md:pt-0 md:pl-10 ${
                  isLightMode
                    ? "text-[#6E6E73] border-black/10"
                    : "text-[#86868B] border-white/10"
                }`}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      isLightMode ? "text-[#1D1D1F]" : "text-[#F5F5F7]"
                    }`}
                  >
                    Kompleks Pergudangan CV. Garindo
                  </p>
                  <p className="mt-1">
                    Jl. Trans Sulawesi KM 7, Palu Barat, Kota Palu, Sulawesi Tengah 94227
                  </p>
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      isLightMode ? "text-[#1D1D1F]" : "text-[#F5F5F7]"
                    }`}
                  >
                    Kontak Distribusi & Pemesanan
                  </p>
                  <p className="mt-1">+62 451 489 1234 • +62 811 456 7890</p>
                  <p>pengadaan@garindo.co.id</p>
                </div>
              </motion.div>
            </div>

            {/* Bottom Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className={`max-w-5xl w-full mx-auto py-4 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-2 shrink-0 ${
                isLightMode
                  ? "border-black/10 text-[#86868B]"
                  : "border-white/10 text-[#86868B]"
              }`}
            >
              <span>© 2026 CV. Garindo. Sulawesi Tengah.</span>
              <span>Distribusi Sembako & Bahan Bangunan</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}