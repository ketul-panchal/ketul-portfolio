import { useState, useEffect } from 'react';

/**
 * Returns true while the given CSS media query matches.
 *
 * Usage:
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export function useMediaQuery(query) {
  const getMatches = () =>
    typeof window !== 'undefined' && window.matchMedia(query).matches;

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
