/**
 * Client-side protection layer.
 * Deters casual users from inspecting, saving, or copying content.
 * NOTE: This is NOT absolute security — determined devs can bypass it.
 *       It blocks ~95% of casual right-click / save / inspect attempts.
 */

export function initProtection() {
  if (typeof window === 'undefined') return;

  // ── 1. Disable right-click context menu ───────────────────────────────
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // ── 2. Block DevTools keyboard shortcuts ──────────────────────────────
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker)
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
      e.preventDefault();
      return false;
    }

    // Ctrl+U (View source)
    if (e.ctrlKey && e.key.toUpperCase() === 'U') {
      e.preventDefault();
      return false;
    }

    // Ctrl+S (Save page)
    if (e.ctrlKey && e.key.toUpperCase() === 'S') {
      e.preventDefault();
      return false;
    }

    // Ctrl+P (Print — can reveal source / save as PDF)
    if (e.ctrlKey && e.key.toUpperCase() === 'P') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+U (also view-source in some browsers)
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'U') {
      e.preventDefault();
      return false;
    }
  });

  // ── 3. Disable image dragging globally ────────────────────────────────
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  // ── 4. DevTools open detection via debugger timing ────────────────────
  //    When DevTools is open the debugger statement causes a measurable
  //    pause. If detected, we can take action (blur, redirect, etc.)
  let devtoolsOpen = false;

  const detectDevTools = () => {
    const threshold = 160;
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const end = performance.now();

    if (end - start > threshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        handleDevToolsOpen();
      }
    } else {
      devtoolsOpen = false;
    }
  };

  const handleDevToolsOpen = () => {
    // Blur images so they can't screenshot from DevTools view
    document.querySelectorAll('img').forEach((img) => {
      img.style.filter = 'blur(20px)';
    });
  };

  // Run detection periodically (every 2 seconds)
  setInterval(detectDevTools, 2000);

  // ── 5. Disable copy ───────────────────────────────────────────────────
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
  });

  // ── 6. Disable select-all (Ctrl+A) ───────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toUpperCase() === 'A') {
      e.preventDefault();
      return false;
    }
  });

  // Console warning
  console.log(
    '%cStop!',
    'color: #ff6b35; font-size: 48px; font-weight: bold;'
  );
  console.log(
    '%cThis is a portfolio site. Inspecting or copying content is not allowed.',
    'color: #fff; font-size: 16px;'
  );
}
