import React, { useState, useEffect } from 'react';
import { UserGameState, SanctuaryTask, LevelConfig } from './types';
import { INITIAL_CATS, CostumeItem } from './data/catsData';
import { getLevelConfig } from './game/levels';
import { sounds } from './audio/soundManager';
import { SanctuaryView } from './components/SanctuaryView';
import { PuzzleBoard } from './components/PuzzleBoard';
import { TaskListModal } from './components/TaskListModal';
import { StyleChooserModal } from './components/StyleChooserModal';
import { CatClosetModal } from './components/CatClosetModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { BodhiIntroModal } from './components/BodhiIntroModal';

const STORAGE_KEY = 'meow_match_save_v1';

const DEFAULT_STATE: UserGameState = {
  stars: 3, // Starting bonus so player can immediately restore first sanctuary tasks!
  coins: 1000,
  lives: 5,
  maxLives: 5,
  lastLifeRechargeTime: Date.now(),
  currentLevelId: 1,
  highestLevelUnlocked: 1,
  levelStars: {},
  tasksCompleted: [],
  furnitureStyles: {},
  boosters: {
    hammer: 4,
    glove: 4,
    startingBomb: 2,
    startingYarn: 2,
    startingPaw: 2
  },
  activeCatId: 'piper',
  cats: INITIAL_CATS,
  soundEnabled: true
};

