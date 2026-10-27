"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import SequenceScroll from "@/components/SequenceScroll";
import AboutSection from "@/components/AboutSection";
import BentoGrid from "@/components/BentoGrid";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

export default function Home() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Safety fallback: ensure site is never blocked if network is very slow
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsModelLoaded(true);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  const isAllLoaded = isImagesLoaded && isModelLoaded;

  return (
    <SmoothScroll>
      {!preloaderDone && (
        <Preloader
          progress={loadProgress}
          isLoaded={isAllLoaded}
          onFinished={() => setPreloaderDone(true)}
        />
      )}

      <Navbar />

      <main className="relative bg-black text-[#1D1D1F] min-h-screen">
        {/* Pinned GSAP ScrollTrigger Sequence (Stays locked until all 240 frames finish) */}
        <SequenceScroll
          onProgressUpdate={(percent) => setLoadProgress(percent)}
          onLoadedComplete={() => setIsImagesLoaded(true)}
          onModelLoaded={() => setIsModelLoaded(true)}
        />

        {/* Subsequent White-Mode Landing Page Sections with Garindo Brand Signature */}
        <div className="relative z-10 bg-white">
          <AboutSection />
          <BentoGrid />
          <StatsSection />
          <TestimonialsSection />
          <FinalCTASection />
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  );
}