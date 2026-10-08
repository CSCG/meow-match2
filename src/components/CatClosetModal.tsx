import React, { useState } from 'react';
import { Cat, UserGameState } from '../types';
import { COSTUMES, CostumeItem } from '../data/catsData';
import { CatVisual } from './CatVisual';
import { sounds } from '../audio/soundManager';
import { X, Heart, Sparkles, Check, Crown, Shirt, Coins } from 'lucide-react';

interface CatClosetModalProps {
  gameState: UserGameState;
  onSelectActiveCat: (catId: 'piper' | 'bodacious') => void;
  onEquipCostume: (catId: 'piper' | 'bodacious', costumeId: string) => void;
  onUnlockCostume: (catId: 'piper' | 'bodacious', costume: CostumeItem) => void;
  onPetCat: (catId: 'piper' | 'bodacious') => void;
  onClose: () => void;
}

export const CatClosetModal: React.FC<CatClosetModalProps> = ({
  gameState,
  onSelectActiveCat,
  onEquipCostume,
  onUnlockCostume,
  onPetCat,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'piper' | 'bodacious'>(gameState.activeCatId);
  const currentCat = gameState.cats[activeTab];

  const relevantCostumes = COSTUMES.filter(
    c => c.catId === activeTab || c.catId === 'both'
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-[fadeIn_0.2s]">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl w-full max-w-xl shadow-2xl border-4 border-amber-400 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-purple-800 text-white flex items-center justify-between border-b-2 border-purple-600">
          <div className="flex items-center gap-2">
            <Shirt className="w-6 h-6 text-purple-300" />
            <h2 className="text-xl font-black font-['Fredoka']">Cat Wardrobe & Sanctuary Pets</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-purple-950/70 px-3 py-1 rounded-full text-sm font-bold text-amber-300 border border-purple-600">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{gameState.coins}</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-purple-700 rounded-xl transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Piper vs. Bodacious */}
        <div className="flex bg-purple-900/40 p-2 gap-2 border-b border-purple-200">
          <button
            onClick={() => {
              setActiveTab('piper');
              sounds.playClick();
            }}
            className={`flex-1 py-2.5 rounded-2xl font-black font-['Fredoka'] text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
              activeTab === 'piper'
                ? 'bg-amber-500 text-amber-950 shadow-md border-2 border-white'
                : 'text-purple-950 hover:bg-purple-200/50'
            }`}
          >
            <span>🐱 Piper (Calico Mix)</span>
            {gameState.activeCatId === 'piper' && (
              <span className="text-[10px] bg-amber-950 text-amber-200 px-1.5 py-0.5 rounded-md uppercase">Active Companion</span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('bodacious');
              sounds.playClick();
            }}
            className={`flex-1 py-2.5 rounded-2xl font-black font-['Fredoka'] text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
              activeTab === 'bodacious'
                ? 'bg-stone-600 text-amber-100 shadow-md border-2 border-white'
                : 'text-purple-950 hover:bg-purple-200/50'
            }`}
          >
            <span>👑 Bodacious (Maine Coon)</span>
            {gameState.activeCatId === 'bodacious' && (
              <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-md uppercase">Active Companion</span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Cat Profile Card */}
          <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-purple-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-col items-center">
              <CatVisual
                cat={currentCat}
                size="lg"
                onTap={() => {
                  sounds.playPurr();
                  onPetCat(activeTab);
                }}
              />
              <button
                onClick={() => {
                  sounds.playPurr();
                  onPetCat(activeTab);
                }}
                className="mt-1 flex items-center gap-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1 rounded-full text-xs font-bold border border-rose-300 active:scale-95 transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Pet {currentCat.name}!</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-amber-950 font-['Fredoka']">
                    {currentCat.name}
                  </h3>
                  <div className="text-xs font-bold text-purple-700">
                    {currentCat.breed}
                  </div>
                </div>

                {gameState.activeCatId !== activeTab && (
                  <button
                    onClick={() => {
                      sounds.playPurr();
                      onSelectActiveCat(activeTab);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-2xl text-xs font-bold font-['Fredoka'] shadow border border-emerald-300 active:scale-95"
                  >
                    Set as Level Companion
                  </button>
                )}
              </div>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {currentCat.description}
              </p>

              {/* Happiness Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold text-rose-700 mb-1">
                  <span>Happiness Level</span>
                  <span>{currentCat.happiness}%</span>
                </div>
                <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden border border-rose-200">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
                    style={{ width: `${currentCat.happiness}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Costumes & Accessories Grid */}
          <div>
            <h4 className="text-sm font-black font-['Fredoka'] text-amber-950 uppercase mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Unlocked Costumes & Accessories</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {relevantCostumes.map(costume => {
                const isUnlocked = currentCat.unlockedCostumes.includes(costume.id);
                const isEquipped = currentCat.selectedCostume === costume.id;
                const canAfford = gameState.coins >= costume.cost;

                return (
                  <div
                    key={costume.id}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2.5 ${
                      isEquipped
                        ? 'bg-purple-100/90 border-purple-500 ring-2 ring-purple-400 shadow-md'
                        : isUnlocked
                        ? 'bg-white border-amber-200 hover:bg-amber-50'
                        : 'bg-stone-100 border-stone-200 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-xl shadow-inner border border-purple-200">
                        {costume.icon}
                      </div>
                      <div>
                        <div className="text-xs font-black text-amber-950 font-['Fredoka']">
                          {costume.name}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          {costume.description}
                        </div>
                      </div>
                    </div>

                    {isEquipped ? (
                      <span className="text-xs font-bold text-purple-700 bg-purple-200/80 px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Equipped
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => {
                          sounds.playPurr();
                          onEquipCostume(activeTab, costume.id);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold px-3 py-1 rounded-xl text-xs active:scale-95 shadow font-['Fredoka']"
                      >
                        Wear
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          sounds.playWin();
                          onUnlockCostume(activeTab, costume);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold font-['Fredoka'] flex items-center gap-1 shadow active:scale-95 ${
                          canAfford
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3 h-3 text-yellow-300" />
                        <span>{costume.cost}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
