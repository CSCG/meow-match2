export type TileColor = 'fish' | 'mouse' | 'clover' | 'lemon' | 'bird' | 'yarn_purple';

export type PowerUpType = 
  | 'line_h'       // Row blast
  | 'line_v'       // Column blast
  | 'bomb'         // 3x3 explosive
  | 'yarn_bomb'    // Rainbow yarn ball (match 5 in line)
  | 'targeting_paw'// 2x2 match, launches homing paw
  | null;

export interface Tile {
  id: string;
  row: number;
  col: number;
  color: TileColor;
  powerUp: PowerUpType;
  isMilkBottle?: boolean;
  isMatched?: boolean;
  isFalling?: boolean;
  fallDistance?: number;
  highlighted?: boolean;
}

export interface CatStatue {
  id: string;
  startRow: number;
  startCol: number;
  width: number;
  height: number;
  isCollected: boolean;
}

export interface LevelObjective {
  type: 'color' | 'grass' | 'statues' | 'milk' | 'score';
  color?: TileColor;
  target: number;
  current: number;
  label: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  moves: number;
  rows: number;
  cols: number;
  allowedColors: TileColor[];
  // 2D grid of valid playable tiles (true if playable, false if hole)
  layout: boolean[][];
  // Grass layers (0 = no grass, 1 = single grass, 2 = dense grass with flowers)
  grass: number[][];
  // Pre-placed statues under grass
  statues: CatStatue[];
  // Milk bottle drop count required
  milkBottlesNeeded: number;
  // Starting milk bottles positions
  initialMilkBottles?: { row: number; col: number }[];
  objectives: LevelObjective[];
}

export interface SanctuaryTask {
  id: string;
  title: string;
  description: string;
  costStars: number;
  completed: boolean;
  furnitureKey: string;
  defaultStyle: number; // 0, 1, 2
  styles: {
    name: string;
    description: string;
    previewColor: string;
    icon: string;
  }[];
}

export interface Cat {
  id: 'piper' | 'bodacious';
  name: string;
  breed: string;
  description: string;
  avatarColor: string;
  furPattern: 'calico' | 'fluffy_mainecoon';
  happiness: number; // 0 - 100
  selectedCostume: string;
  unlockedCostumes: string[];
  quotes: string[];
}

export interface UserGameState {
  stars: number;
  coins: number;
  lives: number;
  maxLives: number;
  lastLifeRechargeTime: number; // timestamp
  currentLevelId: number;
  highestLevelUnlocked: number;
  levelStars: Record<number, number>; // levelId -> stars (1-3)
  tasksCompleted: string[]; // task IDs completed
  furnitureStyles: Record<string, number>; // furnitureKey -> selectedStyle (0, 1, 2)
  boosters: {
    hammer: number;
    glove: number;
    startingBomb: number;
    startingYarn: number;
    startingPaw: number;
  };
  activeCatId: 'piper' | 'bodacious';
  cats: Record<'piper' | 'bodacious', Cat>;
  soundEnabled: boolean;
}
