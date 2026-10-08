import React, { useState, useEffect } from 'react';
import { UserGameState, SanctuaryTask } from '../types';
import { SANCTUARY_TASKS } from '../data/sanctuaryTasks';
import { CatVisual } from './CatVisual';
import { sounds } from '../audio/soundManager';
import {
  Heart,
  Star,
  Coins,
  Sparkles,
  Shirt,
  Play,
  ClipboardList,
  Volume2,
  VolumeX,
  Palette,
  Gift,
  Map,
  Download
} from 'lucide-react';
import { ExportModal } from './ExportModal';

interface SanctuaryViewProps {
  gameState: UserGameState;
  onPlayLevel: () => void;
  onOpenTasks: () => void;
  onOpenCloset: () => void;
  onOpenStyleChooser: (task: SanctuaryTask) => void;
  onOpenLevelSelect: () => void;
  onToggleSound: () => void;
  onInstantRefill: () => void;
  onOpenBodhiIntro?: () => void;
}

export const SanctuaryView: React.FC<SanctuaryViewProps> = ({
  gameState,
  onPlayLevel,
  onOpenTasks,
  onOpenCloset,
  onOpenStyleChooser,
  onOpenLevelSelect,
  onToggleSound,
  onInstantRefill,
  onOpenBodhiIntro
}) => {
  const [piperPos, setPiperPos] = useState({ x: 28, y: 55 });
  const [bodaciousPos, setBodaciousPos] = useState({ x: 65, y: 48 });
  const [dialogue, setDialogue] = useState<{ catId: 'piper' | 'bodacious'; text: string } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const completedSet = new Set(gameState.tasksCompleted);

  // Periodic cute roaming of cats between waypoints
  useEffect(() => {
    const waypoints = [
      { x: 25, y: 52 },
      { x: 38, y: 62 },
      { x: 50, y: 46 },
      { x: 68, y: 56 },
      { x: 78, y: 42 },
      { x: 42, y: 38 }
    ];

    const interval = setInterval(() => {
      const pW = waypoints[Math.floor(Math.random() * waypoints.length)];
      let bW = waypoints[Math.floor(Math.random() * waypoints.length)];
      while (bW === pW) {
        bW = waypoints[Math.floor(Math.random() * waypoints.length)];
      }
      setPiperPos(pW);
      setBodaciousPos(bW);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleCatTap = (catId: 'piper' | 'bodacious') => {
    const cat = gameState.cats[catId];
    sounds.playPurr();
    const randomQuote = cat.quotes[Math.floor(Math.random() * cat.quotes.length)];
    setDialogue({ catId, text: randomQuote });
    setTimeout(() => {
      setDialogue(null);
    }, 4500);
  };

  const isBuilt = (taskKey: string) => {
    const task = SANCTUARY_TASKS.find(t => t.furnitureKey === taskKey);
    return task ? completedSet.has(task.id) : false;
  };

  const getStyleIdx = (taskKey: string) => {
    return gameState.furnitureStyles[taskKey] ?? 0;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200">
      {/* Top HUD Bar */}
      <div className="relative z-30 w-full p-2 sm:p-4 flex items-center justify-between gap-1">
        {/* Left Stats: Lives, Stars, Coins */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          {/* Lives with Instant Refill */}
          <div
            onClick={onInstantRefill}
            className="flex items-center gap-1 sm:gap-1.5 bg-rose-500/90 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-lg border-2 border-rose-300 backdrop-blur-sm cursor-pointer hover:bg-rose-600 active:scale-95 transition-all"
            title="Click to refill lives!"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white animate-pulse" />
            <span className="font-['Fredoka'] font-bold text-xs sm:text-base">
              {gameState.lives}
            </span>
            <span className="hidden sm:inline text-[10px] bg-rose-700/80 px-1.5 py-0.5 rounded-md uppercase font-bold ml-0.5">
              MAX
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-400 text-amber-950 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-lg border-2 border-white backdrop-blur-sm">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-amber-600" />
            <span className="font-['Fredoka'] font-bold text-xs sm:text-base">
              {gameState.stars}
            </span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-500 text-amber-950 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-lg border-2 border-white backdrop-blur-sm">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-amber-900" />
            <span className="font-['Fredoka'] font-bold text-xs sm:text-base">
              {gameState.coins}
            </span>
          </div>
        </div>

        {/* Right Tools: Free Coin Bonus, Wardrobe, Export, Sound, Bodhi Intro */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bodhi Industries Branding & Intro Trigger */}
          {onOpenBodhiIntro && (
            <button
              onClick={onOpenBodhiIntro}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-950 to-slate-900 text-amber-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl font-bold font-['Fredoka'] text-xs sm:text-sm shadow-lg border-2 border-amber-400/80 hover:scale-105 active:scale-95 transition-all"
              title="Bodhi Industries"
            >
              <span className="text-sm">🐾</span>
              <span className="hidden sm:inline font-black tracking-wide">BODHI</span>
            </button>
          )}

          {/* Unlimited Fun Free Bonus */}
          <button
            onClick={onInstantRefill}
            className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-1.5 sm:px-3 sm:py-1.5 rounded-2xl font-bold font-['Fredoka'] text-xs sm:text-sm shadow-lg border-2 border-emerald-300 hover:scale-105 active:scale-95 transition-all"
            title="Free Refill & +500 Coins"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden lg:inline">Free Bonus</span>
          </button>

          {/* Wardrobe / Cat Closet */}
          <button
            onClick={onOpenCloset}
            className="p-1.5 sm:p-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-2xl shadow-lg border-2 border-purple-300 transition-all"
            title="Cat Wardrobe & Costumes"
          >
            <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Download HTML/JS Pack */}
          <button
            onClick={() => setShowExportModal(true)}
            className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl shadow-lg border-2 border-blue-300 transition-all flex items-center justify-center"
            title="Download Ready-to-Upload HTML/JS Pack"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 sm:p-2 bg-amber-800/80 hover:bg-amber-900 active:scale-95 text-amber-100 rounded-2xl shadow-lg border-2 border-amber-600 transition-all"
            title={gameState.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {gameState.soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Sanctuary Garden & Deck Scenery */}
      <div className="relative flex-1 w-full max-w-6xl mx-auto overflow-hidden">
        {/* Background Landscape: Sunny Pool, Ocean/Garden Horizon, Palm Trees */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-400">
          {/* Distant Sunny Sea / Horizon */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-sky-400 via-teal-300 to-sky-100 opacity-80" />

          {/* Sunbeams */}
          <div className="absolute -top-10 left-1/4 w-80 h-80 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none" />

          {/* Pool & Sun Deck Patio */}
          <div className="absolute top-28 left-0 right-0 h-44 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 opacity-60 rounded-[40px] mx-8 border-4 border-white/60 shadow-inner" />

          {/* Lush Green Lawn Ground */}
          <div className="absolute top-44 left-0 right-0 bottom-0 bg-gradient-to-b from-emerald-500 to-green-700 rounded-t-[50px] shadow-2xl border-t-8 border-emerald-400">
            {/* Garden Stepping Stones */}
            <div className="absolute top-8 left-1/3 w-16 h-10 bg-stone-300/80 rounded-full rotate-6 shadow" />
            <div className="absolute top-16 left-1/2 w-20 h-12 bg-stone-300/80 rounded-full -rotate-12 shadow" />
            <div className="absolute top-24 left-2/3 w-18 h-10 bg-stone-300/80 rounded-full rotate-12 shadow" />
          </div>
        </div>

        {/* RESTORED FURNITURE & OBJECTS (Interactive 3-way customizable nodes) */}

        {/* 1. Gazebo / Pavilion (Top Center) */}
        {isBuilt('gazebo') ? (
          <div
            onClick={() => {
              const task = SANCTUARY_TASKS.find(t => t.furnitureKey === 'gazebo');
              if (task) onOpenStyleChooser(task);
            }}
            className="absolute top-12 left-1/2 -translate-x-1/2 w-56 sm:w-72 h-44 cursor-pointer group transition-transform hover:scale-105 z-10"
          >
            <GazeboVisual styleIdx={getStyleIdx('gazebo')} />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-amber-950 px-2.5 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1 border border-amber-300">
              <Palette className="w-3.5 h-3.5" />
              <span>Change Style</span>
            </div>
          </div>
        ) : (
          <UnbuiltMarker taskKey="gazebo" onOpenTasks={onOpenTasks} left="50%" top="22%" label="Build Gazebo" />
        )}

        {/* 2. Perimeter Fence (Lawn Edges) */}
        {isBuilt('fence') && (
          <div className="absolute top-40 left-4 right-4 h-12 flex justify-between pointer-events-none opacity-80 z-0">
            <FenceVisual styleIdx={getStyleIdx('fence')} />
          </div>
        )}

        {/* 3. Cat Tree / Scratching Post (Left Side) */}
        {isBuilt('scratching_post') ? (
          <div
            onClick={() => {
              const task = SANCTUARY_TASKS.find(t => t.furnitureKey === 'scratching_post');
              if (task) onOpenStyleChooser(task);
            }}
            className="absolute top-36 left-8 sm:left-16 w-32 sm:w-40 h-48 cursor-pointer group transition-transform hover:scale-105 z-10"
          >
            <CatTreeVisual styleIdx={getStyleIdx('scratching_post')} />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-amber-950 px-2.5 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1 border border-amber-300">
              <Palette className="w-3.5 h-3.5" />
              <span>Change Style</span>
            </div>
          </div>
        ) : (
          <UnbuiltMarker taskKey="scratching_post" onOpenTasks={onOpenTasks} left="18%" top="42%" label="Piper's Cat Tree" />
        )}

        {/* 4. Royal Cat Bed (Right Side) */}
        {isBuilt('cat_bed') ? (
          <div
            onClick={() => {
              const task = SANCTUARY_TASKS.find(t => t.furnitureKey === 'cat_bed');
              if (task) onOpenStyleChooser(task);
            }}
            className="absolute top-48 right-8 sm:right-16 w-32 sm:w-36 h-28 cursor-pointer group transition-transform hover:scale-105 z-10"
          >
            <CatBedVisual styleIdx={getStyleIdx('cat_bed')} />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-amber-950 px-2.5 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1 border border-amber-300">
              <Palette className="w-3.5 h-3.5" />
              <span>Change Style</span>
            </div>
          </div>
        ) : (
          <UnbuiltMarker taskKey="cat_bed" onOpenTasks={onOpenTasks} left="82%" top="52%" label="Bodacious's Bed" />
        )}

        {/* 5. Drinking Fountain (Center Lawn) */}
        {isBuilt('fountain') ? (
          <div
            onClick={() => {
              const task = SANCTUARY_TASKS.find(t => t.furnitureKey === 'fountain');
              if (task) onOpenStyleChooser(task);
            }}
            className="absolute top-64 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-36 cursor-pointer group transition-transform hover:scale-105 z-10"
          >
            <FountainVisual styleIdx={getStyleIdx('fountain')} />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-amber-950 px-2.5 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1 border border-amber-300">
              <Palette className="w-3.5 h-3.5" />
              <span>Change Style</span>
            </div>
          </div>
        ) : (
          <UnbuiltMarker taskKey="fountain" onOpenTasks={onOpenTasks} left="50%" top="68%" label="Water Fountain" />
        )}

        {/* 6. Flowerbeds & Catnip (Foreground edges) */}
        {isBuilt('flowers') && (
          <div className="absolute bottom-24 left-4 sm:left-12 pointer-events-none z-10">
            <FlowersVisual styleIdx={getStyleIdx('flowers')} />
          </div>
        )}

        {/* 7. Sun Loungers (Poolside) */}
        {isBuilt('loungers') && (
          <div className="absolute top-32 right-1/4 pointer-events-none z-10">
            <LoungersVisual styleIdx={getStyleIdx('loungers')} />
          </div>
        )}

        {/* 8. Feast Table (Bottom right) */}
        {isBuilt('feast_table') && (
          <div className="absolute bottom-28 right-4 sm:right-16 pointer-events-none z-10">
            <FeastTableVisual styleIdx={getStyleIdx('feast_table')} />
          </div>
        )}

        {/* PIPER (Calico Mix) Roaming Avatar */}
        <div
          className="absolute z-20 transition-all duration-1000 ease-in-out"
          style={{ left: `${piperPos.x}%`, top: `${piperPos.y}%` }}
        >
          <CatVisual
            cat={gameState.cats['piper']}
            size="md"
            showDialogue={dialogue?.catId === 'piper' ? dialogue.text : null}
            onTap={() => handleCatTap('piper')}
          />
        </div>

        {/* BODACIOUS (Maine Coon) Roaming Avatar */}
        <div
          className="absolute z-20 transition-all duration-1000 ease-in-out"
          style={{ left: `${bodaciousPos.x}%`, top: `${bodaciousPos.y}%` }}
        >
          <CatVisual
            cat={gameState.cats['bodacious']}
            size="md"
            showDialogue={dialogue?.catId === 'bodacious' ? dialogue.text : null}
            onTap={() => handleCatTap('bodacious')}
          />
        </div>
      </div>

      {/* Bottom Main Navigation Bar */}
      <div className="relative z-30 w-full p-2 sm:p-4 bg-gradient-to-t from-emerald-950 via-emerald-900/90 to-transparent flex items-center justify-between max-w-4xl mx-auto gap-2">
        {/* Sanctuary Tasks Button (Linear meta progression) */}
        <button
          onClick={onOpenTasks}
          className="relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-amber-300 active:scale-95 transition-all font-['Fredoka'] text-xs sm:text-base"
        >
          <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-amber-900 shrink-0" />
          <span className="hidden sm:inline">Restoration Tasks</span>
          <span className="sm:hidden">Tasks</span>
          {/* Notification Dot if stars available */}
          {gameState.stars > 0 && (
            <span className="w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-bounce shrink-0">
              !
            </span>
          )}
        </button>

        {/* Level Controls: Map + Big PLAY Button */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={onOpenLevelSelect}
            className="p-2.5 sm:p-3.5 bg-amber-700 hover:bg-amber-600 active:scale-95 text-white rounded-2xl sm:rounded-3xl shadow-xl border-2 border-amber-400 transition-all font-['Fredoka'] flex items-center gap-1"
            title="Level Map & Expeditions"
          >
            <Map className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200" />
            <span className="hidden sm:inline font-bold text-sm">Map</span>
          </button>

          {/* Big PLAY Button */}
          <button
            onClick={onPlayLevel}
            className="relative group flex items-center gap-2 sm:gap-3 bg-gradient-to-b from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-black px-4 sm:px-10 py-2.5 sm:py-4 rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-white active:scale-95 transition-all font-['Fredoka'] text-base sm:text-2xl"
          >
            <Play className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />
            <span className="hidden sm:inline">LEVEL {gameState.currentLevelId}</span>
            <span className="sm:hidden">PLAY {gameState.currentLevelId}</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-200 animate-spin" />
          </button>
        </div>
      </div>

      {/* Export Game Pack Modal */}
      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
};

// Unbuilt placeholder marker
const UnbuiltMarker: React.FC<{
  taskKey: string;
  left: string;
  top: string;
  label: string;
  onOpenTasks: () => void;
}> = ({ left, top, label, onOpenTasks }) => (
  <div
    onClick={onOpenTasks}
    style={{ left, top }}
    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group active:scale-95 transition-transform"
  >
    <div className="bg-amber-100/90 backdrop-blur-sm border-2 border-dashed border-amber-500 px-3 py-1.5 rounded-2xl shadow-md flex items-center gap-1.5 text-xs font-bold text-amber-900 group-hover:bg-amber-200">
      <Sparkles className="w-4 h-4 text-amber-500" />
      <span>{label}</span>
      <span className="bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full text-[10px]">★</span>
    </div>
  </div>
);

// Visual Components for the 3-Way Style Choices
const GazeboVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => {
  // 0: Tropical Tiki Thatch, 1: Victorian Rose Pavilion, 2: Modern Nordic Timber Deck
  if (styleIdx === 1) {
    // Victorian Rose Pavilion
    return (
      <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xl">
        <polygon points="100,10 180,45 20,45" fill="#fbcfe8" stroke="#f43f5e" strokeWidth="3" />
        <rect x="94" y="2" width="12" height="10" fill="#f43f5e" />
        <circle cx="100" cy="2" r="5" fill="#fb7185" />
        {/* Columns */}
        <rect x="35" y="45" width="10" height="75" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="75" y="45" width="10" height="75" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="115" y="45" width="10" height="75" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="155" y="45" width="10" height="75" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
        {/* Base */}
        <rect x="25" y="115" width="150" height="15" rx="4" fill="#ffffff" stroke="#f43f5e" strokeWidth="2" />
        {/* Climbing pink roses */}
        <circle cx="40" cy="65" r="5" fill="#f43f5e" />
        <circle cx="78" cy="85" r="5" fill="#f43f5e" />
        <circle cx="158" cy="70" r="5" fill="#f43f5e" />
      </svg>
    );
  }

  if (styleIdx === 2) {
    // Modern Nordic Timber Deck
    return (
      <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xl">
        <polygon points="20,35 180,30 180,42 20,47" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        <rect x="35" y="45" width="8" height="75" fill="#b45309" />
        <rect x="157" y="45" width="8" height="75" fill="#b45309" />
        <rect x="20" y="115" width="160" height="18" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="2" />
        {/* Canvas Roof */}
        <polygon points="25,35 100,15 175,30" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      </svg>
    );
  }

  // 0: Tropical Thatched Gazebo
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-xl">
      {/* Bamboo Poles */}
      <rect x="40" y="45" width="12" height="75" fill="#d97706" rx="3" stroke="#92400e" strokeWidth="2" />
      <rect x="80" y="45" width="10" height="75" fill="#d97706" rx="3" stroke="#92400e" strokeWidth="2" />
      <rect x="120" y="45" width="10" height="75" fill="#d97706" rx="3" stroke="#92400e" strokeWidth="2" />
      <rect x="150" y="45" width="12" height="75" fill="#d97706" rx="3" stroke="#92400e" strokeWidth="2" />
      {/* Floor Deck */}
      <rect x="30" y="115" width="140" height="16" rx="4" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      {/* Thatch Tiki Roof */}
      <polygon points="100,5 190,52 10,52" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
      <path d="M 20 52 Q 35 60 50 52 Q 65 60 80 52 Q 95 60 110 52 Q 125 60 140 52 Q 155 60 170 52 Q 185 60 190 52" fill="#d97706" />
    </svg>
  );
};

const CatTreeVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full drop-shadow-lg">
    {/* Base */}
    <rect x="15" y="140" width="90" height="14" rx="4" fill={styleIdx === 1 ? '#38bdf8' : '#b45309'} />
    {/* Scratching Pole */}
    <rect x="52" y="25" width="16" height="115" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
    {/* Platforms */}
    <rect x="20" y="95" width="45" height="12" rx="4" fill={styleIdx === 1 ? '#ec4899' : '#15803d'} />
    <rect x="55" y="55" width="50" height="12" rx="4" fill={styleIdx === 1 ? '#06b6d4' : '#15803d'} />
    {/* Top Crow's Nest Bed */}
    <rect x="35" y="20" width="50" height="16" rx="8" fill={styleIdx === 1 ? '#f472b6' : '#22c55e'} />
    {/* Hanging mouse toy */}
    <line x1="30" y1="95" x2="30" y2="115" stroke="#78350f" strokeWidth="1.5" />
    <circle cx="30" cy="118" r="4" fill="#ef4444" />
  </svg>
);

const CatBedVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <svg viewBox="0 0 120 90" className="w-full h-full drop-shadow-md">
    <ellipse cx="60" cy="55" rx="50" ry="26" fill={styleIdx === 0 ? '#7c3aed' : styleIdx === 1 ? '#e2e8f0' : '#f59e0b'} />
    <ellipse cx="60" cy="50" rx="40" ry="20" fill={styleIdx === 0 ? '#a78bfa' : styleIdx === 1 ? '#ffffff' : '#fef08a'} />
    <circle cx="60" cy="46" r="6" fill="#f43f5e" opacity="0.6" />
  </svg>
);

const FountainVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
    {/* Basin */}
    <ellipse cx="50" cy="80" rx="45" ry="16" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
    <ellipse cx="50" cy="78" rx="38" ry="12" fill="#38bdf8" />
    {/* Tier 2 */}
    <rect x="44" y="45" width="12" height="34" fill="#94a3b8" />
    <ellipse cx="50" cy="45" rx="26" ry="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
    <ellipse cx="50" cy="44" rx="22" ry="7" fill="#38bdf8" />
    {/* Water spout */}
    <path d="M 50 44 Q 40 25 35 45" fill="none" stroke="#67e8f9" strokeWidth="2.5" />
    <path d="M 50 44 Q 60 25 65 45" fill="none" stroke="#67e8f9" strokeWidth="2.5" />
  </svg>
);

const FenceVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <div className="w-full flex items-center justify-around">
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className={`w-4 h-10 rounded-t-lg shadow ${
          styleIdx === 1 ? 'bg-amber-800' : styleIdx === 2 ? 'bg-slate-700' : 'bg-white border border-slate-300'
        }`}
      />
    ))}
  </div>
);

const FlowersVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <div className="flex gap-2 text-2xl animate-pulse">
    {styleIdx === 0 ? '🪻🌱🪻🌱' : styleIdx === 1 ? '🌺🌴🌺🌴' : '🌻🌼🌻🌼'}
  </div>
);

const LoungersVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <div className="flex items-center gap-3 text-3xl">
    <span>🏖️</span>
    <span>🍹</span>
  </div>
);

const FeastTableVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <div className="bg-amber-100/90 border-2 border-amber-400 px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-2 text-xl">
    <span>🍣</span>
    <span>🥛</span>
    <span>🐟</span>
    <span>✨</span>
  </div>
);
