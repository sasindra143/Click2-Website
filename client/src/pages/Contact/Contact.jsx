import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the message for WhatsApp
    const waText = `Hello Click2Website Team!\n\n*Name:* ${form.name}\n*Email:* ${form.email}\n*Phone:* ${form.phone}\n*Project Type:* ${form.subject}\n*Message:* ${form.message}`;
    const waUrl = `https://wa.me/919959732476?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank');
    
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact – Click2Website</title>
        <meta name="description" content="Get in touch with the Click2Website development team for your next big project." />
      </Helmet>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-tag">📞 Get In Touch</span>
          <h1>Contact <span className="gradient-text">Us</span></h1>
          <p>Ready to build your dream website? Let's talk!</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="section-inner">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <h2>Let's Start a Conversation</h2>
              <p>Whether you need a full hospital portal, an LMS platform, or a corporate site — our team is ready to build it.</p>

              <div className="contact-items">
                {[
                  { icon: '📧', label: 'Email', val: 'sasindragandla@gmail.com', href: 'mailto:sasindragandla@gmail.com' },
                  { icon: '📱', label: 'Phone', val: '+91 9959732476', href: 'tel:+919959732476' },
                  { icon: '📍', label: 'Location', val: 'India', href: null },
                ].map(item => (
                  <div key={item.label} className="contact-item">
                    <div className="contact-item-icon">{item.icon}</div>
                    <div>
                      <span className="contact-item-label">{item.label}</span>
                      {item.href
                        ? <a href={item.href}>{item.val}</a>
                        : <span>{item.val}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-hours">
                <h4>🕐 Business Hours</h4>
                <p>Monday – Friday: 9 AM – 6 PM IST</p>
                <p>Weekend developer support available for enterprise</p>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card">
              {sent ? (
                <div className="contact-success">
                  <div className="success-icon">✅</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. A project manager will contact you within 24 hours.</p>
                  <button className="cta-primary" onClick={() => setSent(false)}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3>Request a Free Quote</h3>
                  <div className="form-row">
                    <div className="field-group">
                      <label htmlFor="c-name">Name <span>*</span></label>
                      <input id="c-name" name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" />
                    </div>
                    <div className="field-group">
                      <label htmlFor="c-email">Email <span>*</span></label>
                      <input id="c-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="field-group">
                      <label htmlFor="c-phone">Phone</label>
                      <input id="c-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9XXXXXXXXX" />
                    </div>
                    <div className="field-group">
                      <label htmlFor="c-subject">Project Type <span>*</span></label>
                      <input id="c-subject" name="subject" required value={form.subject} onChange={handleChange} placeholder="e.g. E-Commerce, Hospital Portal" />
                    </div>
                  </div>
                  <div className="field-group">
                    <label htmlFor="c-message">Requirements <span>*</span></label>
                    <textarea id="c-message" name="message" rows={5} required value={form.message} onChange={handleChange} placeholder="Describe your website requirements…" />
                  </div>
                  <button type="submit" className="cta-primary" disabled={loading}>
                    {loading ? 'Sending…' : '📩 Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
