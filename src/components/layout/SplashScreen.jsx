import { useState, useEffect, useRef } from 'react';
import {
    motion,
    AnimatePresence,
    animate,
    useMotionValue,
    useMotionTemplate,
    useTransform,
} from 'framer-motion';
import './SplashScreen.css';

const COUNT_DURATION = 2000; // ms for the counter to reach 100
const COUNT_TICK = 20;
const HOLD = 450; // ms to let the ball settle at 100% before the reveal
const REVEAL_DURATION = 1.2; // s for the hole to open across the whole screen
const BALL_RADIUS = 10;

/**
 * Counts to 100, then the ball blasts open into a hole that grows until the
 * page rendered underneath is fully revealed.
 *
 * - `ready`      the page underneath is mounted; the counter holds at 99 until then
 * - `onReveal`   fired as the hole starts opening (start page intro animations here)
 * - `onComplete` fired once the page is fully uncovered (unmount the splash here)
 */
const SplashScreen = ({ ready = true, onReveal, onComplete }) => {
    const splashRef = useRef(null);
    const [count, setCount] = useState(0);
    const loaded = count === 100 && ready;

    // 0 → 1 over the reveal; the hole radius scales with it up to `maxRadius`
    const progress = useMotionValue(0);
    const maxRadius = useMotionValue(0);
    const radius = useTransform([progress, maxRadius], ([p, max]) => p * max);
    const edge = useTransform(radius, (r) => r + 1);
    const mask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${radius}px, #000 ${edge}px)`;

    const ringSize = useTransform(radius, (r) => r * 2);
    const ringOpacity = useTransform(progress, [0, 0.1, 0.75, 1], [0, 1, 0.8, 0]);
    // The ball swells with the hole and burns out, so it reads as the ball bursting open
    const ballScale = useTransform(radius, (r) => Math.max(1, r / BALL_RADIUS));
    const ballOpacity = useTransform(progress, [0, 0.15], [1, 0]);

    useEffect(() => {
        const step = 100 / (COUNT_DURATION / COUNT_TICK);

        const timer = setInterval(() => {
            setCount((prev) => {
                const next = Math.min(prev + step, 100);
                if (next === 100) clearInterval(timer);
                return next;
            });
        }, COUNT_TICK);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!loaded) return;

        let controls;
        const timeout = setTimeout(() => {
            const { width, height } = splashRef.current.getBoundingClientRect();
            // Far enough to clear the corners of the screen
            maxRadius.set(Math.hypot(width, height) / 2 + 2);

            onReveal?.();
            controls = animate(progress, 1, {
                duration: REVEAL_DURATION,
                ease: [0.76, 0, 0.24, 1],
                onComplete,
            });
        }, HOLD);

        return () => {
            clearTimeout(timeout);
            controls?.stop();
        };
    }, [loaded, onReveal, onComplete, progress, maxRadius]);

    return (
        <div className="splash-screen" ref={splashRef}>
            {/* Dark cover over the page — the reveal hole is masked out of it */}
            <motion.div
                className="splash-backdrop"
                style={{ maskImage: mask, WebkitMaskImage: mask }}
            />

            {/* Glowing rim riding the edge of the hole */}
            <motion.div
                className="splash-ring"
                style={{ width: ringSize, height: ringSize, opacity: ringOpacity }}
            />

            <motion.div
                className="splash-ball"
                style={{ scale: ballScale, opacity: ballOpacity }}
                animate={loaded ? { y: 0 } : { y: [0, -40, 0] }}
                transition={
                    loaded
                        ? { duration: 0.35, ease: 'easeOut' }
                        : { duration: 1, repeat: Infinity, ease: 'circOut' }
                }
            />

            <AnimatePresence>
                {!loaded && (
                    <motion.div
                        className="splash-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <span className="count">
                            {Math.min(Math.round(count), ready ? 100 : 99)}%
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SplashScreen;
