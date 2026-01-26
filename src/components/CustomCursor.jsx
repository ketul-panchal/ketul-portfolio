import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [cursorVariant, setCursorVariant] = useState('default');

  // Motion values with spring physics for smooth following
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Different spring configs for dot vs follower
  const dotSpring = { stiffness: 1000, damping: 50 };
  const followerSpring = { stiffness: 200, damping: 25 };
  const trailSpring = { stiffness: 100, damping: 20 };

  const dotX = useSpring(cursorX, dotSpring);
  const dotY = useSpring(cursorY, dotSpring);
  const followerX = useSpring(cursorX, followerSpring);
  const followerY = useSpring(cursorY, followerSpring);
  const trailX = useSpring(cursorX, trailSpring);
  const trailY = useSpring(cursorY, trailSpring);

  // Rotation based on velocity
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const rotation = useTransform([velocityX, velocityY], ([x, y]) => {
    return Math.atan2(y, x) * (180 / Math.PI);
  });

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const now = Date.now();
      const dt = Math.max(now - lastTime, 1);

      // Calculate velocity
      const vx = (clientX - lastX) / dt;
      const vy = (clientY - lastY) / dt;

      velocityX.set(vx);
      velocityY.set(vy);

      cursorX.set(clientX);
      cursorY.set(clientY);

      lastX = clientX;
      lastY = clientY;
      lastTime = now;
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Enhanced hover detection
    const handleMouseOver = (e) => {
      const target = e.target;

      // Links and buttons
      if (target.tagName === 'A' || target.tagName === 'BUTTON' ||
        target.closest('a') || target.closest('button') ||
        target.classList.contains('hoverable')) {
        setIsHovering(true);
        setCursorVariant('hover');

        const text = target.dataset.cursorText || target.closest('[data-cursor-text]')?.dataset.cursorText;
        if (text) setHoverText(text);
      }

      // Cards
      if (target.classList.contains('card-hover') || target.closest('.id-card')) {
        setCursorVariant('card');
        setIsHovering(true);
      }

      // Images
      if (target.tagName === 'IMG' && !target.closest('.id-card')) {
        setCursorVariant('view');
        setHoverText('View');
        setIsHovering(true);
      }

      // Text selection areas
      if (target.classList.contains('selectable-text')) {
        setCursorVariant('text');
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      const relatedTarget = e.relatedTarget;
      const target = e.target;

      // Only reset if leaving interactive elements completely
      if (!relatedTarget ||
        (!relatedTarget.closest('a') &&
          !relatedTarget.closest('button') &&
          !relatedTarget.closest('.id-card') &&
          !relatedTarget.classList?.contains('hoverable'))) {
        setIsHovering(false);
        setCursorVariant('default');
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY, velocityX, velocityY]);

  // Hide on mobile/touch devices
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  // Get variant-specific styles
  const getFollowerScale = () => {
    if (isClicking) return 0.7;
    if (cursorVariant === 'card') return 2;
    if (cursorVariant === 'hover') return 1.8;
    if (cursorVariant === 'view') return 2.5;
    return 1;
  };

  const getFollowerOpacity = () => {
    if (cursorVariant === 'view') return 0.9;
    if (isHovering) return 0.6;
    return 0.3;
  };

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className={`cursor-dot ${isClicking ? 'clicking' : ''} ${cursorVariant}`}
        style={{
          x: dotX,
          y: dotY,
        }}
      >
        <motion.div
          className="dot-inner"
          animate={{
            scale: isClicking ? 0.6 : isHovering ? 0.8 : 1,
            opacity: cursorVariant === 'view' ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Cursor Follower Ring */}
      <motion.div
        className={`cursor-follower ${cursorVariant}`}
        style={{
          x: followerX,
          y: followerY,
        }}
        animate={{
          scale: getFollowerScale(),
          opacity: getFollowerOpacity(),
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Text inside follower */}
        {(cursorVariant === 'view' || hoverText) && (
          <motion.span
            className="cursor-text"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {hoverText || 'View'}
          </motion.span>
        )}

        {/* Magnetic effect indicator for card */}
        {cursorVariant === 'card' && (
          <motion.div
            className="cursor-magnetic"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </motion.div>

      {/* Trailing glow effect */}
      <motion.div
        className="cursor-trail"
        style={{
          x: trailX,
          y: trailY,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.15 : 0.08,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Decorative particles on click */}
      {isClicking && (
        <motion.div
          className="click-particles"
          style={{
            x: dotX,
            y: dotY,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </>
  );
};

export default CustomCursor;