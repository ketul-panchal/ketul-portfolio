/**
 * Holds the single Lenis instance so anything that needs to move the page can
 * hand the request to Lenis instead of racing it.
 *
 * Native `scrollIntoView({ behavior: 'smooth' })` and Lenis both animate the
 * scroll position on their own schedule; running them at once makes the page
 * fight itself and stutter to a halt.
 */
let instance = null;

export const setLenisInstance = (lenis) => {
    instance = lenis;
};

/**
 * Scrolls to an element, through Lenis when it is running and via the native
 * API otherwise (reduced-motion users, or before Lenis has mounted).
 *
 * Offset defaults to 0 so the landing position matches what
 * `scrollIntoView({ block: 'start' })` did — element top at viewport top.
 *
 * @param {Element} element - Target element.
 * @param {number} [offset] - Pixels to stop short, e.g. to clear a fixed navbar.
 */
export const scrollToElement = (element, offset = 0) => {
    if (!element) return;

    if (instance) {
        instance.scrollTo(element, { offset, duration: 1.2 });
        return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
