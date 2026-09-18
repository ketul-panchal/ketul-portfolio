import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from '../../utils/lenis';

const SmoothScroll = ({ children }) => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return undefined;

        const lenis = new Lenis({
            /*
             * Was 2.8s. That is how long Lenis keeps easing toward the target
             * after the wheel stops — long enough that the page visibly drifts
             * behind the input, which reads as lag rather than smoothness.
             * ~1.1s is the usual sweet spot.
             */
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

            /*
             * These are the Lenis v1 names. The previous config passed the v0
             * spelling (`direction`, `gestureDirection`, `smooth`,
             * `mouseMultiplier`, `smoothTouch`), which v1 silently ignores — so
             * none of it was actually taking effect.
             */
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,

            /*
             * Left off deliberately. Hijacking touch means every swipe is
             * re-driven from JS instead of the compositor, and on a stack of
             * eight sticky full-screen cards that is exactly where the stutter
             * and tearing came from. Native touch scrolling is already smooth.
             */
            syncTouch: false,
        });

        // Share it so navbar links scroll *through* Lenis rather than
        // against it.
        setLenisInstance(lenis);

        // Keep the handle so the loop actually stops on unmount — the previous
        // version kept requesting frames forever after lenis.destroy().
        let frame = 0;
        const raf = (time) => {
            lenis.raf(time);
            frame = requestAnimationFrame(raf);
        };
        frame = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(frame);
            setLenisInstance(null);
            lenis.destroy();
        };
    }, []);

    return <div className="smooth-scroll-wrapper">{children}</div>;
};

export default SmoothScroll;
