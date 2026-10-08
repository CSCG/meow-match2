import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Tile, LevelConfig, UserGameState, CatStatue, PowerUpType } from '../types';
import { TileVisual } from './TileVisual';
import { GrassOverlay, CatStatueVisual } from './BoardOverlays';
import { CatVisual } from './CatVisual';
import {
  initializeBoard,
  findMatches,
  isValidMove,
  resolvePowerUpSwap,
  applyGravityAndRefill,
  findHomingTargets,
  findPossibleMove
} from '../game/match3Engine';
import { sounds } from '../audio/soundManager';
import { Volume2, VolumeX, Pause, Hammer, Hand, RefreshCw, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { PauseModal } from './PauseModal';
import { BodhiLogo } from './BodhiLogo';
import puzzleBgImg from '../assets/images/meow_puzzle_bg_1791448344664.jpg';

interface PuzzleBoardProps {
  level: LevelConfig;
  gameState: UserGameState;
  onWin: (stars: number, coinsEarned: number) => void;
  onExit: () => void;
  onUseBooster: (boosterType: 'hammer' | 'glove') => boolean;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  level,
  gameState,
  onWin,
  onExit,
  onUseBooster
}) => {
  const [grid, setGrid] = useState<(Tile | null)[][]>(() => initializeBoard(level));
  const [grass, setGrass] = useState<number[][]>(() => JSON.parse(JSON.stringify(level.grass)));
  const [statues, setStatues] = useState<CatStatue[]>(() => JSON.parse(JSON.stringify(level.statues)));
  const [movesLeft, setMovesLeft] = useState(level.moves);
  const [score, setScore] = useState(0);
  const [objectives, setObjectives] = useState(level.objectives.map(o => ({ ...o })));

  const [selectedPos, setSelectedPos] = useState<{ row: number; col: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeBooster, setActiveBooster] = useState<'hammer' | 'glove' | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [comboText, setComboText] = useState<string | null>(null);
  const [catSpeech, setCatSpeech] = useState<string | null>("Let's match some fish!");
  const [screenShake, setScreenShake] = useState(false);
  const [showOutOfMovesModal, setShowOutOfMovesModal] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [hintTiles, setHintTiles] = useState<{ from: { row: number; col: number }; to: { row: number; col: number } } | null>(null);
  const [floatingScores, setFloatingScores] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const activeCat = gameState.cats[gameState.activeCatId];
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(gameState.soundEnabled);
  const [tileSize, setTileSize] = useState(46);

  // Dynamic responsive tile sizing for flawless mobile screens
  useEffect(() => {
    const updateTileSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const maxAvailableW = Math.min(w - 24, 480);
      const maxAvailableH = h - 210; // room for top and bottom bars

      const sizeW = Math.floor((maxAvailableW - (level.cols - 1) * 3 - 16) / level.cols);
      const sizeH = Math.floor((maxAvailableH - (level.rows - 1) * 3 - 16) / level.rows);

      const optimal = Math.min(sizeW, sizeH, 52);
      setTileSize(Math.max(36, optimal));
    };

    updateTileSize();
    window.addEventListener('resize', updateTileSize);
    return () => window.removeEventListener('resize', updateTileSize);
  }, [level.cols, level.rows]);

  // Touch gesture swipe handling for intuitive mobile play
  const touchStartRef = useRef<{ row: number; col: number; x: number; y: number } | null>(null);

  const handleTileTouchStart = (row: number, col: number, e: React.TouchEvent) => {
    if (isProcessing) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      row,
      col,
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const handleTileTouchEnd = (row: number, col: number, e: React.TouchEvent) => {
    if (!touchStartRef.current || isProcessing) return;
    const start = touchStartRef.current;
    touchStartRef.current = null;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) < 18) {
      const tile = grid[row]?.[col];
      if (tile) handleTileClick(tile);
      return;
    }

    let targetRow = start.row;
    let targetCol = start.col;

    if (absX > absY) {
      targetCol += deltaX > 0 ? 1 : -1;
    } else {
      targetRow += deltaY > 0 ? 1 : -1;
    }

    if (targetRow >= 0 && targetRow < level.rows && targetCol >= 0 && targetCol < level.cols) {
      const sourceTile = grid[start.row]?.[start.col];
      const targetTile = grid[targetRow]?.[targetCol];
      if (sourceTile && targetTile && level.layout[targetRow]?.[targetCol]) {
        setSelectedPos(null);
        trySwapTiles(start, { row: targetRow, col: targetCol });
      }
    }
  };

  const handleRestartLevel = () => {
    setShowPauseModal(false);
    setGrid(initializeBoard(level));
    setGrass(JSON.parse(JSON.stringify(level.grass)));
    setStatues(JSON.parse(JSON.stringify(level.statues)));
    setMovesLeft(level.moves);
    setScore(0);
    setObjectives(level.objectives.map(o => ({ ...o })));
    setSelectedPos(null);
    setIsProcessing(false);
    setIsVictory(false);
    setShowOutOfMovesModal(false);
    setCatSpeech("Fresh start! You've got this!");
  };

  // Sound enable hook
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Idle timer for intelligent hints and dead-board reshuffle detection
  useEffect(() => {
    setHintTiles(null);
    if (isProcessing || isVictory || showPauseModal || showOutOfMovesModal) return;

    // Check if there are valid moves available
    const possible = findPossibleMove(grid);
    if (!possible) {
      // Auto-shuffle board if no moves available
      setCatSpeech("No moves left! Shuffling board...");
      const timer = setTimeout(() => {
        setGrid(initializeBoard(level));
        sounds.playSwap();
      }, 800);
      return () => clearTimeout(timer);
    }

    // Set 4.5s idle hint
    const hintTimer = setTimeout(() => {
      setHintTiles(possible);
      setCatSpeech("Look closely! A match is waiting!");
    }, 4500);

    return () => clearTimeout(hintTimer);
  }, [grid, isProcessing, isVictory, showPauseModal, showOutOfMovesModal, level]);

  // Check victory condition
  useEffect(() => {
    if (isVictory) return;
    const allCompleted = objectives.every(o => o.current >= o.target);
    if (allCompleted) {
      handleVictorySequence();
    } else if (movesLeft <= 0 && !isProcessing) {
      setShowOutOfMovesModal(true);
    }
  }, [objectives, movesLeft, isProcessing]);

  // Handle victory sequence with leftover moves celebration!
  const handleVictorySequence = async () => {
    setIsVictory(true);
    setIsProcessing(true);
    sounds.playWin();

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setCatSpeech("PURR-FECT! You beat the level!");
    const bonusFromMoves = movesLeft * 150;
    const finalScore = score + bonusFromMoves;
    setScore(finalScore);

    // Calculate stars: 1 star guaranteed for beating level, 2-3 stars for good moves/score
    let starsEarned = 1;
    if (movesLeft >= 4) starsEarned = 2;
    if (movesLeft >= 8) starsEarned = 3;

    const coinsEarned = 100 + movesLeft * 10;

    setTimeout(() => {
      onWin(starsEarned, coinsEarned);
    }, 2500);
  };

  // Helper to update objective counters
  const trackObjectiveProgress = (type: string, color?: string, amount = 1) => {
    setObjectives(prev =>
      prev.map(obj => {
        if (obj.type === type) {
          if (type === 'color' && obj.color !== color) return obj;
          return { ...obj, current: Math.min(obj.target, obj.current + amount) };
        }
        return obj;
      })
    );
  };

  // Check for statues uncovered when grass is cleared
  const checkStatuesUncovered = (newGrass: number[][]) => {
    setStatues(prevStatues => {
      let updated = false;
      const next = prevStatues.map(st => {
        if (st.isCollected) return st;
        // Check if all grass in statue bounding box is 0
        let allZero = true;
        for (let r = st.startRow; r < st.startRow + st.height; r++) {
          for (let c = st.startCol; c < st.startCol + st.width; c++) {
            if (newGrass[r] && newGrass[r][c] > 0) {
              allZero = false;
              break;
            }
          }
        }
        if (allZero) {
          updated = true;
          trackObjectiveProgress('statues', undefined, 1);
          sounds.playPurr();
          return { ...st, isCollected: true };
        }
        return st;
      });
      return updated ? next : prevStatues;
    });
  };

  // Tile interaction handler
  const handleTileClick = async (tile: Tile) => {
    if (isProcessing || isVictory) return;

    // Active Booster: Hammer
    if (activeBooster === 'hammer') {
      if (onUseBooster('hammer')) {
        sounds.playBomb();
        setActiveBooster(null);
        await destroySingleTile(tile.row, tile.col);
      }
      return;
    }

    // Active Booster: Glove (free swap of 2 tiles)
    if (activeBooster === 'glove') {
      if (!selectedPos) {
        setSelectedPos({ row: tile.row, col: tile.col });
      } else {
        const p1 = selectedPos;
        const p2 = { row: tile.row, col: tile.col };
        setSelectedPos(null);
        setActiveBooster(null);
        if (onUseBooster('glove')) {
          await executeFreeSwap(p1, p2);
        }
      }
      return;
    }

    // Direct click on single powerup activates it immediately!
    if (tile.powerUp && !selectedPos) {
      await activateSinglePowerUp(tile.row, tile.col);
      return;
    }

    // Standard Match-3 selection
    if (!selectedPos) {
      setSelectedPos({ row: tile.row, col: tile.col });
      sounds.playClick();
    } else {
      const p1 = selectedPos;
      const p2 = { row: tile.row, col: tile.col };
      setSelectedPos(null);

      // Deselect if clicked same tile
      if (p1.row === p2.row && p1.col === p2.col) return;

      // Must be adjacent
      const dr = Math.abs(p1.row - p2.row);
      const dc = Math.abs(p1.col - p2.col);
      if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        await trySwapTiles(p1, p2);
      } else {
        // Pick new tile
        setSelectedPos(p2);
        sounds.playClick();
      }
    }
  };

  // Free swap via Cat Glove Booster
  const executeFreeSwap = async (p1: { row: number; col: number }, p2: { row: number; col: number }) => {
    sounds.playSwap();
    const nextGrid = grid.map(r => [...r]);
    const t1 = nextGrid[p1.row][p1.col];
    const t2 = nextGrid[p2.row][p2.col];
    if (!t1 || !t2) return;

    nextGrid[p1.row][p1.col] = { ...t2, row: p1.row, col: p1.col };
    nextGrid[p2.row][p2.col] = { ...t1, row: p2.row, col: p2.col };
    setGrid(nextGrid);

    await runCascades(nextGrid, grass, 0);
  };

  // Hammer tool destroys single tile & clears grass beneath
  const destroySingleTile = async (r: number, c: number) => {
    setIsProcessing(true);
    const nextGrid = grid.map(row => [...row]);
    const nextGrass = grass.map(row => [...row]);

    const target = nextGrid[r][c];
    if (target) {
      trackObjectiveProgress('color', target.color, 1);
      nextGrid[r][c] = null;
    }

    if (nextGrass[r][c] > 0) {
      nextGrass[r][c]--;
      trackObjectiveProgress('grass', undefined, 1);
      checkStatuesUncovered(nextGrass);
    }

    setGrid(nextGrid);
    setGrass(nextGrass);

    // Gravity & Cascade
    const { newGrid, milkCollected } = applyGravityAndRefill(nextGrid, level);
    if (milkCollected > 0) {
      trackObjectiveProgress('milk', undefined, milkCollected);
      sounds.playPurr();
    }
    setGrid(newGrid);

    await runCascades(newGrid, nextGrass, 0);
    setIsProcessing(false);
  };

  // Activate single powerup on click
  const activateSinglePowerUp = async (row: number, col: number) => {
    const tile = grid[row][col];
    if (!tile || !tile.powerUp) return;

    setIsProcessing(true);
    setMovesLeft(m => Math.max(0, m - 1));

    const effect = resolvePowerUpSwap(grid, { row, col }, { row, col }, level, grass);
    if (effect) {
      triggerSound(effect.soundType);
      await processClearedTiles(effect.clearedCoords, grid, grass);
    }
    setIsProcessing(false);
  };

  // Perform swap and check for matches / powerup combos
  const trySwapTiles = async (p1: { row: number; col: number }, p2: { row: number; col: number }) => {
    const valid = isValidMove(grid, p1.row, p1.col, p2.row, p2.col);
    sounds.playSwap();

    // Check if it was a powerup synergy combo
    const t1 = grid[p1.row][p1.col];
    const t2 = grid[p2.row][p2.col];

    if (t1?.powerUp || t2?.powerUp) {
      // Direct powerup synergy!
      setIsProcessing(true);
      setMovesLeft(m => Math.max(0, m - 1));

      const effect = resolvePowerUpSwap(grid, p1, p2, level, grass);
      if (effect) {
        triggerSound(effect.soundType);
        if (effect.synergyType) {
          triggerComboPop(effect.synergyType);
        }
        await processClearedTiles(effect.clearedCoords, grid, grass);
      }
      setIsProcessing(false);
      return;
    }

    if (!valid) {
      // Animate failed swap & revert
      setIsProcessing(true);
      const tempGrid = grid.map(r => [...r]);
      tempGrid[p1.row][p1.col] = { ...t2!, row: p1.row, col: p1.col };
      tempGrid[p2.row][p2.col] = { ...t1!, row: p2.row, col: p2.col };
      setGrid(tempGrid);

      setTimeout(() => {
        setGrid(grid);
        setIsProcessing(false);
      }, 200);
      return;
    }

    // Valid move!
    setIsProcessing(true);
    setMovesLeft(m => Math.max(0, m - 1));

    const nextGrid = grid.map(r => [...r]);
    nextGrid[p1.row][p1.col] = { ...t2!, row: p1.row, col: p1.col };
    nextGrid[p2.row][p2.col] = { ...t1!, row: p2.row, col: p2.col };
    setGrid(nextGrid);

    // Run Cascades
    await runCascades(nextGrid, grass, 0, p2);
    setIsProcessing(false);
  };

  // Process cleared tiles, grass damage, milk deliveries, and gravity
  const processClearedTiles = async (
    coords: { row: number; col: number }[],
    currentGrid: (Tile | null)[][],
    currentGrass: number[][]
  ) => {
    const workingGrid = currentGrid.map(r => [...r]);
    const workingGrass = currentGrass.map(r => [...r]);

    coords.forEach(({ row, col }) => {
      const t = workingGrid[row][col];
      if (t) {
        trackObjectiveProgress('color', t.color, 1);
        workingGrid[row][col] = null;
      }

      // Damage grass
      if (workingGrass[row] && workingGrass[row][col] > 0) {
        workingGrass[row][col]--;
        trackObjectiveProgress('grass', undefined, 1);
      }
    });

    checkStatuesUncovered(workingGrass);
    setGrass(workingGrass);
    const earnedPoints = coords.length * 60;
    setScore(s => s + earnedPoints);

    // Spawn floating score popup at match center
    if (coords.length > 0) {
      const mid = coords[Math.floor(coords.length / 2)];
      const newScore = {
        id: Date.now() + Math.random(),
        x: mid.col * tileSize + tileSize / 2,
        y: mid.row * tileSize + tileSize / 2,
        text: `+${earnedPoints}`
      };
      setFloatingScores(prev => [...prev.slice(-8), newScore]);
      setTimeout(() => {
        setFloatingScores(prev => prev.filter(s => s.id !== newScore.id));
      }, 950);
    }

    // Apply gravity
    await new Promise(res => setTimeout(res, 220));
    const { newGrid, milkCollected } = applyGravityAndRefill(workingGrid, level);
    if (milkCollected > 0) {
      trackObjectiveProgress('milk', undefined, milkCollected);
      sounds.playPurr();
    }
    setGrid(newGrid);

    // Continue cascade check
    await runCascades(newGrid, workingGrass, 1);
  };

  // Cascade resolution loop
  const runCascades = async (
    currentGrid: (Tile | null)[][],
    currentGrass: number[][],
    comboStep = 0,
    preferredSpawnPos?: { row: number; col: number }
  ) => {
    const matches = findMatches(currentGrid, preferredSpawnPos);
    if (matches.length === 0) {
      setComboCount(0);
      return;
    }

    sounds.playPop(comboStep);
    const newCombo = comboStep + 1;
    setComboCount(newCombo);

    if (newCombo >= 2) {
      const messages = ["Sweet!", "Purr-fect!", "Meow-velous!", "PAW-SOME!!"];
      triggerComboPop(messages[Math.min(newCombo - 2, messages.length - 1)]);
    }

    // Spawn floating score numbers for cascade matches
    matches.forEach(m => {
      if (m.tiles.length > 0) {
        const mid = m.tiles[Math.floor(m.tiles.length / 2)];
        const pts = m.tiles.length * (60 + newCombo * 20);
        const newScore = {
          id: Date.now() + Math.random(),
          x: mid.col * tileSize + tileSize / 2,
          y: mid.row * tileSize + tileSize / 2,
          text: `+${pts}`
        };
        setFloatingScores(prev => [...prev.slice(-8), newScore]);
        setTimeout(() => {
          setFloatingScores(prev => prev.filter(s => s.id !== newScore.id));
        }, 950);
      }
    });

    const workingGrid = currentGrid.map(r => [...r]);
    const workingGrass = currentGrass.map(r => [...r]);

    // Track matched tiles and create power-ups
    const powerUpsToPlace: { row: number; col: number; type: PowerUpType }[] = [];

    matches.forEach(m => {
      m.tiles.forEach(pos => {
        const t = workingGrid[pos.row][pos.col];
        if (t) {
          trackObjectiveProgress('color', t.color, 1);
        }
        workingGrid[pos.row][pos.col] = null;

        // Clear grass directly under match
        if (workingGrass[pos.row] && workingGrass[pos.row][pos.col] > 0) {
          workingGrass[pos.row][pos.col]--;
          trackObjectiveProgress('grass', undefined, 1);
        }
      });

      if (m.powerUpCreated) {
        powerUpsToPlace.push(m.powerUpCreated);
      }
    });

    // Place newly formed powerups!
    powerUpsToPlace.forEach(p => {
      const color = level.allowedColors[Math.floor(Math.random() * level.allowedColors.length)];
      workingGrid[p.row][p.col] = {
        id: `pu_${Date.now()}_${Math.random()}`,
        row: p.row,
        col: p.col,
        color,
        powerUp: p.type
      };
      sounds.playPaw();
    });

    checkStatuesUncovered(workingGrass);
    setGrass(workingGrass);
    setGrid(workingGrid);

    // Gravity fall
    await new Promise(res => setTimeout(res, 240));
    const { newGrid, milkCollected } = applyGravityAndRefill(workingGrid, level);
    if (milkCollected > 0) {
      trackObjectiveProgress('milk', undefined, milkCollected);
      sounds.playPurr();
    }
    setGrid(newGrid);

    // Next cascade step
    await new Promise(res => setTimeout(res, 180));
    await runCascades(newGrid, workingGrass, newCombo);
  };

  const triggerSound = (type: string) => {
    if (type === 'bomb') {
      sounds.playBomb();
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 400);
    } else if (type === 'rocket') {
      sounds.playRocket();
    } else if (type === 'yarn') {
      sounds.playYarnRainbow();
    } else if (type === 'paw') {
      sounds.playPaw();
    } else {
      sounds.playPop();
    }
  };

  const triggerComboPop = (text: string) => {
    setComboText(text);
    setCatSpeech(text);
    setTimeout(() => setComboText(null), 1200);
  };

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-hidden ${
      screenShake ? 'animate-[wiggle_0.3s_ease-in-out]' : ''
    }`}>
      {/* High-Fidelity Casual Game Conservatory Sanctuary Backdrop */}
      <img
        src={puzzleBgImg}
        alt="Sanctuary Backdrop"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-90 saturate-110"
      />
      {/* Ambient Vignette & Sunbeams */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-transparent to-amber-950/60 pointer-events-none" />
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none animate-sunbeam" />

      {/* Top Banner (Carved Wooden Plaque with Gold Trim & 3D Counters) */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 text-white rounded-3xl p-2 sm:p-3 shadow-[0_12px_28px_rgba(0,0,0,0.5)] border-3 border-amber-500/90 ring-2 ring-amber-950/60 flex items-center justify-between backdrop-blur-md z-30">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onExit}
            className="p-2 bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 rounded-2xl border-2 border-amber-300 shadow text-white transition-all"
            title="Return to Sanctuary"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow" />
          </button>
          <button
            onClick={() => setShowPauseModal(true)}
            className="p-2 bg-amber-950/90 hover:bg-amber-900 active:scale-95 rounded-2xl border-2 border-amber-400 text-amber-300 shadow transition-all flex items-center justify-center"
            title="Pause Game (Bodhi Industries Menu)"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-extrabold leading-tight">
              Level {level.id}
            </div>
            <div className="text-xs sm:text-sm font-black text-white font-['Fredoka'] truncate max-w-[85px] sm:max-w-[170px] leading-tight drop-shadow">
              {level.name}
            </div>
          </div>
        </div>

        {/* Level Objectives Trackers (Golden Parchment Plaque) */}
        <div className="flex items-center gap-1.5 sm:gap-3 bg-amber-950/80 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-2xl border border-amber-600/70 shadow-inner">
          {objectives.map((obj, idx) => {
            const isDone = obj.current >= obj.target;
            return (
              <div key={idx} className="flex items-center gap-1 text-xs font-bold font-['Fredoka']">
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                  {obj.type === 'color' && obj.color && (
                    <TileVisual tile={{ id: 'obj', row: 0, col: 0, color: obj.color, powerUp: null }} size={22} />
                  )}
                  {obj.type === 'grass' && <span className="text-base sm:text-lg">🌱</span>}
                  {obj.type === 'statues' && <span className="text-base sm:text-lg">🐱</span>}
                  {obj.type === 'milk' && <span className="text-base sm:text-lg">🥛</span>}
                </div>
                <div className={`text-[11px] sm:text-xs ${isDone ? 'text-emerald-400 font-black' : 'text-amber-100 font-bold'}`}>
                  {isDone ? (
                    <span className="flex items-center text-emerald-400 font-black filter drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]"><Check className="w-4 h-4" /></span>
                  ) : (
                    `${obj.current}/${obj.target}`
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Moves Left Badge (Tactile 3D Golden Dial) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-amber-950 px-3 sm:px-4 py-0.5 sm:py-1 rounded-2xl border-2 border-white shadow-[0_4px_12px_rgba(245,158,11,0.5)]">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-none">Moves</span>
            <span className={`text-lg sm:text-2xl font-black font-['Fredoka'] leading-tight drop-shadow-sm ${movesLeft <= 5 ? 'text-red-700 animate-pulse' : ''}`}>
              {movesLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Main Play Area with Cheerful Cats beside the board */}
      <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center gap-2 sm:gap-4 my-1 sm:my-2 z-20">
        {/* Left Side: Cheerleader Cat (Piper or Bodacious!) */}
        <div className="hidden md:flex flex-col items-center justify-end h-full pb-4">
          <CatVisual
            cat={activeCat}
            size="xl"
            showDialogue={catSpeech}
            onTap={() => {
              sounds.playPurr();
              setCatSpeech(activeCat.quotes[Math.floor(Math.random() * activeCat.quotes.length)]);
            }}
          />
          <div className="bg-amber-950/80 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold text-amber-200 shadow-lg border border-amber-500/60 mt-1">
            {activeCat.name} ({activeCat.breed})
          </div>
        </div>

        {/* Center: Luxury Carved Wooden Puzzle Frame */}
        <div className="relative p-2 sm:p-3.5 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 rounded-[34px] shadow-[0_25px_50px_rgba(0,0,0,0.6),0_10px_20px_rgba(0,0,0,0.4)] border-4 border-amber-500/90 ring-4 ring-amber-950/60 backdrop-blur-md">
          {/* Brass Corner Rivets */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 shadow border border-amber-200" />
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 shadow border border-amber-200" />
          <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 shadow border border-amber-200" />
          <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 shadow border border-amber-200" />

          {/* Combo Floating Text Banner */}
          {comboText && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-banner-pop">
              <div className="text-4xl sm:text-6xl font-black text-amber-300 font-['Fredoka'] drop-shadow-[0_4px_0_#92400e] drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] text-center whitespace-nowrap">
                {comboText}
              </div>
            </div>
          )}

          {/* Floating Matched Score Numbers */}
          {floatingScores.map(s => (
            <div
              key={s.id}
              style={{ left: s.x, top: s.y }}
              className="absolute pointer-events-none z-40 font-['Fredoka'] font-black text-xl sm:text-2xl text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-float-up"
            >
              {s.text}
            </div>
          ))}

          {/* Under-Grid Statues Layer */}
          <div className="absolute inset-2 sm:inset-3.5 pointer-events-none overflow-hidden rounded-2xl">
            {statues.map(statue => (
              <CatStatueVisual key={statue.id} statue={statue} tileSize={tileSize} />
            ))}
          </div>

          {/* Dynamic Grid with Touch Swipe & Tap */}
          <div
            className="grid gap-1 relative z-10 touch-none"
            style={{
              gridTemplateColumns: `repeat(${level.cols}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${level.rows}, ${tileSize}px)`
            }}
          >
            {grid.map((row, r) =>
              row.map((tile, c) => {
                const isPlayable = level.layout[r][c];
                const isSelected = selectedPos?.row === r && selectedPos?.col === c;
                const isHint = Boolean(
                  hintTiles && (
                    (hintTiles.from.row === r && hintTiles.from.col === c) ||
                    (hintTiles.to.row === r && hintTiles.to.col === c)
                  )
                );
                const grassLevel = grass[r] ? grass[r][c] : 0;

                if (!isPlayable) {
                  return (
                    <div
                      key={`${r}-${c}`}
                      style={{ width: `${tileSize}px`, height: `${tileSize}px` }}
                      className="opacity-0 pointer-events-none"
                    />
                  );
                }

                // Recessed 3D Wooden Socket
                const isEvenCell = (r + c) % 2 === 0;
                return (
                  <div
                    key={`${r}-${c}`}
                    onTouchStart={(e) => handleTileTouchStart(r, c, e)}
                    onTouchEnd={(e) => handleTileTouchEnd(r, c, e)}
                    style={{ width: `${tileSize}px`, height: `${tileSize}px` }}
                    className={`relative rounded-2xl flex items-center justify-center overflow-hidden transition-colors ${
                      isEvenCell
                        ? 'bg-amber-950/60 shadow-[inset_0_3px_6px_rgba(0,0,0,0.5),0_1px_1px_rgba(255,255,255,0.06)] border border-amber-800/40'
                        : 'bg-amber-900/40 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.06)] border border-amber-800/30'
                    }`}
                  >
                    {/* Grass Overlay */}
                    <GrassOverlay level={grassLevel} size={tileSize} />

                    {/* Tile */}
                    {tile && (
                      <TileVisual
                        tile={tile}
                        size={tileSize}
                        isSelected={isSelected}
                        isHint={isHint}
                        onTileClick={handleTileClick}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: The Other Cat watching! */}
        <div className="hidden lg:flex flex-col items-center justify-end h-full pb-4">
          {gameState.activeCatId === 'piper' ? (
            <CatVisual
              cat={gameState.cats['bodacious']}
              size="lg"
              onTap={() => {
                sounds.playPurr();
                setCatSpeech("Bodacious approves your match!");
              }}
            />
          ) : (
            <CatVisual
              cat={gameState.cats['piper']}
              size="lg"
              onTap={() => {
                sounds.playMeow();
                setCatSpeech("Piper loves seeing you play!");
              }}
            />
          )}
          <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-900 shadow border border-amber-200 mt-1">
            {gameState.activeCatId === 'piper' ? 'Bodacious' : 'Piper'}
          </div>
        </div>
      </div>

      {/* Bottom Tool Bar: Boosters & Controls */}
      <div className="w-full max-w-xl bg-amber-900/90 text-white rounded-3xl p-2 sm:p-2.5 px-3 sm:px-4 shadow-xl border-2 border-amber-600 flex items-center justify-between backdrop-blur-sm z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Booster 1: Hammer */}
          <button
            onClick={() => {
              if (activeBooster === 'hammer') {
                setActiveBooster(null);
              } else {
                setActiveBooster('hammer');
                sounds.playClick();
              }
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl font-bold font-['Fredoka'] text-xs sm:text-sm transition-all border-2 ${
              activeBooster === 'hammer'
                ? 'bg-amber-400 text-amber-950 border-white shadow-lg scale-105'
                : 'bg-amber-800 text-amber-100 border-amber-600 hover:bg-amber-700'
            }`}
          >
            <Hammer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <span className="hidden sm:inline">Hammer ({gameState.boosters.hammer})</span>
            <span className="sm:hidden">{gameState.boosters.hammer}</span>
          </button>

          {/* Booster 2: Glove */}
          <button
            onClick={() => {
              if (activeBooster === 'glove') {
                setActiveBooster(null);
              } else {
                setActiveBooster('glove');
                sounds.playClick();
              }
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl font-bold font-['Fredoka'] text-xs sm:text-sm transition-all border-2 ${
              activeBooster === 'glove'
                ? 'bg-amber-400 text-amber-950 border-white shadow-lg scale-105'
                : 'bg-amber-800 text-amber-100 border-amber-600 hover:bg-amber-700'
            }`}
          >
            <Hand className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" />
            <span className="hidden sm:inline">Glove ({gameState.boosters.glove})</span>
            <span className="sm:hidden">{gameState.boosters.glove}</span>
          </button>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right">
            <div className="text-[9px] sm:text-[10px] text-amber-300 font-bold uppercase leading-tight">Score</div>
            <div className="text-base sm:text-lg font-black font-['Fredoka'] text-white leading-tight">{score}</div>
          </div>
          <button
            onClick={() => setShowPauseModal(true)}
            className="p-1.5 sm:p-2 bg-amber-800 hover:bg-amber-700 active:scale-95 rounded-xl border border-amber-600 text-amber-200"
            title="Pause Game (Bodhi Menu)"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className="p-1.5 sm:p-2 bg-amber-800 hover:bg-amber-700 active:scale-95 rounded-xl border border-amber-600 text-amber-200"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Out of Moves Modal */}
      {showOutOfMovesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-amber-400 text-center animate-[scaleIn_0.3s]">
            <div className="text-4xl mb-2">😿</div>
            <h3 className="text-2xl font-black text-amber-950 font-['Fredoka'] mb-2">Out of Moves!</h3>
            <p className="text-sm text-amber-800 mb-6">
              Piper and Bodacious believe in you! Keep going with +5 extra moves!
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setMovesLeft(prev => prev + 5);
                  setShowOutOfMovesModal(false);
                  sounds.playPurr();
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-2xl shadow-lg border-2 border-emerald-300 flex items-center justify-center gap-2 active:scale-95 transition-all font-['Fredoka'] text-lg"
              >
                <span>Add +5 Moves (Free!)</span>
                <Sparkles className="w-5 h-5" />
              </button>

              <button
                onClick={onExit}
                className="w-full py-2.5 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-2xl transition-all text-sm"
              >
                Give Up & Return to Sanctuary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bodhi Industries Pause Menu Modal */}
      {showPauseModal && (
        <PauseModal
          level={level}
          movesLeft={movesLeft}
          objectives={objectives}
          soundEnabled={soundEnabled}
          onResume={() => setShowPauseModal(false)}
          onRestart={handleRestartLevel}
          onExit={onExit}
          onToggleSound={() => setSoundEnabled(prev => !prev)}
        />
      )}
    </div>
  );
};
