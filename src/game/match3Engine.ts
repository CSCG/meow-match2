import { Tile, TileColor, PowerUpType, LevelConfig, CatStatue, LevelObjective } from '../types';

let tileCounter = 1;
export function createTile(
  row: number,
  col: number,
  color: TileColor,
  powerUp: PowerUpType = null,
  isMilkBottle = false
): Tile {
  return {
    id: `t_${tileCounter++}_${Date.now()}`,
    row,
    col,
    color,
    powerUp,
    isMilkBottle
  };
}

export function getRandomColor(allowedColors: TileColor[]): TileColor {
  const idx = Math.floor(Math.random() * allowedColors.length);
  return allowedColors[idx];
}

/**
 * Initialize board grid ensuring no starting 3-matches
 */
export function initializeBoard(level: LevelConfig): (Tile | null)[][] {
  const { rows, cols, layout, allowedColors, initialMilkBottles } = level;
  const grid: (Tile | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!layout[r][c]) {
        grid[r][c] = null;
        continue;
      }

      // Check if this position is a starting milk bottle
      const isMilk = initialMilkBottles?.some(m => m.row === r && m.col === c);
      if (isMilk) {
        grid[r][c] = createTile(r, c, 'fish', null, true);
        continue;
      }

      // Pick random color avoiding starting 3-match
      let color = getRandomColor(allowedColors);
      let attempts = 0;
      while (attempts < 20) {
        const matchH = (c >= 2 && grid[r][c - 1]?.color === color && grid[r][c - 2]?.color === color && !grid[r][c-1]?.isMilkBottle && !grid[r][c-2]?.isMilkBottle);
        const matchV = (r >= 2 && grid[r - 1][c]?.color === color && grid[r - 2][c]?.color === color && !grid[r-1][c]?.isMilkBottle && !grid[r-2][c]?.isMilkBottle);
        if (!matchH && !matchV) break;
        color = getRandomColor(allowedColors);
        attempts++;
      }

      grid[r][c] = createTile(r, c, color);
    }
  }

  return grid;
}

export interface MatchResult {
  tiles: { row: number; col: number }[];
  powerUpCreated: {
    row: number;
    col: number;
    type: PowerUpType;
  } | null;
  color: TileColor;
}

/**
 * Detect all standard matches on board:
 * 5 in line -> Yarn Bomb
 * 5 in T/L shape -> Bomb
 * 4 in line -> Line Blast (Horizontal or Vertical)
 * 2x2 square -> Targeting Paw
 * 3 in line -> Normal match
 */
