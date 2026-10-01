import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import TextScramble from '../ui/TextScramble';
import HeroIDCard from './HeroIDCard';
import './Hero.css';

// Entrance animations sit in their `hidden` state until `playIntro` turns on
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const fadeUp = (y) => ({ hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0 } });

// Cycling texts for the description
const CYCLING_TEXTS = [
  "AMAZING WEB APPLICATIONS",
  "STUNNING UI/UX DESIGNS",
  "MODERN WEBSITES",
  "SAAS PRODUCTS",
  "LANDING PAGES",
  "MOBILE APPLICATIONS",
  "E-COMMERCE PLATFORMS"
];

// Generated once, so a re-render doesn't restart the particle animations
const PARTICLES = Array.from({ length: 20 }, () => ({
  x: Math.random(),
  y: Math.random(),
  scale: Math.random() * 0.5 + 0.3,
  rise: Math.random() * -200 - 100,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 3,
}));

const Hero = ({ playIntro = true }) => {
  const intro = playIntro ? 'visible' : 'hidden';
  const containerRef = useRef(null);

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

  return (
    <section id="home" className="hero" ref={containerRef}>
      {/* Background Grid Pattern */}
      <div className="hero-grid"></div>

      {/* Floating particles */}
      <div className="hero-particles">
        {PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: particle.x * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: particle.y * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: particle.scale,
            }}
            animate={{
              y: [null, particle.rise],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <motion.div className="hero-content" style={{ opacity, scale }}>

        {/* Top Greeting - Closer to main content */}
        <motion.div
          className="hero-greeting"
          variants={fadeUp(-30)}
          initial="hidden"
          animate={intro}
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
            animate={intro}
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

          {/* ID Card on its lanyard */}
          <HeroIDCard playIntro={playIntro} />

          {/* Right Big Text - PANCHAL with horizontal scroll */}
          <motion.div
            className="big-text right-big-text"
            initial="hidden"
            animate={intro}
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
          variants={fadeUp(30)}
          initial="hidden"
          animate={intro}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <span className="description-prefix">I BUILD {playIntro && <TextScramble texts={CYCLING_TEXTS} interval={3000} />}</span>
          {/* <span className="description-dynamic">
            
          </span> */}
        </motion.div>

        {/* Bottom Section */}
        <div className="hero-bottom">
          {/* Page Number */}
          <motion.div
            className="page-number"
            variants={fadeIn}
            initial="hidden"
            animate={intro}
            transition={{ delay: 1.2 }}
          >
            <span className="number-circle">01</span>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="scroll-indicator"
            variants={fadeUp(20)}
            initial="hidden"
            animate={intro}
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
            variants={fadeIn}
            initial="hidden"
            animate={intro}
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