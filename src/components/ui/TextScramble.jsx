import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Uppercase only, so the decoding text doesn't jump around in width
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*';
const FRAME_MS = 30;
const CHARS_PER_FRAME = 1 / 3; // one character locks in every 3 frames

const scrambled = (text, revealed) =>
  text
    .split('')
    .map((char, i) =>
      char === ' ' || i < revealed ? char : CHARS[Math.floor(Math.random() * CHARS.length)]
    )
    .join('');

/**
 * Cycles through `texts`, decoding each one out of random characters.
 * `interval` is how long (ms) each text stays fully decoded before the next one starts.
 */
const TextScramble = ({ texts, interval = 3000 }) => {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const target = texts[index % texts.length];

  // Depends on the target string (not the `texts` array) so a parent re-render
  // with a new array can't restart the decode or the cycle timer.
  useEffect(() => {
    const showNext = () => setIndex((i) => (i + 1) % texts.length);

    if (reduceMotion) {
      const timer = setTimeout(showNext, interval);
      return () => clearTimeout(timer);
    }

    let revealed = 0;
    let holdTimer;
    const frameTimer = setInterval(() => {
      revealed += CHARS_PER_FRAME;
      if (revealed < target.length) {
        setDisplayText(scrambled(target, revealed));
        return;
      }
      clearInterval(frameTimer);
      setDisplayText(target);
      holdTimer = setTimeout(showNext, interval);
    }, FRAME_MS);

    return () => {
      clearInterval(frameTimer);
      clearTimeout(holdTimer);
    };
  }, [target, interval, texts.length, reduceMotion]);

  const text = reduceMotion ? target : displayText;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`scramble-text ${text !== target ? 'scrambling' : ''}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
};

export default TextScramble;
