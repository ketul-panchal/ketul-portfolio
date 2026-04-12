/**
 * Lightweight class-name utility — merges any number of
 * strings / conditionals into a single trimmed class string.
 *
 * Usage:
 *   cn('foo', isActive && 'bar', undefined, 'baz')
 *   // → "foo bar baz"
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ').trim();
}
