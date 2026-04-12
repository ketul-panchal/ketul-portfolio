// ─── Brand ────────────────────────────────────────────────────────────────────
export const SITE_TITLE = 'Ketul Panchal | Full Stack Developer';
export const SITE_URL = 'https://ketul-panchal.github.io/ketul-portfolio/';

// ─── Personal Links ───────────────────────────────────────────────────────────
export const LINKS = {
  email: 'ketulpanchal5@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ketul10',
  github: 'https://github.com/ketul-panchal',
  resume: 'https://drive.google.com/file/d/1UbK2JWwgEFSIuvong6QYrl3cVxq-nBd7/view?usp=sharing',
};

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: 'Home', link: '#home' },
  { label: 'About', link: '#about' },
  { label: 'Skills', link: '#skills' },
  { label: 'Projects', link: '#projects' },
  { label: 'Contact', link: '#contact' },
];

// ─── Breakpoints ──────────────────────────────────────────────────────────────
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

// ─── Animation ────────────────────────────────────────────────────────────────
export const EASING = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.34, 1.56, 0.64, 1],
  linear: [0, 0, 1, 1],
};

export const TRANSITION = {
  fast: { duration: 0.2, ease: EASING.smooth },
  base: { duration: 0.5, ease: EASING.smooth },
  slow: { duration: 0.8, ease: EASING.smooth },
};
