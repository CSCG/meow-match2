import React, { useState, useEffect } from 'react';
import { Cat } from '../types';

interface CatVisualProps {
  cat: Cat;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  action?: 'idle' | 'sleeping' | 'happy' | 'cheering';
  onTap?: () => void;
  showDialogue?: string | null;
}

export const CatVisual: React.FC<CatVisualProps> = ({
  cat,
  size = 'md',
  onTap,
  showDialogue
}) => {
  const [isTapped, setIsTapped] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural organic cat blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4200);
    return () => clearInterval(blinkInterval);
  }, []);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 350);

    // Spawn floating heart particles
    const newHeart = { id: Date.now() + Math.random(), x: (Math.random() - 0.5) * 50, y: -25 };
    setHearts(prev => [...prev.slice(-4), newHeart]);

    if (onTap) onTap();
  };

  const sizeDimensions = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
    hero: 'w-64 h-64 sm:w-72 sm:h-72'
  }[size];

  const isPiper = cat.id === 'piper';

  return (
    <div
      className={`relative inline-block cursor-pointer select-none transition-transform will-change-transform ${
        isTapped ? 'scale-110 -translate-y-2' : 'hover:scale-105 active:scale-95'
      } ${sizeDimensions}`}
      onClick={handlePointerDown}
    >
      {/* Speech Bubble with Comic Drop Shadow */}
      {showDialogue && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 min-w-[180px] max-w-[260px] bg-gradient-to-b from-white to-amber-50 px-4 py-2.5 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.25)] border-3 border-amber-400 text-xs sm:text-sm font-black text-amber-950 font-['Fredoka'] text-center animate-bounce pointer-events-none">
          {showDialogue}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-400" />
        </div>
      )}

      {/* Floating Hearts when Petted */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute text-2xl pointer-events-none z-40 animate-ping"
          style={{
            left: `calc(50% + ${h.x}px)`,
            top: `${h.y}px`,
            animationDuration: '0.9s'
          }}
        >
          💖
        </div>
      ))}

      {/* High-Fidelity 3D Stylized Cat Illustration */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
      >
        <defs>
          {/* Eyes Gradients */}
          <radialGradient id={`catIris_${cat.id}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
          <radialGradient id="maineCoonIris" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="45%" stopColor="#10b981" />
            <stop offset="85%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>

          {/* Calico Shading Gradients */}
          <radialGradient id="calicoCreamBody" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </radialGradient>
          <radialGradient id="calicoGingerPatch" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </radialGradient>
          <radialGradient id="calicoDarkPatch" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#57534e" />
            <stop offset="60%" stopColor="#292524" />
            <stop offset="100%" stopColor="#1c1917" />
          </radialGradient>

          {/* Maine Coon Shading Gradients */}
          <radialGradient id="maineCoonCoat" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#d6d3d1" />
            <stop offset="50%" stopColor="#a8a29e" />
            <stop offset="85%" stopColor="#78716c" />
            <stop offset="100%" stopColor="#57534e" />
          </radialGradient>
          <radialGradient id="maineCoonRuff" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f5f5f4" />
            <stop offset="100%" stopColor="#e7e5e4" />
          </radialGradient>

          {/* Gold Costume Metallic */}
          <linearGradient id="costumeGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {isPiper ? (
          /* =================================================== */
          /* PIPER: The Playful Calico Mix (Ginger, Dark, Cream) */
          /* =================================================== */
          <g className="animate-[pulse_4s_ease-in-out_infinite]">
            {/* Fluffy Bushy Tail with Natural Motion */}
            <g className="origin-bottom-left animate-[wiggle_2.5s_ease-in-out_infinite]">
              <path
                d="M 135 145 C 180 135, 198 88, 162 76 C 146 72, 138 94, 132 120 Z"
                fill="url(#calicoGingerPatch)"
                stroke="#c2410c"
                strokeWidth="1.5"
              />
              {/* Dark Tip Patch on Tail */}
              <path
                d="M 162 76 C 178 82, 185 96, 168 108 C 158 96, 150 82, 162 76 Z"
                fill="url(#calicoDarkPatch)"
              />
              <path d="M 150 90 Q 165 96 156 106" stroke="#ffffff" strokeWidth="1.2" opacity="0.5" fill="none" />
            </g>

            {/* Plump 3D Body */}
            <ellipse cx="100" cy="140" rx="54" ry="44" fill="url(#calicoCreamBody)" stroke="#fde68a" strokeWidth="2" />

            {/* Calico Patch on Back/Side (Ginger) */}
            <path
              d="M 112 108 Q 152 118 146 156 Q 118 166 112 108 Z"
              fill="url(#calicoGingerPatch)"
            />
            {/* Calico Patch on Lower Hip (Dark Espresso) */}
            <path
              d="M 68 122 Q 56 150 84 166 Q 90 144 68 122 Z"
              fill="url(#calicoDarkPatch)"
            />

            {/* Front Paws with Soft Pink Pads */}
            <ellipse cx="76" cy="174" rx="14" ry="11" fill="#ffffff" stroke="#fef3c7" strokeWidth="1.5" />
            <ellipse cx="124" cy="174" rx="14" ry="11" fill="#ffffff" stroke="#fef3c7" strokeWidth="1.5" />
            <ellipse cx="76" cy="176" rx="5" ry="3.5" fill="#fbcfe8" opacity="0.6" />
            <ellipse cx="124" cy="176" rx="5" ry="3.5" fill="#fbcfe8" opacity="0.6" />

            {/* Head with Plump Cheeks */}
            <ellipse cx="100" cy="84" rx="48" ry="42" fill="url(#calicoCreamBody)" stroke="#fde68a" strokeWidth="2" />

            {/* Cheek Fur Fluff Tufts */}
            <path d="M 52 86 L 38 90 L 52 98 Z" fill="#ffffff" />
            <path d="M 148 86 L 162 90 L 148 98 Z" fill="#ffffff" />

            {/* Left Facial Patch (Ginger) */}
            <path
              d="M 58 62 Q 52 92 84 92 Q 74 58 58 62 Z"
              fill="url(#calicoGingerPatch)"
            />
            {/* Right Facial Patch (Dark Chocolate) */}
            <path
              d="M 142 62 Q 148 94 116 92 Q 128 56 142 62 Z"
              fill="url(#calicoDarkPatch)"
            />

            {/* Left Ear */}
            <polygon points="62,60 44,20 82,42" fill="url(#calicoGingerPatch)" stroke="#9a3412" strokeWidth="1.5" />
            <polygon points="60,54 50,28 76,42" fill="#fbcfe8" />
            {/* Right Ear */}
            <polygon points="138,60 156,20 118,42" fill="url(#calicoDarkPatch)" stroke="#1c1917" strokeWidth="1.5" />
            <polygon points="140,54 150,28 124,42" fill="#fbcfe8" />

            {/* Big Expressive Anime/Casual Game Eyes */}
            {isBlinking ? (
              /* Happy Closed Curved Eyes */
              <g>
                <path d="M 68 86 Q 80 94 92 86" stroke="#451a03" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 108 86 Q 120 94 132 86" stroke="#451a03" strokeWidth="4" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              /* Wide Glowing Eyes */
              <g>
                <ellipse cx="80" cy="84" rx="11" ry="13" fill="#292524" />
                <ellipse cx="120" cy="84" rx="11" ry="13" fill="#292524" />
                <ellipse cx="80" cy="84" rx="9" ry="11" fill={`url(#catIris_${cat.id})`} />
                <ellipse cx="120" cy="84" rx="9" ry="11" fill={`url(#catIris_${cat.id})`} />
                {/* Pupils */}
                <ellipse cx="80" cy="84" rx="4.5" ry="7.5" fill="#0f172a" />
                <ellipse cx="120" cy="84" rx="4.5" ry="7.5" fill="#0f172a" />
                {/* Multi-layered Eye Highlights */}
                <circle cx="76" cy="80" r="4" fill="#ffffff" />
                <circle cx="83" cy="89" r="2" fill="#ffffff" />
                <circle cx="116" cy="80" r="4" fill="#ffffff" />
                <circle cx="123" cy="89" r="2" fill="#ffffff" />
                {/* Secondary Star Catchlight */}
                <circle cx="78" cy="87" r="1.2" fill="#fef08a" />
                <circle cx="118" cy="87" r="1.2" fill="#fef08a" />
              </g>
            )}

            {/* Cute Pink Button Nose */}
            <polygon points="95,95 105,95 100,101" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
            {/* Sweet Smiling Mouth */}
            <path d="M 94 102 Q 100 107 100 102 Q 100 107 106 102" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

            {/* Whiskers */}
            <line x1="56" y1="96" x2="26" y2="92" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="56" y1="102" x2="24" y2="105" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="144" y1="96" x2="174" y2="92" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="144" y1="102" x2="176" y2="105" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <circle cx="66" cy="98" r="8" fill="#fb7185" opacity="0.35" />
            <circle cx="134" cy="98" r="8" fill="#fb7185" opacity="0.35" />
          </g>
        ) : (
          /* ======================================================== */
          /* BODACIOUS: The Majestic Maine Coon (Silver-Charcoal Fluff) */
          /* ======================================================== */
          <g className="animate-[pulse_4s_ease-in-out_infinite]">
            {/* Super Fluffy Bushy Maine Coon Plume Tail */}
            <g className="origin-bottom-left animate-[wiggle_3s_ease-in-out_infinite]">
              <path
                d="M 134 150 C 188 144, 212 92, 174 56 C 148 42, 138 84, 128 122 Z"
                fill="url(#maineCoonCoat)"
                stroke="#57534e"
                strokeWidth="1.5"
              />
              {/* Fur Plume Tufts */}
              <path d="M 180 72 Q 198 68 178 88" fill="#d6d3d1" />
              <path d="M 186 94 Q 204 90 182 110" fill="#d6d3d1" />
              <path d="M 176 116 Q 196 118 168 134" fill="#d6d3d1" />
            </g>

            {/* Plump Fluffy Body */}
            <ellipse cx="100" cy="142" rx="58" ry="46" fill="url(#maineCoonCoat)" stroke="#57534e" strokeWidth="1.5" />

            {/* Majestic Maine Coon Chest Mane & Ruff */}
            <path
              d="M 72 114 C 60 138, 80 170, 100 170 C 120 170, 140 138, 128 114 C 118 128, 82 128, 72 114 Z"
              fill="url(#maineCoonRuff)"
              stroke="#e7e5e4"
              strokeWidth="1.5"
            />

            {/* Furry Paws with Tufts */}
            <ellipse cx="74" cy="176" rx="16" ry="12" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" />
            <ellipse cx="126" cy="176" rx="16" ry="12" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" />

            {/* Head with Fluffy Lynx Cheeks */}
            <ellipse cx="100" cy="85" rx="50" ry="44" fill="url(#maineCoonCoat)" stroke="#57534e" strokeWidth="1.5" />

            {/* Cheek Fur Fluff Tufts */}
            <path d="M 50 86 L 32 94 L 48 104 Z" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1" />
            <path d="M 150 86 L 168 94 L 152 104 Z" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1" />

            {/* Signature Large Maine Coon Ears with Pointed Lynx Tip Tufts */}
            {/* Left Ear */}
            <polygon points="62,64 42,14 84,46" fill="#44403c" stroke="#292524" strokeWidth="1.5" />
            <polygon points="60,58 48,24 78,46" fill="#fbcfe8" />
            <path d="M 42 14 Q 36 2 46 8" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Right Ear */}
            <polygon points="138,64 158,14 116,46" fill="#44403c" stroke="#292524" strokeWidth="1.5" />
            <polygon points="140,58 152,24 122,46" fill="#fbcfe8" />
            <path d="M 158 14 Q 164 2 154 8" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Tabby Forehead 'M' Marking */}
            <path d="M 86 64 L 93 75 L 100 66 L 107 75 L 114 64" fill="none" stroke="#292524" strokeWidth="3" strokeLinecap="round" />

            {/* Eyes */}
            {isBlinking ? (
              <g>
                <path d="M 68 86 Q 80 94 92 86" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 108 86 Q 120 94 132 86" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              <g>
                <circle cx="80" cy="85" r="11" fill="url(#maineCoonIris)" stroke="#1c1917" strokeWidth="1.5" />
                <circle cx="120" cy="85" r="11" fill="url(#maineCoonIris)" stroke="#1c1917" strokeWidth="1.5" />
                {/* Slit Pupils */}
                <ellipse cx="80" cy="85" rx="4" ry="8" fill="#022c22" />
                <ellipse cx="120" cy="85" rx="4" ry="8" fill="#022c22" />
                {/* Double Highlights */}
                <circle cx="77" cy="81" r="4" fill="#ffffff" />
                <circle cx="84" cy="90" r="1.8" fill="#ffffff" />
                <circle cx="117" cy="81" r="4" fill="#ffffff" />
                <circle cx="124" cy="90" r="1.8" fill="#ffffff" />
              </g>
            )}

            {/* Nose & Mouth */}
            <polygon points="95,96 105,96 100,102" fill="#f43f5e" stroke="#be185d" strokeWidth="1" />
            <path d="M 94 103 Q 100 108 100 103 Q 100 108 106 103" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />

            {/* Long Proud Whiskers */}
            <line x1="54" y1="96" x2="20" y2="92" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <line x1="54" y1="103" x2="18" y2="106" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <line x1="146" y1="96" x2="180" y2="92" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <line x1="146" y1="103" x2="182" y2="106" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

            {/* Rosy Cheeks */}
            <circle cx="66" cy="98" r="8" fill="#fb7185" opacity="0.35" />
            <circle cx="134" cy="98" r="8" fill="#fb7185" opacity="0.35" />
          </g>
        )}

        {/* ======================================================== */}
        {/* High-Quality Costumes Layer */}
        {/* ======================================================== */}
        {cat.selectedCostume === 'royal_crown' && (
          <g id="costume_crown" className="animate-[bounce_2s_infinite]">
            <path d="M 80 46 L 85 24 L 94 36 L 100 18 L 106 36 L 115 24 L 120 46 Z" fill="url(#costumeGoldGrad)" stroke="#92400e" strokeWidth="2" />
            <circle cx="85" cy="24" r="3.5" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
            <circle cx="100" cy="18" r="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.8" />
            <circle cx="115" cy="24" r="3.5" fill="#10b981" stroke="#047857" strokeWidth="0.8" />
            <rect x="82" y="42" width="36" height="6" rx="2" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
            <circle cx="88" cy="45" r="1.5" fill="#ffffff" />
            <circle cx="100" cy="45" r="1.5" fill="#ffffff" />
            <circle cx="112" cy="45" r="1.5" fill="#ffffff" />
          </g>
        )}

        {cat.selectedCostume === 'witch_hat' && (
          <g id="costume_witch_hat">
            <ellipse cx="100" cy="48" rx="36" ry="11" fill="#312e81" stroke="#1e1b4b" strokeWidth="2.5" />
            <polygon points="74,46 100,8 126,46" fill="#4338ca" stroke="#312e81" strokeWidth="2" />
            <rect x="82" y="41" width="36" height="6" rx="2" fill="url(#costumeGoldGrad)" stroke="#92400e" strokeWidth="1" />
            <polygon points="100,38 102,42 106,44 102,46 100,50 98,46 94,44 98,42" fill="#ffffff" />
          </g>
        )}

        {cat.selectedCostume === 'gentleman_monocle' && (
          <g id="costume_monocle">
            <circle cx="120" cy="85" r="15" fill="#38bdf8" fillOpacity="0.25" stroke="url(#costumeGoldGrad)" strokeWidth="3" />
            <path d="M 135 85 Q 148 100 140 130" fill="none" stroke="url(#costumeGoldGrad)" strokeWidth="2.5" strokeDasharray="3,2" />
            <circle cx="140" cy="130" r="3.5" fill="#d97706" />
            <line x1="113" y1="77" x2="127" y2="93" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          </g>
        )}

        {cat.selectedCostume === 'red_bowtie' && (
          <g id="costume_bowtie" className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            <polygon points="84,110 100,117 84,124" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            <polygon points="116,110 100,117 116,124" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            <circle cx="100" cy="117" r="5.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
            <circle cx="98" cy="115" r="1.5" fill="#ffffff" opacity="0.8" />
          </g>
        )}

        {cat.selectedCostume === 'gold_sunglasses' && (
          <g id="costume_glasses" className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
            <rect x="66" y="76" width="28" height="17" rx="6" fill="#0f172a" stroke="url(#costumeGoldGrad)" strokeWidth="3" />
            <rect x="106" y="76" width="28" height="17" rx="6" fill="#0f172a" stroke="url(#costumeGoldGrad)" strokeWidth="3" />
            <line x1="94" y1="83" x2="106" y2="83" stroke="url(#costumeGoldGrad)" strokeWidth="3.5" />
            {/* Specular White Glare on Sunglasses Lenses */}
            <line x1="70" y1="80" x2="84" y2="90" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
            <line x1="110" y1="80" x2="124" y2="90" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          </g>
        )}

        {cat.selectedCostume === 'sailor_bib' && (
          <g id="costume_sailor">
            <path d="M 74 112 Q 100 140 126 112 L 120 134 Q 100 152 80 134 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            <path d="M 78 116 Q 100 136 122 116" fill="none" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="100" cy="128" r="4" fill="url(#costumeGoldGrad)" stroke="#b45309" strokeWidth="1" />
          </g>
        )}

        {cat.selectedCostume === 'hawaiian_lei' && (
          <g id="costume_lei">
            <circle cx="80" cy="116" r="6.5" fill="#f43f5e" />
            <circle cx="93" cy="125" r="6.5" fill="#f97316" />
            <circle cx="107" cy="125" r="6.5" fill="#eab308" />
            <circle cx="120" cy="116" r="6.5" fill="#ec4899" />
            <circle cx="80" cy="116" r="2.5" fill="#ffffff" />
            <circle cx="93" cy="125" r="2.5" fill="#ffffff" />
            <circle cx="107" cy="125" r="2.5" fill="#ffffff" />
            <circle cx="120" cy="116" r="2.5" fill="#ffffff" />
          </g>
        )}

        {cat.selectedCostume === 'fluffy_scarf' && (
          <g id="costume_scarf">
            <path d="M 70 110 Q 100 130 130 110 Q 100 136 70 110 Z" fill="#ec4899" stroke="#be185d" strokeWidth="2" />
            <path d="M 114 118 L 124 148 L 110 150 L 102 122 Z" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" />
            <line x1="110" y1="150" x2="124" y2="148" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3,2" />
          </g>
        )}
      </svg>
    </div>
  );
};
