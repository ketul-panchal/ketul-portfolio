import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './IDCard.css';

const IDCard = () => {
  const cardRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const lanyardRotate = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (windowSize.width / 2);
    const y = (e.clientY - centerY) / (windowSize.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className="id-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      {/* Lanyard - Touches Top */}
      <motion.div className="lanyard" style={{ rotate: lanyardRotate }}>
        <div className="lanyard-strap">
          <div className="lanyard-pattern"></div>
        </div>
        <div className="lanyard-connector">
          <div className="connector-ring"></div>
          <div className="connector-clip"></div>
        </div>
      </motion.div>

      {/* ID Card */}
      <motion.div
        ref={cardRef}
        className="id-card"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {/* Card Shine */}
        <motion.div
          className="card-shine"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `radial-gradient(circle at ${50 + x * 50}% ${50 + y * 50}%, rgba(255,255,255,0.12) 0%, transparent 50%)`
            ),
          }}
        />

        {/* Card Glow Border */}
        <div className="card-glow"></div>

        {/* Card Content */}
        <div className="card-inner">
          {/* Header */}
          <div className="card-header">
            <div className="card-logo">
              <span className="logo-icon">K</span>
            </div>
            <div className="card-company">
              <span className="company-name">PORTFOLIO</span>
              <span className="company-year">2024</span>
            </div>
            <div className="card-chip">
              <div className="chip-lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="card-photo-section">
            <div className="photo-frame">
              <motion.img
                src="/assets/images/me.png"
                alt="Ketul Panchal"
                className="card-photo"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="status-text">Available for work</span>
            </div>
          </div>

          {/* Info */}
          <div className="card-info">
            <div className="info-name">
              <h2 className="name-text">KETUL PANCHAL</h2>
              <div className="name-underline"></div>
            </div>
            <div className="info-role">
              <span className="role-label">ROLE</span>
              <div className="role-tags">
                <span className="role-tag">Full Stack Developer</span>
                <span className="role-tag">App Developer</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="card-footer">
            <div className="footer-left">
              <span className="footer-label">ID</span>
              <span className="footer-value">#DEV2024</span>
            </div>
            <div className="footer-qr">
              <div className="qr-code">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="qr-cell"
                    style={{ opacity: Math.random() > 0.5 ? 1 : 0.2 }}
                  />
                ))}
              </div>
            </div>
            <div className="footer-right">
              <span className="footer-label">LEVEL</span>
              <span className="footer-value">SENIOR</span>
            </div>
          </div>

          {/* Barcode */}
          <div className="card-barcode">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="barcode-line"
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  opacity: Math.random() * 0.5 + 0.5,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IDCard;