export function findMatches(
  grid: (Tile | null)[][],
  preferredSpawnPos?: { row: number; col: number }
): MatchResult[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const results: MatchResult[] = [];
  const matchedSet = new Set<string>();

  // 1. Check horizontal lines
  const hLines: { row: number; cols: number[]; color: TileColor }[] = [];
  for (let r = 0; r < rows; r++) {
    let matchColor: TileColor | null = null;
    let matchCols: number[] = [];

    for (let c = 0; c < cols; c++) {
      const tile = grid[r][c];
      if (tile && !tile.isMilkBottle && (!matchColor || tile.color === matchColor)) {
        matchColor = tile.color;
        matchCols.push(c);
      } else {
        if (matchCols.length >= 3 && matchColor) {
          hLines.push({ row: r, cols: [...matchCols], color: matchColor });
        }
        if (tile && !tile.isMilkBottle) {
          matchColor = tile.color;
          matchCols = [c];
        } else {
          matchColor = null;
          matchCols = [];
        }
      }
    }
    if (matchCols.length >= 3 && matchColor) {
      hLines.push({ row: r, cols: [...matchCols], color: matchColor });
    }
  }

  // 2. Check vertical lines
  const vLines: { col: number; rows: number[]; color: TileColor }[] = [];
  for (let c = 0; c < cols; c++) {
    let matchColor: TileColor | null = null;
    let matchRows: number[] = [];

    for (let r = 0; r < rows; r++) {
      const tile = grid[r][c];
      if (tile && !tile.isMilkBottle && (!matchColor || tile.color === matchColor)) {
        matchColor = tile.color;
        matchRows.push(r);
      } else {
        if (matchRows.length >= 3 && matchColor) {
          vLines.push({ col: c, rows: [...matchRows], color: matchColor });
        }
        if (tile && !tile.isMilkBottle) {
          matchColor = tile.color;
          matchRows = [r];
        } else {
          matchColor = null;
          matchRows = [];
        }
      }
    }
    if (matchRows.length >= 3 && matchColor) {
      vLines.push({ col: c, rows: [...matchRows], color: matchColor });
    }
  }

  // Check 2x2 squares (Targeting Paw)
  const pawSquares: { r: number; c: number; color: TileColor }[] = [];
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const t1 = grid[r][c];
      const t2 = grid[r][c + 1];
      const t3 = grid[r + 1][c];
      const t4 = grid[r + 1][c + 1];

      if (t1 && t2 && t3 && t4 && !t1.isMilkBottle && !t2.isMilkBottle && !t3.isMilkBottle && !t4.isMilkBottle) {
        if (t1.color === t2.color && t1.color === t3.color && t1.color === t4.color) {
          pawSquares.push({ r, c, color: t1.color });
        }
      }
    }
  }

  // T / L shape intersection detection (Bomb)
  const tOrLShapes: {
    tiles: { row: number; col: number }[];
    intersection: { row: number; col: number };
    color: TileColor;
  }[] = [];

  for (const h of hLines) {
    for (const v of vLines) {
      if (h.color === v.color && h.cols.includes(v.col) && v.rows.includes(h.row)) {
        // Intersection point
        const inter = { row: h.row, col: v.col };
        const combinedTiles: { row: number; col: number }[] = [];
        h.cols.forEach(c => combinedTiles.push({ row: h.row, col: c }));
        v.rows.forEach(r => {
          if (r !== h.row) combinedTiles.push({ row: r, col: v.col });
        });
        tOrLShapes.push({
          tiles: combinedTiles,
          intersection: inter,
          color: h.color
        });
      }
    }
  }

  // Process T/L Shapes (Bomb) first
  for (const shape of tOrLShapes) {
    const tileCoords = shape.tiles.filter(t => !matchedSet.has(`${t.row},${t.col}`));
    if (tileCoords.length >= 5) {
      shape.tiles.forEach(t => matchedSet.add(`${t.row},${t.col}`));
      let spawn = shape.intersection;
      if (preferredSpawnPos && shape.tiles.some(t => t.row === preferredSpawnPos.row && t.col === preferredSpawnPos.col)) {
        spawn = preferredSpawnPos;
      }
      results.push({
        tiles: shape.tiles,
        powerUpCreated: { row: spawn.row, col: spawn.col, type: 'bomb' },
        color: shape.color
      });
    }
  }

  // Process 5-in-a-line (Yarn Bomb)
  for (const h of hLines) {
    if (h.cols.length >= 5) {
      const coords = h.cols.map(c => ({ row: h.row, col: c }));
      const unmapped = coords.filter(c => !matchedSet.has(`${c.row},${c.col}`));
      if (unmapped.length >= 5) {
        coords.forEach(c => matchedSet.add(`${c.row},${c.col}`));
        let spawn = coords[Math.floor(coords.length / 2)];
        if (preferredSpawnPos && coords.some(t => t.row === preferredSpawnPos.row && t.col === preferredSpawnPos.col)) {
          spawn = preferredSpawnPos;
        }
        results.push({
          tiles: coords,
          powerUpCreated: { row: spawn.row, col: spawn.col, type: 'yarn_bomb' },
          color: h.color
        });
      }
    }
  }

  for (const v of vLines) {
    if (v.rows.length >= 5) {
      const coords = v.rows.map(r => ({ row: r, col: v.col }));
      const unmapped = coords.filter(c => !matchedSet.has(`${c.row},${c.col}`));
      if (unmapped.length >= 5) {
        coords.forEach(c => matchedSet.add(`${c.row},${c.col}`));
        let spawn = coords[Math.floor(coords.length / 2)];
        if (preferredSpawnPos && coords.some(t => t.row === preferredSpawnPos.row && t.col === preferredSpawnPos.col)) {
          spawn = preferredSpawnPos;
        }
        results.push({
          tiles: coords,
          powerUpCreated: { row: spawn.row, col: spawn.col, type: 'yarn_bomb' },
          color: v.color
        });
      }
    }
  }

  // Process 4-in-a-line (Line Blast)
  for (const h of hLines) {
    if (h.cols.length === 4) {
      const coords = h.cols.map(c => ({ row: h.row, col: c }));
      const unmapped = coords.filter(c => !matchedSet.has(`${c.row},${c.col}`));
      if (unmapped.length >= 4) {
        coords.forEach(c => matchedSet.add(`${c.row},${c.col}`));
        let spawn = coords[Math.floor(coords.length / 2)];
        if (preferredSpawnPos && coords.some(t => t.row === preferredSpawnPos.row && t.col === preferredSpawnPos.col)) {
          spawn = preferredSpawnPos;
        }
        results.push({
          tiles: coords,
          // Horizontal match creates vertical line blast or horizontal line blast
          powerUpCreated: { row: spawn.row, col: spawn.col, type: 'line_h' },
          color: h.color
        });
      }
    }
  }

  for (const v of vLines) {
    if (v.rows.length === 4) {
      const coords = v.rows.map(r => ({ row: r, col: v.col }));
      const unmapped = coords.filter(c => !matchedSet.has(`${c.row},${c.col}`));
      if (unmapped.length >= 4) {
        coords.forEach(c => matchedSet.add(`${c.row},${c.col}`));
        let spawn = coords[Math.floor(coords.length / 2)];
        if (preferredSpawnPos && coords.some(t => t.row === preferredSpawnPos.row && t.col === preferredSpawnPos.col)) {
          spawn = preferredSpawnPos;
        }
        results.push({
          tiles: coords,
          powerUpCreated: { row: spawn.row, col: spawn.col, type: 'line_v' },
          color: v.color
        });
      }
    }
  }

  // Process 2x2 Square (Targeting Paw)
  for (const sq of pawSquares) {
    const coords = [
      { row: sq.r, col: sq.c },
      { row: sq.r, col: sq.c + 1 },
      { row: sq.r + 1, col: sq.c },
      { row: sq.r + 1, col: sq.c + 1 }
    ];
    const unmapped = coords.filter(c => !matchedSet.has(`${c.row},${c.col}`));
    if (unmapped.length >= 4) {
      coords.forEach(c => matchedSet.add(`${c.row},${c.col}`));
      let spawn = coords[0];
      if (preferredSpawnPos && coords.some(t => t.row === preferredSpawnPos.row && t.col === preferredSpawnPos.col)) {
        spawn = preferredSpawnPos;
      }
      results.push({
        tiles: coords,
        powerUpCreated: { row: spawn.row, col: spawn.col, type: 'targeting_paw' },
        color: sq.color
      });
    }
  }

  // Process remaining 3-in-a-line
  for (const h of hLines) {
    const coords = h.cols.map(c => ({ row: h.row, col: c }));
    const unmapped = coords.filter(c => !matchedSet.has(`${c.row},${c.col}`));
    if (unmapped.length >= 3) {
      unmapped.forEach(c => matchedSet.add(`${c.row},${c.col}`));
      results.push({
        tiles: unmapped,
        powerUpCreated: null,
        color: h.color
      });
    }
  }

  for (const v of vLines) {
    const coords = v.rows.map(r => ({ row: r, col: v.col }));
    const unmapped = coords.filter(c => !matchedSet.has(`${c.row},${c.col}`));
    if (unmapped.length >= 3) {
      unmapped.forEach(c => matchedSet.add(`${c.row},${c.col}`));
      results.push({
        tiles: unmapped,
        powerUpCreated: null,
        color: v.color
      });
    }
  }

  return results;
}

