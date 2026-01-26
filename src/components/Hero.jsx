import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import TextScramble from './TextScramble';
import './Hero.css';

const Hero = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth spring animation for scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Horizontal scroll for big text
  const leftTextX = useTransform(smoothProgress, [0, 1], ['0%', '-50%']);
  const rightTextX = useTransform(smoothProgress, [0, 1], ['0%', '50%']);

  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.9]);

  // Mouse motion values for 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  // Mouse parallax effect for overall card movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // For overall parallax
      setMousePosition({
        x: (clientX - innerWidth / 2) / 40,
        y: (clientY - innerHeight / 2) / 40,
      });

      // For 3D card rotation
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (clientX - centerX) / (innerWidth / 2);
        const y = (clientY - centerY) / (innerHeight / 2);
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Floating animation variants
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Letter animation for big text
  const letterVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  const leftText = "KETUL";
  const rightText = "PANCHAL";

  // Cycling texts for the description
  const cyclingTexts = [
    "AMAZING WEB APPLICATIONS",
    "STUNNING UI/UX DESIGNS",
    "MODERN WEBSITES",
    "SAAS PRODUCTS",
    "LANDING PAGES",
    "MOBILE APPLICATIONS",
    "E-COMMERCE PLATFORMS"
  ];

  return (
    <section id="home" className="hero" ref={containerRef}>
      {/* Background Grid Pattern */}
      <div className="hero-grid"></div>

      {/* Floating particles */}
      <div className="hero-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <motion.div className="hero-content" style={{ opacity, scale }}>

        {/* Top Greeting - Closer to main content */}
        <motion.div
          className="hero-greeting"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="greeting-text">(HELLO! I'M KETUL)</span>
        </motion.div>

        {/* Main Section */}
        <div className="hero-main">

          {/* Left Big Text - KETUL with horizontal scroll */}
          <motion.div
            className="big-text left-big-text"
            initial="hidden"
            animate="visible"
            style={{ x: leftTextX }}
          >
            {leftText.split('').map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                className="big-letter"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          {/* ID Card Section */}
          <motion.div
            className="id-card-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
          >
            {/* Lanyard */}
            <motion.div
              className="lanyard"
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
            >
              <div className="lanyard-strap">
                <div className="lanyard-text">(PORTFOLIO)</div>
              </div>
              <div className="lanyard-connector">
                <div className="connector-clip"></div>
              </div>
            </motion.div>

            {/* ID Card with 3D effect */}
            <motion.div
              ref={cardRef}
              className="id-card"
              style={{
                rotateX,
                rotateY,
                transformPerspective: 1200,
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Card Shine Effect */}
              <motion.div
                className="card-shine"
                style={{
                  background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
                }}
              />

              {/* Card Glow */}
              <div className="card-glow"></div>

              {/* Card Content */}
              <div className="card-inner">
                {/* Photo Section - Coral/Orange Frame */}
                <motion.div
                  className="photo-section"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="photo-frame">
                    <img
                      src="/assets/me.png"
                      alt="Ketul Panchal"
                      className="card-photo"
                    />
                  </div>
                </motion.div>

                {/* Info Section */}
                <div className="card-info">
                  <span className="role-label">Software Engineer</span>
                  <h2 className="role-title">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      FULL STACK
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      DEVELOPER
                    </motion.span>
                  </h2>
                </div>

                {/* Barcode Section */}
                <div className="card-barcode">
                  {/* <div className="barcode-container">
                    {[...Array(35)].map((_, i) => (
                      <div
                        key={i}
                        className="barcode-line"
                        style={{
                          width: Math.random() * 3 + 1 + 'px',
                          opacity: Math.random() * 0.5 + 0.3,
                        }}
                      />
                    ))}
                  </div> */}
                  <span className="barcode-text">Available for Full-time, Freelance</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Big Text - PANCHAL with horizontal scroll */}
          <motion.div
            className="big-text right-big-text"
            initial="hidden"
            animate="visible"
            style={{ x: rightTextX }}
          >
            {rightText.split('').map((letter, i) => (
              <motion.span
                key={i}
                custom={i + leftText.length}
                variants={letterVariants}
                className="big-letter"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Description Text - Below main section with cycling text */}
        <motion.div
          className="hero-description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <span className="description-prefix">I BUILD <TextScramble texts={cyclingTexts} interval={5000} /></span>
          {/* <span className="description-dynamic">
            
          </span> */}
        </motion.div>

        {/* Bottom Section */}
        <div className="hero-bottom">
          {/* Page Number */}
          <motion.div
            className="page-number"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="number-circle">01</span>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <motion.div
              className="scroll-arrow"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Branding */}
          <motion.div
            className="hero-branding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="branding-label">Leveled up at:</span>
            <span className="branding-name">SELF<span className="accent">TAUGHT</span></span>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="hero-decorations">
        <motion.div
          className="deco-circle deco-1"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="deco-circle deco-2"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>
    </section>
  );
};

export default Hero;