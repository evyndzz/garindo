"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  external?: boolean;
  showArrow?: boolean;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  external = false,
  showArrow = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Outer container magnetic pull
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Inner content stronger magnetic pull for tactile parallax
  const innerX = useMotionValue(0);
  const innerY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 16, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);
  const smoothInnerX = useSpring(innerX, springConfig);
  const smoothInnerY = useSpring(innerY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    x.set(deltaX * 0.28);
    y.set(deltaY * 0.28);
    innerX.set(deltaX * 0.12);
    innerY.set(deltaY * 0.12);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    innerX.set(0);
    innerY.set(0);
  };

  const baseStyles =
    "group relative inline-flex items-center justify-between gap-4 rounded-full font-semibold tracking-tight transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] cursor-pointer select-none";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#FF7A29] via-[#F56300] to-[#D9381E] text-white pl-7 pr-2 py-2 shadow-lg shadow-[#F56300]/25 hover:brightness-105",
    secondary:
      "bg-[#1D1D1F] text-white hover:bg-black pl-7 pr-2 py-2",
    outline:
      "bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] ring-1 ring-black/10 hover:ring-black/20 pl-6 pr-2 py-2",
  };

  const iconCircleStyles = {
    primary: "bg-white/20 text-white group-hover:bg-white group-hover:text-[#1D1D1F]",
    secondary: "bg-white/10 text-white group-hover:bg-[#F56300] group-hover:text-white",
    outline: "bg-black/5 text-[#1D1D1F] group-hover:bg-[#F56300] group-hover:text-white",
  };

  const innerContent = (
    <motion.span
      style={{ x: smoothInnerX, y: smoothInnerY }}
      className="flex items-center justify-between gap-4 w-full"
    >
      <span className="text-sm sm:text-[15px] font-bold tracking-tight whitespace-nowrap">
        {children}
      </span>
      {showArrow && (
        <span
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0 ${iconCircleStyles[variant]}`}
        >
          <ArrowUpRight className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      )}
    </motion.span>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          onClick={onClick}
          className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
          {innerContent}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
          {innerContent}
        </button>
      )}
    </motion.div>
  );
}

