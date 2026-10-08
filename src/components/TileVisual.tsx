import React from 'react';
import { Tile, TileColor, PowerUpType } from '../types';

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
      className={`relative flex items-center justify-center cursor-pointer select-none transition-transform duration-150 ${
        isSelected ? 'scale-110 z-20 brightness-110' : 'hover:scale-105 active:scale-95'
      } ${isHint ? 'animate-bounce' : ''}`}
    >
      {/* Selection Glow / Ring */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl border-4 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.8)] pointer-events-none z-30" />
      )}

      {/* Milk Bottle Tile */}
      {isMilkBottle ? (
        <div className="w-full h-full p-1 drop-shadow-md flex items-center justify-center animate-[bounce_2s_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="milkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            {/* Bottle Cap */}
            <rect x="40" y="10" width="20" height="10" rx="3" fill="url(#capGrad)" />
            {/* Bottle Neck */}
            <rect x="43" y="20" width="14" height="12" fill="#cbd5e1" />
            {/* Glass Bottle Body */}
            <rect x="30" y="30" width="40" height="58" rx="12" fill="url(#milkGrad)" stroke="#94a3b8" strokeWidth="2.5" />
            {/* Milk Level */}
            <rect x="33" y="44" width="34" height="42" rx="8" fill="#ffffff" />
            {/* Cute Cat Paw Label */}
            <circle cx="50" cy="62" r="5" fill="#f472b6" />
            <circle cx="45" cy="54" r="2.2" fill="#f472b6" />
            <circle cx="50" cy="52" r="2.2" fill="#f472b6" />
            <circle cx="55" cy="54" r="2.2" fill="#f472b6" />
            {/* Glass Glare */}
            <path d="M 36 36 Q 36 82 40 82" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" fill="none" />
          </svg>
        </div>
      ) : powerUp === 'yarn_bomb' ? (
        /* Rainbow Yarn Bomb! */
        <div className="w-full h-full p-0.5 drop-shadow-lg animate-[spin_8s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="44" fill="#6366f1" />
            {/* Rainbow Yarn Ribbons */}
            <path d="M 15 50 Q 50 15 85 50" stroke="#ef4444" strokeWidth="7" fill="none" />
            <path d="M 20 62 Q 50 25 80 62" stroke="#f59e0b" strokeWidth="7" fill="none" />
            <path d="M 22 40 Q 50 78 78 40" stroke="#10b981" strokeWidth="7" fill="none" />
            <path d="M 18 50 Q 50 85 82 50" stroke="#06b6d4" strokeWidth="7" fill="none" />
            <path d="M 30 25 Q 75 50 30 75" stroke="#ec4899" strokeWidth="7" fill="none" />
            {/* Yarn Strand Hanging */}
            <path d="M 65 75 Q 85 92 90 85" stroke="#f43f5e" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Center sparkle */}
            <circle cx="50" cy="50" r="8" fill="#ffffff" opacity="0.9" />
          </svg>
        </div>
      ) : powerUp === 'bomb' ? (
        /* Bomb (3x3 Detonator) */
        <div className="w-full h-full p-1 drop-shadow-lg flex items-center justify-center animate-[pulse_1.5s_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="bombSphere" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="60%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
            </defs>
            {/* Fuse */}
            <path d="M 52 24 Q 68 15 72 8" fill="none" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
            {/* Fuse Spark */}
            <circle cx="72" cy="8" r="4" fill="#fbbf24" className="animate-ping" />
            <polygon points="72,4 75,8 72,12 69,8" fill="#ef4444" />
            {/* Cap */}
            <rect x="44" y="22" width="14" height="8" rx="2" fill="#94a3b8" />
            {/* Bomb Body */}
            <circle cx="50" cy="58" r="36" fill="url(#bombSphere)" />
            {/* Cute Cat Paw Emblem on Bomb */}
            <circle cx="50" cy="62" r="9" fill="#f43f5e" />
            <circle cx="41" cy="49" r="4.5" fill="#f43f5e" />
            <circle cx="50" cy="45" r="4.5" fill="#f43f5e" />
            <circle cx="59" cy="49" r="4.5" fill="#f43f5e" />
            {/* Glare */}
            <ellipse cx="38" cy="46" rx="8" ry="5" transform="rotate(-30 38 46)" fill="#ffffff" opacity="0.3" />
          </svg>
        </div>
      ) : powerUp === 'line_h' ? (
        /* Line Rocket (Horizontal) */
        <div className="w-full h-full p-1 drop-shadow-md flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="rocketH" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            {/* Rocket Body */}
            <rect x="18" y="36" width="64" height="28" rx="8" fill="url(#rocketH)" stroke="#b91c1c" strokeWidth="2" />
            {/* Stripes */}
            <rect x="36" y="36" width="10" height="28" fill="#ffffff" opacity="0.8" />
            <rect x="54" y="36" width="10" height="28" fill="#ffffff" opacity="0.8" />
            {/* Horizontal Arrowheads on both sides */}
            <polygon points="18,36 4,50 18,64" fill="#dc2626" />
            <polygon points="82,36 96,50 82,64" fill="#dc2626" />
            {/* Thruster Sparks */}
            <circle cx="2" cy="50" r="3" fill="#facc15" />
            <circle cx="98" cy="50" r="3" fill="#facc15" />
          </svg>
        </div>
      ) : powerUp === 'line_v' ? (
        /* Line Rocket (Vertical) */
        <div className="w-full h-full p-1 drop-shadow-md flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="rocketV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Rocket Body */}
            <rect x="36" y="18" width="28" height="64" rx="8" fill="url(#rocketV)" stroke="#1d4ed8" strokeWidth="2" />
            {/* Stripes */}
            <rect x="36" y="36" width="28" height="10" fill="#ffffff" opacity="0.8" />
            <rect x="36" y="54" width="28" height="10" fill="#ffffff" opacity="0.8" />
            {/* Vertical Arrowheads on both sides */}
            <polygon points="36,18 50,4 64,18" fill="#1d4ed8" />
            <polygon points="36,82 50,96 64,82" fill="#1d4ed8" />
            {/* Thruster Sparks */}
            <circle cx="50" cy="2" r="3" fill="#38bdf8" />
            <circle cx="50" cy="98" r="3" fill="#38bdf8" />
          </svg>
        </div>
      ) : powerUp === 'targeting_paw' ? (
        /* Targeting Paw / Paper Dart */
        <div className="w-full h-full p-1 drop-shadow-md flex items-center justify-center animate-[wiggle_1.5s_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="pawGold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </radialGradient>
            </defs>
            {/* Outer Golden Glow Circle */}
            <circle cx="50" cy="50" r="42" fill="url(#pawGold)" stroke="#b45309" strokeWidth="2.5" />
            {/* Target Crosshairs */}
            <circle cx="50" cy="50" r="32" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4,4" />
            {/* Main Paw Pad */}
            <ellipse cx="50" cy="58" rx="14" ry="11" fill="#ffffff" />
            {/* Toe Beans */}
            <circle cx="36" cy="42" r="5.5" fill="#ffffff" />
            <circle cx="45" cy="34" r="5.5" fill="#ffffff" />
            <circle cx="55" cy="34" r="5.5" fill="#ffffff" />
            <circle cx="64" cy="42" r="5.5" fill="#ffffff" />
            {/* Target indicator wings */}
            <polygon points="50,12 55,20 45,20" fill="#dc2626" />
            <polygon points="50,88 55,80 45,80" fill="#dc2626" />
            <polygon points="12,50 20,45 20,55" fill="#dc2626" />
            <polygon points="88,50 80,45 80,55" fill="#dc2626" />
          </svg>
        </div>
      ) : (
        /* Standard Game Tiles: Fish, Mouse, Clover, Lemon, Bird, Yarn */
        <RenderStandardTile color={color} />
      )}
    </div>
  );
};

