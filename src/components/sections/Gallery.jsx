import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { projects } from '../../data/projectsData';
import './Gallery.css';

const BASE = import.meta.env.BASE_URL;

// Split projects into two rows
const topRow = projects.filter((_, i) => i % 2 === 0);
const bottomRow = projects.filter((_, i) => i % 2 === 1);

// Duplicate items so the strip is seamless when it loops
const loopedTop = [...topRow, ...topRow, ...topRow, ...topRow];
const loopedBottom = [...bottomRow, ...bottomRow, ...bottomRow, ...bottomRow];

const GalleryCard = ({ project, index }) => (
  <motion.div
    className="gallery-card"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3) }}
  >
    <div className="gallery-card-inner">
      <img
        src={BASE + project.image}
        alt={project.name}
        className="gallery-card-img"
        loading="lazy"
        draggable={false}
      />
      {/* Hover overlay */}
      <div className="gallery-card-overlay">
        <span className="gallery-card-name">{project.name}</span>
        <span className="gallery-card-tech">{project.techStack}</span>
      </div>
      {/* Subtle shine layer */}
      <div className="gallery-card-shine" />
    </div>
  </motion.div>
);

const Gallery = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax: top row drifts left, bottom row drifts right as you scroll
  const topX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const bottomX = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section className="gallery-section" ref={sectionRef}>
      {/* Background glow accents */}
      <div className="gallery-bg">
        <div className="gallery-glow gallery-glow-1" />
        <div className="gallery-glow gallery-glow-2" />
      </div>

      {/* Header */}
      <motion.div
        className="gallery-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <span className="gallery-label">SHOWCASE</span>
        <h2 className="gallery-title">
          Featured <span className="accent">Work</span>
        </h2>
        <p className="gallery-subtitle">A glimpse at projects I've shipped</p>
      </motion.div>

      {/* Marquee rows */}
      <div className="gallery-marquee-wrapper">
        {/* ─── Row 1 — scrolls left ─── */}
        <div className="gallery-row">
          <motion.div className="gallery-track track-left" style={{ x: topX }}>
            {loopedTop.map((project, i) => (
              <GalleryCard key={`top-${i}`} project={project} index={i} />
            ))}
          </motion.div>
        </div>

        {/* ─── Row 2 — scrolls right ─── */}
        <div className="gallery-row">
          <motion.div className="gallery-track track-right" style={{ x: bottomX }}>
            {loopedBottom.map((project, i) => (
              <GalleryCard key={`bot-${i}`} project={project} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
