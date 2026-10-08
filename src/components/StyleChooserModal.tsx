import React, { useState } from 'react';
import { SanctuaryTask } from '../types';
import { sounds } from '../audio/soundManager';
import { X, Check, Sparkles, Palette } from 'lucide-react';

interface StyleChooserModalProps {
  task: SanctuaryTask;
  currentStyleIdx: number;
  onSelectStyle: (styleIdx: number) => void;
  onClose: () => void;
}

export const StyleChooserModal: React.FC<StyleChooserModalProps> = ({
  task,
  currentStyleIdx,
  onSelectStyle,
  onClose
}) => {
  const [selectedIdx, setSelectedIdx] = useState(currentStyleIdx);

  const handleApply = () => {
    sounds.playPurr();
    onSelectStyle(selectedIdx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s]">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl w-full max-w-md shadow-2xl border-4 border-amber-400 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-amber-800 text-white flex items-center justify-between border-b-2 border-amber-600">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-300" />
            <h3 className="text-lg font-black font-['Fredoka']">Customize {task.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-amber-700 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3-Way Style Options */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-amber-900 font-medium text-center mb-2">
            Pick your favorite design theme for Piper and Bodacious! You can change this anytime.
          </p>

          <div className="grid grid-cols-1 gap-3">
            {task.styles.map((st, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedIdx(idx);
                    sounds.playClick();
                  }}
                  className={`p-3.5 rounded-2xl border-3 cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 shadow-md scale-[1.02]'
                      : 'bg-white/80 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white"
                    style={{ backgroundColor: st.previewColor + '33' }}
                  >
                    {st.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-black text-amber-950 font-['Fredoka']">
                        {st.name}
                      </h4>
                      {isSelected && (
                        <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-800 mt-0.5 leading-snug">
                      {st.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3">
            <button
              onClick={handleApply}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-2xl shadow-lg border-2 border-emerald-300 font-['Fredoka'] text-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Apply Design</span>
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
