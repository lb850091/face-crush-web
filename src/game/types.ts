export type EmojiType = 'happy' | 'angry' | 'cool' | 'love' | 'silly' | 'shocked';

export interface GamePiece {
  id: string;
  type: EmojiType;
  row: number;
  col: number;
  isMatched: boolean;
  isNew: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Match {
  positions: Position[];
}

/** Candy Crush style: 9×9 grid, 6 types (see 101computing.net/candy-crush-level-generation) */
export const GRID_ROWS = 9;
export const GRID_COLS = 9;
export const EMOJI_TYPES: EmojiType[] = ['happy', 'angry', 'cool', 'love', 'silly', 'shocked'];
