import { motion } from 'framer-motion';
import { EmojiType } from '@/game/types';

interface EmojiFaceProps {
  type: EmojiType;
  size?: number;
  isMatched?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * High-contrast emoji configurations designed for accessibility.
 * Each emoji has a unique shape, distinct color, AND a unique symbol/pattern
 * so they can be distinguished by color-blind users.
 * No backgrounds or borders — the emoji itself IS the visual.
 */
const EMOJI_CONFIG: Record<EmojiType, { emoji: string; label: string; glow: string; bg: string }> = {
  happy:   { emoji: '😊', label: 'Happy',   glow: '50, 205, 50',   bg: 'rgba(50,205,50,0.18)' },
  angry:   { emoji: '😡', label: 'Angry',   glow: '255, 55, 80',   bg: 'rgba(255,55,80,0.18)' },
  cool:    { emoji: '😎', label: 'Cool',    glow: '0, 180, 255',   bg: 'rgba(0,180,255,0.18)' },
  love:    { emoji: '🥰', label: 'Love',    glow: '255, 100, 200', bg: 'rgba(255,100,200,0.18)' },
  silly:   { emoji: '🤪', label: 'Silly',   glow: '255, 175, 0',   bg: 'rgba(255,175,0,0.18)' },
  shocked: { emoji: '😱', label: 'Shocked', glow: '180, 100, 255', bg: 'rgba(180,100,255,0.18)' },
};

const EmojiFace = ({ type, size = 40, isMatched, isSelected, onClick }: EmojiFaceProps) => {
  const config = EMOJI_CONFIG[type];

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex items-center justify-center select-none cursor-pointer p-0 border-0 rounded-xl
        ${isSelected ? 'z-10' : ''}
      `}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.72,
        lineHeight: 1,
        background: config.bg,
        boxShadow: isSelected
          ? `0 0 16px 4px rgba(${config.glow},0.7), inset 0 0 8px rgba(${config.glow},0.3)`
          : `0 0 8px 1px rgba(${config.glow},0.25)`,
        border: `2px solid rgba(${config.glow}, ${isSelected ? 0.8 : 0.3})`,
      }}
      animate={
        isMatched
          ? { scale: [1, 1.3, 0], opacity: [1, 1, 0], rotate: [0, 15, -15] }
          : isSelected
            ? { scale: [1, 1.12, 1.05], transition: { repeat: Infinity, duration: 0.6 } }
            : { scale: 1, opacity: 1 }
      }
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      aria-label={config.label}
    >
      <span
        className="block relative"
        style={{
          filter: `drop-shadow(0 0 6px rgba(${config.glow},0.6)) drop-shadow(0 2px 3px rgba(0,0,0,0.3))`,
        }}
      >
        {config.emoji}
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `rgb(${config.glow})`,
            mixBlendMode: 'color',
          }}
        />
      </span>
    </motion.button>
  );
};

export default EmojiFace;