/**
 * Check if swapping (r1, c1) and (r2, c2) creates any valid match or activates power-ups
 */
export function isValidMove(
  grid: (Tile | null)[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean {
  // Must be adjacent orthogonally
  const dr = Math.abs(r1 - r2);
  const dc = Math.abs(c1 - c2);
  if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
    const t1 = grid[r1][c1];
    const t2 = grid[r2][c2];
    if (!t1 || !t2) return false;

    // Power-up combinations are ALWAYS valid moves!
    if (t1.powerUp && t2.powerUp) return true;
    // Yarn bomb swapped with any colored tile is valid!
    if (t1.powerUp === 'yarn_bomb' || t2.powerUp === 'yarn_bomb') return true;

    // Single powerup activated
    if (t1.powerUp || t2.powerUp) return true;

    // Temporarily swap
    const clone = grid.map(row => [...row]);
    clone[r1][c1] = { ...t2, row: r1, col: c1 };
    clone[r2][c2] = { ...t1, row: r2, col: c2 };

    const matches = findMatches(clone);
    return matches.length > 0;
  }
  return false;
}

export interface DetonationEffect {
  clearedCoords: { row: number; col: number }[];
  soundType: 'pop' | 'bomb' | 'rocket' | 'yarn' | 'paw';
  synergyType?: string;
  homingPawTargets?: { row: number; col: number }[];
}

/**
 * Handle direct power-up activation and synergies!
 */
export function resolvePowerUpSwap(
  grid: (Tile | null)[][],
  t1Pos: { row: number; col: number },
  t2Pos: { row: number; col: number },
  level: LevelConfig,
  currentGrass: number[][]
): DetonationEffect | null {
  const rows = grid.length;
  const cols = grid[0].length;
  const t1 = grid[t1Pos.row][t1Pos.col];
  const t2 = grid[t2Pos.row][t2Pos.col];
  if (!t1 || !t2) return null;

  const p1 = t1.powerUp;
  const p2 = t2.powerUp;

  // 1. Double Yarn Bomb -> Clears the ENTIRE board!
  if (p1 === 'yarn_bomb' && p2 === 'yarn_bomb') {
    const cleared: { row: number; col: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) cleared.push({ row: r, col: c });
      }
    }
    return { clearedCoords: cleared, soundType: 'yarn', synergyType: 'SUPER_NOVA' };
  }

  // 2. Yarn Bomb + Bomb -> Converts all tiles of the other color into Bombs and detonates them!
  if ((p1 === 'yarn_bomb' && p2 === 'bomb') || (p1 === 'bomb' && p2 === 'yarn_bomb')) {
    const targetColor = p1 === 'bomb' ? t1.color : t2.color;
    const cleared: { row: number; col: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = grid[r][c];
        if (tile && (tile.color === targetColor || (r === t1Pos.row && c === t1Pos.col) || (r === t2Pos.row && c === t2Pos.col))) {
          // Detonate 3x3 around each
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc]) {
                cleared.push({ row: nr, col: nc });
              }
            }
          }
        }
      }
    }
    return { clearedCoords: cleared, soundType: 'bomb', synergyType: 'BOMB_STORM' };
  }

  // 3. Yarn Bomb + Line Blast -> Converts all tiles of that color into line rockets!
  if ((p1 === 'yarn_bomb' && (p2 === 'line_h' || p2 === 'line_v')) ||
      ((p1 === 'line_h' || p1 === 'line_v') && p2 === 'yarn_bomb')) {
    const targetColor = p1 === 'yarn_bomb' ? t2.color : t1.color;
    const cleared: { row: number; col: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = grid[r][c];
        if (tile && tile.color === targetColor) {
          // Clears full row and column for that tile
          for (let colIdx = 0; colIdx < cols; colIdx++) {
            if (grid[r][colIdx]) cleared.push({ row: r, col: colIdx });
          }
          for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
            if (grid[rowIdx][c]) cleared.push({ row: rowIdx, col: c });
          }
        }
      }
    }
    cleared.push(t1Pos, t2Pos);
    return { clearedCoords: cleared, soundType: 'rocket', synergyType: 'ROCKET_BARRAGE' };
  }

  // 4. Yarn Bomb + Normal Tile -> Removes all tiles of that color!
  if (p1 === 'yarn_bomb' || p2 === 'yarn_bomb') {
    const normalTile = p1 === 'yarn_bomb' ? t2 : t1;
    const targetColor = normalTile.color;
    const cleared: { row: number; col: number }[] = [t1Pos, t2Pos];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = grid[r][c];
        if (tile && tile.color === targetColor) {
          cleared.push({ row: r, col: c });
        }
      }
    }
    return { clearedCoords: cleared, soundType: 'yarn', synergyType: 'YARN_COLOR_CLEAR' };
  }

  // 5. Bomb + Bomb -> Huge 5x5 detonation!
  if (p1 === 'bomb' && p2 === 'bomb') {
    const centerR = Math.round((t1Pos.row + t2Pos.row) / 2);
    const centerC = Math.round((t1Pos.col + t2Pos.col) / 2);
    const cleared: { row: number; col: number }[] = [];
    for (let r = centerR - 2; r <= centerR + 2; r++) {
      for (let c = centerC - 2; c <= centerC + 2; c++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c]) {
          cleared.push({ row: r, col: c });
        }
      }
    }
    return { clearedCoords: cleared, soundType: 'bomb', synergyType: 'MEGA_BOMB' };
  }

  // 6. Line Blast + Line Blast -> Cross blast (full row + full column)
  if ((p1 === 'line_h' || p1 === 'line_v') && (p2 === 'line_h' || p2 === 'line_v')) {
    const cleared: { row: number; col: number }[] = [];
    const targetR = t1Pos.row;
    const targetC = t1Pos.col;
    for (let c = 0; c < cols; c++) {
      if (grid[targetR][c]) cleared.push({ row: targetR, col: c });
    }
    for (let r = 0; r < rows; r++) {
      if (grid[r][targetC]) cleared.push({ row: r, col: targetC });
    }
    return { clearedCoords: cleared, soundType: 'rocket', synergyType: 'CROSS_BLAST' };
  }

  // 7. Bomb + Line Blast -> 3 rows and 3 columns cleared!
  if ((p1 === 'bomb' && (p2 === 'line_h' || p2 === 'line_v')) ||
      ((p1 === 'line_h' || p1 === 'line_v') && p2 === 'bomb')) {
    const cleared: { row: number; col: number }[] = [];
    const rMid = t1Pos.row;
    const cMid = t1Pos.col;
    for (let r = rMid - 1; r <= rMid + 1; r++) {
      if (r >= 0 && r < rows) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c]) cleared.push({ row: r, col: c });
        }
      }
    }
    for (let c = cMid - 1; c <= cMid + 1; c++) {
      if (c >= 0 && c < cols) {
        for (let r = 0; r < rows; r++) {
          if (grid[r][c]) cleared.push({ row: r, col: c });
        }
      }
    }
    return { clearedCoords: cleared, soundType: 'bomb', synergyType: 'TITAN_BLAST' };
  }

  // 8. Targeting Paw + Paw -> Spawns 3 homing paws!
  if (p1 === 'targeting_paw' && p2 === 'targeting_paw') {
    const targets = findHomingTargets(grid, currentGrass, level, 3);
    const cleared = [t1Pos, t2Pos, ...targets];
    return { clearedCoords: cleared, soundType: 'paw', synergyType: 'TRIPLE_PAW', homingPawTargets: targets };
  }

  // 9. Single Powerup clicked or swapped with normal tile
  const activeP = p1 || p2;
  const activePos = p1 ? t1Pos : t2Pos;

  if (activeP === 'bomb') {
    const cleared: { row: number; col: number }[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = activePos.row + dr;
        const nc = activePos.col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc]) {
          cleared.push({ row: nr, col: nc });
        }
      }
    }
    return { clearedCoords: cleared, soundType: 'bomb' };
  }

  if (activeP === 'line_h') {
    const cleared: { row: number; col: number }[] = [];
    for (let c = 0; c < cols; c++) {
      if (grid[activePos.row][c]) cleared.push({ row: activePos.row, col: c });
    }
    return { clearedCoords: cleared, soundType: 'rocket' };
  }

  if (activeP === 'line_v') {
    const cleared: { row: number; col: number }[] = [];
    for (let r = 0; r < rows; r++) {
      if (grid[r][activePos.col]) cleared.push({ row: r, col: activePos.col });
    }
    return { clearedCoords: cleared, soundType: 'rocket' };
  }

  if (activeP === 'targeting_paw') {
    // Cross 1-cell around it + homing target to an objective!
    const cleared: { row: number; col: number }[] = [activePos];
    const neighbors = [
      { r: activePos.row - 1, c: activePos.col },
      { r: activePos.row + 1, c: activePos.col },
      { r: activePos.row, c: activePos.col - 1 },
      { r: activePos.row, c: activePos.col + 1 }
    ];
    neighbors.forEach(n => {
      if (n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols && grid[n.r][n.c]) {
        cleared.push({ row: n.r, col: n.c });
      }
    });

    const target = findHomingTargets(grid, currentGrass, level, 1)[0];
    if (target) {
      cleared.push(target);
      return { clearedCoords: cleared, soundType: 'paw', homingPawTargets: [target] };
    }
    return { clearedCoords: cleared, soundType: 'paw' };
  }

  return null;
}

