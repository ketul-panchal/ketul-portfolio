import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Returns a ref and a boolean indicating whether the element is in view.
 * Pairs directly with Framer Motion's `animate` prop.
 *
 * Usage:
 *   const [ref, isVisible] = useScrollAnimation();
 *   <motion.div ref={ref} animate={isVisible ? 'visible' : 'hidden'} variants={...} />
 *
 * @param {object} options - Options forwarded to framer-motion's useInView.
 * @param {boolean} [options.once=true]   - Only trigger the animation once.
 * @param {string}  [options.margin]      - Intersection margin, e.g. "-100px".
 */
export function useScrollAnimation({ once = true, margin = '-80px' } = {}) {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once, margin });
  return [ref, isVisible];
}