export default function App() {
  const [gameState, setGameState] = useState<UserGameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          cats: {
            piper: { ...DEFAULT_STATE.cats.piper, ...(parsed.cats?.piper || {}) },
            bodacious: { ...DEFAULT_STATE.cats.bodacious, ...(parsed.cats?.bodacious || {}) }
          }
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_STATE;
  });

  // Current view: 'sanctuary' | 'puzzle'
  const [currentView, setCurrentView] = useState<'sanctuary' | 'puzzle'>('sanctuary');
  const [activeLevelConfig, setActiveLevelConfig] = useState<LevelConfig | null>(null);

  // Modals state
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showClosetModal, setShowClosetModal] = useState(false);
  const [showLevelSelectModal, setShowLevelSelectModal] = useState(false);
  const [activeStyleTask, setActiveStyleTask] = useState<SanctuaryTask | null>(null);
  const [showIntroModal, setShowIntroModal] = useState(() => {
    try {
      return !sessionStorage.getItem('bodhi_intro_seen');
    } catch {
      return true;
    }
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch {
      // ignore
    }
  }, [gameState]);

  // Sync sound manager
  useEffect(() => {
    sounds.enabled = gameState.soundEnabled;
  }, [gameState.soundEnabled]);

  // Passive life regeneration: +1 life every 15 minutes (900,000ms) up to maxLives
  useEffect(() => {
    const RECHARGE_INTERVAL_MS = 15 * 60 * 1000;
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.lives >= prev.maxLives) {
          return { ...prev, lastLifeRechargeTime: Date.now() };
        }
        const now = Date.now();
        const elapsed = now - prev.lastLifeRechargeTime;
        if (elapsed >= RECHARGE_INTERVAL_MS) {
          const livesToAdd = Math.min(
            prev.maxLives - prev.lives,
            Math.floor(elapsed / RECHARGE_INTERVAL_MS)
          );
          if (livesToAdd > 0) {
            return {
              ...prev,
              lives: prev.lives + livesToAdd,
              lastLifeRechargeTime: now
            };
          }
        }
        return prev;
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Start a puzzle level
  const handlePlayLevel = (levelId = gameState.currentLevelId) => {
    if (gameState.lives <= 0) {
      // Auto refill for seamless girlfriend fun!
      handleInstantRefill();
    }

    setGameState(prev => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1),
      currentLevelId: levelId
    }));

    const config = getLevelConfig(levelId);
    setActiveLevelConfig(config);
    setCurrentView('puzzle');
    sounds.playPurr();
  };

  // Handle puzzle win
  const handlePuzzleWin = (starsEarned: number, coinsEarned: number) => {
    if (!activeLevelConfig) return;

    setGameState(prev => {
      const levelId = activeLevelConfig.id;
      const prevStars = prev.levelStars[levelId] || 0;
      const nextHighest = Math.max(prev.highestLevelUnlocked, levelId + 1);

      return {
        ...prev,
        stars: prev.stars + starsEarned,
        coins: prev.coins + coinsEarned,
        highestLevelUnlocked: nextHighest,
        currentLevelId: levelId + 1,
        levelStars: {
          ...prev.levelStars,
          [levelId]: Math.max(prevStars, starsEarned)
        }
      };
    });

    setCurrentView('sanctuary');
    setActiveLevelConfig(null);
  };

  // Exit puzzle back to sanctuary
  const handleExitPuzzle = () => {
    setCurrentView('sanctuary');
    setActiveLevelConfig(null);
    sounds.playClick();
  };

  // Use booster tool
  const handleUseBooster = (type: 'hammer' | 'glove'): boolean => {
    if (gameState.boosters[type] > 0) {
      setGameState(prev => ({
        ...prev,
        boosters: {
          ...prev.boosters,
          [type]: prev.boosters[type] - 1
        }
      }));
      return true;
    } else if (gameState.coins >= 100) {
      // Auto buy booster with coins
      setGameState(prev => ({
        ...prev,
        coins: prev.coins - 100
      }));
      return true;
    }
    return false;
  };

  // Complete a Sanctuary Task with Stars
  const handleCompleteTask = (task: SanctuaryTask) => {
    if (gameState.stars < task.costStars) return;

    setGameState(prev => ({
      ...prev,
      stars: prev.stars - task.costStars,
      tasksCompleted: [...prev.tasksCompleted, task.id],
      furnitureStyles: {
        ...prev.furnitureStyles,
        [task.furnitureKey]: prev.furnitureStyles[task.furnitureKey] ?? task.defaultStyle
      }
    }));

    // Open style chooser for the newly placed piece!
    setActiveStyleTask(task);
  };

  // Apply new 3-Way Style
  const handleSelectStyle = (styleIdx: number) => {
    if (!activeStyleTask) return;
    setGameState(prev => ({
      ...prev,
      furnitureStyles: {
        ...prev.furnitureStyles,
        [activeStyleTask.furnitureKey]: styleIdx
      }
    }));
  };

  // Select active companion cat
  const handleSelectActiveCat = (catId: 'piper' | 'bodacious') => {
    setGameState(prev => ({
      ...prev,
      activeCatId: catId
    }));
  };

  // Equip costume
  const handleEquipCostume = (catId: 'piper' | 'bodacious', costumeId: string) => {
    setGameState(prev => ({
      ...prev,
      cats: {
        ...prev.cats,
        [catId]: {
          ...prev.cats[catId],
          selectedCostume: costumeId
        }
      }
    }));
  };

  // Unlock costume with coins
  const handleUnlockCostume = (catId: 'piper' | 'bodacious', costume: CostumeItem) => {
    if (gameState.coins < costume.cost) return;

    setGameState(prev => ({
      ...prev,
      coins: prev.coins - costume.cost,
      cats: {
        ...prev.cats,
        [catId]: {
          ...prev.cats[catId],
          selectedCostume: costume.id,
          unlockedCostumes: [...prev.cats[catId].unlockedCostumes, costume.id],
          happiness: Math.min(100, prev.cats[catId].happiness + 10)
        }
      }
    }));
  };

  // Pet cat
  const handlePetCat = (catId: 'piper' | 'bodacious') => {
    setGameState(prev => ({
      ...prev,
      cats: {
        ...prev.cats,
        [catId]: {
          ...prev.cats[catId],
          happiness: Math.min(100, prev.cats[catId].happiness + 5)
        }
      }
    }));
  };

  // Instant Refill (So the user's girlfriend never goes bankrupt or gets stuck!)
  const handleInstantRefill = () => {
    sounds.playWin();
    setGameState(prev => ({
      ...prev,
      lives: prev.maxLives,
      coins: prev.coins + 500,
      boosters: {
        hammer: prev.boosters.hammer + 2,
        glove: prev.boosters.glove + 2,
        startingBomb: prev.boosters.startingBomb + 1,
        startingYarn: prev.boosters.startingYarn + 1,
        startingPaw: prev.boosters.startingPaw + 1
      }
    }));
  };

  const handleToggleSound = () => {
    setGameState(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col bg-slate-900 font-['Quicksand',sans-serif]">
      {currentView === 'sanctuary' ? (
        <SanctuaryView
          gameState={gameState}
          onPlayLevel={() => handlePlayLevel()}
          onOpenTasks={() => setShowTasksModal(true)}
          onOpenCloset={() => setShowClosetModal(true)}
          onOpenStyleChooser={task => setActiveStyleTask(task)}
          onOpenLevelSelect={() => setShowLevelSelectModal(true)}
          onToggleSound={handleToggleSound}
          onInstantRefill={handleInstantRefill}
          onOpenBodhiIntro={() => setShowIntroModal(true)}
        />
      ) : activeLevelConfig ? (
        <PuzzleBoard
          level={activeLevelConfig}
          gameState={gameState}
          onWin={handlePuzzleWin}
          onExit={handleExitPuzzle}
          onUseBooster={handleUseBooster}
        />
      ) : null}

      {/* Task List Modal */}
      {showTasksModal && (
        <TaskListModal
          completedTaskIds={gameState.tasksCompleted}
          userStars={gameState.stars}
          onCompleteTask={handleCompleteTask}
          onClose={() => setShowTasksModal(false)}
        />
      )}

      {/* 3-Way Style Chooser Modal */}
      {activeStyleTask && (
        <StyleChooserModal
          task={activeStyleTask}
          currentStyleIdx={gameState.furnitureStyles[activeStyleTask.furnitureKey] ?? activeStyleTask.defaultStyle}
          onSelectStyle={handleSelectStyle}
          onClose={() => setActiveStyleTask(null)}
        />
      )}

      {/* Cat Closet & Wardrobe Modal */}
      {showClosetModal && (
        <CatClosetModal
          gameState={gameState}
          onSelectActiveCat={handleSelectActiveCat}
          onEquipCostume={handleEquipCostume}
          onUnlockCostume={handleUnlockCostume}
          onPetCat={handlePetCat}
          onClose={() => setShowClosetModal(false)}
        />
      )}

      {/* Level Select Modal */}
      {showLevelSelectModal && (
        <LevelSelectModal
          gameState={gameState}
          onSelectLevel={lvlId => {
            setShowLevelSelectModal(false);
            handlePlayLevel(lvlId);
          }}
          onClose={() => setShowLevelSelectModal(false)}
        />
      )}

      {/* Bodhi Industries Presentation Intro Modal */}
      {showIntroModal && (
        <BodhiIntroModal
          onStart={() => {
            try {
              sessionStorage.setItem('bodhi_intro_seen', 'true');
            } catch {
              // ignore
            }
            setShowIntroModal(false);
          }}
          onClose={() => {
            try {
              sessionStorage.setItem('bodhi_intro_seen', 'true');
            } catch {
              // ignore
            }
            setShowIntroModal(false);
          }}
        />
      )}
    </main>
  );
}
