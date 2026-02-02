import { useRef } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import Stack from './Stack';
import './About.css';

// Importing images
const images = [
    import.meta.env.BASE_URL + 'assets/IMG20251024215956.jpg',
    import.meta.env.BASE_URL + 'assets/IMG20251024215959.jpg',
    import.meta.env.BASE_URL + 'assets/IMG_20251022_131142.jpg',
    import.meta.env.BASE_URL + 'assets/20250106_133939801_iOS.jpg'
];

const About = () => {
    const containerRef = useRef(null);

    const aboutText = "Full-Stack & Flutter Developer with experience building scalable web, mobile, and SaaS applications. Currently working at Brainbean Technolabs Pvt Ltd, developing ERP, POS, and e-commerce systems. Skilled in Node.js, Express, MongoDB, React, Next.js, and Flutter with a focus on clean architecture and secure APIs. Open to remote roles, full-time opportunities, and freelance projects.";

    // Create card content for Stack component
    const stackCards = images.map((src, i) => (
        <img
            key={i}
            src={src}
            alt={`Ketul - ${i + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    ));

    return (
        <section id="about" className="about-section" ref={containerRef}>
            {/* Main background */}
            <div className="about-background">
                <div className="bg-pattern"></div>
                <div className="bg-glow bg-glow-1"></div>
                <div className="bg-glow bg-glow-2"></div>
                <div className="bg-grid"></div>
            </div>

            {/* Decorative Elements */}
            <div className="about-decorations">
                <motion.div
                    className="deco-ring ring-1"
                    animate={{
                        rotate: 360,
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity }
                    }}
                />
                <motion.div
                    className="deco-ring ring-2"
                    animate={{
                        rotate: -360,
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <div className="floating-dots">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="floating-dot"
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.3
                            }}
                            style={{
                                left: `${10 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="about-container">
                <div className="about-content">

                    {/* Left Column: Text */}
                    <div className="about-text-column">
                        <motion.div
                            className="section-header"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <span className="section-number">02</span>
                            <span className="section-label">ABOUT ME</span>
                            <div className="section-line"></div>
                        </motion.div>

                        {/* Scroll Reveal Text */}
                        <div className="text-wrapper">
                            <ScrollReveal
                                baseOpacity={0.1}
                                enableBlur={true}
                                baseRotation={3}
                                blurStrength={4}
                                containerClassName="about-scroll-reveal"
                                textClassName="about-text"
                                rotationEnd="center center"
                                wordAnimationEnd="center center"
                            >
                                {aboutText}
                            </ScrollReveal>
                        </div>

                        {/* Quick Stats */}
                        <motion.div
                            className="quick-stats"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <div className="stat-item">
                                <motion.span
                                    className="stat-number"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    viewport={{ once: true }}
                                >
                                    2+
                                </motion.span>
                                <span className="stat-label">Years Experience</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <motion.span
                                    className="stat-number"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    25+
                                </motion.span>
                                <span className="stat-label">Projects Completed</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <motion.span
                                    className="stat-number"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    8+
                                </motion.span>
                                <span className="stat-label">Technologies</span>
                            </div>
                        </motion.div>

                        {/* CTA Button */}
                        {/* <motion.div
                            className="about-cta"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <a href="#contact" className="cta-button">
                                <span>Let's Connect</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </motion.div> */}
                    </div>

                    {/* Right Column: Stack Gallery */}
                    <div className="about-gallery-column">
                        <motion.div
                            className="gallery-container"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            {/* Stack Label */}
                            <div className="stack-label">
                                <span className="label-text">DRAG OR CLICK</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M8 12L12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Photo Stack */}
                            <div className="stack-wrapper">
                                <Stack
                                    randomRotation={true}
                                    sensitivity={180}
                                    sendToBackOnClick={true}
                                    cards={stackCards}
                                    autoplay={true}
                                    autoplayDelay={4000}
                                    pauseOnHover={true}
                                    mobileClickOnly={true}
                                    animationConfig={{ stiffness: 260, damping: 20 }}
                                />
                            </div>

                            {/* Decorative Frame */}
                            <div className="stack-frame">
                                <svg viewBox="0 0 320 400" fill="none">
                                    <defs>
                                        <linearGradient id="stackFrameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#ff6b4a" stopOpacity="0.4" />
                                            <stop offset="50%" stopColor="#ff8c5a" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#ff6b4a" stopOpacity="0.4" />
                                        </linearGradient>
                                    </defs>
                                    <rect
                                        x="10" y="10"
                                        width="300" height="380"
                                        rx="20"
                                        fill="none"
                                        stroke="url(#stackFrameGradient)"
                                        strokeWidth="1"
                                        strokeDasharray="8 4"
                                    />
                                </svg>
                            </div>

                            {/* Corner Accents */}
                            <div className="corner-accent top-left"></div>
                            <div className="corner-accent top-right"></div>
                            <div className="corner-accent bottom-left"></div>
                            <div className="corner-accent bottom-right"></div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Bottom decorative line */}
            <div className="about-bottom-line"></div>
        </section>
    );
};

export default About;