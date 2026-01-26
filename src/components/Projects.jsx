import { projects } from '../data/projectsData';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { FiExternalLink, FiGithub, FiArrowUpRight } from 'react-icons/fi';
import './Projects.css';
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useRef } from 'react';

// Simplified Moving Text Component with Seamless Loop
const ParallaxText = ({ children, baseVelocity = 5 }) => {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useMotionValue(0);
    const currentX = useRef(0);

    useAnimationFrame((t, delta) => {
        let moveBy = baseVelocity * (delta / 1000);
        const velocity = Math.abs(velocityFactor.get());
        if (velocity > 0) {
            moveBy += moveBy * velocity;
        }

        currentX.current -= moveBy;
        if (currentX.current <= -25) {
            currentX.current = 0;
        }
        x.set(currentX.current);
    });

    return (
        <div className="parallax-text-container">
            <motion.div
                className="parallax-text-scroller"
                style={{ x: useTransform(x, value => `${value}%`) }}
            >
                <span>{children}</span>
                <span>{children}</span>
                <span>{children}</span>
                <span>{children}</span>
            </motion.div>
        </div>
    );
}

const ProjectCard = ({ project, index, isLast }) => {
    // Alternate between dark and light cards
    const isLight = index % 2 === 1;

    const cardStyle = {
        background: isLight
            ? '#f8f8f8'
            : (project.cardBackground || 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)'),
        color: isLight ? '#000' : (project.textColor || '#ffffff'),
        // Border Radius applied here now
        borderRadius: isLast ? '40px' : '40px 40px 0 0',
        // Shadow applied here to mask the card below
        boxShadow: '0 -20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden'
    };

    const accentColor = project.accentColor || '#ff6b35';

    return (
        <div className={`project-card-content ${isLight ? 'light' : 'dark'}`} style={cardStyle}>
            {/* Link Arrow Button - Top Right */}
            {project.url && project.url !== '#' && (
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-arrow-link"
                    style={{
                        background: isLight ? '#8B5CF6' : accentColor, // Purple or Accent
                        color: '#fff'
                    }}
                >
                    <FiArrowUpRight />
                </a>
            )}

            {/* Left Side - Info */}
            <div className="project-card-info">
                <h3 className="project-card-title">{project.name}</h3>

                <div className="project-card-tech">
                    {project.techStack.split(',').map((tech, idx) => (
                        <span
                            key={idx}
                            className="tech-tag"
                            style={{
                                borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                                color: isLight ? '#333' : 'rgba(255,255,255,0.8)',
                                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)'
                            }}
                        >
                            {tech.trim()}
                        </span>
                    ))}
                </div>

                <p className="project-card-description">{project.description}</p>

                <div className="project-card-actions">
                    {project.url && project.url !== '#' && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link primary"
                            style={{ background: isLight ? '#000' : accentColor, color: '#fff' }}
                        >
                            <FiExternalLink />
                            <span>View Project</span>
                        </a>
                    )}
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link secondary"
                            style={{
                                borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                                color: isLight ? '#000' : '#fff'
                            }}
                        >
                            <FiGithub />
                            <span>Code</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="project-card-visual">
                {project.image ? (
                    <img
                        src={project.image}
                        alt={project.name}
                        className="project-card-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div className="project-card-image-placeholder" style={{ display: project.image ? 'none' : 'flex' }}>
                    <span className="project-icon">🚀</span>
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    return (
        <section id="projects" className="projects-section">
            {/* Header with Marquee */}
            <div className="projects-marquee-container">
                <ParallaxText baseVelocity={3.5}>
                    &nbsp; Full Stack Application &nbsp; <span className="star-icon">✦</span> &nbsp; Mobile App &nbsp; <span className="star-icon">✦</span> &nbsp; SaaS &nbsp; <span className="star-icon">✦</span> &nbsp; Web App &nbsp; <span className="star-icon">✦</span> &nbsp; Website &nbsp; <span className="star-icon">✦</span>
                </ParallaxText>
            </div>

            {/* Sticky Stack Cards */}
            <ScrollStack>
                {projects.map((project, index) => (
                    <ScrollStackItem key={project.id}>
                        <ProjectCard
                            project={project}
                            index={index}
                            isLast={index === projects.length - 1}
                        />
                    </ScrollStackItem>
                ))}
            </ScrollStack>
        </section>
    );
};

export default Projects;
