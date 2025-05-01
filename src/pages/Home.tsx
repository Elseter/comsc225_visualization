import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="home-container">
      {/* Hero section with map background */}
      <section className="hero-section">
        <div className="hero-overlay" style={{ opacity: Math.min(scrollPosition / 500, 0.85) }}></div>
        <div className="map-container">
          <img
            src="/BristolRunningScreenshot.png"
            alt="Map showing data visualization of routes in Bristol"
            className="map-image"
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Data Science Insights</h1>
          <p className="hero-subtitle">Analyzing activity patterns in Bristol and beyond</p>
          <button className="hero-button" onClick={() => navigate('/fullmap')}>
            View full map
          </button>        
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Content sections */}
      <section className="content-section">
        <div className="container">
          <h2 className="section-title">Activity Analysis</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Distance</h3>
              <p className="stat-value">19.1 km</p>
              <p className="stat-description">Tracked across Bristol</p>
            </div>
            <div className="stat-card">
              <h3>Elevation Gain</h3>
              <p className="stat-value">134m</p>
              <p className="stat-description">Cumulative ascent</p>
            </div>
            <div className="stat-card">
              <h3>Activities</h3>
              <p className="stat-value">3</p>
              <p className="stat-description">Running & walking</p>
            </div>
            <div className="stat-card">
              <h3>Avg. Heart Rate</h3>
              <p className="stat-value">145 bpm</p>
              <p className="stat-description">During activities</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section graph-section">
        <div className="container">
          <h2 className="section-title">Data Visualization</h2>
          <div className="graph-container">
            <div className="graph-card">
              <h3>Route Distribution</h3>
              <div className="graph-placeholder">
                <div className="graph-loading">Interactive Graph Loading...</div>
              </div>
            </div>
            <div className="graph-card">
              <h3>Performance Metrics</h3>
              <div className="graph-placeholder">
                <div className="graph-loading">Interactive Graph Loading...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">My Methodology</h2>
          <div className="methodology-grid">
            <div className="methodology-card">
              <div className="methodology-icon">📊</div>
              <h3>Data Collection</h3>
              <p>Using Garmin Connect API to gather activity data from wearable devices</p>
            </div>
            <div className="methodology-card">
              <div className="methodology-icon">🧮</div>
              <h3>Processing</h3>
              <p>Cleaning and transforming raw GPS data into usable formats</p>
            </div>
            <div className="methodology-card">
              <div className="methodology-icon">📈</div>
              <h3>Analysis</h3>
              <p>Applying statistical methods to extract meaningful patterns</p>
            </div>
            <div className="methodology-card">
              <div className="methodology-icon">🗺️</div>
              <h3>Visualization</h3>
              <p>Creating interactive maps and charts to present findings</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section cta-section">
        <div className="container">
          <h2 className="section-title">Interested in a Deeper Analysis?</h2>
          <p className="cta-description">
            I can help you understand your own activity data or provide custom analysis for your organization.
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary">Contact Me</button>
            <button className="cta-button secondary">View Projects</button>
          </div>
        </div>
      </section>
    </div>
  );
}