import { GamePiece, EmojiType, Position, Match, GRID_ROWS, GRID_COLS, EMOJI_TYPES } from './types';

let idCounter = 0;
const generateId = () => `piece-${++idCounter}`;

/** Returns the active emoji subset based on the current level */
export const getActiveTypes = (_level: number): EmojiType[] => {
  return EMOJI_TYPES;
};

const randomType = (level: number = 1): EmojiType => {
  const types = getActiveTypes(level);
  return types[Math.floor(Math.random() * types.length)];
};

/** Candy Crush level generation: random 9×9 grid with no initial blocks of 3+ (101computing.net) */
export const createGrid = (level: number = 1): GamePiece[][] => {
  let grid: GamePiece[][] = [];
  do {
    grid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      grid[row] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        let type = randomType(level);
        while (
          (col >= 2 && grid[row][col - 1].type === type && grid[row][col - 2].type === type) ||
          (row >= 2 && grid[row - 1][col].type === type && grid[row - 2][col].type === type)
        ) {
          type = randomType(level);
        }
        grid[row][col] = { id: generateId(), type, row, col, isMatched: false, isNew: false };
      }
    }
  } while (findMatches(grid).length > 0);
  return grid;
};

export const cloneGrid = (grid: GamePiece[][]): GamePiece[][] =>
  grid.map(row => row.map(piece => ({ ...piece })));

export const swapPieces = (grid: GamePiece[][], a: Position, b: Position): GamePiece[][] => {
  const newGrid = cloneGrid(grid);
  const temp = { ...newGrid[a.row][a.col] };
  newGrid[a.row][a.col] = { ...newGrid[b.row][b.col], row: a.row, col: a.col };
  newGrid[b.row][b.col] = { ...temp, row: b.row, col: b.col };
  return newGrid;
};

/** Matches are horizontal or vertical only (3+ in a row or column). No diagonal or L-shapes. */
export const findMatches = (grid: GamePiece[][]): Match[] => {
  const matches: Match[] = [];
  // Horizontal: same row, consecutive columns
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS - 2; col++) {
      const type = grid[row][col].type;
      if (type === grid[row][col + 1].type && type === grid[row][col + 2].type) {
        const positions: Position[] = [{ row, col }];
        let end = col + 1;
        while (end < GRID_COLS && grid[row][end].type === type) {
          positions.push({ row, col: end });
          end++;
        }
        matches.push({ positions });
        col = end - 1;
      }
    }
  }
  // Vertical: same column, consecutive rows
  for (let col = 0; col < GRID_COLS; col++) {
    for (let row = 0; row < GRID_ROWS - 2; row++) {
      const type = grid[row][col].type;
      if (type === grid[row + 1][col].type && type === grid[row + 2][col].type) {
        const positions: Position[] = [{ row, col }];
        let end = row + 1;
        while (end < GRID_ROWS && grid[end][col].type === type) {
          positions.push({ row: end, col });
          end++;
        }
        matches.push({ positions });
        row = end - 1;
      }
    }
  }
  return matches;
};

export const markMatches = (grid: GamePiece[][], matches: Match[]): GamePiece[][] => {
  const newGrid = cloneGrid(grid);
  matches.forEach(match => {
    match.positions.forEach(pos => {
      newGrid[pos.row][pos.col].isMatched = true;
    });
  });
  return newGrid;
};

export const applyGravity = (grid: GamePiece[][], level: number = 1): GamePiece[][] => {
  const newGrid = cloneGrid(grid);
  for (let col = 0; col < GRID_COLS; col++) {
    const remaining = [];
    for (let row = GRID_ROWS - 1; row >= 0; row--) {
      if (!newGrid[row][col].isMatched) remaining.push(newGrid[row][col]);
    }
    const needed = GRID_ROWS - remaining.length;
    for (let i = 0; i < needed; i++) {
      remaining.push({
        id: generateId(),
        type: randomType(level),
        row: 0,
        col,
        isMatched: false,
        isNew: true,
      });
    }
    remaining.reverse();
    for (let row = 0; row < GRID_ROWS; row++) {
      newGrid[row][col] = { ...remaining[row], row, col };
    }
  }
  return newGrid;
};

export const hasValidMoves = (grid: GamePiece[][]): boolean => {
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (col < GRID_COLS - 1) {
        const swapped = swapPieces(grid, { row, col }, { row, col: col + 1 });
        if (findMatches(swapped).length > 0) return true;
      }
      if (row < GRID_ROWS - 1) {
        const swapped = swapPieces(grid, { row, col }, { row: row + 1, col });
        if (findMatches(swapped).length > 0) return true;
      }
    }
  }
  return false;
};

export const countMatchedPieces = (matches: Match[]): number => {
  const unique = new Set<string>();
  matches.forEach(m => m.positions.forEach(p => unique.add(`${p.row},${p.col}`)));
  return unique.size;
};
