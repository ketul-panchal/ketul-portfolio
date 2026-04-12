import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TextScramble = ({ texts, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(true);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  const scramble = useCallback((targetText) => {
    let iteration = 0;
    const maxIterations = targetText.length;

    setIsScrambling(true);

    const scrambleInterval = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1 / 3;

      if (iteration >= maxIterations) {
        clearInterval(scrambleInterval);
        setDisplayText(targetText);
        setIsScrambling(false);
      }
    }, 30);

    return () => clearInterval(scrambleInterval);
  }, []);

  useEffect(() => {
    scramble(texts[currentIndex]);

    const textInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(textInterval);
  }, [currentIndex, texts, interval, scramble]);

  useEffect(() => {
    scramble(texts[currentIndex]);
  }, [currentIndex, texts, scramble]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`scramble-text ${isScrambling ? 'scrambling' : ''}`}
      >
        {displayText}
      </motion.span>
    </AnimatePresence>
  );
};

export default TextScramble;