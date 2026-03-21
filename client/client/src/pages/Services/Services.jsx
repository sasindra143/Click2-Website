import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Tilt from 'react-parallax-tilt';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    icon: '🌐',
    title: 'Advanced Web Development',
    desc: 'Bespoke, high-performance web applications built with React, Next.js, and GSAP for immersive user experiences.',
    bullets: ['Custom 3D UI/UX Design', 'Full-Stack Scalability', 'SEO & Performance Optimized', 'Mobile-First Responsive Design'],
    color: 'purple',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: '📧',
    title: 'Precision Email Automation',
    desc: 'Enterprise-grade email marketing systems with intelligent tracking, drip campaigns, and automated follow-ups.',
    bullets: ['Engagement Tracking Pixel', 'Automated Drip Sequences', 'Lead Nurturing Systems', 'Gmail & Outlook Integration'],
    color: 'blue',
    img: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: '📱',
    title: 'Direct SMS Automation',
    desc: 'High-speed SMS engagement portals integrated with Twilio for instant customer alerts and verification.',
    bullets: ['Instant Notification Alerts', 'Bulk SMS Campaigns', 'Two-Factor Authentication', 'Global API Connectivity'],
    color: 'green',
    img: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: '🏥',
    title: 'Hospital & Healthcare Portals',
    desc: 'Secure, HIPAA-compliant platforms for appointment scheduling, doctor directories, and patient management.',
    bullets: ['Appointment Systems', 'Patient Records', 'Doctor Directories', 'Secure Connectivity'],
    color: 'amber',
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
  },
];

const CLIENT_WORK = [
  { 
    name: 'PR Skillverse', 
    url: 'https://www.prskillverse.com', 
    img: '/ai-images/portfolio_pr_skillverse_1774054598085.png',
    desc: 'Advanced E-Learning (LMS) Platform for tech skills.'
  },
  { 
    name: '360 Vertex Solutions', 
    url: 'https://www.360vertexsolutions.com', 
    img: '/ai-images/portfolio_vertex_solutions_1774054612593.png',
    desc: 'Corporate Agency Website providing digital solutions.'
  },
  { 
    name: 'Vaakya Creations', 
    url: 'https://vaakya-creations.netlify.app', 
    img: '/ai-images/portfolio_vaakya_creations_1774054627953.png',
    desc: 'Creative Portfolio showcasing media and art pieces.'
  },
  { 
    name: 'Sasindra Portfolio', 
    url: 'https://sasindraportfolio.netlify.app/', 
    img: '/ai-images/service_business_1774054704656.png', // Reusing the ultra-sleek business UI
    desc: 'Interactive Personal Web Developer Portfolio.'
  },
];

const PLANS = [
  {
    name: 'Starter Website',
    price: '₹14,999',
    period: '/one-time',
    badge: null,
    features: ['5 Pages Custom Design', 'Mobile Responsive', 'Contact Form', 'Basic SEO Setup', '1 Month Support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Business Portal',
    price: '₹34,999',
    period: '/one-time',
    badge: '🔥 Most Popular',
    features: ['Up to 15 Pages', 'CMS Integration', 'Advanced SEO', 'Payment Gateway Integration', '3 Months Priority Support', 'Free SSL'],
    cta: 'Start Project',
    highlight: true,
  },
  {
    name: 'Enterprise App',
    price: 'Custom',
    period: ' pricing',
    badge: null,
    features: ['Custom Web Applications', 'Hospital/LMS Portals', 'Scalable Architecture', 'Custom API Dev', 'Dedicated Developer', 'Annual Maintenance'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function Services() {
  const container = useRef();

  useGSAP(() => {
    // Hero Elements reveal
    gsap.from('.page-hero-inner > *', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Service Cards Stagger
    gsap.from('.svc-card-wrapper', {
      scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.4)'
    });

    // Pricing Header & Cards Stagger
    gsap.from('.section-header > *', {
      scrollTrigger: { trigger: '.pricing-section', start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out'
    });

    gsap.from('.plan-card-wrapper', {
      scrollTrigger: { trigger: '.pricing-grid', start: 'top 80%' },
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }, { scope: container });

  return (
    <div ref={container} style={{ overflowX: 'hidden' }}>
      <Helmet>
        <title>Services – Click2Website</title>
        <meta name="description" content="Custom web development for hospitals, colleges, businesses, LMS and portfolios. View our pricing plans." />
        <title>Our Services | Specialized Web Development | Click2Website</title>
        <meta name="description" content="Explore our specialized web development services for hospitals, colleges, e-learning platforms, and corporate businesses." />
      </Helmet>

      <Navbar />

      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-tag">🛠️ What We Build</span>
          <h1>Our Web <span className="gradient-text">Services</span></h1>
          <p>Professional end-to-end development services for every industry.</p>
          <div className="hero-btns">
            <Link to="/contact" className="cta-primary">Get a Free Quote</Link>
            <a href="#pricing" className="cta-secondary">View Packages</a>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-list-container gs-section">
        <div className="section-title">
          <h2 className="gs-header">Our Specialized Web Services</h2>
          <p className="gs-fade">Modern UI/UX focused web development across all industries.</p>
        </div>
        
        <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {SERVICES.map((s) => (
            <Tilt key={s.title} className="svc-card-wrapper" tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={400} glareEnable={true} glareMaxOpacity={0.1}>
              <div className={`svc-card accent-${s.color}`} style={{ height: '100%', padding: 0, overflow: 'hidden' }}>
                <img src={s.img} alt={s.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.05)' }} />
                <div style={{ padding: '1.5rem' }}>
                  <div className="svc-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{s.icon}</div>
                  <h3 style={{ fontSize: '1.25rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.9rem' }}>{s.desc}</p>
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}><span className="check">✓</span> {b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Client Work Section */}
      <section className="portfolio-section gs-section" style={{ padding: '5rem 0' }}>
        <div className="section-title">
          <h2 className="gs-header">Live Client Portfolio</h2>
          <p className="gs-fade">Explore our successful, high-performance web development projects.</p>
        </div>

        <div 
          className="home-portfolio-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '1.5rem', 
            marginTop: '3rem' 
          }}
        >
          {CLIENT_WORK.map((work) => (
            <Tilt key={work.name} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} transitionSpeed={400} glareEnable={true} glareMaxOpacity={0.15}>
              <a href={work.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div className="home-portfolio-card" style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <img src={work.img} alt={work.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div className="home-portfolio-content" style={{ padding: '1.25rem', flexGrow: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.1rem' }}>{work.name}</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{work.desc}</p>
                  </div>
                </div>
              </a>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section" id="pricing">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">💰 Development Packages</span>
            <h2>Transparent Development Costs</h2>
            <p>From simple portfolios to complex enterprise portals. No hidden fees.</p>
          </div>
          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <Tilt key={plan.name} className="plan-card-wrapper" tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.01} transitionSpeed={1000} gyroscope={true}>
                <div className={`plan-card${plan.highlight ? ' highlight' : ''}`} style={{ height: '100%' }}>
                  {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <strong>{plan.price}</strong><span>{plan.period}</span>
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((f) => (
                      <li key={f}><span className="check">✓</span> {f}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className={plan.highlight ? 'cta-primary' : 'cta-secondary'}>
                    {plan.cta}
                  </Link>
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
