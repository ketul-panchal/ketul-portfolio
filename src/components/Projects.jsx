import { projects, projectsHeader } from '../data/projectsData';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { FiExternalLink, FiGithub, FiArrowUpRight } from 'react-icons/fi';
import './Projects.css';

const ProjectCard = ({ project, index }) => {
    // Alternate between dark and light cards
    const isLight = index % 2 === 1;

    const cardStyle = {
        background: isLight
            ? '#f5f5f5'
            : (project.cardBackground || 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)'),
        color: isLight ? '#000' : (project.textColor || '#ffffff'),
    };

    const accentColor = project.accentColor || '#ff6b35';

    return (
        <div className={`project-card-content ${isLight ? 'light' : 'dark'}`} style={cardStyle}>
            {/* Link Arrow Button */}
            {project.url && project.url !== '#' && (
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-arrow-link"
                    style={{
                        background: isLight ? accentColor : '#fff',
                        color: isLight ? '#fff' : '#000'
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
                                borderColor: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
                                color: isLight ? '#333' : 'rgba(255,255,255,0.8)'
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
                            style={{ background: accentColor }}
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
                                borderColor: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
                                color: isLight ? '#333' : '#fff'
                            }}
                        >
                            <FiGithub />
                            <span>GitHub</span>
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
            {/* Section Header */}
            <div className="projects-header">
                <h2 className="projects-title">
                    <span className="title-icon">✦</span>
                    {projectsHeader.title}
                    <span className="title-icon">✦</span>
                </h2>
            </div>

            {/* Sticky Stack Cards */}
            <ScrollStack>
                {projects.map((project, index) => (
                    <ScrollStackItem key={project.id}>
                        <ProjectCard project={project} index={index} />
                    </ScrollStackItem>
                ))}
            </ScrollStack>
        </section>
    );
};

export default Projects;