/**
 * Intelligent Homing Target finder for Targeting Paw:
 * Prioritizes:
 * 1. Grass layer that covers a hidden cat statue!
 * 2. Any active grass layer
 * 3. Tile underneath a milk bottle to help it drop!
 * 4. Level objective target tile
 * 5. Random tile
 */
export function findHomingTargets(
  grid: (Tile | null)[][],
  currentGrass: number[][],
  level: LevelConfig,
  count = 1
): { row: number; col: number }[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const candidates: { row: number; col: number; score: number }[] = [];

  // Check uncollected cat statues with grass on top
  for (const s of level.statues) {
    if (!s.isCollected) {
      for (let r = s.startRow; r < s.startRow + s.height; r++) {
        for (let c = s.startCol; c < s.startCol + s.width; c++) {
          if (currentGrass[r] && currentGrass[r][c] > 0) {
            candidates.push({ row: r, col: c, score: 100 });
          }
        }
      }
    }
  }

  // Any grass
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (currentGrass[r][c] > 0 && !candidates.some(cand => cand.row === r && cand.col === c)) {
        candidates.push({ row: r, col: c, score: 50 });
      }
    }
  }

  // Tile below a milk bottle
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c]?.isMilkBottle && grid[r + 1][c] && !grid[r + 1][c]?.isMilkBottle) {
        candidates.push({ row: r + 1, col: c, score: 80 });
      }
    }
  }

  // If no candidates, pick valid tiles
  if (candidates.length === 0) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          candidates.push({ row: r, col: c, score: 10 });
        }
      }
    }
  }

  // Sort by score desc, randomize ties
  candidates.sort((a, b) => b.score - a.score + (Math.random() - 0.5));
  return candidates.slice(0, count).map(c => ({ row: c.row, col: c.col }));
}

