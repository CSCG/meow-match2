import React from 'react';

interface BodhiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BodhiLogo: React.FC<BodhiLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-14 h-14'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl sm:text-3xl'
  };

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="flex items-center gap-2.5">
        {/* Enlightened Geometric Lotus-Paw Emblem */}
        <div className={`relative ${iconSizes[size]} drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="bodhiGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="bodhiCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Hexagonal / Diamond Sacred Shield */}
            <polygon
              points="50,4 92,26 92,74 50,96 8,74 8,26"
              fill="#1e1b4b"
              stroke="url(#bodhiGold)"
              strokeWidth="4"
            />

            {/* Inner Glowing Mandala Petals */}
            <circle cx="50" cy="50" r="32" fill="none" stroke="url(#bodhiCyan)" strokeWidth="2" opacity="0.6" strokeDasharray="4 2" />
            <polygon
              points="50,18 78,50 50,82 22,50"
              fill="none"
              stroke="url(#bodhiGold)"
              strokeWidth="2.5"
            />

            {/* Enlightened Golden Cat Paw Core */}
            {/* Main Pad */}
            <path
              d="M 38 56 C 36 68, 64 68, 62 56 C 60 48, 40 48, 38 56 Z"
              fill="url(#bodhiGold)"
            />
            {/* 4 Toe Pads */}
            <circle cx="34" cy="42" r="5" fill="url(#bodhiGold)" />
            <circle cx="45" cy="36" r="5.5" fill="url(#bodhiGold)" />
            <circle cx="55" cy="36" r="5.5" fill="url(#bodhiGold)" />
            <circle cx="66" cy="42" r="5" fill="url(#bodhiGold)" />

            {/* Center Enlightened Spark */}
            <circle cx="50" cy="56" r="2.5" fill="#ffffff" />
          </svg>
        </div>

        <div className="flex flex-col text-left">
          <span className={`font-black tracking-widest text-amber-300 font-['Fredoka'] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ${titleSizes[size]}`}>
            BODHI INDUSTRIES
          </span>
          {showSubtitle && (
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-amber-200/90 font-bold uppercase -mt-0.5">
              Interactive Studios
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
