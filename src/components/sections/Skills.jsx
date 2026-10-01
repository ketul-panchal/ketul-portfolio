import { useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
    SiJavascript,
    SiPython,
    SiReact,
    SiNextdotjs,
    SiNodedotjs,
    SiExpress,
    SiFlutter,
    SiTailwindcss,
    SiMongodb,
    SiPostgresql,
    SiFirebase,
    SiRedis,
    SiGit,
    SiDocker,
    SiKubernetes,
    SiTypescript
} from 'react-icons/si';
import { createBallPit } from './skillsBallPit';
import './Skills.css';

const skillsData = [
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', bgColor: '#323330' },
    { name: 'React', icon: SiReact, color: '#61DAFB', bgColor: '#20232a' },
    { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff', bgColor: '#000000' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933', bgColor: '#f0f0f0' },
    { name: 'Python', icon: SiPython, color: '#3776AB', bgColor: '#FFD43B' },
    { name: 'TypeScript', icon: SiTypescript, color: '#ffffff', bgColor: '#3178C6' },
    { name: 'Flutter', icon: SiFlutter, color: '#02569B', bgColor: '#f0f0f0' },
    { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4', bgColor: '#0f172a' },
    { name: 'Express', icon: SiExpress, color: '#ffffff', bgColor: '#000000' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', bgColor: '#f0f0f0' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', bgColor: '#f0f0f0' },
    { name: 'Firebase', icon: SiFirebase, color: '#FFCA28', bgColor: '#1a1a2e' },
    { name: 'Redis', icon: SiRedis, color: '#DC382D', bgColor: '#f0f0f0' },
    { name: 'Git', icon: SiGit, color: '#F05032', bgColor: '#f0f0f0' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED', bgColor: '#f0f0f0' },
    { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5', bgColor: '#ffffff' },
];

const Skills = () => {
    const containerRef = useRef(null);
    const ballRefs = useRef([]);
    const reduceMotion = Boolean(useReducedMotion());

    // The physics runs outside React and moves the balls directly, so there are no
    // re-renders while they bounce around
    useLayoutEffect(() => {
        const pit = createBallPit(containerRef.current, ballRefs.current, { reduceMotion });
        return () => pit.destroy();
    }, [reduceMotion]);

    return (
        <section id="skills" className="skills-section">
            <div className="skills-header">
                <span className="skills-label">
                    <span className="skills-label-pointer">Click &amp; drag</span>
                    <span className="skills-label-touch">Tap &amp; drag</span>
                </span>
                <h2 className="skills-title">
                    My tech stack to build
                    <br />
                    amazing things!
                </h2>
            </div>

            <div className="skills-container" ref={containerRef}>
                {skillsData.map((skill, index) => {
                    const Icon = skill.icon;
                    return (
                        <button
                            key={skill.name}
                            ref={(el) => {
                                ballRefs.current[index] = el;
                            }}
                            type="button"
                            className="skill-ball"
                            aria-label={skill.name}
                            data-cursor-text="Drag"
                            style={{ '--ball-bg': skill.bgColor, '--ball-fg': skill.color }}
                        >
                            <span className="skill-ball-face">
                                <Icon aria-hidden="true" />
                            </span>
                            <span className="skill-tooltip" aria-hidden="true">
                                {skill.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default Skills;
