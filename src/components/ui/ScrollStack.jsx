import { useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import './ScrollStack.css';

// While the next card slides over a card, the covered one shrinks and darkens a little
const DEPTH_SCALE = 0.06;
const DEPTH_SHADE = 0.6;

export const ScrollStackItem = ({ children, itemClassName = '', style }) => (
    <div className={`scroll-stack-card ${itemClassName}`.trim()} style={style}>
        <div className="scroll-stack-card-inner">
            {children}
            <span className="scroll-stack-shade" aria-hidden="true" />
        </div>
    </div>
);

/**
 * Makes the cards in `container` pile up as the page scrolls. Returns a cleanup function.
 *
 * A card taller than the screen sticks by its bottom edge rather than its top, so all of it
 * is seen before the next card covers it.
 */
function stackCards(container, { depth }) {
    const cards = [...container.children];
    const inners = cards.map((card) => card.firstElementChild);
    const shades = inners.map((inner) => inner.lastElementChild);
    const covered = cards.map(() => 0); // 0 = nothing on top of it yet, 1 = fully covered
    const live = cards.map(() => false);

    // --card-h feeds the sticky offset in ScrollStack.css
    const sizes = new ResizeObserver((entries) => {
        for (const { target, borderBoxSize } of entries) {
            const height = borderBoxSize?.[0]?.blockSize ?? target.offsetHeight;
            target.style.setProperty('--card-h', `${Math.round(height)}px`);
        }
    });
    cards.forEach((card) => sizes.observe(card));

    const update = () => {
        const vh = window.innerHeight;
        const rects = cards.map((card) => card.getBoundingClientRect());

        for (let i = 0; i < cards.length; i++) {
            const next = rects[i + 1];
            const amount = next ? Math.min(1, Math.max(0, 1 - next.top / vh)) : 0;
            const settled = amount === 0 || amount === 1;
            if (amount === covered[i] || (!settled && Math.abs(amount - covered[i]) < 0.001)) continue;

            // A card buried under the next one isn't drawn at all (it stays focusable, unlike
            // with visibility: hidden)
            if ((amount >= 1) !== (covered[i] >= 1)) inners[i].style.opacity = amount >= 1 ? '0' : '';
            covered[i] = amount;

            if (!depth) continue;
            inners[i].style.transform = amount ? `scale(${(1 - DEPTH_SCALE * amount).toFixed(4)})` : '';
            shades[i].style.opacity = amount ? (DEPTH_SHADE * amount).toFixed(3) : '';
        }

        // Cards on screen (or about to be) get their own layer, so shrinking them costs no repaints
        if (!depth) return;
        for (let i = 0; i < cards.length; i++) {
            const isLive = covered[i] < 1 && rects[i].top < vh * 1.25 && rects[i].bottom > -vh * 0.25;
            if (isLive === live[i]) continue;
            live[i] = isLive;
            inners[i].classList.toggle('is-live', isLive);
        }
    };

    // Tabbing to a link in a covered card scrolls back to that card, so the focus is never hidden
    const revealFocused = (event) => {
        const i = cards.findIndex((card) => card.contains(event.target));
        if (i < 0 || !covered[i]) return;
        let top = container.getBoundingClientRect().top + window.scrollY;
        for (let k = 0; k < i; k++) top += cards[k].offsetHeight;
        window.scrollTo({ top, behavior: 'instant' });
    };
    container.addEventListener('focusin', revealFocused);

    // Only follow the scroll while the stack is on screen
    let following = false;
    const follow = (on) => {
        if (on === following) return;
        following = on;
        if (on) {
            window.addEventListener('scroll', update, { passive: true });
            window.addEventListener('resize', update);
            update();
        } else {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            update(); // settle the final state, which also drops the layers of cards now off screen
        }
    };
    const visibility = new IntersectionObserver(([entry]) => follow(entry.isIntersecting));
    visibility.observe(container);

    return () => {
        follow(false);
        visibility.disconnect();
        sizes.disconnect();
        container.removeEventListener('focusin', revealFocused);
        inners.forEach((inner, i) => {
            inner.classList.remove('is-live');
            inner.style.transform = '';
            inner.style.opacity = '';
            shades[i].style.opacity = '';
        });
    };
}

const ScrollStack = ({ children, className = '' }) => {
    const containerRef = useRef(null);
    const reduceMotion = Boolean(useReducedMotion());

    useLayoutEffect(() => stackCards(containerRef.current, { depth: !reduceMotion }), [reduceMotion]);

    return (
        <div ref={containerRef} className={`scroll-stack-container ${className}`.trim()}>
            {children}
        </div>
    );
};

export default ScrollStack;
