import React from 'react';
import { CatStatue } from '../types';

interface GrassOverlayProps {
  level: number; // 0 = none, 1 = light grass, 2 = dense grass with flowers
  size: number;
}

export const GrassOverlay: React.FC<GrassOverlayProps> = ({ level, size }) => {
  if (level <= 0) return null;

  return (
    <div
      style={{ width: size, height: size }}
      className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {level === 1 ? (
          /* Level 1: Light Garden Grass */
          <g>
            <rect x="4" y="4" width="92" height="92" rx="14" fill="#22c55e" opacity="0.45" stroke="#16a34a" strokeWidth="2" />
            {/* Small Grass Blades */}
            <path d="M 20 80 Q 25 50 35 48" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 50 82 Q 52 45 45 42" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 75 80 Q 72 52 82 50" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          /* Level 2: Dense Grass with Flowers (requires 2 hits) */
          <g>
            <rect x="2" y="2" width="96" height="96" rx="14" fill="#15803d" opacity="0.65" stroke="#14532d" strokeWidth="3" />
            {/* Lush Foliage Tufts */}
            <path d="M 18 85 Q 22 40 32 38" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 46 88 Q 50 35 42 32" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 78 85 Q 74 42 86 40" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Cute Little Daisy Flower */}
            <circle cx="34" cy="38" r="4" fill="#facc15" />
            <circle cx="34" cy="32" r="3" fill="#ffffff" />
            <circle cx="34" cy="44" r="3" fill="#ffffff" />
            <circle cx="28" cy="38" r="3" fill="#ffffff" />
            <circle cx="40" cy="38" r="3" fill="#ffffff" />
            {/* Badge indicating +1 remaining hit */}
            <circle cx="78" cy="24" r="12" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
            <text x="78" y="29" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">2</text>
          </g>
        )}
      </svg>
    </div>
  );
};

interface CatStatueVisualProps {
  statue: CatStatue;
  tileSize: number;
}

export const CatStatueVisual: React.FC<CatStatueVisualProps> = ({ statue, tileSize }) => {
  const widthPx = statue.width * tileSize;
  const heightPx = statue.height * tileSize;
  const leftPx = statue.startCol * tileSize;
  const topPx = statue.startRow * tileSize;

  return (
    <div
      style={{
        width: widthPx,
        height: heightPx,
        left: leftPx,
        top: topPx
      }}
      className={`absolute pointer-events-none z-0 p-2 flex items-center justify-center transition-all duration-500 ${
        statue.isCollected ? 'scale-125 opacity-0' : 'opacity-90'
      }`}
    >
      <div className="w-full h-full bg-amber-100/90 rounded-3xl border-4 border-amber-400/80 shadow-inner flex flex-col items-center justify-center p-2 relative overflow-hidden">
        {/* Porcelain Maneki-Neko Lucky Cat Statue */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Statue Body */}
          <ellipse cx="50" cy="62" rx="36" ry="32" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" />
          {/* Red Collar & Gold Bell */}
          <path d="M 28 48 Q 50 62 72 48" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="56" r="6.5" fill="#facc15" stroke="#b45309" strokeWidth="1.5" />
          {/* Head */}
          <circle cx="50" cy="36" r="28" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" />
          {/* Ears */}
          <polygon points="28,26 22,8 40,16" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <polygon points="30,24 26,12 38,18" fill="#f43f5e" />
          <polygon points="72,26 78,8 60,16" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <polygon points="70,24 74,12 62,18" fill="#f43f5e" />
          {/* Raised Lucky Waving Paw */}
          <ellipse cx="74" cy="30" rx="9" ry="14" transform="rotate(-20 74 30)" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="76" cy="22" rx="5" ry="3" fill="#f472b6" />
          {/* Face */}
          <path d="M 38 32 Q 44 36 46 32" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <path d="M 54 32 Q 56 36 62 32" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="38" r="2.5" fill="#f43f5e" />
          {/* Gold Coin / Koban */}
          <rect x="40" y="66" width="20" height="24" rx="8" fill="#facc15" stroke="#b45309" strokeWidth="2" />
          <text x="50" y="82" fill="#78350f" fontSize="12" fontWeight="bold" textAnchor="middle">吉</text>
        </svg>
      </div>
    </div>
  );
};
