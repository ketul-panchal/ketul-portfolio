import { useCallback, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { FiArrowUpRight, FiArrowDown } from 'react-icons/fi';
import { projects } from '../../data/projectsData';
import { getProjectImage } from '../../utils/projectImage';
import WorkQuickView from './WorkQuickView';
import './Gallery.css';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'web', label: 'Web' },
];

// Bento pattern, repeating every five cards: a large feature card, two small, two wide
const SIZES = ['feature', 'small', 'small', 'wide', 'wide'];

// Largest width each card size is shown at, for picking an image from the srcset
const IMAGE_SIZES = {
  feature: '(min-width: 1024px) 720px, (min-width: 640px) 90vw, 80vw',
  small: '(min-width: 1024px) 340px, (min-width: 640px) 45vw, 80vw',
  wide: '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 80vw',
};

const ease = [0.22, 1, 0.36, 1];

const pad = (n) => String(n).padStart(2, '0');
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const countFor = (filterId) =>
  filterId === 'all' ? projects.length : projects.filter((p) => p.platform === filterId).length;

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const wordRise = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 70 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.25, ease: 'easeIn' } },
};

const WorkCard = ({ project, size, imageHidden, onOpen, registerImage, registerButton }) => {
  const image = getProjectImage(project.image);

  // Spotlight and image parallax follow the pointer through CSS variables (no re-render)
  const handlePointerMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    card.style.setProperty('--px', (x / rect.width - 0.5).toFixed(3));
    card.style.setProperty('--py', (y / rect.height - 0.5).toFixed(3));
  };

  const handlePointerLeave = (e) => {
    e.currentTarget.style.setProperty('--px', 0);
    e.currentTarget.style.setProperty('--py', 0);
  };

  return (
    <motion.article
      layout
      variants={cardVariants}
      exit="exit"
      transition={{ layout: { type: 'spring', stiffness: 200, damping: 28 } }}
      className={`work-card is-${size}`}
      style={{ borderRadius: 24, '--accent-rgb': image.rgb }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div layout className="work-card-media">
        <div className="work-card-figure" style={{ '--ar': image.ratio }}>
          <img
            ref={(el) => registerImage(project.id, el)}
            src={image.src}
            srcSet={image.srcSet}
            sizes={IMAGE_SIZES[size]}
            width={image.width}
            height={image.height}
            alt={`${project.name} preview`}
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{ opacity: imageHidden ? 0 : 1 }}
          />
        </div>
      </motion.div>

      <motion.div layout="position" className="work-card-meta">
        <span className="work-card-number">{pad(projects.indexOf(project) + 1)}</span>
        <span className="work-card-category">{project.category}</span>
      </motion.div>

      <motion.div layout="position" className="work-card-body">
        <h3 className="work-card-title">{project.shortName || project.name}</h3>
        {size === 'feature' && (
          <p className="work-card-description">{capitalize(project.description)}</p>
        )}
        <p className="work-card-tech">
          {project.techStack.split(',').map((tech) => tech.trim()).join('  ·  ')}
        </p>
      </motion.div>

      <span className="work-card-arrow" aria-hidden="true">
        <FiArrowUpRight />
      </span>

      {/* Covers the whole card, so the card opens from anywhere */}
      <button
        ref={(el) => registerButton(project.id, el)}
        type="button"
        className="work-card-hit"
        aria-label={`View ${project.name}`}
        data-cursor-text="View"
        onClick={() => onOpen(project.id)}
      />
    </motion.article>
  );
};

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [quickView, setQuickView] = useState(null); // { id, origin } of the open project
  const [activeSlide, setActiveSlide] = useState(0); // mobile carousel position
  const gridRef = useRef(null);
  const imageEls = useRef(new Map());
  const buttonEls = useRef(new Map());

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.platform === filter)),
    [filter]
  );

  const registerImage = useCallback((id, el) => {
    if (el) imageEls.current.set(id, el);
    else imageEls.current.delete(id);
  }, []);

  const registerButton = useCallback((id, el) => {
    if (el) buttonEls.current.set(id, el);
    else buttonEls.current.delete(id);
  }, []);

  // The card image's position is where the quick view's image flies in from
  const openProject = (id) => {
    setQuickView({ id, origin: imageEls.current.get(id)?.getBoundingClientRect() ?? null });
  };

  const navigateTo = useCallback((id) => {
    setQuickView((current) => current && { ...current, id });
  }, []);

  const closeProject = useCallback((id) => {
    setQuickView(null);
    buttonEls.current.get(id)?.focus({ preventScroll: true });
  }, []);

  const changeFilter = (id) => {
    setFilter(id);
    setActiveSlide(0);
    gridRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const handleGridScroll = () => {
    const grid = gridRef.current;
    const max = grid.scrollWidth - grid.clientWidth;
    if (max > 0) setActiveSlide(Math.round((grid.scrollLeft / max) * (visible.length - 1)));
  };

  const showSlide = (index) => {
    gridRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const scrollToProjects = (e) => {
    const target = document.getElementById('projects');
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="work-bg" aria-hidden="true">
          <div className="work-bg-grid" />
          <div className="work-glow work-glow-1" />
          <div className="work-glow work-glow-2" />
        </div>

        <div className="work-container">
          <motion.header
            className="work-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <div className="work-heading">
              <motion.span className="work-label" variants={reveal}>
                Showcase
              </motion.span>
              <h2 id="work-title" className="work-title">
                <span className="work-title-mask">
                  <motion.span variants={wordRise}>Featured</motion.span>
                </span>{' '}
                <span className="work-title-mask">
                  <motion.span className="accent" variants={wordRise}>
                    Work
                  </motion.span>
                </span>
                <motion.sup className="work-count" variants={reveal}>
                  ({pad(projects.length)})
                </motion.sup>
              </h2>
              <motion.p className="work-subtitle" variants={reveal}>
                A glimpse at projects I&apos;ve built and shipped. Open any of them for a closer look.
              </motion.p>
            </div>

            <motion.div className="work-filters" role="group" aria-label="Filter projects" variants={reveal}>
              {FILTERS.filter((f) => countFor(f.id) > 0).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`work-filter${filter === f.id ? ' is-active' : ''}`}
                  aria-pressed={filter === f.id}
                  onClick={() => changeFilter(f.id)}
                >
                  {filter === f.id && (
                    <motion.span
                      layoutId="work-filter-pill"
                      className="work-filter-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="work-filter-label">{f.label}</span>
                  <span className="work-filter-count">{pad(countFor(f.id))}</span>
                </button>
              ))}
            </motion.div>
          </motion.header>

          <motion.div
            ref={gridRef}
            className="work-grid"
            layoutScroll
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            onScroll={handleGridScroll}
          >
            <AnimatePresence mode="popLayout">
              {visible.map((project, i) => (
                <WorkCard
                  key={project.id}
                  project={project}
                  size={SIZES[i % SIZES.length]}
                  imageHidden={quickView?.id === project.id}
                  onOpen={openProject}
                  registerImage={registerImage}
                  registerButton={registerButton}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Carousel position (phones only) */}
          <div className="work-dots">
            {visible.map((project, i) => (
              <button
                key={project.id}
                type="button"
                className={`work-dot${i === activeSlide ? ' is-active' : ''}`}
                aria-label={`Show ${project.shortName || project.name}`}
                onClick={() => showSlide(i)}
              />
            ))}
          </div>

          <motion.div
            className="work-footer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={reveal}
          >
            <p className="work-footer-text">Want the full story behind each build?</p>
            <a href="#projects" className="work-footer-link" onClick={scrollToProjects}>
              Explore all projects <FiArrowDown aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        {quickView && (
          <WorkQuickView
            projects={visible}
            activeId={quickView.id}
            origin={quickView.origin}
            cardImages={imageEls}
            onNavigate={navigateTo}
            onClose={closeProject}
          />
        )}
      </section>
    </MotionConfig>
  );
};

export default Gallery;
