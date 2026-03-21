import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Welcome.css';

const Welcome = () => {
  const { user } = useAuth();

  return (
    <div className="welcome-page">
      <Navbar />
      
      <main className="welcome-main">
        <div className="welcome-card glass-panel">
          <div className="welcome-icon">🎉</div>
          <h1>Hi Welcome, <span>{user?.name?.split(' ')[0] || 'Friend'}</span>!</h1>
          
          <div className="welcome-message">
            <p>You have successfully logged in to our platform.</p>
            <p className="highlight-text">
              You are very close to getting your requirement website!
            </p>
            <p className="sub-text">
              Our expert web development team has received your registration. We will review your profile and get in touch with you shortly to bring your dream project to life.
            </p>
          </div>

          <div className="welcome-actions">
            <Link to="/" className="cta-primary">Back to Home</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Welcome;