/**
 * Apply Gravity & Column Refill:
 * 1. Milk bottles that reach the bottom row are marked for collection!
 * 2. Unmatched tiles fall down to fill holes in playable cells.
 * 3. New tiles spawn at the top of each column.
 */
export function applyGravityAndRefill(
  grid: (Tile | null)[][],
  level: LevelConfig
): {
  newGrid: (Tile | null)[][];
  milkCollected: number;
} {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid: (Tile | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
  let milkCollected = 0;

  // Clone non-null tiles column-by-column
  for (let c = 0; c < cols; c++) {
    const survivingTiles: Tile[] = [];

    for (let r = 0; r < rows; r++) {
      const tile = grid[r][c];
      if (tile && !tile.isMatched) {
        survivingTiles.push(tile);
      }
    }

    // Identify playable slots in this column from bottom to top
    const playableRows: number[] = [];
    for (let r = rows - 1; r >= 0; r--) {
      if (level.layout[r][c]) {
        playableRows.push(r);
      }
    }

    // Place existing surviving tiles in playable slots from bottom up
    for (let i = 0; i < playableRows.length; i++) {
      const targetR = playableRows[i];
      if (survivingTiles.length > 0) {
        const tile = survivingTiles.pop()!;
        tile.row = targetR;
        tile.col = c;
        newGrid[targetR][c] = tile;
      } else {
        // Spawn a new tile at the top!
        const color = getRandomColor(level.allowedColors);
        newGrid[targetR][c] = createTile(targetR, c, color);
      }
    }
  }

  // Check bottom-most playable cell for milk bottle deliveries!
  for (let c = 0; c < cols; c++) {
    // Find lowest playable row in column
    let bottomPlayableR = -1;
    for (let r = rows - 1; r >= 0; r--) {
      if (level.layout[r][c]) {
        bottomPlayableR = r;
        break;
      }
    }

    if (bottomPlayableR !== -1) {
      const bottomTile = newGrid[bottomPlayableR][c];
      if (bottomTile?.isMilkBottle) {
        milkCollected++;
        // Remove delivered milk bottle
        newGrid[bottomPlayableR][c] = null;
      }
    }
  }

  return { newGrid, milkCollected };
}
