import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Testimonials.css';

const REVIEWS = [
  { name: 'Dr. Ramesh', title: 'Hospital Director', location: 'Delhi', text: 'Click2Website built our complete hospital portal in just 4 weeks. Online appointments and patient records are running flawlessly!', stars: 5 },
  { name: 'Prof. Priya', title: 'College Dean', location: 'Bangalore', text: 'Our new college website has automated student admissions completely. The technical team at Click2Website is brilliant.', stars: 5 },
  { name: 'Arjun', title: 'Startup Founder', location: 'Hyderabad', text: 'The LMS they built for us scales to thousands of students without a hitch. Best development agency in India.', stars: 5 },
  { name: 'Sanjay', title: 'Retail Business Owner', location: 'Mumbai', text: 'Our E-commerce sales skyrocketed 300% after they redesigned our store. Worth every penny!', stars: 5 },
  { name: 'Lakshmi', title: 'Marketing Manager', location: 'Chennai', text: 'Highly responsive, beautiful UI, and zero bugs. The Click2Website team delivered exactly what they promised.', stars: 5 },
  { name: 'Vikram', title: 'Tech Agency', location: 'Pune', text: 'We outsourced some heavy backend modules to them. Incredibly fast turnaround and solid architecture.', stars: 5 },
];

export default function Testimonials() {
  return (
    <>
      <Helmet>
        <title>Testimonials – Click2Website</title>
        <meta name="description" content="See what hospitals, colleges, and enterprise businesses say about Click2Website development services." />
      </Helmet>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-tag">⭐ Client Success</span>
          <h1>What Our <span className="gradient-text">Clients Say</span></h1>
          <p>Trusted by 500+ businesses worldwide to build fast, secure, and modern websites.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="testi-stats">
        <div className="section-inner">
          <div className="testi-stats-row">
            {[['500+', 'Projects Delivered'], ['99%', 'Client Satisfaction'], ['4.9/5', 'Average Rating'], ['100%', 'On-Time Delivery']].map(([v, l]) => (
              <div key={l} className="testi-stat">
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testi-section">
        <div className="section-inner">
          <div className="testi-grid">
            {REVIEWS.map((r) => (
              <div key={r.name} className="testi-card">
                <div className="stars">{'⭐'.repeat(r.stars)}</div>
                <p>"{r.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{r.name[0]}</div>
                  <div>
                    <strong>{r.name}</strong>
                    <span>{r.title} · {r.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="testi-cta-section">
        <div className="section-inner">
          <div className="testi-cta">
            <h2>Ready to Start Your Digital Transformation?</h2>
            <a href="/contact" className="cta-primary">Get a Free Quote 🚀</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
