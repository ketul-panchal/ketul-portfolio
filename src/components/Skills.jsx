import { useRef, useState, useEffect, useCallback } from 'react';
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
import './Skills.css';

const skillsData = [
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', bgColor: '#323330', size: 'large' },
    { name: 'React', icon: SiReact, color: '#61DAFB', bgColor: '#20232a', size: 'large' },
    { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff', bgColor: '#000000', size: 'large' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933', bgColor: '#f0f0f0', size: 'large' },
    { name: 'Python', icon: SiPython, color: '#3776AB', bgColor: '#FFD43B', size: 'large' },
    { name: 'TypeScript', icon: SiTypescript, color: '#ffffff', bgColor: '#3178C6', size: 'large' },
    { name: 'Flutter', icon: SiFlutter, color: '#02569B', bgColor: '#f0f0f0', size: 'large' },
    { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4', bgColor: '#0f172a', size: 'large' },
    { name: 'Express', icon: SiExpress, color: '#ffffff', bgColor: '#000000', size: 'large' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', bgColor: '#f0f0f0', size: 'large' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', bgColor: '#f0f0f0', size: 'large' },
    { name: 'Firebase', icon: SiFirebase, color: '#FFCA28', bgColor: '#1a1a2e', size: 'large' },
    { name: 'Redis', icon: SiRedis, color: '#DC382D', bgColor: '#f0f0f0', size: 'large' },
    { name: 'Git', icon: SiGit, color: '#F05032', bgColor: '#f0f0f0', size: 'large' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED', bgColor: '#f0f0f0', size: 'large' },
    { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5', bgColor: '#ffffff', size: 'large' },
];

// Size configurations for desktop and mobile
const desktopSizeMap = {
    large: { radius: 85, icon: 74 },
    medium: { radius: 55, icon: 46 },
    small: { radius: 38, icon: 30 },
};

const mobileSizeMap = {
    large: { radius: 38, icon: 30 },   // Reduced to medium-ish size
    medium: { radius: 32, icon: 26 },
    small: { radius: 28, icon: 22 },
};

// Physics constants
const GRAVITY = 0.4;
const FRICTION = 0.985;
const BOUNCE = 0.65;
const BALL_BOUNCE = 0.75;

const Skills = () => {
    const containerRef = useRef(null);
    const ballsRef = useRef([]);
    const draggedBallRef = useRef(null);
    const animationRef = useRef(null);
    const isDraggingRef = useRef(false);
    const [, forceUpdate] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Get current size map based on screen size
    const getCurrentSizeMap = useCallback(() => {
        return isMobile ? mobileSizeMap : desktopSizeMap;
    }, [isMobile]);

    // Initialize balls
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        const sizeMap = getCurrentSizeMap();

        ballsRef.current = skillsData.map((skill, index) => {
            const radius = sizeMap[skill.size].radius;
            const cols = isMobile ? 3 : 4;
            const col = index % cols;
            const spacing = (container.width - (isMobile ? 40 : 100)) / cols;

            return {
                id: index,
                ...skill,
                radius,
                iconSize: sizeMap[skill.size].icon,
                x: (isMobile ? 20 : 50) + spacing * col + spacing / 2 + (Math.random() - 0.5) * (isMobile ? 20 : 40),
                y: radius + 50 + Math.random() * (isMobile ? 60 : 100),
                vx: (Math.random() - 0.5) * 3,
                vy: 0,
                mass: (radius / 40) * (radius / 40),
                isDragging: false,
            };
        });

        forceUpdate(n => n + 1);
    }, [isMobile, getCurrentSizeMap]);

    // Update ball sizes when screen size changes
    useEffect(() => {
        if (ballsRef.current.length === 0) return;

        const sizeMap = getCurrentSizeMap();

        ballsRef.current = ballsRef.current.map(ball => {
            const newRadius = sizeMap[ball.size].radius;
            const newIconSize = sizeMap[ball.size].icon;

            return {
                ...ball,
                radius: newRadius,
                iconSize: newIconSize,
                mass: (newRadius / 40) * (newRadius / 40),
            };
        });

        forceUpdate(n => n + 1);
    }, [isMobile, getCurrentSizeMap]);

    // Prevent page scroll when dragging - applied to document
    useEffect(() => {
        const preventScroll = (e) => {
            if (isDraggingRef.current) {
                e.preventDefault();
            }
        };

        // Use passive: false to allow preventDefault
        document.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            document.removeEventListener('touchmove', preventScroll);
        };
    }, []);

    // Main physics loop - always running
    useEffect(() => {
        const simulate = () => {
            if (!containerRef.current || ballsRef.current.length === 0) {
                animationRef.current = requestAnimationFrame(simulate);
                return;
            }

            const container = containerRef.current.getBoundingClientRect();
            const balls = ballsRef.current;

            // Update physics for each ball
            for (let i = 0; i < balls.length; i++) {
                const ball = balls[i];

                // Skip physics for dragged ball
                if (ball.isDragging) continue;

                // Apply gravity
                ball.vy += GRAVITY;

                // Apply friction (air resistance)
                ball.vx *= FRICTION;
                ball.vy *= FRICTION;

                // Update position
                ball.x += ball.vx;
                ball.y += ball.vy;

                // Wall collisions - keep inside container
                // Left wall
                if (ball.x - ball.radius < 0) {
                    ball.x = ball.radius;
                    ball.vx = Math.abs(ball.vx) * BOUNCE;
                }
                // Right wall
                if (ball.x + ball.radius > container.width) {
                    ball.x = container.width - ball.radius;
                    ball.vx = -Math.abs(ball.vx) * BOUNCE;
                }
                // Top wall
                if (ball.y - ball.radius < 0) {
                    ball.y = ball.radius;
                    ball.vy = Math.abs(ball.vy) * BOUNCE;
                }
                // Bottom wall (floor)
                if (ball.y + ball.radius > container.height) {
                    ball.y = container.height - ball.radius;
                    ball.vy = -Math.abs(ball.vy) * BOUNCE;
                    // Extra friction on floor
                    ball.vx *= 0.92;
                    // Stop tiny bounces
                    if (Math.abs(ball.vy) < 0.5) {
                        ball.vy = 0;
                    }
                }
            }

            // Ball-to-ball collisions
            for (let i = 0; i < balls.length; i++) {
                for (let j = i + 1; j < balls.length; j++) {
                    const ball1 = balls[i];
                    const ball2 = balls[j];

                    const dx = ball2.x - ball1.x;
                    const dy = ball2.y - ball1.y;
                    const distSq = dx * dx + dy * dy;
                    const minDist = ball1.radius + ball2.radius;
                    const minDistSq = minDist * minDist;

                    if (distSq < minDistSq && distSq > 0.01) {
                        const dist = Math.sqrt(distSq);

                        // Collision normal
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // Separate balls (prevent overlap)
                        const overlap = minDist - dist;
                        const totalMass = ball1.mass + ball2.mass;

                        const sep1 = overlap * (ball2.mass / totalMass) * 0.5;
                        const sep2 = overlap * (ball1.mass / totalMass) * 0.5;

                        if (!ball1.isDragging) {
                            ball1.x -= nx * sep1;
                            ball1.y -= ny * sep1;
                        }
                        if (!ball2.isDragging) {
                            ball2.x += nx * sep2;
                            ball2.y += ny * sep2;
                        }

                        // Relative velocity
                        const dvx = ball1.vx - ball2.vx;
                        const dvy = ball1.vy - ball2.vy;
                        const dvn = dvx * nx + dvy * ny;

                        // Only resolve if approaching
                        if (dvn > 0) {
                            const impulse = (2 * dvn * BALL_BOUNCE) / totalMass;

                            if (!ball1.isDragging) {
                                ball1.vx -= impulse * ball2.mass * nx;
                                ball1.vy -= impulse * ball2.mass * ny;
                            }
                            if (!ball2.isDragging) {
                                ball2.vx += impulse * ball1.mass * nx;
                                ball2.vy += impulse * ball1.mass * ny;
                            }
                        }
                    }
                }
            }

            // Trigger re-render
            forceUpdate(n => n + 1);
            animationRef.current = requestAnimationFrame(simulate);
        };

        animationRef.current = requestAnimationFrame(simulate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Mouse/touch handlers
    const handleMouseDown = (e, ballId) => {
        e.preventDefault();
        const ball = ballsRef.current.find(b => b.id === ballId);
        if (ball) {
            ball.isDragging = true;
            ball.vx = 0;
            ball.vy = 0;
            isDraggingRef.current = true;
            draggedBallRef.current = {
                id: ballId,
                lastX: e.clientX,
                lastY: e.clientY,
                lastTime: Date.now(),
            };
        }
    };

    const handleMouseMove = (e) => {
        if (!draggedBallRef.current || !containerRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        const ball = ballsRef.current.find(b => b.id === draggedBallRef.current.id);

        if (ball) {
            const now = Date.now();
            const dt = now - draggedBallRef.current.lastTime;

            // Calculate new position relative to container
            let newX = e.clientX - container.left;
            let newY = e.clientY - container.top;

            // Clamp to boundaries
            newX = Math.max(ball.radius, Math.min(container.width - ball.radius, newX));
            newY = Math.max(ball.radius, Math.min(container.height - ball.radius, newY));

            // Calculate velocity for throw
            if (dt > 0) {
                ball.vx = (newX - ball.x) * 0.3;
                ball.vy = (newY - ball.y) * 0.3;
            }

            ball.x = newX;
            ball.y = newY;

            draggedBallRef.current.lastX = e.clientX;
            draggedBallRef.current.lastY = e.clientY;
            draggedBallRef.current.lastTime = now;
        }
    };

    const handleMouseUp = () => {
        if (!draggedBallRef.current) return;

        const ball = ballsRef.current.find(b => b.id === draggedBallRef.current.id);
        if (ball) {
            ball.isDragging = false;
        }
        draggedBallRef.current = null;
        isDraggingRef.current = false;
    };

    // Touch handlers
    const handleTouchStart = (e, ballId) => {
        const touch = e.touches[0];
        handleMouseDown(
            { preventDefault: () => { }, clientX: touch.clientX, clientY: touch.clientY },
            ballId
        );
    };

    const handleTouchMove = (e) => {
        if (!draggedBallRef.current) return;
        const touch = e.touches[0];
        handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    };

    const handleTouchEnd = () => {
        handleMouseUp();
    };

    return (
        <section id="skills" className="skills-section">
            <div className="skills-header">
                <span className="skills-label">CLICK & DRAG</span>
                <h2 className="skills-title">
                    My tech stack to build
                    <br />
                    amazing things!
                </h2>
            </div>

            <div
                className="skills-container"
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {ballsRef.current.map((ball) => {
                    const Icon = ball.icon;

                    return (
                        <div
                            key={ball.id}
                            className={`skill-ball ${ball.isDragging ? 'dragging' : ''}`}
                            style={{
                                width: ball.radius * 2,
                                height: ball.radius * 2,
                                backgroundColor: ball.bgColor,
                                transform: `translate(${ball.x - ball.radius}px, ${ball.y - ball.radius}px)`,
                                zIndex: ball.isDragging ? 100 : 1,
                                touchAction: 'none', // Prevents scroll on touch for balls
                            }}
                            onMouseDown={(e) => handleMouseDown(e, ball.id)}
                            onTouchStart={(e) => handleTouchStart(e, ball.id)}
                        >
                            <Icon size={ball.iconSize} color={ball.color} />
                            <span className="skill-tooltip">{ball.name}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Skills;