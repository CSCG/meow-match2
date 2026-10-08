import React from 'react';
import { Tile, TileColor } from '../types';

interface TileVisualProps {
  tile: Tile | null;
  isSelected?: boolean;
  isHint?: boolean;
  onTileClick?: (tile: Tile) => void;
  size?: number;
}

export const TileVisual: React.FC<TileVisualProps> = ({
  tile,
  isSelected,
  isHint,
  onTileClick,
  size = 52
}) => {
  if (!tile) return <div style={{ width: size, height: size }} />;

  const { color, powerUp, isMilkBottle } = tile;

  return (
    <div
      onClick={() => onTileClick && onTileClick(tile)}
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center cursor-pointer select-none transition-transform duration-150 will-change-transform ${
        isSelected
          ? 'scale-115 z-20 brightness-110 drop-shadow-[0_8px_16px_rgba(251,191,36,0.6)]'
          : 'hover:scale-108 active:scale-95'
      } ${isHint ? 'animate-[bounce_1.2s_infinite]' : ''}`}
    >
      {/* 3D Tactile Selection Ring */}
      {isSelected && (
        <div className="absolute -inset-1 rounded-2xl border-[3px] border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.9),inset_0_0_8px_rgba(254,240,138,0.6)] pointer-events-none z-30 animate-pulse" />
      )}

      {/* Milk Bottle Tile (Special Level Objective) */}
      {isMilkBottle ? (
        <div className="w-full h-full p-0.5 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] flex items-center justify-center animate-[bounce_2.5s_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="milkBottleGlass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="milkLiquidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="cap3D" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="40%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <filter id="tileGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* Bottle Neck Ring */}
            <rect x="41" y="24" width="18" height="6" rx="2" fill="#94a3b8" />
            {/* Bottle Cap */}
            <rect x="37" y="14" width="26" height="12" rx="4" fill="url(#cap3D)" stroke="#7f1d1d" strokeWidth="1.5" />
            <line x1="42" y1="16" x2="42" y2="24" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
            <line x1="48" y1="16" x2="48" y2="24" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
            <line x1="54" y1="16" x2="54" y2="24" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />

            {/* Glass Bottle Body */}
            <rect x="26" y="28" width="48" height="62" rx="14" fill="url(#milkBottleGlass)" stroke="#64748b" strokeWidth="2.5" />
            {/* Creamy Milk Filling */}
            <path d="M 28 46 Q 50 42 72 46 L 72 78 Q 72 88 60 88 L 40 88 Q 28 88 28 78 Z" fill="url(#milkLiquidGrad)" />

            {/* Cute Golden Cat Paw Crest on Milk */}
            <ellipse cx="50" cy="65" rx="8" ry="6.5" fill="#f472b6" />
            <circle cx="43" cy="56" r="3.2" fill="#f472b6" />
            <circle cx="50" cy="53" r="3.2" fill="#f472b6" />
            <circle cx="57" cy="56" r="3.2" fill="#f472b6" />
            <ellipse cx="50" cy="64" rx="5" ry="3.5" fill="#fbcfe8" opacity="0.8" />

            {/* Glass Specular Glare */}
            <path d="M 31 34 Q 31 82 34 82" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" fill="none" />
            <path d="M 68 36 Q 67 80 65 80" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.5" fill="none" />
          </svg>
        </div>
      ) : powerUp === 'yarn_bomb' ? (
        /* Rainbow Yarn Bomb: 5-Tile Match Masterpiece */
        <div className="w-full h-full p-0.5 filter drop-shadow-[0_6px_10px_rgba(147,51,234,0.5)] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_10s_linear_infinite]">
            <defs>
              <radialGradient id="yarnBombCore" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="80%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </radialGradient>
              <radialGradient id="prismSphere" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#312e81" />
              </radialGradient>
            </defs>

            {/* Base Dimensional Sphere */}
            <circle cx="50" cy="50" r="44" fill="url(#prismSphere)" stroke="#4338ca" strokeWidth="2.5" />

            {/* Tactile Rainbow Woven Bands */}
            <path d="M 12 50 C 25 15, 75 15, 88 50" stroke="#ef4444" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M 16 62 C 30 25, 70 25, 84 62" stroke="#f59e0b" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M 18 38 C 30 75, 70 75, 82 38" stroke="#10b981" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M 22 50 C 35 85, 65 85, 78 50" stroke="#06b6d4" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M 28 22 C 78 45, 78 55, 28 78" stroke="#ec4899" strokeWidth="7" fill="none" strokeLinecap="round" />

            {/* Woven Thread Textures */}
            <path d="M 14 48 C 26 16, 74 16, 86 48" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="3,3" />

            {/* Glowing Golden Core */}
            <circle cx="50" cy="50" r="14" fill="url(#yarnBombCore)" stroke="#ffffff" strokeWidth="2" />
            {/* Center Star Flare */}
            <polygon points="50,38 53,47 62,50 53,53 50,62 47,53 38,50 47,47" fill="#ffffff" />
            <circle cx="50" cy="50" r="4" fill="#fef08a" />

            {/* Orbiting Sparkle Dots */}
            <circle cx="30" cy="30" r="3" fill="#ffffff" opacity="0.9" />
            <circle cx="70" cy="70" r="2.5" fill="#fef08a" opacity="0.9" />
            <circle cx="72" cy="32" r="2" fill="#ffffff" opacity="0.8" />
          </svg>
        </div>
      ) : powerUp === 'bomb' ? (
        /* 3D Tactile Cannonball Bomb (3x3 Detonator) */
        <div className="w-full h-full p-0.5 filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)] flex items-center justify-center animate-[pulse_2s_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="bomb3DSphere" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="45%" stopColor="#334155" />
                <stop offset="85%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
              <radialGradient id="fuseSparkGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fde047" />
                <stop offset="80%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id="bombCollarGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* Braided Burning Fuse */}
            <path d="M 50 24 Q 68 18 74 10" fill="none" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
            <path d="M 50 24 Q 68 18 74 10" fill="none" stroke="#78350f" strokeWidth="1" strokeDasharray="3,3" />

            {/* Spark Burst on Fuse */}
            <circle cx="74" cy="10" r="8" fill="url(#fuseSparkGlow)" className="animate-ping" />
            <polygon points="74,2 77,8 83,10 77,12 74,18 71,12 65,10 71,8" fill="#facc15" />
            <circle cx="74" cy="10" r="3" fill="#ffffff" />

            {/* Metallic Collar */}
            <rect x="42" y="20" width="16" height="8" rx="2.5" fill="url(#bombCollarGrad)" stroke="#1e293b" strokeWidth="1.5" />

            {/* Bomb 3D Body */}
            <circle cx="50" cy="58" r="38" fill="url(#bomb3DSphere)" stroke="#0f172a" strokeWidth="2.5" />

            {/* Glowing Neon Cat Paw Insignia */}
            <g className="filter drop-shadow-[0_0_4px_rgba(244,63,94,0.8)]">
              <ellipse cx="50" cy="62" rx="10" ry="8" fill="#f43f5e" />
              <circle cx="40" cy="49" r="4.8" fill="#f43f5e" />
              <circle cx="50" cy="45" r="4.8" fill="#f43f5e" />
              <circle cx="60" cy="49" r="4.8" fill="#f43f5e" />
              {/* Inner Paw Highlights */}
              <ellipse cx="50" cy="61" rx="6" ry="4" fill="#fda4af" />
              <circle cx="40" cy="48" r="2.2" fill="#fda4af" />
              <circle cx="50" cy="44" r="2.2" fill="#fda4af" />
              <circle cx="60" cy="48" r="2.2" fill="#fda4af" />
            </g>

            {/* Top-Left Specular Reflection Glare */}
            <ellipse cx="36" cy="42" rx="10" ry="6" transform="rotate(-30 36 42)" fill="#ffffff" opacity="0.45" />
          </svg>
        </div>
      ) : powerUp === 'line_h' ? (
        /* Horizontal Line Rocket: 3D Lacquered Firecracker */
        <div className="w-full h-full p-0.5 filter drop-shadow-[0_4px_8px_rgba(239,68,68,0.5)] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="rocketBodyH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="30%" stopColor="#ef4444" />
                <stop offset="70%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
              <linearGradient id="goldConeH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Exhaust Flames */}
            <polygon points="12,44 2,50 12,56" fill="#f59e0b" className="animate-pulse" />
            <polygon points="88,44 98,50 88,56" fill="#f59e0b" className="animate-pulse" />
            <polygon points="12,47 6,50 12,53" fill="#ffffff" />
            <polygon points="88,47 94,50 88,53" fill="#ffffff" />

            {/* Rocket Body */}
            <rect x="20" y="34" width="60" height="32" rx="8" fill="url(#rocketBodyH)" stroke="#991b1b" strokeWidth="2" />
            {/* Glossy Top Specular Highlight */}
            <rect x="22" y="36" width="56" height="7" rx="3" fill="#ffffff" opacity="0.5" />

            {/* Racing Stripes */}
            <rect x="36" y="34" width="10" height="32" fill="#ffffff" opacity="0.9" />
            <rect x="54" y="34" width="10" height="32" fill="#ffffff" opacity="0.9" />

            {/* Dual Direction Cones */}
            <polygon points="20,32 6,50 20,68" fill="url(#goldConeH)" stroke="#92400e" strokeWidth="1.5" />
            <polygon points="80,32 94,50 80,68" fill="url(#goldConeH)" stroke="#92400e" strokeWidth="1.5" />

            {/* Direction Arrows */}
            <path d="M 43 50 L 40 45 M 43 50 L 40 55" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 57 50 L 60 45 M 57 50 L 60 55" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      ) : powerUp === 'line_v' ? (
        /* Vertical Line Rocket: 3D Lacquered Firecracker */
        <div className="w-full h-full p-0.5 filter drop-shadow-[0_4px_8px_rgba(59,130,246,0.5)] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="rocketBodyV" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="30%" stopColor="#3b82f6" />
                <stop offset="70%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="goldConeV" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Exhaust Flames */}
            <polygon points="44,12 50,2 56,12" fill="#38bdf8" className="animate-pulse" />
            <polygon points="44,88 50,98 56,88" fill="#38bdf8" className="animate-pulse" />
            <polygon points="47,12 50,6 53,12" fill="#ffffff" />
            <polygon points="47,88 50,94 53,88" fill="#ffffff" />

            {/* Rocket Body */}
            <rect x="34" y="20" width="32" height="60" rx="8" fill="url(#rocketBodyV)" stroke="#1e40af" strokeWidth="2" />
            {/* Glossy Left Specular Highlight */}
            <rect x="36" y="22" width="7" height="56" rx="3" fill="#ffffff" opacity="0.5" />

            {/* Racing Stripes */}
            <rect x="34" y="36" width="32" height="10" fill="#ffffff" opacity="0.9" />
            <rect x="34" y="54" width="32" height="10" fill="#ffffff" opacity="0.9" />

            {/* Dual Direction Cones */}
            <polygon points="32,20 50,6 68,20" fill="url(#goldConeV)" stroke="#92400e" strokeWidth="1.5" />
            <polygon points="32,80 50,94 68,80" fill="url(#goldConeV)" stroke="#92400e" strokeWidth="1.5" />

            {/* Direction Arrows */}
            <path d="M 50 43 L 45 40 M 50 43 L 55 40" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 50 57 L 45 60 M 50 57 L 55 60" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      ) : powerUp === 'targeting_paw' ? (
        /* Targeting Paw: Golden Winged Homing Dart */
        <div className="w-full h-full p-0.5 filter drop-shadow-[0_4px_8px_rgba(245,158,11,0.6)] flex items-center justify-center animate-[wiggle_2s_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="pawGoldMedal" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </radialGradient>
            </defs>

            {/* Golden Flight Wings */}
            <polygon points="14,35 45,50 14,65 24,50" fill="#facc15" stroke="#b45309" strokeWidth="1.5" />
            <polygon points="86,35 55,50 86,65 76,50" fill="#facc15" stroke="#b45309" strokeWidth="1.5" />

            {/* Outer Golden Coin Token */}
            <circle cx="50" cy="50" r="38" fill="url(#pawGoldMedal)" stroke="#78350f" strokeWidth="2.5" />

            {/* Target Reticle Crosshairs */}
            <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="5,4" opacity="0.8" />
            <line x1="50" y1="14" x2="50" y2="22" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="78" x2="50" y2="86" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <line x1="14" y1="50" x2="22" y2="50" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <line x1="78" y1="50" x2="86" y2="50" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />

            {/* Plump 3D Silicone Paw Emblem */}
            <g className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              <ellipse cx="50" cy="57" rx="13" ry="10" fill="#ffffff" />
              <ellipse cx="50" cy="57" rx="9" ry="7" fill="#f472b6" />
              {/* Toe Beans */}
              <circle cx="37" cy="42" r="5" fill="#ffffff" />
              <circle cx="37" cy="42" r="3.5" fill="#f472b6" />
              <circle cx="45.5" cy="35" r="5" fill="#ffffff" />
              <circle cx="45.5" cy="35" r="3.5" fill="#f472b6" />
              <circle cx="54.5" cy="35" r="5" fill="#ffffff" />
              <circle cx="54.5" cy="35" r="3.5" fill="#f472b6" />
              <circle cx="63" cy="42" r="5" fill="#ffffff" />
              <circle cx="63" cy="42" r="3.5" fill="#f472b6" />
            </g>

            {/* Specular Highlight Glint */}
            <ellipse cx="36" cy="30" rx="8" ry="4" transform="rotate(-30 36 30)" fill="#ffffff" opacity="0.6" />
          </svg>
        </div>
      ) : (
        /* High-Definition 3D Stylized Casual Game Pieces */
        <Render3DCasualTile color={color} />
      )}
    </div>
  );
};

const Render3DCasualTile: React.FC<{ color: TileColor }> = ({ color }) => {
  switch (color) {
    case 'fish':
      // 3D Juicy Aqua Blue Fish (Signature Meow Match Style)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(2,132,199,0.45)] p-0.5">
          <defs>
            <radialGradient id="fish3DBody" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="75%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
            <linearGradient id="fishFin3D" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="fishScaleHighlight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Tail Fin with 3D Depth */}
          <path d="M 34 50 Q 14 26 12 36 Q 22 50 12 64 Q 14 74 34 50 Z" fill="url(#fishFin3D)" stroke="#0369a1" strokeWidth="1.5" />
          <path d="M 18 42 Q 28 50 18 58" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6" />

          {/* Dorsal Fin */}
          <path d="M 44 28 Q 54 12 66 24 Z" fill="url(#fishFin3D)" stroke="#0369a1" strokeWidth="1.5" />
          {/* Ventral Fin */}
          <path d="M 48 70 Q 58 84 68 72 Z" fill="url(#fishFin3D)" stroke="#0369a1" strokeWidth="1.5" />

          {/* Chubby 3D Fish Body */}
          <ellipse cx="56" cy="50" rx="34" ry="25" fill="url(#fish3DBody)" stroke="#0284c7" strokeWidth="2" />

          {/* Glossy Top Specular Highlight Arc */}
          <path d="M 34 40 Q 56 28 76 38" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.85" fill="none" />
          <path d="M 38 43 Q 56 34 70 41" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none" />

          {/* Embossed Cute Scales */}
          <path d="M 46 44 Q 52 50 46 56" fill="none" stroke="url(#fishScaleHighlight)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 56 44 Q 62 50 56 56" fill="none" stroke="url(#fishScaleHighlight)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Huge Expressive Kawaii Eye */}
          <ellipse cx="73" cy="46" rx="7.5" ry="8" fill="#ffffff" stroke="#0369a1" strokeWidth="1.2" />
          <ellipse cx="74" cy="46" rx="5.5" ry="6" fill="#0f172a" />
          <circle cx="72" cy="43" r="2.8" fill="#ffffff" />
          <circle cx="76" cy="48" r="1.4" fill="#ffffff" />

          {/* Sweet Smile */}
          <path d="M 80 54 Q 84 57 87 53" fill="none" stroke="#0c4a6e" strokeWidth="2.5" strokeLinecap="round" />

          {/* Floating Playful Water Droplet */}
          <circle cx="88" cy="40" r="2" fill="#e0f2fe" opacity="0.8" />
        </svg>
      );

    case 'mouse':
      // 3D Kawaii Plush Pink Mouse Toy
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(219,39,119,0.45)] p-0.5">
          <defs>
            <radialGradient id="mouse3DBody" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="40%" stopColor="#ec4899" />
              <stop offset="80%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#9d174d" />
            </radialGradient>
            <radialGradient id="mouseEarInner" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f472b6" />
            </radialGradient>
          </defs>

          {/* Cute Playful Tail */}
          <path d="M 24 64 Q 8 78 12 52 Q 14 42 22 50" fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round" />
          <path d="M 24 64 Q 8 78 12 52 Q 14 42 22 50" fill="none" stroke="#fbcfe8" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />

          {/* Left Ear */}
          <circle cx="36" cy="30" r="15" fill="url(#mouse3DBody)" stroke="#be185d" strokeWidth="2" />
          <circle cx="36" cy="30" r="9" fill="url(#mouseEarInner)" />
          {/* Right Ear */}
          <circle cx="68" cy="30" r="15" fill="url(#mouse3DBody)" stroke="#be185d" strokeWidth="2" />
          <circle cx="68" cy="30" r="9" fill="url(#mouseEarInner)" />

          {/* Plump 3D Body */}
          <ellipse cx="52" cy="58" rx="34" ry="26" fill="url(#mouse3DBody)" stroke="#9d174d" strokeWidth="2" />

          {/* Top Glossy Highlight */}
          <ellipse cx="46" cy="46" rx="14" ry="7" transform="rotate(-15 46 46)" fill="#ffffff" opacity="0.55" />

          {/* Expressive Kawaii Eyes */}
          <ellipse cx="64" cy="53" rx="4.5" ry="5.5" fill="#1e1b4b" />
          <circle cx="63" cy="51" r="2" fill="#ffffff" />
          <circle cx="66" cy="55" r="1" fill="#ffffff" />

          {/* Cute Spherical Button Nose with Glint */}
          <circle cx="82" cy="60" r="4.5" fill="#831843" />
          <circle cx="81" cy="58.5" r="1.5" fill="#ffffff" />

          {/* Whiskers */}
          <line x1="72" y1="58" x2="88" y2="54" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <line x1="72" y1="64" x2="88" y2="68" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

          {/* Sweet Rosy Cheeks */}
          <ellipse cx="56" cy="62" rx="5" ry="3" fill="#be185d" opacity="0.4" />
        </svg>
      );

    case 'clover':
      // 3D Jelly Emerald Lucky Clover / Paw Cushion
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(22,163,74,0.45)] p-0.5">
          <defs>
            <radialGradient id="cloverPetal3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="40%" stopColor="#4ade80" />
              <stop offset="80%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>
            <radialGradient id="cloverDewdrop" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#bbf7d0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* Curved Stem with Dimension */}
          <path d="M 50 56 Q 52 82 66 84" fill="none" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
          <path d="M 50 56 Q 52 82 66 84" fill="none" stroke="#86efac" strokeWidth="1.8" opacity="0.7" strokeLinecap="round" />

          {/* 4 Plump Tactile Petals with Individual Radial Highlights */}
          {/* Top Petal */}
          <circle cx="50" cy="30" r="18" fill="url(#cloverPetal3D)" stroke="#166534" strokeWidth="1.5" />
          <ellipse cx="47" cy="24" rx="7" ry="4" fill="#ffffff" opacity="0.6" />

          {/* Right Petal */}
          <circle cx="70" cy="48" r="18" fill="url(#cloverPetal3D)" stroke="#166534" strokeWidth="1.5" />
          <ellipse cx="68" cy="42" rx="7" ry="4" fill="#ffffff" opacity="0.5" />

          {/* Bottom Petal */}
          <circle cx="50" cy="66" r="18" fill="url(#cloverPetal3D)" stroke="#166534" strokeWidth="1.5" />
          <ellipse cx="48" cy="60" rx="7" ry="4" fill="#ffffff" opacity="0.4" />

          {/* Left Petal */}
          <circle cx="30" cy="48" r="18" fill="url(#cloverPetal3D)" stroke="#166534" strokeWidth="1.5" />
          <ellipse cx="27" cy="42" rx="7" ry="4" fill="#ffffff" opacity="0.6" />

          {/* Center Dimensional Heart Node */}
          <circle cx="50" cy="48" r="11" fill="#15803d" />
          <circle cx="50" cy="48" r="8" fill="#4ade80" />
          <circle cx="48" cy="46" r="3" fill="#ffffff" opacity="0.8" />

          {/* Dewdrop Sparkle */}
          <circle cx="42" cy="28" r="3.5" fill="url(#cloverDewdrop)" />
          <circle cx="41" cy="27" r="1.2" fill="#ffffff" />
        </svg>
      );

    case 'lemon':
      // 3D Golden Bell / Citrus Lemon
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(234,179,8,0.5)] p-0.5">
          <defs>
            <radialGradient id="lemon3DBody" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fde047" />
              <stop offset="80%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </radialGradient>
            <linearGradient id="lemonLeafGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>

          {/* Fresh Green Leaf with Dewdrop */}
          <path d="M 52 24 Q 72 10 70 28 Q 60 32 52 24 Z" fill="url(#lemonLeafGrad)" stroke="#15803d" strokeWidth="1.5" />
          <path d="M 54 23 Q 64 16 66 24" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Plump 3D Golden Body */}
          <ellipse cx="50" cy="54" rx="36" ry="28" transform="rotate(-15 50 54)" fill="url(#lemon3DBody)" stroke="#ca8a04" strokeWidth="2" />

          {/* Golden Tips */}
          <circle cx="20" cy="62" r="5" fill="#ca8a04" />
          <circle cx="80" cy="46" r="5" fill="#ca8a04" />

          {/* Top Curved Specular Glare */}
          <ellipse cx="44" cy="38" rx="14" ry="6" transform="rotate(-15 44 38)" fill="#ffffff" opacity="0.65" />
          <ellipse cx="40" cy="42" rx="8" ry="3" transform="rotate(-15 40 42)" fill="#ffffff" opacity="0.4" />

          {/* Cute Cheerful Face */}
          <circle cx="44" cy="50" r="3.2" fill="#713f12" />
          <circle cx="43" cy="49" r="1" fill="#ffffff" />
          <circle cx="60" cy="46" r="3.2" fill="#713f12" />
          <circle cx="59" cy="45" r="1" fill="#ffffff" />
          <path d="M 48 56 Q 53 61 58 55" fill="none" stroke="#713f12" strokeWidth="2.5" strokeLinecap="round" />

          {/* Rosy Blush */}
          <circle cx="38" cy="54" r="4" fill="#f87171" opacity="0.45" />
          <circle cx="66" cy="50" r="4" fill="#f87171" opacity="0.45" />
        </svg>
      );

    case 'bird':
      // 3D Chubby Ruby Songbird Toy
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(220,38,38,0.45)] p-0.5">
          <defs>
            <radialGradient id="bird3DBody" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="35%" stopColor="#f87171" />
              <stop offset="75%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
            <radialGradient id="birdBeak3D" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
          </defs>

          {/* Feathered Tail with Depth */}
          <polygon points="16,50 34,54 20,68" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1.5" />
          <polygon points="12,56 30,58 18,72" fill="#991b1b" />

          {/* Plump 3D Body */}
          <circle cx="54" cy="54" r="32" fill="url(#bird3DBody)" stroke="#991b1b" strokeWidth="2" />

          {/* Creamy Underbelly */}
          <path d="M 46 64 Q 60 84 76 66 Q 64 74 46 64 Z" fill="#fee2e2" opacity="0.7" />

          {/* Wing with Layered Feather Shading */}
          <ellipse cx="44" cy="56" rx="18" ry="11" transform="rotate(-15 44 56)" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
          <path d="M 34 54 Q 46 62 58 56" stroke="#fca5a5" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Beveled Golden Beak */}
          <polygon points="78,46 94,52 78,58" fill="url(#birdBeak3D)" stroke="#a16207" strokeWidth="1.5" />
          <polygon points="78,46 94,52 78,52" fill="#fef08a" opacity="0.6" />

          {/* Big Expressive Eye with Double Sparkle */}
          <circle cx="68" cy="44" r="6" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />
          <circle cx="69" cy="44" r="4.2" fill="#0f172a" />
          <circle cx="67.5" cy="42" r="1.8" fill="#ffffff" />
          <circle cx="70.5" cy="46" r="0.9" fill="#ffffff" />

          {/* Playful Crown Tuft with Highlight */}
          <path d="M 52 24 Q 46 12 56 16" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          <circle cx="56" cy="16" r="2.5" fill="#fca5a5" />

          {/* Top Head Highlight */}
          <ellipse cx="50" cy="32" rx="10" ry="5" fill="#ffffff" opacity="0.55" />
        </svg>
      );

    case 'yarn_purple':
    default:
      // 3D Textured Wound Ball of Royal Violet Yarn
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(147,51,234,0.45)] p-0.5">
          <defs>
            <radialGradient id="yarn3DBall" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="35%" stopColor="#c084fc" />
              <stop offset="75%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </radialGradient>
          </defs>

          {/* Dimensional Spherical Base */}
          <circle cx="50" cy="50" r="36" fill="url(#yarn3DBall)" stroke="#6b21a8" strokeWidth="2" />

          {/* Overlapping Tactile Woven Yarn Strands with Embossed Highlights */}
          <path d="M 22 50 C 35 24, 65 24, 78 50" stroke="#f3e8ff" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 24 50 C 35 26, 65 26, 76 50" stroke="#7e22ce" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />

          <path d="M 28 34 C 45 68, 65 68, 72 34" stroke="#d8b4fe" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 30 66 C 45 32, 65 32, 70 66" stroke="#c084fc" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 18 42 C 45 52, 55 52, 82 42" stroke="#e9d5ff" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Loose Curly Tail Strand at Bottom */}
          <path d="M 64 78 Q 80 88 88 80 Q 92 74 86 72" fill="none" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" />

          {/* Golden Center Button / Thread Knot Pin */}
          <circle cx="50" cy="50" r="5" fill="#facc15" stroke="#a16207" strokeWidth="1" />
          <circle cx="49" cy="49" r="1.5" fill="#ffffff" />

          {/* Specular Highlight Glare */}
          <ellipse cx="38" cy="28" rx="8" ry="4" transform="rotate(-25 38 28)" fill="#ffffff" opacity="0.65" />
        </svg>
      );
  }
};
