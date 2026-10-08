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
      className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center p-0.5"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(20,83,45,0.4)]">
        <defs>
          <linearGradient id="grassL1Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="60%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="grassL2Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>

        {level === 1 ? (
          /* Level 1: Silky Garden Lawn with Dewdrops */
          <g>
            <rect x="4" y="4" width="92" height="92" rx="16" fill="url(#grassL1Grad)" opacity="0.6" stroke="#16a34a" strokeWidth="2" />
            {/* 3D Grass Tufts with Highlights */}
            <path d="M 18 84 Q 24 48 34 46" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 18 84 Q 24 48 34 46" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />

            <path d="M 48 86 Q 52 42 44 38" stroke="#15803d" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 48 86 Q 52 42 44 38" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />

            <path d="M 76 84 Q 70 50 82 48" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 76 84 Q 70 50 82 48" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />

            {/* Dewdrop Glint */}
            <circle cx="34" cy="46" r="2.5" fill="#ffffff" opacity="0.9" />
          </g>
        ) : (
          /* Level 2: Dense Flowering Meadow (requires 2 hits) */
          <g>
            <rect x="3" y="3" width="94" height="94" rx="16" fill="url(#grassL2Grad)" opacity="0.8" stroke="#14532d" strokeWidth="2.5" />

            {/* Rich Layered Foliage */}
            <path d="M 16 88 Q 20 36 32 34" stroke="#14532d" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 16 88 Q 20 36 32 34" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />

            <path d="M 46 90 Q 52 30 42 26" stroke="#14532d" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 46 90 Q 52 30 42 26" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />

            <path d="M 80 88 Q 72 38 88 36" stroke="#14532d" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 80 88 Q 72 38 88 36" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />

            {/* 3D Cute Daisy Flower with Soft Petals */}
            <g transform="translate(32, 42)">
              <circle cx="0" cy="-6" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="6" cy="0" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="0" cy="6" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="-6" cy="0" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              <circle cx="-1.5" cy="-1.5" r="1.5" fill="#ffffff" opacity="0.8" />
            </g>

            {/* Golden Honey Badge indicating 2 Hits Remaining */}
            <circle cx="80" cy="22" r="12" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="80" cy="22" r="10" fill="#d97706" />
            <text x="80" y="27" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="Fredoka, sans-serif" textAnchor="middle">2</text>
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
      className={`absolute pointer-events-none z-0 p-1.5 flex items-center justify-center transition-all duration-500 will-change-transform ${
        statue.isCollected ? 'scale-125 opacity-0' : 'opacity-95'
      }`}
    >
      <div className="w-full h-full bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 rounded-3xl border-4 border-amber-400 shadow-[inset_0_4px_8px_rgba(0,0,0,0.2),0_4px_12px_rgba(217,119,6,0.3)] flex flex-col items-center justify-center p-2 relative overflow-hidden">
        {/* Golden Specular Gleam across Statue Plinth */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/40 rounded-full blur-xl pointer-events-none" />

        {/* Golden Maneki-Neko Lucky Cat Figurine */}
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(180,83,9,0.4)]">
          <defs>
            <radialGradient id="statueGoldGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <radialGradient id="statueBellGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
          </defs>

          {/* Plump Statue Body */}
          <ellipse cx="50" cy="62" rx="36" ry="32" fill="url(#statueGoldGrad)" stroke="#92400e" strokeWidth="2.5" />

          {/* Imperial Crimson Collar & Golden Bell */}
          <path d="M 28 48 Q 50 64 72 48" fill="none" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="56" r="7" fill="url(#statueBellGrad)" stroke="#92400e" strokeWidth="1.5" />
          <line x1="46" y1="56" x2="54" y2="56" stroke="#92400e" strokeWidth="1.2" />

          {/* Head */}
          <circle cx="50" cy="35" r="28" fill="url(#statueGoldGrad)" stroke="#92400e" strokeWidth="2.5" />

          {/* Ears with Crimson Velvet Inners */}
          <polygon points="26,24 20,6 38,14" fill="url(#statueGoldGrad)" stroke="#92400e" strokeWidth="2" />
          <polygon points="28,22 24,10 36,16" fill="#f43f5e" />

          <polygon points="74,24 80,6 62,14" fill="url(#statueGoldGrad)" stroke="#92400e" strokeWidth="2" />
          <polygon points="72,22 76,10 64,16" fill="#f43f5e" />

          {/* Waving Paw (Inviting Luck & Stars!) */}
          <ellipse cx="76" cy="28" rx="9" ry="14" transform="rotate(-20 76 28)" fill="url(#statueGoldGrad)" stroke="#92400e" strokeWidth="2" />
          <ellipse cx="78" cy="20" rx="5" ry="3.5" fill="#f472b6" />

          {/* Adorable Lucky Cat Face */}
          <path d="M 37 32 Q 43 36 45 32" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 55 32 Q 57 36 63 32" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="37" r="2.8" fill="#dc2626" />

          {/* Rosy Golden Cheeks */}
          <circle cx="34" cy="38" r="4" fill="#f87171" opacity="0.6" />
          <circle cx="66" cy="38" r="4" fill="#f87171" opacity="0.6" />

          {/* Polished Gold Koban (Lucky Coin) */}
          <rect x="38" y="66" width="24" height="24" rx="8" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
          <text x="50" y="82" fill="#78350f" fontSize="13" fontWeight="900" fontFamily="Fredoka, sans-serif" textAnchor="middle">喵</text>

          {/* Star Sparkle on Forehead */}
          <polygon points="50,18 52,22 56,24 52,26 50,30 48,26 44,24 48,22" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
};
