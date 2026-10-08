import React from 'react';
import { UserGameState } from '../types';
import { PRESET_LEVELS } from '../game/levels';
import { sounds } from '../audio/soundManager';
import { X, Play, Star, Lock, Sparkles, MapPin } from 'lucide-react';

interface LevelSelectModalProps {
  gameState: UserGameState;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  gameState,
  onSelectLevel,
  onClose
}) => {
  // Show up to highestUnlocked + 2
  const maxDisplay = Math.max(8, gameState.highestLevelUnlocked + 2);
  const levelsList = Array.from({ length: maxDisplay }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-[fadeIn_0.2s]">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl w-full max-w-lg shadow-2xl border-4 border-amber-400 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-amber-800 text-white flex items-center justify-between border-b-2 border-amber-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-300" />
            <h2 className="text-xl font-black font-['Fredoka']">Sanctuary Puzzle Levels</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-amber-700 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Level Path Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <p className="text-xs text-amber-900 font-medium text-center mb-2">
            Beat match-3 levels to earn stars and coins to restore Piper & Bodacious's dream haven!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {levelsList.map(lvlId => {
              const isUnlocked = lvlId <= gameState.highestLevelUnlocked;
              const isCurrent = lvlId === gameState.currentLevelId;
              const stars = gameState.levelStars[lvlId] || 0;
              const preset = PRESET_LEVELS.find(l => l.id === lvlId);
              const title = preset ? preset.name : `Expedition #${lvlId}`;

              return (
                <div
                  key={lvlId}
                  onClick={() => {
                    if (isUnlocked) {
                      sounds.playClick();
                      onSelectLevel(lvlId);
                    }
                  }}
                  className={`relative p-3.5 rounded-3xl border-3 flex flex-col items-center justify-between min-h-[115px] transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-b from-amber-200 to-amber-300 border-amber-500 shadow-xl ring-4 ring-amber-400/50 scale-105 cursor-pointer'
                      : isUnlocked
                      ? 'bg-white border-amber-300 shadow-md hover:bg-amber-50 cursor-pointer'
                      : 'bg-stone-200 border-stone-300 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Top: Level Number */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black font-['Fredoka'] text-amber-900">
                      LVL {lvlId}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Center: Play Icon or Lock */}
                  <div className="my-1 flex items-center justify-center">
                    {isUnlocked ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow border-2 border-emerald-300 group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-stone-400 text-stone-200 flex items-center justify-center shadow">
                        <Lock className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Bottom: Stars Earned */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map(starNum => (
                      <Star
                        key={starNum}
                        className={`w-3.5 h-3.5 ${
                          starNum <= stars
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
