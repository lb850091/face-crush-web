import { motion, AnimatePresence } from 'framer-motion';

interface GameHeaderProps {
  score: number;
  level: number;
  combo: number;
}

const GameHeader = ({ score, level, combo }: GameHeaderProps) => (
  <div className="flex items-center justify-between w-full max-w-md mx-auto px-4 py-3 relative z-10">
    <div className="text-center bg-secondary/60 rounded-xl px-3 py-1.5">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Level</div>
      <div className="text-2xl font-black text-foreground">{level}</div>
    </div>

    <div className="text-center flex-1 mx-3 bg-secondary/60 rounded-xl px-3 py-1.5">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Score</div>
      <motion.div
        key={score}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="text-3xl font-black text-primary drop-shadow-[0_0_8px_hsl(45,100%,55%,0.5)]"
      >
        {score.toLocaleString()}
      </motion.div>
    </div>

    <div className="text-center min-w-[60px] bg-secondary/60 rounded-xl px-3 py-1.5">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Combo</div>
      <AnimatePresence mode="wait">
        {combo > 1 && (
          <motion.div
            key={combo}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="text-2xl font-black text-accent"
          >
            🔥x{combo}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default GameHeader;
