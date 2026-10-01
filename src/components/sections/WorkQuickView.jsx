import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { FiArrowUpRight, FiChevronLeft, FiChevronRight, FiGithub, FiX } from 'react-icons/fi';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { SiUpwork } from 'react-icons/si';
import { projects as allProjects } from '../../data/projectsData';
import { getProjectImage } from '../../utils/projectImage';
import './WorkQuickView.css';

const ease = [0.22, 1, 0.36, 1];
const flipSpring = { type: 'spring', stiffness: 220, damping: 28 };

const pad = (n) => String(n).padStart(2, '0');
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Where a project link goes, so the button can say so
const LINK_TYPES = [
  { host: 'apps.apple.com', label: 'View on the App Store', Icon: FaApple },
  { host: 'play.google.com', label: 'Get it on Google Play', Icon: FaGooglePlay },
  { host: 'github.com', label: 'View the code on GitHub', Icon: FiGithub },
  { host: 'upwork.com', label: 'View on Upwork', Icon: SiUpwork },
];

const describeLink = (url) => {
  try {
    const { hostname } = new URL(url);
    return LINK_TYPES.find((type) => hostname.endsWith(type.host)) ?? { label: 'Visit the live site', Icon: FiArrowUpRight };
  } catch {
    return null; // no link, or a placeholder like "#"
  }
};

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction * 90 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
  exit: (direction) => ({ opacity: 0, x: direction * -90, transition: { duration: 0.3, ease: 'easeIn' } }),
};

/**
 * Full-size look at one project. The card's image flies into the dialog on open and
 * back into its card on close; arrows, swipes and ←/→ move between `projects`.
 */