const RenderStandardTile: React.FC<{ color: TileColor }> = ({ color }) => {
  switch (color) {
    case 'fish':
      // Cyan Fish (Meow Match staple!)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow p-1">
          <defs>
            <linearGradient id="fishGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {/* Tail Fin */}
          <polygon points="16,30 36,50 16,70" fill="#0369a1" />
          {/* Fish Body */}
          <ellipse cx="56" cy="50" rx="34" ry="24" fill="url(#fishGrad)" stroke="#0284c7" strokeWidth="2" />
          {/* Belly Fin */}
          <polygon points="52,68 62,82 68,68" fill="#38bdf8" />
          {/* Dorsal Fin */}
          <polygon points="46,30 56,16 66,30" fill="#38bdf8" />
          {/* Eye */}
          <circle cx="74" cy="45" r="5.5" fill="#ffffff" />
          <circle cx="75" cy="45" r="3.2" fill="#0f172a" />
          <circle cx="76" cy="43" r="1.2" fill="#ffffff" />
          {/* Smile */}
          <path d="M 80 54 Q 84 56 86 52" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
          {/* Cute Scales */}
          <path d="M 48 45 Q 53 50 48 55" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
          <path d="M 58 45 Q 63 50 58 55" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'mouse':
      // Pink Mouse
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow p-1">
          <defs>
            <linearGradient id="mouseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>
          {/* Tail */}
          <path d="M 22 65 Q 10 75 14 55" fill="none" stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" />
          {/* Body */}
          <ellipse cx="52" cy="56" rx="32" ry="25" fill="url(#mouseGrad)" stroke="#be185d" strokeWidth="2" />
          {/* Big Round Ears */}
          <circle cx="38" cy="32" r="14" fill="#f472b6" stroke="#be185d" strokeWidth="2" />
          <circle cx="38" cy="32" r="8" fill="#fbcfe8" />
          <circle cx="66" cy="32" r="14" fill="#f472b6" stroke="#be185d" strokeWidth="2" />
          <circle cx="66" cy="32" r="8" fill="#fbcfe8" />
          {/* Eyes */}
          <ellipse cx="64" cy="52" rx="3.5" ry="4.5" fill="#0f172a" />
          <circle cx="65" cy="50" r="1.5" fill="#ffffff" />
          {/* Nose */}
          <circle cx="80" cy="58" r="4" fill="#be185d" />
          {/* Whiskers */}
          <line x1="72" y1="56" x2="88" y2="52" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="72" y1="62" x2="88" y2="66" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      );

    case 'clover':
      // Lucky Green Clover / Paw
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow p-1">
          <defs>
            <linearGradient id="cloverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          <g transform="translate(50, 48)">
            {/* 4 Petals */}
            <circle cx="0" cy="-18" r="16" fill="url(#cloverGrad)" stroke="#15803d" strokeWidth="1.5" />
            <circle cx="18" cy="0" r="16" fill="url(#cloverGrad)" stroke="#15803d" strokeWidth="1.5" />
            <circle cx="0" cy="18" r="16" fill="url(#cloverGrad)" stroke="#15803d" strokeWidth="1.5" />
            <circle cx="-18" cy="0" r="16" fill="url(#cloverGrad)" stroke="#15803d" strokeWidth="1.5" />
            {/* Center Heart */}
            <circle cx="0" cy="0" r="10" fill="#22c55e" />
            <path d="M 0 14 Q 5 36 12 38" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
            {/* Glare */}
            <circle cx="-6" cy="-22" r="3.5" fill="#bbf7d0" />
          </g>
        </svg>
      );

    case 'lemon':
      // Golden Yellow Lemon / Bell
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow p-1">
          <defs>
            <linearGradient id="lemonGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
          {/* Leaf */}
          <path d="M 52 22 Q 68 12 66 28 Q 58 30 52 22 Z" fill="#22c55e" />
          {/* Lemon Oval */}
          <ellipse cx="50" cy="54" rx="34" ry="26" transform="rotate(-15 50 54)" fill="url(#lemonGrad)" stroke="#ca8a04" strokeWidth="2" />
          {/* Tips */}
          <circle cx="22" cy="62" r="5" fill="#eab308" />
          <circle cx="78" cy="46" r="5" fill="#eab308" />
          {/* Cute Face */}
          <circle cx="45" cy="50" r="3" fill="#713f12" />
          <circle cx="59" cy="46" r="3" fill="#713f12" />
          <path d="M 50 56 Q 54 60 58 54" fill="none" stroke="#713f12" strokeWidth="2" strokeLinecap="round" />
          {/* Glare */}
          <ellipse cx="44" cy="40" rx="10" ry="4" transform="rotate(-15 44 40)" fill="#ffffff" opacity="0.6" />
        </svg>
      );

    case 'bird':
      // Red Bird / Heart (from screenshots)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow p-1">
          <defs>
            <linearGradient id="birdGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          {/* Tail */}
          <polygon points="18,52 34,56 22,68" fill="#991b1b" />
          {/* Body */}
          <circle cx="54" cy="54" r="30" fill="url(#birdGrad)" stroke="#991b1b" strokeWidth="2" />
          {/* Wing */}
          <ellipse cx="46" cy="56" rx="16" ry="10" transform="rotate(-15 46 56)" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
          {/* Beak */}
          <polygon points="76,46 92,52 76,58" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Eye */}
          <circle cx="66" cy="45" r="4.5" fill="#ffffff" />
          <circle cx="67" cy="45" r="2.8" fill="#0f172a" />
          <circle cx="68" cy="43" r="1" fill="#ffffff" />
          {/* Feather tuft on top */}
          <path d="M 50 24 Q 45 14 54 18" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'yarn_purple':
    default:
      // Cozy Purple Yarn
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow p-1">
          <defs>
            <linearGradient id="yarnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="34" fill="url(#yarnGrad)" stroke="#7e22ce" strokeWidth="2" />
          <path d="M 26 50 Q 50 25 74 50" stroke="#f3e8ff" strokeWidth="3" fill="none" />
          <path d="M 30 35 Q 50 65 70 35" stroke="#e9d5ff" strokeWidth="3" fill="none" />
          <path d="M 32 65 Q 50 35 68 65" stroke="#e9d5ff" strokeWidth="3" fill="none" />
          <circle cx="44" cy="42" r="3" fill="#ffffff" opacity="0.6" />
        </svg>
      );
  }
};
