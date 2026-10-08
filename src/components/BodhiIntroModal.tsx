import React from 'react';
import { sounds } from '../audio/soundManager';
import { BodhiLogo } from './BodhiLogo';
import { Play, Sparkles, Smartphone, Heart, Palette, ShieldCheck, X } from 'lucide-react';

interface BodhiIntroModalProps {
  onStart: () => void;
  onClose?: () => void;
  isInitialLaunch?: boolean;
}

export const BodhiIntroModal: React.FC<BodhiIntroModalProps> = ({
  onStart,
  onClose,
  isInitialLaunch = false
}) => {
  const handleStartGame = () => {
    sounds.playWin();
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-[fadeIn_0.3s]">
      <div className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-amber-950/90 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(245,158,11,0.25)] border-4 border-amber-400/90 flex flex-col overflow-hidden text-white my-auto">
        {/* Close Button if not initial launch */}
        {!isInitialLaunch && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-slate-800/80 hover:bg-slate-700 active:scale-95 rounded-full text-slate-300 hover:text-white transition-all border border-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-amber-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Bodhi Industries Showcase Header */}
        <div className="relative pt-6 pb-4 px-6 flex flex-col items-center justify-center text-center border-b border-amber-500/30">
          <div className="inline-block mb-3 px-3 py-1 bg-amber-500/10 border border-amber-400/30 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
            Interactive Presentation
          </div>

          <BodhiLogo size="lg" showSubtitle={true} />

          <div className="mt-3 text-xs tracking-[0.3em] uppercase text-amber-200/80 font-bold">
            Presents
          </div>

          <h1 className="mt-1 text-3xl sm:text-4xl font-black font-['Fredoka'] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-100 drop-shadow-md">
            Meow Match Sanctuary
          </h1>
          <div className="text-xs sm:text-sm font-bold text-amber-300 font-['Fredoka'] mt-0.5">
            Piper & Bodacious Edition
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Featured Stars: Piper & Bodacious */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-2xl border border-amber-500/20">
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-amber-950/40 border border-amber-600/30">
              <div className="text-3xl mb-1">🐱</div>
              <div className="font-black font-['Fredoka'] text-sm text-amber-300">Piper</div>
              <div className="text-[10px] text-amber-200 font-medium">Sweet Calico Mix</div>
            </div>

            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-indigo-950/40 border border-indigo-600/30">
              <div className="text-3xl mb-1">🦁</div>
              <div className="font-black font-['Fredoka'] text-sm text-indigo-300">Bodacious</div>
              <div className="text-[10px] text-indigo-200 font-medium">Majestic Maine Coon</div>
            </div>
          </div>

          {/* Highlights Checklist with Mobile-Friendly callout */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5 text-slate-200">
              <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <span><strong>Mobile-Optimized</strong>: Responsive dynamic tile scaling with touch-swipe and tap controls.</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-200">
              <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <span><strong>Infinite Fun</strong>: Unlimited free refills, stars, and boosters for seamless gameplay.</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-200">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                <Palette className="w-4 h-4" />
              </div>
              <span><strong>3-Way Customization</strong>: Gazebo, cat beds, fountains, flowerbeds, and custom wardrobe.</span>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-2">
            <button
              onClick={handleStartGame}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-amber-500 active:scale-95 text-amber-950 font-black font-['Fredoka'] rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)] border-2 border-white flex items-center justify-center gap-3 text-lg transition-all"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>ENTER SANCTUARY</span>
              <Sparkles className="w-5 h-5 text-amber-900" />
            </button>
          </div>
        </div>

        {/* Bodhi Industries Production Badge */}
        <div className="py-2.5 px-4 bg-slate-950 text-center border-t border-slate-800 flex items-center justify-between text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Bodhi Certified
          </span>
          <span>© 2026 Bodhi Industries</span>
        </div>
      </div>
    </div>
  );
};
