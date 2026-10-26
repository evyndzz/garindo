"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

interface PreloaderProps {
  progress: number;
  isLoaded: boolean;
  onFinished: () => void;
}

export default function Preloader({
  progress,
  isLoaded,
  onFinished,
}: PreloaderProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          const step = Math.ceil((progress - prev) * 0.25);
          return Math.min(progress, prev + Math.max(1, step));
        }
        return prev;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [progress]);

  useEffect(() => {
    if (isLoaded && displayProgress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        const finishTimer = setTimeout(() => {
          onFinished();
        }, 650);
        return () => clearTimeout(finishTimer);
      }, 200);

      return () => clearTimeout(exitTimer);
    }
  }, [isLoaded, displayProgress, onFinished]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="apple-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
          }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black text-[#F5F5F7] select-none"
        >
          <Logo size="lg" showText={false} theme="dark" />
          <p className="mt-5 text-sm font-medium text-[#F5F5F7] tracking-tight">
            CV. Garindo
          </p>

          {/* Minimalist Progress Line with Garindo Gradient */}
          <div className="w-44 h-[2px] bg-white/15 rounded-full overflow-hidden mt-5">
            <div
              className="h-full bg-gradient-to-r from-[#FF7A29] via-[#F56300] to-[#D9381E] transition-all duration-150 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
