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
import sanctuaryBgImg from '../assets/images/meow_sanctuary_bg_1791448366161.jpg';

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

      {/* Sanctuary Garden & Deck Scenery with 3D Casual Game Backdrop */}
      <div className="relative flex-1 w-full max-w-6xl mx-auto overflow-hidden">
        {/* Background Image */}
        <img
          src={sanctuaryBgImg}
          alt="Sanctuary Garden Background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-95 saturate-110"
        />

        {/* Ambient Sunbeams & Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-emerald-950/25 pointer-events-none" />
        <div className="absolute -top-10 left-1/3 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none animate-sunbeam" />

        {/* Customized Ground Accents when clean_lawn is customized */}
        {isBuilt('clean_lawn') && (
          <div className="absolute inset-0 pointer-events-none">
            {getStyleIdx('clean_lawn') === 1 && (
              <div className="absolute bottom-16 left-0 right-0 flex justify-around opacity-70 text-lg">
                <span className="animate-pulse">🌼</span>
                <span>☘️</span>
                <span className="animate-pulse">🌸</span>
                <span>☘️</span>
                <span className="animate-pulse">🌼</span>
              </div>
            )}
            {getStyleIdx('clean_lawn') === 2 && (
              <div className="absolute bottom-16 left-0 right-0 flex justify-around opacity-70 text-lg">
                <span className="animate-pulse">🌿</span>
                <span>🍀</span>
                <span className="animate-pulse">🌻</span>
                <span>🍀</span>
                <span className="animate-pulse">🌿</span>
              </div>
            )}
          </div>
        )}

        {/* RESTORED FURNITURE & OBJECTS (Interactive 3-way customizable nodes) */}

        {/* 0. Clean Lawn / Grounds Style Node */}
        {!isBuilt('clean_lawn') && (
          <UnbuiltMarker taskKey="clean_lawn" onOpenTasks={onOpenTasks} left="32%" top="58%" label="Tidy Lawn Grounds" />
        )}

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
        {isBuilt('fence') ? (
          <div
            onClick={() => {
              const task = SANCTUARY_TASKS.find(t => t.furnitureKey === 'fence');
              if (task) onOpenStyleChooser(task);
            }}
            className="absolute top-40 left-4 right-4 h-12 flex justify-between cursor-pointer group z-0 transition-opacity hover:opacity-100 opacity-90"
            title="Fence - Click to change style"
          >
            <FenceVisual styleIdx={getStyleIdx('fence')} />
          </div>
        ) : (
          <UnbuiltMarker taskKey="fence" onOpenTasks={onOpenTasks} left="88%" top="32%" label="Build Fence" />
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
        {isBuilt('flowers') ? (
          <div
            onClick={() => {
              const task = SANCTUARY_TASKS.find(t => t.furnitureKey === 'flowers');
              if (task) onOpenStyleChooser(task);
            }}
            className="absolute bottom-24 left-4 sm:left-12 cursor-pointer group z-10 transition-transform hover:scale-105"
            title="Catnip Flowers - Click to change style"
          >
            <FlowersVisual styleIdx={getStyleIdx('flowers')} />
          </div>
        ) : (
          <UnbuiltMarker taskKey="flowers" onOpenTasks={onOpenTasks} left="14%" top="72%" label="Plant Flowers" />
        )}

        {/* 7. Sun Loungers (Poolside) */}
        {isBuilt('loungers') ? (
          <div
            onClick={() => {
              const task = SANCTUARY_TASKS.find(t => t.furnitureKey === 'loungers');
              if (task) onOpenStyleChooser(task);
            }}
            className="absolute top-32 right-1/4 cursor-pointer group z-10 transition-transform hover:scale-105"
            title="Sun Loungers - Click to change style"
          >
            <LoungersVisual styleIdx={getStyleIdx('loungers')} />
          </div>
        ) : (
          <UnbuiltMarker taskKey="loungers" onOpenTasks={onOpenTasks} left="72%" top="34%" label="Sun Loungers" />
        )}

        {/* 8. Feast Table (Bottom right) */}
        {isBuilt('feast_table') ? (
          <div
            onClick={() => {
              const task = SANCTUARY_TASKS.find(t => t.furnitureKey === 'feast_table');
              if (task) onOpenStyleChooser(task);
            }}
            className="absolute bottom-28 right-4 sm:right-16 cursor-pointer group z-10 transition-transform hover:scale-105"
            title="Tuna Banquet - Click to change style"
          >
            <FeastTableVisual styleIdx={getStyleIdx('feast_table')} />
          </div>
        ) : (
          <UnbuiltMarker taskKey="feast_table" onOpenTasks={onOpenTasks} left="84%" top="68%" label="Feast Table" />
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
  if (styleIdx === 1) {
    // Victorian Rose Pavilion
    return (
      <svg viewBox="0 0 200 140" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
        <defs>
          <linearGradient id="roseDomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdf2f8" />
            <stop offset="50%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <linearGradient id="marbleColumn" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        {/* Dome Roof */}
        <path d="M 20 46 Q 100 -5 180 46 Z" fill="url(#roseDomeGrad)" stroke="#be185d" strokeWidth="2.5" />
        <circle cx="100" cy="5" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        {/* Fluted Marble Columns */}
        <rect x="34" y="46" width="12" height="72" rx="2" fill="url(#marbleColumn)" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="74" y="46" width="12" height="72" rx="2" fill="url(#marbleColumn)" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="114" y="46" width="12" height="72" rx="2" fill="url(#marbleColumn)" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="154" y="46" width="12" height="72" rx="2" fill="url(#marbleColumn)" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Marble Plinth Base */}
        <rect x="20" y="116" width="160" height="16" rx="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
        {/* Climbing English Rose Vines */}
        <path d="M 38 116 Q 48 80 40 50" stroke="#16a34a" strokeWidth="3" fill="none" />
        <circle cx="42" cy="70" r="6" fill="#f43f5e" stroke="#9f1239" strokeWidth="1" />
        <circle cx="36" cy="90" r="5" fill="#fb7185" />
        <path d="M 158 116 Q 150 80 156 50" stroke="#16a34a" strokeWidth="3" fill="none" />
        <circle cx="154" cy="75" r="6" fill="#f43f5e" stroke="#9f1239" strokeWidth="1" />
        <circle cx="160" cy="95" r="5" fill="#fb7185" />
      </svg>
    );
  }

  if (styleIdx === 2) {
    // Modern Nordic Timber Deck
    return (
      <svg viewBox="0 0 200 140" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
        <defs>
          <linearGradient id="nordicWood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>
        {/* Architectural Beams */}
        <polygon points="18,34 182,30 182,42 18,46" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        <rect x="32" y="42" width="10" height="76" rx="2" fill="url(#nordicWood)" stroke="#78350f" strokeWidth="1.5" />
        <rect x="158" y="42" width="10" height="76" rx="2" fill="url(#nordicWood)" stroke="#78350f" strokeWidth="1.5" />
        {/* Slat Platform */}
        <rect x="16" y="116" width="168" height="18" rx="4" fill="url(#nordicWood)" stroke="#78350f" strokeWidth="2" />
        <line x1="20" y1="122" x2="180" y2="122" stroke="#451a03" strokeWidth="1" opacity="0.6" />
        {/* Clean Ivory Sailcloth Canopy */}
        <polygon points="24,34 100,12 176,30" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <polygon points="24,34 100,12 100,16 24,38" fill="#e2e8f0" />
      </svg>
    );
  }

  // Style 0: Tropical Thatched Tiki Pavilion
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
      <defs>
        <linearGradient id="bambooGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="thatchRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* Bamboo Posts */}
      <rect x="36" y="44" width="12" height="74" rx="4" fill="url(#bambooGrad)" stroke="#92400e" strokeWidth="1.8" />
      <rect x="76" y="44" width="10" height="74" rx="3" fill="url(#bambooGrad)" stroke="#92400e" strokeWidth="1.8" />
      <rect x="116" y="44" width="10" height="74" rx="3" fill="url(#bambooGrad)" stroke="#92400e" strokeWidth="1.8" />
      <rect x="152" y="44" width="12" height="74" rx="4" fill="url(#bambooGrad)" stroke="#92400e" strokeWidth="1.8" />
      {/* Bamboo Rings */}
      <line x1="36" y1="65" x2="48" y2="65" stroke="#92400e" strokeWidth="2" />
      <line x1="36" y1="90" x2="48" y2="90" stroke="#92400e" strokeWidth="2" />
      <line x1="152" y1="65" x2="164" y2="65" stroke="#92400e" strokeWidth="2" />
      <line x1="152" y1="90" x2="164" y2="90" stroke="#92400e" strokeWidth="2" />
      {/* Floor Deck */}
      <rect x="26" y="116" width="148" height="16" rx="4" fill="#92400e" stroke="#78350f" strokeWidth="2" />
      {/* Thatched Palm Roof */}
      <polygon points="100,6 194,54 6,54" fill="url(#thatchRoof)" stroke="#78350f" strokeWidth="2.5" />
      <path d="M 12 54 Q 30 64 48 54 Q 66 64 84 54 Q 102 64 120 54 Q 138 64 156 54 Q 174 64 192 54" fill="#d97706" />
    </svg>
  );
};

const CatTreeVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <svg viewBox="0 0 120 160" className="w-full h-full filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)]">
    <defs>
      <linearGradient id="sisalRope" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="50%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Base Platform */}
    <rect x="12" y="140" width="96" height="16" rx="6" fill={styleIdx === 1 ? '#0284c7' : '#92400e'} stroke="#451a03" strokeWidth="2" />
    {/* Main Sisal Post */}
    <rect x="52" y="24" width="16" height="118" fill="url(#sisalRope)" stroke="#b45309" strokeWidth="1.5" />
    {/* Sisal Grooves */}
    {[...Array(12)].map((_, i) => (
      <line key={i} x1="52" y1={30 + i * 9} x2="68" y2={30 + i * 9} stroke="#b45309" strokeWidth="1.2" opacity="0.6" />
    ))}
    {/* Mid Platform Left */}
    <rect x="16" y="94" width="48" height="14" rx="5" fill={styleIdx === 1 ? '#f472b6' : '#16a34a'} stroke="#14532d" strokeWidth="1.5" />
    {/* Mid Platform Right */}
    <rect x="56" y="56" width="52" height="14" rx="5" fill={styleIdx === 1 ? '#38bdf8' : '#16a34a'} stroke="#14532d" strokeWidth="1.5" />
    {/* Penthouse Bed */}
    <rect x="34" y="16" width="52" height="18" rx="8" fill={styleIdx === 1 ? '#ec4899' : '#22c55e'} stroke="#15803d" strokeWidth="2" />
    {/* Dangling Toy Mouse */}
    <line x1="28" y1="94" x2="28" y2="116" stroke="#78350f" strokeWidth="1.5" strokeDasharray="3,2" />
    <circle cx="28" cy="119" r="4.5" fill="#f43f5e" />
    <line x1="28" y1="123" x2="24" y2="128" stroke="#f43f5e" strokeWidth="1.2" />
  </svg>
);

const CatBedVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <svg viewBox="0 0 120 90" className="w-full h-full filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)]">
    <defs>
      <radialGradient id="bedVelvetGrad" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor={styleIdx === 0 ? '#c084fc' : styleIdx === 1 ? '#ffffff' : '#fde047'} />
        <stop offset="70%" stopColor={styleIdx === 0 ? '#9333ea' : styleIdx === 1 ? '#cbd5e1' : '#f59e0b'} />
        <stop offset="100%" stopColor={styleIdx === 0 ? '#6b21a8' : styleIdx === 1 ? '#94a3b8' : '#b45309'} />
      </radialGradient>
    </defs>
    {/* Outer Plush Donut Bolster */}
    <ellipse cx="60" cy="54" rx="52" ry="28" fill="url(#bedVelvetGrad)" stroke="#4c1d95" strokeWidth="2" />
    {/* Inner Tufted Cushion */}
    <ellipse cx="60" cy="50" rx="42" ry="20" fill={styleIdx === 0 ? '#e9d5ff' : styleIdx === 1 ? '#f8fafc' : '#fef08a'} />
    {/* Golden Royal Crown Crest Badge */}
    <path d="M 54 48 L 56 42 L 60 45 L 64 42 L 66 48 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
    <circle cx="60" cy="40" r="1.5" fill="#ef4444" />
  </svg>
);

const FountainVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.3)]">
    <defs>
      <radialGradient id="waterFlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="60%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </radialGradient>
    </defs>
    {/* Lower Tier Marble Basin */}
    <ellipse cx="50" cy="80" rx="46" ry="16" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    <ellipse cx="50" cy="78" rx="40" ry="12" fill="url(#waterFlow)" />
    {/* Center Pedestal */}
    <rect x="44" y="44" width="12" height="36" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
    {/* Upper Tier Marble Bowl */}
    <ellipse cx="50" cy="45" rx="28" ry="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    <ellipse cx="50" cy="44" rx="23" ry="8" fill="url(#waterFlow)" />
    {/* Bubbling Water Jets */}
    <path d="M 50 44 Q 38 24 32 46" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
    <path d="M 50 44 Q 62 24 68 46" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
    {/* Water Droplets Splash */}
    <circle cx="32" cy="46" r="2" fill="#ffffff" />
    <circle cx="68" cy="46" r="2" fill="#ffffff" />
    <circle cx="50" cy="22" r="2.5" fill="#ffffff" />
  </svg>
);

const FenceVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <div className="w-full flex items-center justify-around filter drop-shadow-md">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className={`w-3.5 h-11 rounded-t-lg transition-colors border ${
          styleIdx === 1
            ? 'bg-gradient-to-b from-amber-700 to-amber-900 border-amber-950'
            : styleIdx === 2
            ? 'bg-gradient-to-b from-slate-600 to-slate-800 border-slate-900'
            : 'bg-gradient-to-b from-white to-slate-200 border-slate-300'
        }`}
      />
    ))}
  </div>
);

const FlowersVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <div className="flex items-center gap-2 bg-emerald-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-500/50 shadow-lg text-2xl">
    <span className="animate-bounce">🦋</span>
    {styleIdx === 0 && <span>🪻🌸🪻🌸</span>}
    {styleIdx === 1 && <span>🌺🌴🌺🌴</span>}
    {styleIdx === 2 && <span>🌻🌼🌻🌼</span>}
  </div>
);

const LoungersVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <div className="flex items-center gap-3 bg-amber-950/60 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl border border-amber-500/50 shadow-lg text-2xl">
    <span className="drop-shadow">🏖️</span>
    <span className="drop-shadow animate-pulse">🍹</span>
    <span className="drop-shadow">🌴</span>
  </div>
);

const FeastTableVisual: React.FC<{ styleIdx: number }> = ({ styleIdx }) => (
  <div className="bg-gradient-to-r from-amber-950/90 to-amber-900/90 border-2 border-amber-400 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 text-2xl backdrop-blur-sm">
    <span className="drop-shadow">🍣</span>
    <span className="drop-shadow">🥛</span>
    <span className="drop-shadow">🐟</span>
    <span className="animate-spin text-lg text-yellow-300">✨</span>
  </div>
);
