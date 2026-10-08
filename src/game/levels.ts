import { LevelConfig, CatStatue, LevelObjective } from '../types';

export const PRESET_LEVELS: LevelConfig[] = [
  // Level 1: Basics & Matching
  {
    id: 1,
    name: "Piper's Sunny Porch",
    moves: 22,
    rows: 8,
    cols: 8,
    allowedColors: ['fish', 'mouse', 'clover', 'lemon'],
    layout: Array(8).fill(null).map(() => Array(8).fill(true)),
    grass: Array(8).fill(null).map(() => Array(8).fill(0)),
    statues: [],
    milkBottlesNeeded: 0,
    objectives: [
      { type: 'color', color: 'fish', target: 20, current: 0, label: 'Cyan Fish' },
      { type: 'color', color: 'mouse', target: 20, current: 0, label: 'Pink Mice' }
    ]
  },

  // Level 2: Introduction to Grass Foliage
  {
    id: 2,
    name: "Bodacious's Grass Garden",
    moves: 24,
    rows: 8,
    cols: 8,
    allowedColors: ['fish', 'mouse', 'clover', 'lemon', 'bird'],
    layout: Array(8).fill(null).map(() => Array(8).fill(true)),
    grass: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    statues: [],
    milkBottlesNeeded: 0,
    objectives: [
      { type: 'grass', target: 24, current: 0, label: 'Lawn Grass' },
      { type: 'color', color: 'clover', target: 25, current: 0, label: 'Lucky Clovers' }
    ]
  },

  // Level 3: Hidden Cat Statues under Grass
  {
    id: 3,
    name: "Buried Lucky Statues",
    moves: 26,
    rows: 8,
    cols: 8,
    allowedColors: ['fish', 'mouse', 'clover', 'lemon', 'bird'],
    layout: [
      [false, true, true, true, true, true, true, false],
      [true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true],
      [false, true, true, true, true, true, true, false]
    ],
    grass: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 2, 0, 0, 2, 2, 0],
      [0, 2, 2, 0, 0, 2, 2, 0],
      [0, 0, 0, 2, 2, 0, 0, 0],
      [0, 0, 0, 2, 2, 0, 0, 0],
      [0, 2, 2, 0, 0, 2, 2, 0],
      [0, 2, 2, 0, 0, 2, 2, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    statues: [
      { id: 's1', startRow: 1, startCol: 1, width: 2, height: 2, isCollected: false },
      { id: 's2', startRow: 1, startCol: 5, width: 2, height: 2, isCollected: false },
      { id: 's3', startRow: 5, startCol: 1, width: 2, height: 2, isCollected: false },
      { id: 's4', startRow: 5, startCol: 5, width: 2, height: 2, isCollected: false }
    ],
    milkBottlesNeeded: 0,
    objectives: [
      { type: 'statues', target: 4, current: 0, label: 'Cat Statues' },
      { type: 'color', color: 'fish', target: 30, current: 0, label: 'Cyan Fish' }
    ]
  },

  // Level 4: Milk Bottle Drop!
  {
    id: 4,
    name: "Milk Delivery For Piper",
    moves: 25,
    rows: 8,
    cols: 8,
    allowedColors: ['fish', 'mouse', 'clover', 'lemon', 'bird'],
    layout: Array(8).fill(null).map(() => Array(8).fill(true)),
    grass: Array(8).fill(null).map(() => Array(8).fill(0)),
    statues: [],
    milkBottlesNeeded: 3,
    initialMilkBottles: [
      { row: 0, col: 1 },
      { row: 0, col: 4 },
      { row: 0, col: 6 }
    ],
    objectives: [
      { type: 'milk', target: 3, current: 0, label: 'Milk Bottles' },
      { type: 'color', color: 'lemon', target: 30, current: 0, label: 'Yellow Lemons' }
    ]
  },

  // Level 5: Irregular Castle Layout (Matching reference Screenshot 2!)
  {
    id: 5,
    name: "Bodacious's Castle Haven",
    moves: 26,
    rows: 8,
    cols: 8,
    allowedColors: ['fish', 'mouse', 'clover', 'lemon', 'bird'],
    // Irregular layout with center cutout and corner cutouts
    layout: [
      [false, false, true, true, true, true, false, false],
      [true, true, true, true, true, true, true, true],
      [true, true, true, false, false, true, true, true],
      [true, true, true, false, false, true, true, true],
      [false, true, true, false, false, true, true, false],
      [false, true, true, true, true, true, true, false],
      [true, true, true, true, true, true, true, true],
      [false, false, true, true, true, true, false, false]
    ],
    grass: [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [1, 1, 2, 2, 2, 2, 1, 1],
      [1, 2, 2, 0, 0, 2, 2, 1],
      [1, 2, 2, 0, 0, 2, 2, 1],
      [0, 1, 2, 0, 0, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 1, 0, 0]
    ],
    statues: [
      { id: 's1', startRow: 1, startCol: 2, width: 2, height: 1, isCollected: false },
      { id: 's2', startRow: 1, startCol: 4, width: 2, height: 1, isCollected: false },
      { id: 's3', startRow: 5, startCol: 2, width: 2, height: 1, isCollected: false },
      { id: 's4', startRow: 5, startCol: 4, width: 2, height: 1, isCollected: false }
    ],
    milkBottlesNeeded: 0,
    objectives: [
      { type: 'statues', target: 4, current: 0, label: 'Lucky Statues' },
      { type: 'color', color: 'fish', target: 40, current: 0, label: 'Cyan Fish' }
    ]
  },

  // Level 6: Beach Gazebo Patio (Matching reference Screenshot 1!)
  {
    id: 6,
    name: "Gazebo Patio Party",
    moves: 28,
    rows: 8,
    cols: 8,
    allowedColors: ['fish', 'mouse', 'clover', 'lemon', 'bird'],
    layout: [
      [true, true, true, false, false, true, true, true],
      [true, true, true, true, true, true, true, true],
      [true, true, true, false, false, true, true, true],
      [true, true, true, false, false, true, true, true],
      [true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true],
      [true, true, true, false, false, true, true, true]
    ],
    grass: [
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 2, 2, 1, 1, 2, 2, 1],
      [1, 2, 2, 0, 0, 2, 2, 1],
      [1, 2, 2, 0, 0, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 2, 2, 2, 2, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0]
    ],
    statues: [
      { id: 's1', startRow: 1, startCol: 1, width: 2, height: 2, isCollected: false },
      { id: 's2', startRow: 1, startCol: 5, width: 2, height: 2, isCollected: false }
    ],
    milkBottlesNeeded: 2,
    initialMilkBottles: [
      { row: 0, col: 0 },
      { row: 0, col: 7 }
    ],
    objectives: [
      { type: 'statues', target: 2, current: 0, label: 'Cat Statues' },
      { type: 'milk', target: 2, current: 0, label: 'Milk Bottles' },
      { type: 'grass', target: 20, current: 0, label: 'Lawn Grass' }
    ]
  },

  // Level 7: Paw Powerup & Combo Paradise
  {
    id: 7,
    name: "Yarn & Bombs Galore",
    moves: 27,
    rows: 8,
    cols: 8,
    allowedColors: ['fish', 'mouse', 'clover', 'lemon', 'bird'],
    layout: Array(8).fill(null).map(() => Array(8).fill(true)),
    grass: [
      [0, 1, 1, 2, 2, 1, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 1, 2, 2, 1, 1, 0]
    ],
    statues: [
      { id: 's1', startRow: 2, startCol: 2, width: 2, height: 2, isCollected: false },
      { id: 's2', startRow: 4, startCol: 4, width: 2, height: 2, isCollected: false }
    ],
    milkBottlesNeeded: 3,
    initialMilkBottles: [
      { row: 0, col: 2 },
      { row: 0, col: 5 }
    ],
    objectives: [
      { type: 'statues', target: 2, current: 0, label: 'Cat Statues' },
      { type: 'milk', target: 3, current: 0, label: 'Milk Bottles' },
      { type: 'color', color: 'mouse', target: 35, current: 0, label: 'Pink Mice' }
    ]
  },

  // Level 8: The Royal Feline Challenge
  {
    id: 8,
    name: "Royal Sanctuary Grandeur",
    moves: 30,
    rows: 8,
    cols: 8,
    allowedColors: ['fish', 'mouse', 'clover', 'lemon', 'bird'],
    layout: [
      [true, true, true, true, true, true, true, true],
      [true, true, true, false, false, true, true, true],
      [true, true, true, true, true, true, true, true],
      [true, false, true, true, true, true, false, true],
      [true, false, true, true, true, true, false, true],
      [true, true, true, true, true, true, true, true],
      [true, true, true, false, false, true, true, true],
      [true, true, true, true, true, true, true, true]
    ],
    grass: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 0, 0, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 0, 2, 2, 2, 2, 0, 1],
      [1, 0, 2, 2, 2, 2, 0, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 0, 0, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    statues: [
      { id: 's1', startRow: 2, startCol: 2, width: 2, height: 2, isCollected: false },
      { id: 's2', startRow: 2, startCol: 4, width: 2, height: 2, isCollected: false },
      { id: 's3', startRow: 4, startCol: 2, width: 2, height: 2, isCollected: false }
    ],
    milkBottlesNeeded: 4,
    initialMilkBottles: [
      { row: 0, col: 1 },
      { row: 0, col: 6 }
    ],
    objectives: [
      { type: 'statues', target: 3, current: 0, label: 'Cat Statues' },
      { type: 'milk', target: 4, current: 0, label: 'Milk Bottles' },
      { type: 'grass', target: 30, current: 0, label: 'Lawn Grass' }
    ]
  }
];