const WorkQuickView = ({ projects, activeId, origin, cardImages, onNavigate, onClose }) => {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const figureEls = useRef(new Map());
  const openedId = useRef(activeId);
  const [direction, setDirection] = useState(1);
  const [closing, setClosing] = useState(false);

  const index = Math.max(0, projects.findIndex((p) => p.id === activeId));
  const project = projects[index];
  const image = getProjectImage(project.image);
  const link = describeLink(project.url);
  const LinkIcon = link?.Icon;

  // `chrome` fades the backdrop and panel in and out; the image flies on its own
  const chrome = useMotionValue(0);
  const panelScale = useTransform(chrome, [0, 1], [0.97, 1]);
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const imageScale = useMotionValue(1);
  const imageOpacity = useMotionValue(1);

  // Open: start the image where the card shows it, then let it fly into place
  useLayoutEffect(() => {
    const target = figureEls.current.get(openedId.current)?.getBoundingClientRect();
    if (!reduceMotion && origin?.width && target?.width) {
      imageX.set(origin.left - target.left);
      imageY.set(origin.top - target.top);
      imageScale.set(origin.width / target.width);
      animate(imageX, 0, flipSpring);
      animate(imageY, 0, flipSpring);
      animate(imageScale, 1, flipSpring);
    } else {
      imageOpacity.set(0);
      animate(imageOpacity, 1, { duration: 0.4 });
    }
    animate(chrome, 1, { duration: 0.4, ease: 'easeOut' });
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [origin, reduceMotion, chrome, imageX, imageY, imageScale, imageOpacity]);

  // Close: fly the image back into its card (if it's on screen), then unmount
  const close = useCallback(() => {
    if (closing) return;
    setClosing(true);

    const card = cardImages.current.get(project.id)?.getBoundingClientRect();
    const figure = figureEls.current.get(project.id)?.getBoundingClientRect();
    const cardOnScreen = card?.width > 0 && card.bottom > 0 && card.top < window.innerHeight;

    const animations = [animate(chrome, 0, { duration: 0.35, ease: 'easeIn' })];
    if (!reduceMotion && cardOnScreen && figure?.width) {
      // Undo the current transform (origin is top-left) to get the figure's resting box
      const restLeft = figure.left - imageX.get();
      const restTop = figure.top - imageY.get();
      const restWidth = figure.width / imageScale.get();
      animations.push(
        animate(imageX, card.left - restLeft, flipSpring),
        animate(imageY, card.top - restTop, flipSpring),
        animate(imageScale, card.width / restWidth, flipSpring)
      );
    } else {
      animations.push(animate(imageOpacity, 0, { duration: 0.3 }));
    }

    Promise.all(animations).then(() => onClose(project.id));
  }, [closing, cardImages, project.id, reduceMotion, chrome, imageX, imageY, imageScale, imageOpacity, onClose]);

  const go = useCallback(
    (step) => {
      if (closing || projects.length < 2) return;
      setDirection(step);
      onNavigate(projects[(index + step + projects.length) % projects.length].id);
    },
    [closing, projects, index, onNavigate]
  );

  // Keyboard: Esc closes, arrows browse, Tab stays inside the dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        go(1);
      } else if (e.key === 'ArrowLeft') {
        go(-1);
      } else if (e.key === 'Tab') {
        const focusable = dialogRef.current.querySelectorAll('button, a[href]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close, go]);

  // Keep the page behind the dialog still
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const handleSwipe = (e, { offset, velocity }) => {
    if (offset.x < -60 || velocity.x < -500) go(1);
    else if (offset.x > 60 || velocity.x > 500) go(-1);
  };

  return createPortal(
    // data-lenis-prevent: the smooth scroller leaves wheel/touch events inside the dialog alone
    <div className={`wqv${closing ? ' is-closing' : ''}`} data-lenis-prevent>
      <motion.div className="wqv-backdrop" style={{ opacity: chrome }} onClick={close} />

      <div
        ref={dialogRef}
        className="wqv-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wqv-title"
        style={{ '--accent-rgb': image.rgb }}
      >
        <motion.div className="wqv-panel" style={{ opacity: chrome, scale: panelScale }} />

        <div className="wqv-stage">
          <motion.div className="wqv-glow" style={{ opacity: chrome }} />
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={project.id}
              className="wqv-figure"
              style={{ '--ar': image.ratio }}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              drag={projects.length > 1 && !closing ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={handleSwipe}
            >
              <motion.div
                ref={(el) => {
                  if (el) figureEls.current.set(project.id, el);
                  else figureEls.current.delete(project.id);
                }}
                className="wqv-flip"
                style={{ x: imageX, y: imageY, scale: imageScale, opacity: imageOpacity }}
              >
                <img
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes="(min-width: 861px) 680px, 92vw"
                  width={image.width}
                  height={image.height}
                  alt={`${project.name} preview`}
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div className="wqv-info" style={{ opacity: chrome }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.id}
              className="wqv-info-inner"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            >
              <div className="wqv-tags">
                <span className="wqv-number">No. {pad(allProjects.indexOf(project) + 1)}</span>
                {project.category && <span className="wqv-category">{project.category}</span>}
              </div>

              <h2 id="wqv-title" className="wqv-title">
                {project.name}
              </h2>
              <p className="wqv-description">{capitalize(project.description)}</p>

              <span className="wqv-label">Tech stack</span>
              <ul className="wqv-tech">
                {project.techStack.split(',').map((tech) => (
                  <li key={tech}>{tech.trim()}</li>
                ))}
              </ul>

              {link && (
                <a className="wqv-cta" href={project.url} target="_blank" rel="noopener noreferrer">
                  <LinkIcon className="wqv-cta-icon" aria-hidden="true" />
                  {link.label}
                  <FiArrowUpRight className="wqv-cta-arrow" aria-hidden="true" />
                </a>
              )}
            </motion.div>
          </AnimatePresence>

          <p className="wqv-hint" aria-hidden="true">
            <kbd>←</kbd> <kbd>→</kbd> browse · <kbd>Esc</kbd> close
          </p>
        </motion.div>

        <motion.div className="wqv-toolbar" style={{ opacity: chrome }}>
          {projects.length > 1 && (
            <>
              <span className="wqv-counter" aria-live="polite">
                {pad(index + 1)} <span>/ {pad(projects.length)}</span>
              </span>
              <button type="button" className="wqv-btn" onClick={() => go(-1)} aria-label="Previous project">
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button type="button" className="wqv-btn" onClick={() => go(1)} aria-label="Next project">
                <FiChevronRight aria-hidden="true" />
              </button>
            </>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            className="wqv-btn wqv-close"
            onClick={close}
            aria-label="Close"
          >
            <FiX aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </div>,
    document.body
  );
};

export default WorkQuickView;
