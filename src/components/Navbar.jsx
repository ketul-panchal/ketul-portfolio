import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

  return (
    <motion.header
      className="navbar-wrapper"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.nav
        className={`navbar-pill ${scrolled ? 'scrolled' : ''}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Glass effect layers */}
        <div className="glass-effect"></div>
        <div className="glass-border"></div>

        <div className="nav-content">
          {/* Logo/Name - Left Side */}
          <motion.a
            href="#home"
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="logo-text">Ketul</span>
            <span className="logo-dot">.</span>
          </motion.a>

          {/* Navigation Links - Right Side */}
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
              >
                {item}
                <span className="link-indicator"></span>
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <motion.div
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div
          className="mobile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <motion.div
        className={`mobile-menu ${isOpen ? 'active' : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mobile-glass-effect"></div>
        {navItems.map((item, index) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="mobile-link"
            initial={{ opacity: 0, x: -20 }}
            animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setIsOpen(false)}
          >
            {item}
          </motion.a>
        ))}
      </motion.div>
    </motion.header>
  );
};

export default Navbar;