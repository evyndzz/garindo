import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  theme?: "dark" | "light";
}

export default function Logo({
  className = "",
  size = "sm",
  showText = true,
  theme = "light",
}: LogoProps) {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-sm font-semibold tracking-tight",
    md: "text-base font-semibold tracking-tight",
    lg: "text-xl font-semibold tracking-tight",
  };

  const cutoutColor = theme === "dark" ? "#000000" : "#FFFFFF";
  const textColor = theme === "dark" ? "text-[#F5F5F7]" : "text-[#1D1D1F]";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient
              id="garindoMinimalGrad"
              x1="50"
              y1="6"
              x2="50"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FF7A29" />
              <stop offset="55%" stopColor="#F56300" />
              <stop offset="100%" stopColor="#D9381E" />
            </linearGradient>
          </defs>
          <polygon
            points="50,8 92,86 8,86"
            fill="url(#garindoMinimalGrad)"
          />
          <polygon points="50,26 77,77 23,77" fill={cutoutColor} />
          <polygon
            points="50,36 69,71 31,71"
            fill="url(#garindoMinimalGrad)"
          />
          <polygon points="50,47 61,66 39,66" fill={cutoutColor} />
          <rect
            x="49"
            y="54"
            width="22"
            height="6"
            fill="url(#garindoMinimalGrad)"
          />
        </svg>
      </div>

      {showText && (
        <span className={`${textSizes[size]} ${textColor} font-[family-name:var(--font-montserrat)] tracking-tight`}>
          CV. Garindo
        </span>
      )}
    </div>
  );
}
