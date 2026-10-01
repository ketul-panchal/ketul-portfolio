import { motion, MotionConfig } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { projects } from '../../data/projectsData';
import { getProjectImage } from '../../utils/projectImage';
import { describeLink } from '../../utils/projectLink';
import ScrollStack, { ScrollStackItem } from '../ui/ScrollStack';
import ProtectedImage from '../ui/ProtectedImage';
import './Projects.css';

const ease = [0.22, 1, 0.36, 1];

const pad = (n) => String(n).padStart(2, '0');
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Largest width the image is shown at, for picking one from the srcset
const IMAGE_SIZES = '(min-width: 1024px) 56vw, (min-width: 640px) and (orientation: landscape) 50vw, 92vw';

const reveal = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const wordRise = {
    hidden: { y: '110%' },
    visible: { y: '0%', transition: { duration: 0.9, ease } },
};

const stagger = (gap) => ({ visible: { transition: { staggerChildren: gap } } });

const ProjectCard = ({ project, index }) => {
    const image = getProjectImage(project.image);
    const link = describeLink(project.url);
    const LinkIcon = link?.Icon;
    const title = project.shortName || project.name;
    const titleId = `project-${project.id}-title`;

    return (
        <article
            className="project-card"
            aria-labelledby={titleId}
            style={{
                '--card-bg': project.cardBackground,
                '--card-fg': project.textColor,
                '--accent': project.accentColor,
                '--glow-rgb': image.rgb,
            }}
        >
            <motion.div
                className="project-card-info"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={stagger(0.07)}
            >
                <motion.p className="project-card-meta" variants={reveal}>
                    <span className="project-card-index">
                        {pad(index + 1)} <span>/ {pad(projects.length)}</span>
                    </span>
                    {project.category && <span className="project-card-category">{project.category}</span>}
                </motion.p>

                <motion.h3 id={titleId} className="project-card-title" variants={reveal}>
                    {title}
                </motion.h3>

                <motion.p className="project-card-description" variants={reveal}>
                    {capitalize(project.description)}
                </motion.p>

                <motion.ul className="project-card-tech" aria-label="Tech stack" variants={reveal}>
                    {project.techStack.split(',').map((tech) => (
                        <li key={tech}>{tech.trim()}</li>
                    ))}
                </motion.ul>

                {link && (
                    <motion.a
                        className="project-card-cta"
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label}: ${title} (opens in a new tab)`}
                        variants={reveal}
                    >
                        <LinkIcon className="project-card-cta-icon" aria-hidden="true" />
                        {link.label}
                        <span className="project-card-cta-arrow" aria-hidden="true">
                            <FiArrowUpRight />
                        </span>
                    </motion.a>
                )}
            </motion.div>

            <motion.div
                className="project-card-visual"
                initial={{ opacity: 0, y: 48, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease }}
            >
                <ProtectedImage
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes={IMAGE_SIZES}
                    width={image.width}
                    height={image.height}
                    alt={`${project.name} screenshots`}
                    className="project-card-image"
                    loading="lazy"
                    decoding="async"
                />
            </motion.div>
        </article>
    );
};

const Projects = () => {
    return (
        <MotionConfig reducedMotion="user">
            <section id="projects" className="projects-section" aria-labelledby="projects-title">
                <motion.header
                    className="projects-header"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={stagger(0.08)}
                >
                    <div>
                        <motion.span className="projects-label" variants={reveal}>
                            Projects
                        </motion.span>
                        <h2 id="projects-title" className="projects-title">
                            <span className="projects-title-mask">
                                <motion.span variants={wordRise}>Every build,</motion.span>
                            </span>{' '}
                            <span className="projects-title-mask">
                                <motion.span className="accent" variants={wordRise}>
                                    in detail.
                                </motion.span>
                            </span>
                        </h2>
                    </div>
                    <motion.p className="projects-subtitle" variants={reveal}>
                        Mobile apps, web platforms and SaaS products. What each one does, and the
                        stack behind it.
                    </motion.p>
                </motion.header>

                <ScrollStack>
                    {projects.map((project, index) => (
                        <ScrollStackItem key={project.id}>
                            <ProjectCard project={project} index={index} />
                        </ScrollStackItem>
                    ))}
                </ScrollStack>
            </section>
        </MotionConfig>
    );
};

export default Projects;
