import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import GlassSurface from './GlassSurface';
import './GlassNavbar.css';

const NAV_ITEMS = [
    { label: 'Home', link: '#home' },
    { label: 'About', link: '#about' },
    { label: 'Skills', link: '#skills' },
    { label: 'Projects', link: '#projects' },
    { label: 'Contact', link: '#contact' }
];

const GlassNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [dimensions, setDimensions] = useState({ width: 700, height: 56 });
    const navRef = useRef(null);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Detect active section
            const sections = NAV_ITEMS.map(item => item.link.replace('#', ''));
            for (const section of sections.reverse()) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle responsive dimensions
    useEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;
            if (width > 1200) {
                setDimensions({ width: 720, height: 54 });
            } else if (width > 900) {
                setDimensions({ width: 620, height: 52 });
            } else if (width > 768) {
                setDimensions({ width: 480, height: 50 });
            } else {
                setDimensions({ width: Math.min(width - 32, 360), height: 48 });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const handleNavigate = (link) => {
        const element = document.querySelector(link);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    // Glass surface props based on scroll state
    const glassProps = {
        borderRadius: 100,
        borderWidth: 0.06,
        brightness: scrolled ? 12 : 18,
        opacity: scrolled ? 0.88 : 0.8,
        blur: scrolled ? 14 : 10,
        displace: 0.4,
        backgroundOpacity: 0.08,
        saturation: 1.3,
        distortionScale: -160,
        redOffset: 3,
        greenOffset: 8,
        blueOffset: 12,
        mixBlendMode: 'normal'
    };

    return (
        <header className="glass-navbar-wrapper">
            <motion.div
                ref={navRef}
                className={`glass-navbar-container ${scrolled ? 'scrolled' : ''}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                {/* Glass Surface Navbar */}
                <GlassSurface
                    width={dimensions.width}
                    height={dimensions.height}
                    {...glassProps}
                    className="glass-navbar-pill"
                >
                    <nav className="glass-nav-content">
                        {/* Logo */}
                        <motion.a
                            href="#home"
                            className="glass-nav-logo"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigate('#home');
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="logo-text">Ketul</span>
                            <span className="logo-dot">.</span>
                        </motion.a>

                        {/* Desktop Nav Links */}
                        <div className="glass-nav-links">
                            {NAV_ITEMS.map((item, index) => {
                                const isActive = activeSection === item.link.replace('#', '');
                                return (
                                    <motion.a
                                        key={item.label}
                                        href={item.link}
                                        className={`glass-nav-link ${isActive ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigate(item.link);
                                        }}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="link-text">{item.label}</span>
                                        {isActive && (
                                            <motion.span
                                                className="link-active-indicator"
                                                layoutId="activeIndicator"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </motion.a>
                                );
                            })}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            className="glass-menu-toggle"
                            onClick={() => setIsOpen(!isOpen)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <FaTimes />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <FaBars />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </nav>
                </GlassSurface>

                {/* Glow effect behind navbar */}
                <div className="navbar-glow-effect"></div>
            </motion.div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="glass-mobile-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="glass-mobile-menu-wrapper"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <GlassSurface
                            width={Math.min(typeof window !== 'undefined' ? window.innerWidth - 32 : 320, 340)}
                            height={300}
                            borderRadius={24}
                            brightness={12}
                            opacity={0.92}
                            blur={18}
                            displace={0.3}
                            backgroundOpacity={0.1}
                            distortionScale={-140}
                            className="glass-mobile-menu"
                        >
                            <div className="mobile-menu-inner">
                                {/* Mobile Logo */}
                                <div className="mobile-menu-header">
                                    <span className="mobile-logo-text">Ketul</span>
                                    <span className="mobile-logo-dot">.</span>
                                </div>

                                {/* Mobile Links */}
                                <div className="mobile-menu-links">
                                    {NAV_ITEMS.map((item, index) => {
                                        const isActive = activeSection === item.link.replace('#', '');
                                        return (
                                            <motion.a
                                                key={item.label}
                                                href={item.link}
                                                className={`mobile-menu-link ${isActive ? 'active' : ''}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 + index * 0.04 }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavigate(item.link);
                                                }}
                                            >
                                                <span className="mobile-link-number">0{index + 1}</span>
                                                <span className="mobile-link-text">{item.label}</span>
                                                <motion.span
                                                    className="mobile-link-arrow"
                                                    initial={{ x: -5, opacity: 0 }}
                                                    whileHover={{ x: 0, opacity: 1 }}
                                                >
                                                    →
                                                </motion.span>
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </div>
                        </GlassSurface>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default GlassNavbar;