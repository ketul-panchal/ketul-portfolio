import React from 'react';
import { motion } from 'framer-motion';
import { SiLinkedin, SiGithub, SiInstagram } from 'react-icons/si';
import { FiArrowUpRight, FiMail } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
    // User content
    const email = "ketulpanchal5@gmail.com";
    const linkedinUrl = "https://www.linkedin.com/in/ketul10";
    const githubUrl = "https://github.com/ketul-panchal";
    const myResume = "https://drive.google.com/file/d/1UbK2JWwgEFSIuvong6QYrl3cVxq-nBd7/view?usp=sharing";

    return (
        <section id="contact" className="contact-section">
            <div className="contact-background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="contact-container">

                {/* Left Side - Big Typography */}
                <div className="contact-left">
                    <motion.div
                        className="status-badge"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <span className="status-dot"></span>
                        Available for freelance
                    </motion.div>

                    <div className="headline-wrapper">
                        <motion.h1
                            className="contact-headline"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                            viewport={{ once: true }}
                        >
                            Let's create<br />
                            something<br />
                            extraordinary<br />
                            together<span className="headline-dot">.</span>
                        </motion.h1>

                        <motion.p
                            className="contact-subline"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            Let's make an impact
                        </motion.p>
                    </div>
                </div>

                {/* Right Side - Profile & Actions */}
                <div className="contact-right">

                    {/* Profile Card */}
                    <motion.div
                        className="profile-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <div className="profile-image-wrapper">
                            {/* Using one of the user's images */}
                            <img src="/assets/IMG_20251022_131142.jpg" alt="Ketul" className="profile-image" />
                        </div>
                        <div className="profile-info">
                            <h3 className="profile-name">Ketul</h3>
                            <p className="profile-role">Full-Stack & Flutter Developer</p>
                            <div className="profile-socials">
                                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"><SiLinkedin /></a>
                                <a href={githubUrl} target="_blank" rel="noopener noreferrer"><SiGithub /></a>
                                {/* <a href="#" target="_blank" rel="noopener noreferrer"><SiInstagram /></a> */}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Details */}
                    <motion.div
                        className="contact-details"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <span className="contact-label">Contact me</span>
                        <a href={`mailto:${email}`} className="contact-email">
                            {email}
                        </a>

                        <p className="contact-pitch">
                            Hit me up if you're looking for a <span className="highlight">fast, reliable</span> Full-Stack developer who can bring your vision to life.
                        </p>

                        {/* LinkedIn Button (Replacing Behance) */}
                        <a
                            href={myResume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="linkedin-cta"
                        >
                            <span>My Resume</span>
                            <FiArrowUpRight className="arrow-icon" />
                        </a>
                    </motion.div>

                </div>
            </div>

            {/* Footer */}
            <div className="contact-footer">
                <div className="footer-left">
                    <span className="logo-text">Ketul.</span>
                </div>
                <div className="footer-center">
                    Copyright © 2026 Ketul Portfolio
                </div>
                <div className="footer-right">
                    <span>Built with ❤️</span>
                </div>
            </div>
        </section>
    );
};

export default Contact;
