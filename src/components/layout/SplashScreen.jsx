import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
    const [count, setCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const duration = 2000; // total loading time in ms
        const intervalTime = 20;
        const steps = duration / intervalTime;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setCount((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (count === 100) {
            const timeout = setTimeout(() => {
                setIsFinished(true);
                // Delay calling onComplete to allow blast animation to finish
                setTimeout(onComplete, 800);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [count, onComplete]);

    return (
        <motion.div
            className="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="splash-content">
                <AnimatePresence>
                    {!isFinished && (
                        <motion.div
                            className="ball-container"
                            exit={{ scale: 50, opacity: 0 }} // Blast effect handled here or in separate element
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            {/* Converting this to the blast element. 
                   Actually, better to have a dedicated blast element 
                   that scales up when finished.
               */}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* The Ball */}
                <motion.div
                    className="splash-ball"
                    animate={
                        isFinished
                            ? { scale: [1, 50], opacity: [1, 0] }
                            : { y: [0, -40, 0] }
                    }
                    transition={
                        isFinished
                            ? { duration: 0.8, ease: "easeInOut" }
                            : { duration: 1, repeat: Infinity, ease: "circOut" }
                    }
                />

                {/* Counter Text */}
                <AnimatePresence>
                    {!isFinished && (
                        <motion.div
                            className="splash-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <span className="count">{Math.round(count)}%</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background that might be revealed or overlay */}
        </motion.div>
    );
};

export default SplashScreen;
