import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { TypeAnimation } from 'react-type-animation';
import Tilt from 'react-parallax-tilt';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import heroImg from '../../assets/hero.png';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: '🏥', title: 'Hospital Websites', desc: 'Secure portals with real-time appointment booking, doctor directories, and patient history.', color: 'purple' },
  { icon: '🏫', title: 'College & University Portals', desc: 'Dynamic educational websites for seamless student-faculty management.', color: 'blue' },
  { icon: '💼', title: 'Business Websites', desc: 'High-conversion corporate platforms designed to capture leads and boost SEO.', color: 'green' },
  { icon: '🎓', title: 'LMS Portals', desc: 'Custom E-Learning setups with video modules, student tracking, and secure payments.', color: 'amber' },
];

const PORTFOLIO = [
  { 
    name: 'PR Skillverse', 
    url: 'https://www.prskillverse.com', 
    img: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
    desc: 'Advanced E-Learning (LMS) Platform for tech skills.'
  },
  { 
    name: '360 Vertex Solutions', 
    url: 'https://www.360vertexsolutions.com', 
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    desc: 'Corporate Agency Website providing digital solutions.'
  },
  { 
    name: 'Vaakya Creations', 
    url: 'https://vaakya-creations.netlify.app', 
    img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    desc: 'Creative Portfolio showcasing media and art pieces.'
  },
];

const STATS = [
  { value: '500+', label: 'Projects Delivered' },
  { value: '99%', label: 'Client Satisfaction' },
  { value: '10+', label: 'Years Experience' },
  { value: '24/7', label: 'Tech Support' },
];

