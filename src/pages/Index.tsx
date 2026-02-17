import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from '@/components/GameBoard';
import GameHeader from '@/components/GameHeader';
import iconUrl from '@/assets/icon.png';

const LEVEL_THRESHOLD = 500;
const TIMER_DURATION = 10;
const TIMED_MODE_LEVEL = 6;

interface FloatingPoint {
  id: number;
  points: number;
  x: number;
}

let fpId = 0;

const Index = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [floatingPoints, setFloatingPoints] = useState<FloatingPoint[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastLevelRef = useRef(level);

  const isTimedMode = level >= TIMED_MODE_LEVEL;

  useEffect(() => {
    if (isTimedMode && !gameOver) {
      if (level !== lastLevelRef.current) {
        setTimeLeft(TIMER_DURATION);
      }
      lastLevelRef.current = level;

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.05) {
            clearInterval(timerRef.current!);
            setGameOver(true);
            return 0;
          }
          return Math.max(0, prev - 0.05);
        });
      }, 50);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else if (!isTimedMode && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isTimedMode, level, gameOver]);

  const handleRestart = useCallback(() => {
    setScore(0);
    setLevel(1);
    setCombo(0);
    setGameOver(false);
    setTimeLeft(TIMER_DURATION);
    lastLevelRef.current = 1;
  }, []);

  const handleScore = useCallback((points: number, currentCombo: number) => {
    if (gameOver) return;

    setScore(prev => {
      const newScore = prev + points;
      const newLevel = Math.floor(newScore / LEVEL_THRESHOLD) + 1;
      setLevel(newLevel);
      return newScore;
    });

    if (level >= TIMED_MODE_LEVEL) {
      setTimeLeft(TIMER_DURATION);
    }

    const fp: FloatingPoint = {
      id: ++fpId,
      points,
      x: 30 + Math.random() * 40,
    };
    setFloatingPoints(prev => [...prev, fp]);
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== fp.id));
    }, 1200);
  }, [gameOver, level]);

  const handleCombo = useCallback((c: number) => setCombo(c), []);

  const timerPercent = (timeLeft / TIMER_DURATION) * 100;
  const timerCritical = timeLeft <= 3;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[hsl(270,60%,16%)] via-background to-[hsl(270,60%,8%)] overflow-hidden relative">
      {/* Bingo dot pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(45 100% 55%) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Title */}
      <div className="pt-5 pb-1 text-center relative z-10">
        <h1
          className="text-3xl font-black tracking-tight text-primary flex items-center gap-2"
          style={{
            textShadow:
              '0 0 6px rgba(255,200,0,0.9), 0 0 14px rgba(255,150,0,0.6), 0 0 20px hsl(45,100%,55%,0.4), 0 2px 0 rgba(0,0,0,0.3)',
          }}
        >
          <img
            src={iconUrl}
            alt=""
            className="w-9 h-9 object-contain"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(255,200,0,0.9)) drop-shadow(0 0 14px rgba(255,150,0,0.6)) drop-shadow(0 2px 0 rgba(0,0,0,0.5))',
            }}
          />
          Emoji Crush
        </h1>
      </div>

      <GameHeader score={score} level={level} combo={combo} />

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-8 text-center shadow-2xl max-w-xs mx-4"
            >
              <div className="text-5xl mb-3">💀</div>
              <h2 className="text-2xl font-black text-foreground mb-1">Time's Up!</h2>
              <p className="text-muted-foreground text-sm mb-1">You reached Level {level}</p>
              <p className="text-3xl font-black text-primary mb-5">{score.toLocaleString()} pts</p>
              <button
                onClick={handleRestart}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board */}
      <div className="relative mt-2">
        <GameBoard onScore={handleScore} onCombo={handleCombo} level={level} />

        {/* Floating points */}
        <AnimatePresence>
          {floatingPoints.map(fp => (
            <motion.div
              key={fp.id}
              initial={{ opacity: 1, y: 0, x: `${fp.x}%` }}
              animate={{ opacity: 0, y: -80 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute top-1/2 pointer-events-none text-xl font-black text-primary"
            >
              +{fp.points}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Timer bar at bottom (timed mode only) */}
      <AnimatePresence>
        {isTimedMode && !gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-3"
          >
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-1 px-1">
                <span className={`text-xs font-bold uppercase tracking-widest ${timerCritical ? 'text-destructive' : 'text-muted-foreground'}`}>
                  ⏱ {timeLeft.toFixed(1)}s
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${timerCritical ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}>
                  {timerCritical ? '🔥 HURRY!' : 'TIMED MODE'}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-secondary/80 overflow-hidden backdrop-blur-md border border-border/40">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${timerPercent}%`,
                    background: timerCritical
                      ? 'linear-gradient(90deg, hsl(0,80%,50%), hsl(30,100%,50%))'
                      : 'linear-gradient(90deg, hsl(45,100%,50%), hsl(35,100%,55%))',
                    boxShadow: timerCritical
                      ? '0 0 12px hsl(0,80%,50%,0.6)'
                      : '0 0 8px hsl(45,100%,50%,0.4)',
                  }}
                  animate={timerCritical ? { opacity: [1, 0.6, 1] } : {}}
                  transition={timerCritical ? { duration: 0.5, repeat: Infinity } : {}}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <p className="mt-4 text-sm text-muted-foreground text-center px-6 relative z-10">
        {isTimedMode
          ? 'Match before time runs out! Each match resets the timer ⏱'
          : 'Tap two adjacent emojis to swap • Match 3+ to score'}
      </p>

      {/* Footer links */}
      <div className="mt-auto pt-6 pb-4 flex justify-center gap-4 relative z-10">
        <Link
          to="/privacy"
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Privacy
        </Link>
        <Link
          to="/terms"
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Terms
        </Link>
      </div>
    </div>
  );
};

export default Index;
