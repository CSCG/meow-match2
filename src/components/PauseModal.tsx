import React from 'react';
import { LevelConfig } from '../types';
import { sounds } from '../audio/soundManager';
import { BodhiLogo } from './BodhiLogo';
import { TileVisual } from './TileVisual';
import { Play, RotateCcw, Volume2, VolumeX, Home, Check, Sparkles } from 'lucide-react';

interface PauseModalProps {
  level: LevelConfig;
  movesLeft: number;
  objectives: { type: string; current: number; target: number; color?: string }[];
  soundEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  onToggleSound: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  level,
  movesLeft,
  objectives,
  soundEnabled,
  onResume,
  onRestart,
  onExit,
  onToggleSound
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-[fadeIn_0.2s]">
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl w-full max-w-sm shadow-2xl border-4 border-amber-400/80 flex flex-col overflow-hidden text-white">
        {/* Bodhi Industries Header Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/90 via-indigo-950 to-amber-950/90 border-b-2 border-amber-500/50 flex flex-col items-center justify-center text-center">
          <BodhiLogo size="md" showSubtitle={true} />
          <div className="mt-2 text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/40">
            Game Paused
          </div>
        </div>

        {/* Level Status & Objectives */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="bg-indigo-900/50 p-3 rounded-2xl border border-indigo-700/50 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300">Current Level</div>
              <div className="text-base font-black font-['Fredoka'] text-white">
                Level {level.id}: {level.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300">Moves Left</div>
              <div className="text-xl font-black font-['Fredoka'] text-amber-400">{movesLeft}</div>
            </div>
          </div>

          {/* Objectives Checklist */}
          <div>
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Mission Targets</span>
            </div>
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              {objectives.map((obj, idx) => {
                const isDone = obj.current >= obj.target;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs font-bold font-['Fredoka']">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {obj.type === 'color' && obj.color && (
                          <TileVisual tile={{ id: 'pause_obj', row: 0, col: 0, color: obj.color as any, powerUp: null }} size={22} />
                        )}
                        {obj.type === 'grass' && <span className="text-base">🌱</span>}
                        {obj.type === 'statues' && <span className="text-base">🐱</span>}
                        {obj.type === 'milk' && <span className="text-base">🥛</span>}
                      </div>
                      <span className="capitalize text-slate-200">
                        {obj.type === 'color'
                          ? obj.color === 'fish'
                            ? 'Cyan Fish'
                            : obj.color === 'mouse'
                            ? 'Pink Mice'
                            : obj.color === 'clover'
                            ? 'Lucky Clovers'
                            : obj.color === 'lemon'
                            ? 'Yellow Lemons'
                            : obj.color === 'bird'
                            ? 'Red Birds'
                            : 'Purple Yarn'
                          : obj.type === 'statues'
                          ? 'Cat statues'
                          : obj.type === 'grass'
                          ? 'Lawn grass'
                          : obj.type === 'milk'
                          ? 'Milk bottles'
                          : `${obj.type}`}
                      </span>
                    </div>

                    <div className={isDone ? 'text-emerald-400 flex items-center gap-1' : 'text-amber-300'}>
                      {isDone ? (
                        <>
                          <span>Completed</span>
                          <Check className="w-4 h-4 text-emerald-400" />
                        </>
                      ) : (
                        `${obj.current} / ${obj.target}`
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Resume Button */}
            <button
              onClick={() => {
                sounds.playPurr();
                onResume();
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 text-white font-black font-['Fredoka'] rounded-2xl shadow-lg border-2 border-emerald-300 flex items-center justify-center gap-2 text-base transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Resume Puzzle</span>
            </button>

            {/* Sound & Restart Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onToggleSound();
                }}
                className="py-2.5 bg-indigo-900/80 hover:bg-indigo-850 active:scale-95 text-indigo-100 font-bold font-['Fredoka'] rounded-2xl border border-indigo-700 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>{soundEnabled ? 'Audio: On' : 'Audio: Muted'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onRestart();
                }}
                className="py-2.5 bg-amber-900/60 hover:bg-amber-850 active:scale-95 text-amber-100 font-bold font-['Fredoka'] rounded-2xl border border-amber-600/70 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Restart</span>
              </button>
            </div>

            {/* Return to Sanctuary (Exit) */}
            <button
              onClick={() => {
                sounds.playClick();
                onExit();
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-bold font-['Fredoka'] rounded-2xl border border-slate-700 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Sanctuary</span>
            </button>
          </div>
        </div>

        {/* Bodhi Industries Footer Brand Stamp */}
        <div className="py-2 px-4 bg-slate-950 text-center border-t border-slate-800 text-[10px] text-amber-400/70 font-semibold tracking-wider uppercase">
          Bodhi Industries • Sanctuary Labs • Mobile Edition
        </div>
      </div>
    </div>
  );
};
