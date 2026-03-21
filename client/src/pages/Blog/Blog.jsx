import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Blog.css';

const POSTS = [
  {
    id: 1,
    emoji: '🏥',
    title: 'Why Every Modern Hospital Needs a Patient Portal',
    desc: 'How secure online portals reduce administrative load and improve patient satisfaction scores.',
    readTime: '5 min read',
    date: 'Jan 15, 2026',
    views: '2.3k views',
    tag: 'Healthcare',
  },
  {
    id: 2,
    emoji: '🏫',
    title: 'Digital Transformation in Colleges and Universities',
    desc: 'Automating student admissions, fee collections, and notices through custom college portals.',
    readTime: '7 min read',
    date: 'Feb 2, 2026',
    views: '1.8k views',
    tag: 'Education',
  },
  {
    id: 3,
    emoji: '💼',
    title: 'Top 5 Web Design Trends for Corporate Businesses',
    desc: 'What to look for when redesigning your business website for maximum lead generation in 2026.',
    readTime: '4 min read',
    date: 'Mar 10, 2026',
    views: '3.1k views',
    tag: 'Business',
  },
  {
    id: 4,
    emoji: '🎓',
    title: 'How to Build an LMS That scales to 1M+ Students',
    desc: 'A technical deep-dive into creating high-performance Learning Management Systems.',
    readTime: '6 min read',
    date: 'Mar 18, 2026',
    views: '892 views',
    tag: 'Tech',
  },
];

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog – Click2Website</title>
        <meta name="description" content="Stay updated with the latest in web development, healthcare IT, and EdTech solutions." />
      </Helmet>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-inner">
          <span className="section-tag">📝 Knowledge Hub</span>
          <h1>Latest <span className="gradient-text">Articles</span></h1>
          <p>Stay updated with our newest case studies, development strategies, and industry insights.</p>
        </div>
      </section>

      <section className="blog-section">
        <div className="section-inner">
          <div className="blog-grid">
            {POSTS.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-tag">{post.tag}</div>
                <div className="blog-icon">{post.emoji}</div>
                <h3>{post.title}</h3>
                <p>{post.desc}</p>
                <div className="blog-meta">
                  <span>📅 {post.date}</span>
                  <span>⏱ {post.readTime}</span>
                  <span>👁 {post.views}</span>
                </div>
                <button className="blog-read-btn">Read Article →</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
