import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiFace from './EmojiFace';
import { GamePiece, Position, GRID_ROWS, GRID_COLS } from '@/game/types';
import {
  createGrid, swapPieces, findMatches, markMatches, applyGravity,
  hasValidMoves, countMatchedPieces, getActiveTypes,
} from '@/game/engine';

interface GameBoardProps {
  onScore: (points: number, combo: number) => void;
  onCombo: (combo: number) => void;
  level: number;
}

const GameBoard = ({ onScore, onCombo, level }: GameBoardProps) => {
  const [grid, setGrid] = useState<GamePiece[][]>(() => createGrid(level));
  const [selected, setSelected] = useState<Position | null>(null);
  const [processing, setProcessing] = useState(false);
  const [combo, setCombo] = useState(0);
  const touchStart = useRef<Position | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const cellSize = typeof window !== 'undefined'
    ? Math.min(Math.floor((Math.min(window.innerWidth, 420) - 24) / GRID_COLS), 48)
    : 44;

  const processMatches = useCallback(async (currentGrid: GamePiece[][], currentCombo: number) => {
    const matches = findMatches(currentGrid);
    if (matches.length === 0) {
      setCombo(0);
      if (!hasValidMoves(currentGrid)) {
        setGrid(createGrid(level));
      }
      setProcessing(false);
      return;
    }

    const newCombo = currentCombo + 1;
    setCombo(newCombo);
    onCombo(newCombo);

    const points = countMatchedPieces(matches) * 10 * newCombo;
    onScore(points, newCombo);

    const marked = markMatches(currentGrid, matches);
    setGrid(marked);

    await new Promise(r => setTimeout(r, 350));

    const fallen = applyGravity(marked, level);
    setGrid(fallen);

    await new Promise(r => setTimeout(r, 300));

    processMatches(fallen, newCombo);
  }, [level, onScore, onCombo]);

  const handleSwap = useCallback(async (a: Position, b: Position) => {
    if (processing) return;
    const dr = Math.abs(a.row - b.row);
    const dc = Math.abs(a.col - b.col);
    if (dr + dc !== 1) return;

    setProcessing(true);
    setSelected(null);

    const swapped = swapPieces(grid, a, b);
    setGrid(swapped);

    await new Promise(r => setTimeout(r, 200));

    const matches = findMatches(swapped);
    if (matches.length === 0) {
      await new Promise(r => setTimeout(r, 200));
      setGrid(swapPieces(swapped, a, b));
      setProcessing(false);
      return;
    }

    processMatches(swapped, 0);
  }, [grid, processing, processMatches]);

  const handleCellClick = (row: number, col: number) => {
    if (processing) return;
    if (selected) {
      handleSwap(selected, { row, col });
    } else {
      setSelected({ row, col });
    }
  };

  const handleTouchStart = (row: number, col: number) => {
    touchStart.current = { row, col };
  };

  const handleTouchEnd = (row: number, col: number, e: React.TouchEvent) => {
    if (!touchStart.current || processing) return;
    const boardEl = boardRef.current;
    if (!boardEl) return;
    const touch = e.changedTouches[0];
    const rect = boardEl.getBoundingClientRect();
    const endCol = Math.floor((touch.clientX - rect.left) / cellSize);
    const endRow = Math.floor((touch.clientY - rect.top) / cellSize);

    if (endRow >= 0 && endRow < GRID_ROWS && endCol >= 0 && endCol < GRID_COLS) {
      const dr = endRow - touchStart.current.row;
      const dc = endCol - touchStart.current.col;
      if (Math.abs(dr) + Math.abs(dc) === 1) {
        handleSwap(touchStart.current, { row: endRow, col: endCol });
      }
    }
    touchStart.current = null;
  };

  return (
    <div
      ref={boardRef}
      className="grid gap-0.5 p-2 rounded-2xl bg-card/80 backdrop-blur-md border border-border/50 shadow-[0_0_40px_hsl(270,60%,30%,0.4)] mx-auto relative z-10"
      style={{
        gridTemplateColumns: `repeat(${GRID_COLS}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, ${cellSize}px)`,
        touchAction: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {grid.map((row, ri) =>
          row.map((piece, ci) => (
            <motion.div
              key={piece.id}
              layout
              initial={piece.isNew ? { y: -cellSize * 2, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex items-center justify-center"
              onClick={() => handleCellClick(ri, ci)}
              onTouchStart={() => handleTouchStart(ri, ci)}
              onTouchEnd={(e) => handleTouchEnd(ri, ci, e)}
            >
              <EmojiFace
                type={piece.type}
                size={cellSize - 2}
                isMatched={piece.isMatched}
                isSelected={selected?.row === ri && selected?.col === ci}
              />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameBoard;
