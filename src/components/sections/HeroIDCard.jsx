import { useEffect, useRef } from 'react';
import {
  motion,
  animate,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import ProtectedImage from '../ui/ProtectedImage';
import './HeroIDCard.css';

const PARALLAX = { x: 16, y: 12 }; // px the badge drifts toward the cursor
const MAX_TILT = { x: 10, y: 14 }; // deg of 3D tilt while the card is hovered
const MAX_SWING = 40; // deg the badge can be swung on its lanyard
const INTRO_DELAY = 0.35; // s after the splash starts revealing the page

const driftSpring = { stiffness: 60, damping: 20 };
const tiltSpring = { stiffness: 180, damping: 18 };
// Under-damped so the badge swings back and forth a few times before resting
const swingSpring = { type: 'spring', stiffness: 60, damping: 5 };
const settledSpring = { type: 'spring', stiffness: 60, damping: 20 };

const SWAY_KEYFRAMES = [0, 1.2, 0, -1.2, 0];
const swayTransition = { duration: 7, ease: 'easeInOut', repeat: Infinity };

const dropIn = {
  hidden: { opacity: 0, y: -140 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.4, delay: INTRO_DELAY },
      y: { type: 'spring', stiffness: 80, damping: 12, delay: INTRO_DELAY },
    },
  },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, delay: INTRO_DELAY } },
};
const rise = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Angle (deg) of the pointer around the lanyard pivot; grows as it moves right
const angleAround = (pivot, e) =>
  Math.atan2(e.clientX - pivot.x, e.clientY - pivot.y) * (180 / Math.PI);

/**
 * The hero's ID badge, hanging from a lanyard.
 *
 * - Drops in and swings to rest when `playIntro` turns on, then sways gently
 * - Drifts toward the cursor, and tilts in 3D with a moving glare when hovered
 * - Can be grabbed and swung on its lanyard (mouse or touch); swings back on release
 */
const HeroIDCard = ({ playIntro = true }) => {
  const reduceMotion = useReducedMotion();
  const intro = playIntro ? 'visible' : 'hidden';

  const pivotRef = useRef(null);
  const dragRef = useRef(null);

  // Whole-badge drift toward the cursor
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const driftX = useSpring(pointerX, driftSpring);
  const driftY = useSpring(pointerY, driftSpring);

  // Rotation around the top of the lanyard: swing (intro, drag, release) + idle sway
  const swing = useMotionValue(reduceMotion ? 0 : 10);
  const sway = useMotionValue(0);
  const rotate = useTransform([swing, sway], ([s, w]) => s + w);

  // Pointer position over the card, -0.5 … 0.5 on each axis
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [MAX_TILT.x, -MAX_TILT.x]), tiltSpring);
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-MAX_TILT.y, MAX_TILT.y]), tiltSpring);

  // Glare follows the (sprung) tilt, so it glides back to centre when the pointer leaves
  const glareX = useTransform(rotateY, [-MAX_TILT.y, MAX_TILT.y], [0, 100]);
  const glareY = useTransform(rotateX, [MAX_TILT.x, -MAX_TILT.x], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.5), transparent 55%)`;
  const hovered = useMotionValue(0);
  const glareOpacity = useSpring(hovered, { stiffness: 200, damping: 30 });

  // Intro: drop in swung out, swing to rest, then sway gently while idle
  useEffect(() => {
    if (!playIntro) return;

    animate(swing, 0, { ...swingSpring, stiffness: 50, damping: 4.5, delay: INTRO_DELAY });
    if (!reduceMotion) {
      animate(sway, SWAY_KEYFRAMES, { ...swayTransition, delay: INTRO_DELAY + 2.6 });
    }

    return () => {
      swing.stop();
      sway.stop();
    };
  }, [playIntro, reduceMotion, swing, sway]);

  // Drift toward the cursor anywhere on the page; recentre when it leaves the window
  useEffect(() => {
    if (reduceMotion) return;

    const handleMove = (e) => {
      if (e.pointerType === 'touch' || dragRef.current) return;
      pointerX.set((e.clientX / window.innerWidth - 0.5) * 2 * PARALLAX.x);
      pointerY.set((e.clientY / window.innerHeight - 0.5) * 2 * PARALLAX.y);
    };
    const handleOut = (e) => {
      if (e.relatedTarget) return;
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerout', handleOut);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerout', handleOut);
    };
  }, [reduceMotion, pointerX, pointerY]);

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const handlePointerEnter = (e) => {
    if (e.pointerType !== 'touch' && !reduceMotion) hovered.set(1);
  };

  const handlePointerLeave = () => {
    resetTilt();
    hovered.set(0);
  };

  const handlePointerMove = (e) => {
    const drag = dragRef.current;
    if (drag?.pointerId === e.pointerId) {
      const turned = angleAround(drag.pivot, e) - drag.startAngle;
      // Positive rotation swings the card left, so follow the pointer with the opposite sign
      swing.set(clamp(drag.startSwing - turned, -MAX_SWING, MAX_SWING));
      return;
    }

    if (e.pointerType === 'touch' || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set(clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5));
    tiltY.set(clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5));
  };

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;

    const { left, top } = pivotRef.current.getBoundingClientRect();
    const pivot = { x: left, y: top };
    dragRef.current = {
      pointerId: e.pointerId,
      pivot,
      startAngle: angleAround(pivot, e),
      startSwing: swing.get(),
    };
    e.currentTarget.setPointerCapture(e.pointerId);

    swing.stop();
    animate(sway, 0, { duration: 0.3 });
    resetTilt();
  };

  const handlePointerUp = (e) => {
    if (dragRef.current?.pointerId !== e.pointerId) return;
    dragRef.current = null;

    // Picks up the release velocity, so a flick swings harder
    animate(swing, 0, reduceMotion ? settledSpring : swingSpring);
    if (!reduceMotion) {
      animate(sway, SWAY_KEYFRAMES, { ...swayTransition, delay: 2.5 });
    }
  };

  return (
    <motion.div className="id-card-container" style={{ x: driftX, y: driftY }}>
      {/* Fixed point the badge swings around (top of the lanyard) */}
      <span ref={pivotRef} className="badge-pivot" aria-hidden="true" />

      <motion.div
        className="badge"
        variants={reduceMotion ? fadeIn : dropIn}
        initial="hidden"
        animate={intro}
        style={{ rotate }}
      >
        <div className="lanyard-strap" aria-hidden="true">
          <span className="lanyard-text">(PORTFOLIO)</span>
        </div>
        <div className="lanyard-clip" aria-hidden="true" />

        <motion.div
          className="id-card"
          data-cursor-text="Drag"
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
        >
          <div className="photo-section">
            <span className="card-slot" aria-hidden="true" />
            <ProtectedImage src="assets/me.png" alt="Ketul Panchal" className="card-photo" />
          </div>

          <div className="card-info">
            <span className="role-label">Software Engineer</span>
            <h2 className="role-title">
              <motion.span
                variants={rise}
                initial="hidden"
                animate={intro}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                FULL STACK
              </motion.span>
              <motion.span
                variants={rise}
                initial="hidden"
                animate={intro}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                DEVELOPER
              </motion.span>
            </h2>
            <div className="card-status">
              <span className="status-dot" aria-hidden="true" />
              <span>
                Available<span className="status-detail"> for Full-time, Freelance</span>
              </span>
            </div>
          </div>

          <motion.div
            className="card-glare"
            style={{ background: glare, opacity: glareOpacity }}
            aria-hidden="true"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroIDCard;
