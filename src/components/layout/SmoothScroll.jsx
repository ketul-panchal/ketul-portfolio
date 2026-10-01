import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const SmoothScroll = ({ children, paused = false }) => {
    const lenisRef = useRef(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 2.8, // Adjusted for slower scroll
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Standard easing
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });
        lenisRef.current = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // Lock scrolling (smooth and native) while the intro plays over the page
    useEffect(() => {
        if (!paused) return;

        const lenis = lenisRef.current;
        lenis?.stop();
        document.body.style.overflow = 'hidden';

        return () => {
            lenis?.start();
            document.body.style.overflow = '';
        };
    }, [paused]);

    return <div className="smooth-scroll-wrapper">{children}</div>;
};

export default SmoothScroll;
