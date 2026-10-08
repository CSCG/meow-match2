import React, { useState } from 'react';
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
  action = 'idle',
  onTap,
  showDialogue
}) => {
  const [isTapped, setIsTapped] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePointerDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 300);

    // Spawn floating heart
    const newHeart = { id: Date.now(), x: (Math.random() - 0.5) * 40, y: -20 };
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
      className={`relative inline-block cursor-pointer select-none transition-transform active:scale-95 ${sizeDimensions}`}
      onClick={handlePointerDown}
    >
      {/* Speech Bubble Dialogue */}
      {showDialogue && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 min-w-[170px] max-w-[240px] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border-2 border-amber-300 text-xs font-bold text-amber-950 text-center animate-bounce pointer-events-none">
          {showDialogue}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-300" />
        </div>
      )}

      {/* Floating Hearts */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute text-xl pointer-events-none z-40 animate-ping"
          style={{
            left: `calc(50% + ${h.x}px)`,
            top: `${h.y}px`,
            animationDuration: '0.8s'
          }}
        >
          💖
        </div>
      ))}

      {/* Cat SVG Illustration */}
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full drop-shadow-md transition-all duration-300 ${isTapped ? 'scale-110' : ''}`}
      >
        <defs>
          <radialGradient id={`eyeGlow_${cat.id}`} cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
          </filter>
        </defs>

        {isPiper ? (
          /* PIPER: Calico Mix (Orange, Dark Brown/Black, Cream/White patches) */
          <g className="animate-[pulse_3s_ease-in-out_infinite]">
            {/* Fluffy Tail */}
            <path
              d="M 140 145 C 180 135, 195 90, 160 80 C 145 75, 140 95, 135 120 Z"
              fill="#ea580c"
              className="origin-bottom-left animate-[wiggle_2s_ease-in-out_infinite]"
            />
            <path
              d="M 160 80 C 175 85, 180 100, 165 110 Z"
              fill="#292524"
            />
            {/* Body */}
            <ellipse cx="100" cy="140" rx="52" ry="42" fill="#fffbeb" />
            {/* Calico Patch on Back/Side */}
            <path
              d="M 115 110 Q 150 120 145 155 Q 120 165 115 110 Z"
              fill="#ea580c"
            />
            <path
              d="M 70 125 Q 60 150 85 165 Q 90 145 70 125 Z"
              fill="#292524"
            />
            {/* Paws */}
            <ellipse cx="78" cy="172" rx="14" ry="10" fill="#ffffff" stroke="#fde68a" strokeWidth="1.5" />
            <ellipse cx="122" cy="172" rx="14" ry="10" fill="#ffffff" stroke="#fde68a" strokeWidth="1.5" />

            {/* Head */}
            <ellipse cx="100" cy="85" rx="46" ry="40" fill="#fffbeb" />

            {/* Calico Facial Patches */}
            {/* Left ginger patch */}
            <path
              d="M 60 65 Q 55 90 85 90 Q 75 60 60 65 Z"
              fill="#ea580c"
            />
            {/* Right dark patch */}
            <path
              d="M 140 65 Q 145 92 118 90 Q 128 58 140 65 Z"
              fill="#292524"
            />

            {/* Left Ear */}
            <path d="M 64 62 L 48 24 L 82 45 Z" fill="#ea580c" />
            <path d="M 62 56 L 52 30 L 76 46 Z" fill="#fbcfe8" />

            {/* Right Ear */}
            <path d="M 136 62 L 152 24 L 118 45 Z" fill="#292524" />
            <path d="M 138 56 L 148 30 L 124 46 Z" fill="#fbcfe8" />

            {/* Big Expressive Anime/Casual Game Eyes */}
            <ellipse cx="80" cy="84" rx="10" ry="12" fill="#1c1917" />
            <ellipse cx="120" cy="84" rx="10" ry="12" fill="#1c1917" />
            <circle cx="80" cy="84" r="8" fill="url(#eyeGlow_piper)" />
            <circle cx="120" cy="84" r="8" fill="url(#eyeGlow_piper)" />
            {/* Pupils */}
            <ellipse cx="80" cy="84" rx="4" ry="7" fill="#0f172a" />
            <ellipse cx="120" cy="84" rx="4" ry="7" fill="#0f172a" />
            {/* Highlights */}
            <circle cx="77" cy="80" r="3.5" fill="#ffffff" />
            <circle cx="83" cy="88" r="1.5" fill="#ffffff" />
            <circle cx="117" cy="80" r="3.5" fill="#ffffff" />
            <circle cx="123" cy="88" r="1.5" fill="#ffffff" />

            {/* Cute Pink Nose */}
            <polygon points="96,96 104,96 100,101" fill="#f472b6" />
            {/* Mouth */}
            <path d="M 94 102 Q 100 106 100 101 Q 100 106 106 102" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />

            {/* Whiskers */}
            <line x1="55" y1="95" x2="30" y2="92" stroke="#d6d3d1" strokeWidth="1.5" />
            <line x1="55" y1="100" x2="28" y2="103" stroke="#d6d3d1" strokeWidth="1.5" />
            <line x1="145" y1="95" x2="170" y2="92" stroke="#d6d3d1" strokeWidth="1.5" />
            <line x1="145" y1="100" x2="172" y2="103" stroke="#d6d3d1" strokeWidth="1.5" />

            {/* Cute Cheeks */}
            <circle cx="68" cy="98" r="7" fill="#f43f5e" opacity="0.25" />
            <circle cx="132" cy="98" r="7" fill="#f43f5e" opacity="0.25" />
          </g>
        ) : (
          /* BODACIOUS: Small Fluffy Maine Coon with lynx ear-tufts, bushy tail, tabby silver-grey/brown coat */
          <g className="animate-[pulse_3s_ease-in-out_infinite]">
            {/* Super Fluffy Bushy Maine Coon Tail */}
            <path
              d="M 135 150 C 185 145, 210 95, 175 60 C 150 45, 140 85, 130 120 Z"
              fill="#78716c"
            />
            {/* Tail Fluff Spikes */}
            <path d="M 180 75 Q 195 70 178 88" fill="#a8a29e" stroke="#57534e" strokeWidth="1" />
            <path d="M 185 95 Q 200 92 180 110" fill="#a8a29e" stroke="#57534e" strokeWidth="1" />
            <path d="M 175 115 Q 192 118 168 132" fill="#a8a29e" stroke="#57534e" strokeWidth="1" />

            {/* Fluffy Body */}
            <ellipse cx="100" cy="142" rx="55" ry="44" fill="#a8a29e" />
            {/* Maine Coon Cream/Silver Chest Fluff Mane */}
            <path
              d="M 75 118 C 65 140, 85 168, 100 168 C 115 168, 135 140, 125 118 C 115 130, 85 130, 75 118 Z"
              fill="#f5f5f4"
            />
            {/* Paws with soft fur tufts */}
            <ellipse cx="76" cy="174" rx="15" ry="11" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1.5" />
            <ellipse cx="124" cy="174" rx="15" ry="11" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1.5" />

            {/* Head with Fluffy Cheeks */}
            <path
              d="M 52 90 C 45 80, 52 65, 65 60 C 80 52, 120 52, 135 60 C 148 65, 155 80, 148 90 C 156 102, 145 115, 130 118 C 118 122, 82 122, 70 118 C 55 115, 44 102, 52 90 Z"
              fill="#78716c"
            />
            {/* Cheek Fluff Tufts */}
            <path d="M 50 88 L 36 94 L 52 102 Z" fill="#a8a29e" />
            <path d="M 150 88 L 164 94 L 148 102 Z" fill="#a8a29e" />

            {/* Maine Coon Signature Lynx-Tufted Large Ears! */}
            {/* Left Ear */}
            <path d="M 64 64 L 46 18 L 84 48 Z" fill="#57534e" />
            <path d="M 62 58 L 50 26 L 78 48 Z" fill="#fbcfe8" />
            {/* Ear Tip Lynx Tufts */}
            <path d="M 46 18 Q 42 6 49 10 Q 45 16 46 18" fill="#292524" stroke="#292524" strokeWidth="1.5" />

            {/* Right Ear */}
            <path d="M 136 64 L 154 18 L 116 48 Z" fill="#57534e" />
            <path d="M 138 58 L 150 26 L 122 48 Z" fill="#fbcfe8" />
            {/* Ear Tip Lynx Tufts */}
            <path d="M 154 18 Q 158 6 151 10 Q 155 16 154 18" fill="#292524" stroke="#292524" strokeWidth="1.5" />

            {/* Tabby Forehead 'M' Marking */}
            <path d="M 88 64 L 94 74 L 100 66 L 106 74 L 112 64" fill="none" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" />

            {/* Big Gorgeous Cat Eyes */}
            <circle cx="80" cy="85" r="9" fill="url(#eyeGlow_piper)" />
            <circle cx="120" cy="85" r="9" fill="url(#eyeGlow_piper)" />
            {/* Slit Pupils with depth */}
            <ellipse cx="80" cy="85" rx="4" ry="7.5" fill="#0f172a" />
            <ellipse cx="120" cy="85" rx="4" ry="7.5" fill="#0f172a" />
            {/* Highlights */}
            <circle cx="77" cy="81" r="3.5" fill="#ffffff" />
            <circle cx="83" cy="89" r="1.5" fill="#ffffff" />
            <circle cx="117" cy="81" r="3.5" fill="#ffffff" />
            <circle cx="123" cy="89" r="1.5" fill="#ffffff" />

            {/* Nose & Mouth */}
            <polygon points="96,96 104,96 100,101" fill="#f43f5e" />
            <path d="M 94 102 Q 100 106 100 101 Q 100 106 106 102" fill="none" stroke="#292524" strokeWidth="2" strokeLinecap="round" />

            {/* Long Proud Whiskers */}
            <line x1="55" y1="96" x2="24" y2="92" stroke="#e7e5e4" strokeWidth="1.8" />
            <line x1="55" y1="102" x2="22" y2="105" stroke="#e7e5e4" strokeWidth="1.8" />
            <line x1="145" y1="96" x2="176" y2="92" stroke="#e7e5e4" strokeWidth="1.8" />
            <line x1="145" y1="102" x2="178" y2="105" stroke="#e7e5e4" strokeWidth="1.8" />

            {/* Cheeks */}
            <circle cx="68" cy="98" r="7" fill="#fb7185" opacity="0.25" />
            <circle cx="132" cy="98" r="7" fill="#fb7185" opacity="0.25" />
          </g>
        )}

        {/* Costumes Layer */}
        {cat.selectedCostume === 'royal_crown' && (
          <g id="costume_crown" className="animate-bounce">
            <path d="M 82 46 L 86 26 L 94 38 L 100 22 L 106 38 L 114 26 L 118 46 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <circle cx="86" cy="26" r="3" fill="#ef4444" />
            <circle cx="100" cy="22" r="3.5" fill="#3b82f6" />
            <circle cx="114" cy="26" r="3" fill="#10b981" />
            <rect x="85" y="43" width="30" height="5" rx="2" fill="#f59e0b" />
          </g>
        )}

        {cat.selectedCostume === 'sailor_bib' && (
          <g id="costume_sailor">
            <path d="M 76 112 Q 100 136 124 112 L 118 132 Q 100 148 82 132 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <path d="M 80 115 Q 100 132 120 115" fill="none" stroke="#ffffff" strokeWidth="2" />
            <circle cx="100" cy="126" r="3.5" fill="#facc15" />
          </g>
        )}

        {cat.selectedCostume === 'hawaiian_lei' && (
          <g id="costume_lei">
            <circle cx="82" cy="116" r="6" fill="#f43f5e" />
            <circle cx="94" cy="124" r="6" fill="#f97316" />
            <circle cx="106" cy="124" r="6" fill="#eab308" />
            <circle cx="118" cy="116" r="6" fill="#ec4899" />
            <circle cx="82" cy="116" r="2.5" fill="#ffffff" />
            <circle cx="94" cy="124" r="2.5" fill="#ffffff" />
            <circle cx="106" cy="124" r="2.5" fill="#ffffff" />
            <circle cx="118" cy="116" r="2.5" fill="#ffffff" />
          </g>
        )}

        {cat.selectedCostume === 'red_bowtie' && (
          <g id="costume_bowtie">
            <polygon points="86,110 100,116 86,122" fill="#dc2626" />
            <polygon points="114,110 100,116 114,122" fill="#dc2626" />
            <circle cx="100" cy="116" r="4.5" fill="#b91c1c" />
          </g>
        )}

        {cat.selectedCostume === 'gold_sunglasses' && (
          <g id="costume_glasses">
            <rect x="68" y="78" width="26" height="15" rx="5" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
            <rect x="106" y="78" width="26" height="15" rx="5" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
            <line x1="94" y1="84" x2="106" y2="84" stroke="#f59e0b" strokeWidth="3" />
            {/* Lens Glare */}
            <line x1="72" y1="82" x2="84" y2="90" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="110" y1="82" x2="122" y2="90" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>
        )}

        {cat.selectedCostume === 'fluffy_scarf' && (
          <g id="costume_scarf">
            <path d="M 72 110 Q 100 128 128 110 Q 100 134 72 110 Z" fill="#f472b6" />
            <path d="M 112 118 L 122 144 L 110 146 L 102 122 Z" fill="#ec4899" />
            <line x1="110" y1="146" x2="122" y2="144" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2" />
          </g>
        )}

        {cat.selectedCostume === 'witch_hat' && (
          <g id="costume_witch_hat">
            <ellipse cx="100" cy="48" rx="34" ry="10" fill="#312e81" stroke="#1e1b4b" strokeWidth="2" />
            <polygon points="76,46 100,12 124,46" fill="#4338ca" stroke="#312e81" strokeWidth="2" />
            <rect x="84" y="42" width="32" height="5" rx="1.5" fill="#f59e0b" />
            <circle cx="100" cy="44.5" r="2.5" fill="#fef08a" />
          </g>
        )}

        {cat.selectedCostume === 'gentleman_monocle' && (
          <g id="costume_monocle">
            <circle cx="120" cy="85" r="14" fill="#38bdf8" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="2.5" />
            <path d="M 134 85 Q 146 100 138 128" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />
            <circle cx="138" cy="128" r="3" fill="#d97706" />
            <line x1="114" y1="78" x2="126" y2="92" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
};
