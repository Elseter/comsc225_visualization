import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityDataLoader from '../components/ActivityDataLoader';
import './Home.css';

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const activityData = [
    { name: 'running', count: 102, emoji: '🏃‍♂️' },
    { name: 'treadmill running', count: 94, emoji: '🏃‍♂️' },
    { name: 'walking', count: 52, emoji: '🚶‍♂️' },
    { name: 'trail running', count: 15, emoji: '🥾' },
    { name: 'hiking', count: 15, emoji: '🥾' },
    { name: 'cycling', count: 6, emoji: '🚴‍♂️' },
    { name: 'skating ws', count: 1, emoji: '⛸️' },
    { name: 'rowing v2', count: 1, emoji: '🚣‍♂️' },
  ];


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
          <p className="hero-subtitle">Analyzing activity patterns with Garmin</p>
          <button className="hero-button" onClick={() => navigate('/fullmap')}>
            View full map
          </button>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">What is Garmin?</h2>
          <div className="info-grid">
            <div className="info-text">
              <p>
                <strong>Garmin</strong> is a leading manufacturer of GPS-enabled devices, widely used in fitness, outdoor activities, and health tracking. Its wearable products like smartwatches and fitness trackers collect a range of biometric and environmental data, including location, heart rate, pace, elevation, and more.
              </p>
              <p>
                When users engage in activities such as running or cycling, Garmin devices continuously record data points that are then synced to the cloud through the Garmin Connect platform. This enables detailed analysis of user performance and movement patterns over time.
              </p>
            </div>
            <div className="info-image">
              <img src="./garminDashboard.jpg" alt="Garmin watch tracking activity" />
            </div>
          </div>
        </div>
      </section>


      <section className="content-section">
        <div className="container">
          <h2 className="section-title">What Data Does Garmin Collect?</h2>
          <p>
            Garmin devices collect detailed biometric and performance data during each activity. This includes core metrics such as:
          </p>
          <ul className="data-list">
            <li><strong>Time & Location:</strong> Start time, time zone, GPS coordinates</li>
            <li><strong>Activity Details:</strong> Distance, duration, speed, elevation gain/loss</li>
            <li><strong>Health Metrics:</strong> Heart rate (avg/max), VO2 max, cadence, stride length</li>
            <li><strong>Performance Insights:</strong> Training effects, power zones, calorie burn</li>
            <li><strong>Device Info:</strong> Device ID, manufacturer, software version</li>
            <li><strong>Environmental Context:</strong> Vertical speed, elevation, temperature (in some devices)</li>
          </ul>

        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">How Can You Access Garmin Data?</h2>
          <p>
            While Garmin makes activity data easy to view within its mobile ecosystem, exporting that data for analysis requires a more technical approach.
          </p>
          <h3>Using the Garmin App</h3>
          <p>
            For everyday users, Garmin provides a mobile app that syncs with wearable devices over Bluetooth. This app offers a comprehensive dashboard to view current and past activities, including metrics like pace, distance, elevation, and heart rate. However, the app does not allow bulk data export or detailed downloads—especially not in formats suitable for custom analysis.
          </p>

          <h3>Limitations of Garmin Connect API</h3>
          <p>
            Garmin does offer an official API—<strong>Garmin Connect API</strong>—designed for third-party integrations. Unfortunately, access to this API is restricted exclusively to enterprise-level business partners. Gaining access involves a lengthy validation process and approval from Garmin’s internal review team.
          </p>

          <h3>Third-Party Workarounds</h3>
          <p>
            To work around this limitation, I used a community-developed Python package called <strong>Garth</strong>. Garth acts as a lightweight API client with a locally embedded Garmin API key. However, it does not provide out-of-the-box endpoints—you must already know the exact API URLs to make requests.
          </p>
          <p>
            To solve this, I found another open-source project called <strong>garminconnect</strong>. This package acts as a wrapper for Garth and includes many of the needed API endpoint URLs hardcoded into its source. By reviewing the open-source codebase of garminconnect, I was able to identify the specific endpoints necessary to extract my activity data.
          </p>

          <p>
            With this combination of tools—<strong>Garth</strong> and <strong>garminconnect</strong>—I was able to authenticate with Garmin's backend and retrieve detailed records of my workouts, exported in structured formats like CSV for further analysis and visualization.
          </p>
          <div className='api-image-container'>
            <img src="./garminConnectAPI.png" alt="Garmin Connect API" className="api-image" />
          </div>
        </div>
      </section>

      <section className="activity-range-section">
        <div className="container">
          <h2 className="section-title">Selected Activity Range</h2>
          <p className="section-subtitle">Visualizing activities recorded from:</p>

          <div className="date-range-card">
            <div className="date-block">
              <h3>Start Date</h3>
              <p>December 25, 2023</p>
            </div>
            <div className="range-arrow">→</div>
            <div className="date-block">
              <h3>End Date</h3>
              <p>February 9, 2025</p>
            </div>
          </div>

          <p className="date-description">
            This selection includes over a year of activity data including runs, walks, elevation changes, and heart rate metrics synced from a Garmin device.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">Activity Types</h2>
          <div className="methodology-grid">
            {activityData.map((activity, index) => (
              <div className="methodology-card" key={index}>
                <div className="methodology-icon">{activity.emoji}</div>
                <h3 style={{ textTransform: 'capitalize', color: '#0056d2' }}>
                  {activity.name}
                </h3>
                <p>{activity.count} activities</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <ActivityDataLoader />


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