/**
 * Generate infinite playable levels dynamically after level 8 so user never runs out!
 */
export function getLevelConfig(levelId: number): LevelConfig {
  const preset = PRESET_LEVELS.find(l => l.id === levelId);
  if (preset) {
    // Deep clone so in-place edits in game don't mutate template
    return JSON.parse(JSON.stringify(preset));
  }

  // Dynamic Generator for endless progression
  const moves = 25 + Math.floor(Math.sin(levelId) * 4);
  const rows = 8;
  const cols = 8;
  const allowedColors: LevelConfig['allowedColors'] = ['fish', 'mouse', 'clover', 'lemon', 'bird'];

  // Irregular cutout patterns based on seed
  const layout = Array(rows).fill(null).map((_, r) => 
    Array(cols).fill(null).map((_, c) => {
      // Keep playable, maybe cut a couple corners or center window
      if ((r === 0 || r === 7) && (c === 0 || c === 7) && levelId % 2 === 0) return false;
      if (r >= 3 && r <= 4 && c >= 3 && c <= 4 && levelId % 3 === 0) return false;
      return true;
    })
  );

  const grass = Array(rows).fill(null).map((_, r) => 
    Array(cols).fill(null).map((_, c) => {
      if (!layout[r][c]) return 0;
      if (r >= 1 && r <= 6 && c >= 1 && c <= 6) return (r + c + levelId) % 3;
      return 0;
    })
  );

  const statues: CatStatue[] = [
    { id: `dyn_s1`, startRow: 2, startCol: 2, width: 2, height: 2, isCollected: false },
    { id: `dyn_s2`, startRow: 4, startCol: 4, width: 2, height: 2, isCollected: false }
  ];

  const objectives: LevelObjective[] = [
    { type: 'statues', target: 2, current: 0, label: 'Cat Statues' },
    { type: 'color', color: allowedColors[levelId % allowedColors.length], target: 35 + (levelId % 10), current: 0, label: 'Target Tiles' },
    { type: 'milk', target: 2, current: 0, label: 'Milk Bottles' }
  ];

  return {
    id: levelId,
    name: `Sanctuary Expedition #${levelId}`,
    moves,
    rows,
    cols,
    allowedColors,
    layout,
    grass,
    statues,
    milkBottlesNeeded: 2,
    initialMilkBottles: [{ row: 0, col: 2 }, { row: 0, col: 5 }],
    objectives
  };
}
