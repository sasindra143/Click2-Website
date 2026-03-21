import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Tilt from 'react-parallax-tilt';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  { emoji: '👨‍💼', name: 'Ramesh Kumar', role: 'Founder & CEO', quote: 'Empowering businesses with modern, scalable, and fast web solutions.' },
  { emoji: '👩‍💻', name: 'Priya Sharma', role: 'Lead Developer', quote: 'Passionate about clean code and building flawless digital experiences.' },
  { emoji: '🧑‍🎨', name: 'Arjun Patel', role: 'Lead UI/UX Designer', quote: 'Creating beautiful interfaces that convert visitors to loyal customers.' },
];

export default function About() {
  const container = useRef();

  useGSAP(() => {
    // Hero Elements
    gsap.from('.page-hero-inner > *', {
      y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out'
    });

    // Overview Text and List
    gsap.from('.about-text > *', {
      scrollTrigger: { trigger: '.about-overview', start: 'top 80%' },
      x: -40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power2.out'
    });

    // Overview Cards (Mission/Vision)
    gsap.from('.about-card-wrapper', {
      scrollTrigger: { trigger: '.about-cards', start: 'top 80%' },
      x: 40, opacity: 0, duration: 1, stagger: 0.2, ease: 'power2.out'
    });

    // Team Header
    gsap.from('.team-section .section-header > *', {
      scrollTrigger: { trigger: '.team-section', start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out'
    });

    // Team Grid
    gsap.from('.team-card-wrapper', {
      scrollTrigger: { trigger: '.team-grid', start: 'top 80%' },
      y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)'
    });

  }, { scope: container });

  return (
    <div ref={container} style={{ overflowX: 'hidden' }}>
      <Helmet>
        <title>About Us – Click2Website</title>
        <meta name="description" content="Click2Website is a premium web development agency building solutions for hospitals, colleges, and enterprise businesses." />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-tag">🏢 Our Story</span>
          <h1>About <span className="gradient-text">Click2Website</span></h1>
          <p>Premium web development agency building digital experiences that drive real results.</p>
        </div>
      </section>

      {/* Overview */}
      <section className="about-overview">
        <div className="section-inner about-grid">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              Click2Website is a dedicated team of expert developers, designers, and strategists.
              We specialize in custom web development for Hospitals, Colleges, Businesses, LMS Portals,
              and Personal Portfolios. We help you establish a powerful online presence that scales.
            </p>
            <ul className="about-list">
              {['Custom Web App Development', 'SEO-Optimized Architectures', 'Responsive Mobile-First Design', 'End-to-End Enterprise Solutions'].map(i => (
                <li key={i}><span className="check">✅</span> {i}</li>
              ))}
            </ul>
          </div>
          <div className="about-cards">
            <Tilt className="about-card-wrapper" tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={1000}>
              <div className="about-card mission" style={{ height: '100%' }}>
                <div className="about-card-icon">🎯</div>
                <h3>Our Mission</h3>
                <p>"To empower businesses across all sectors with high-performance digital platforms that enable massive growth."</p>
              </div>
            </Tilt>
            <Tilt className="about-card-wrapper" tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={1000}>
              <div className="about-card vision" style={{ height: '100%' }}>
                <div className="about-card-icon">👁️</div>
                <h3>Our Vision</h3>
                <p>"To be the world's most trusted development partner for institutions demanding technical excellence."</p>
              </div>
            </Tilt>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">👥 Our Team</span>
            <h2>The Brains Behind Click2Website</h2>
          </div>
          <div className="team-grid">
            {TEAM.map((m) => (
              <Tilt key={m.name} className="team-card-wrapper" tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={400} glareEnable={true} glareMaxOpacity={0.1}>
                <div className="team-card" style={{ height: '100%' }}>
                  <div className="team-avatar">{m.emoji}</div>
                  <h3>{m.name}</h3>
                  <span className="team-role">{m.role}</span>
                  <p>"{m.quote}"</p>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