export default function Home() {
  const container = useRef();
  const sections = useRef([]);

  useGSAP(() => {
    // Hero Elements Animation
    gsap.from('.hero-badge', { y: -30, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.from('.hero-content h1', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
    gsap.from('.hero-content p', { y: 20, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
    gsap.from('.hero-btns', { y: 20, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.6 });
    gsap.from('.hero-trust span', { y: 15, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.8 });
    
    // Smooth Floating Animation for cards
    gsap.to('.hero-float', {
      y: -20,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: {
        amount: 1,
        from: 'random'
      }
    });

    // Reveal animations for all sections
    gsap.utils.toArray('section').forEach((section) => {
      gsap.from(section.querySelector('.section-header'), {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    gsap.from('.feature-card', {
      scrollTrigger: { trigger: '.features-grid', start: 'top 80%' },
      y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.2)'
    });

    gsap.from('.portfolio-card-wrap', {
      scrollTrigger: { trigger: '.portfolio-grid', start: 'top 80%' },
      scale: 0.9, opacity: 0, duration: 1, stagger: 0.2, ease: 'power2.out'
    });

    gsap.from('.stat-item', {
      scrollTrigger: { trigger: '.stats-row', start: 'top 85%' },
      scale: 0.5, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'elastic.out(1, 0.75)'
    });

  }, { scope: container });

  return (
    <div className="home-page" ref={container}>
      <Helmet>
        <title>Click2Website | Best Web Development Agency for Businesses</title>
        <meta name="description" content="Click2Website creates stunning, high-performance websites with 3D animations for hospitals, colleges, and LMS platforms." />
      </Helmet>
      
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-bg-wrapper">
          <div className="hero-bg" />
          <div className="bg-glow blob-1" />
          <div className="bg-glow blob-2" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🚀 Empowering 500+ Businesses Online</div>
          <h1>
            Your Vision, Our Code —{' '}
            <span className="gradient-text" style={{ display: 'inline-block', minHeight: '1.2em' }}>
              <TypeAnimation sequence={['Build Faster', 1500, 'Scale Higher', 1500, 'Grow Stronger', 1500]} wrapper="span" speed={50} repeat={Infinity} />
            </span>
            <br />
            with Click2Website
          </h1>
          <p>
            We provide premium web development services tailored for hospitals, colleges, 
            corporate businesses, LMS platforms, and personal portfolios.
          </p>
          <div className="hero-btns">
            <Link to="/contact" className="cta-primary">🚀 Get a Free Quote</Link>
            <Link to="/services" className="cta-secondary">🔗 View Our Services</Link>
          </div>
          <div className="hero-trust">
            {['🔒 High Security', '✅ SEO Optimized', '⚡ Blazing Fast'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="hero-visual perspective-container">
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} transitionSpeed={2000} gyroscope={true}>
            <div style={{ position: 'relative' }}>
              <img src={heroImg} alt="Click2Website Development" loading="eager" className="hero-main-img" />
              <div className="hero-float card1">🏥 Hospital Portal Live</div>
              <div className="hero-float card2">🎓 LMS Site Deployed</div>
              <div className="hero-float card3">📈 +40% Traffic</div>
            </div>
          </Tilt>
        </div>
      </section>

      {/* ── OUR SPECIALIZATIONS ── */}
      <section className="specializations" ref={(el) => (sections.current[1] = el)}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Our Core Pillars</span>
            <h2>Our Specialized <span className="gradient-text">Expertise</span></h2>
            <p>From architectural core to high-conversion automated marketing systems.</p>
          </div>

          <div className="spec-grid">
            <div className="spec-item">
              <div className="spec-icon">🌐</div>
              <h3>Web Development</h3>
              <p>Custom-built, scalable applications optimized for speed and maximum engagement.</p>
              <ul className="spec-list">
                <li>React & Next.js Masters</li>
                <li>Dynamic 3D UI Effects</li>
                <li>SEO-First Architecture</li>
              </ul>
            </div>
            
            <div className="spec-item highlighted">
              <div className="spec-icon">📧</div>
              <h3>Email Automations</h3>
              <p>Sophisticated marketing flows and tracking systems that convert leads into loyal clients.</p>
              <ul className="spec-list">
                <li>Smart Drip Campaigns</li>
                <li>Engagement Tracking Pixel</li>
                <li>Automated Follow-ups</li>
              </ul>
            </div>

            <div className="spec-item">
              <div className="spec-icon">📱</div>
              <h3>SMS Automations</h3>
              <p>Direct-to-customer communication systems integrated seamlessly with Twilio.</p>
              <ul className="spec-list">
                <li>Instant SMS Alerts</li>
                <li>Bulk Scheduling Systems</li>
                <li>Verification Gateways</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO (NEW) ── */}
      <section className="features-section" style={{ background: 'transparent' }} id="portfolio" ref={(el) => (sections.current[2] = el)}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">✨ Our Work</span>
            <h2>Recent Successful Projects</h2>
            <p>We take pride in building scalable, beautiful web solutions. Explore our live projects.</p>
          </div>
          <div className="features-grid portfolio-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {PORTFOLIO.map((p) => (
              <Tilt key={p.name} className="portfolio-card-wrap" tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.03} transitionSpeed={400} glareEnable={true} glareMaxOpacity={0.2} glarePosition="all">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="feature-card glass-panel" style={{ display: 'block', padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.05)' }} />
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{p.name}</h3>
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.95rem' }}>{p.desc}</p>
                    <span style={{ display: 'inline-block', marginTop: '1rem', color: '#a78bfa', fontWeight: 'bold' }}>View Live Site →</span>
                  </div>
                </a>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features" ref={(el) => (sections.current[3] = el)}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">💡 Why Click2Website?</span>
            <h2>Digital Solutions for Every Industry</h2>
            <p>We craft specialized websites tailored to exactly what your sector demands.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <Tilt key={f.title} tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05} transitionSpeed={400} glareEnable={true} glareMaxOpacity={0.1}>
                <div className={`feature-card accent-${f.color}`} style={{ height: '100%', margin: 0 }}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section" ref={(el) => (sections.current[4] = el)}>
        <div className="section-inner">
          <div className="stats-row">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item">
                <strong className="gradient-text">{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">🛠️ How It Works</span>
            <h2>Get Started in 3 Simple Steps</h2>
          </div>
          <div className="steps-row">
            {[
              { step: '01', icon: '📞', title: 'Consultation', desc: 'Reach out to us with your requirements and get a free detailed quote.' },
              { step: '02', icon: '💻', title: 'Development', desc: 'Our expert team designs and builds your custom, responsive website.' },
              { step: '03', icon: '🚀', title: 'Launch', desc: 'We deploy your site to the live server and provide ongoing support.' },
            ].map((s) => (
              <Tilt key={s.step} tiltMaxAngleX={5} tiltMaxAngleY={5} transitionSpeed={1000} scale={1.02}>
                <div className="step-card" style={{ height: '100%' }}>
                  <div className="step-number">{s.step}</div>
                  <div className="step-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="section-inner">
          <Tilt tiltReverse={true} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.01} glareEnable={true} glareMaxOpacity={0.1}>
            <div className="cta-card">
              <h2>Ready to transform your online presence?</h2>
              <p>Join hundreds of successful businesses who trust Click2Website for their digital growth.</p>
              <Link to="/contact" className="cta-primary large">
                Start Your Project Today 🚀
              </Link>
            </div>
          </Tilt>
        </div>
      </section>

      <Footer />
    </div>
  );
}
