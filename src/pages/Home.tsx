import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityDataLoader from '../components/ActivityDataLoader';
import MusicSpeedChart from '../components/MusicSpeedChart';
import SpeedComparisonTrack from '../components/SpeedComparisonTrack';
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

  const spotifyStats = [
    { name: 'Total Songs Played', count: '33,654 songs', emoji: '🎵' },
    { name: 'Total Minutes Played', count: '82,249.02 minutes', emoji: '⏱️' },
    { name: 'Total Hours Played', count: '1,370.82 hours', emoji: '⏳' },
    { name: 'Total Days Played', count: '57.12 days (13.86% of total time)', emoji: '📅' },

  ]


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
          <h2 className="section-title">And then we bring Spotify in</h2>
          <div className="info-grid">
            <div className="info-text">
              <p>
                <strong>Spotify</strong> allows users to access a wealth of their personal listening data through its <a href="https://www.spotify.com/account/privacy" target="_blank" rel="noopener noreferrer">Privacy page</a>. By submitting a data request, users can download a comprehensive archive of their activity on the platform, including detailed listening history.
              </p>
              <p>
                This listening history includes granular data about each song you've played—such as the timestamp, platform (e.g., Android or desktop), duration played, country of connection, and whether the song was skipped or played offline. For example, a single record might look like this:
              </p>
              <pre>
                <code>
                  {`                  {
                    "ts": "2024-05-09T15:48:14Z",
                    "platform": "android",
                    "ms_played": 1298,
                    "conn_country": "US",
                    "ip_addr": "174.192.3.145",
                    "master_metadata_track_name": "Renegades",
                    "master_metadata_album_artist_name": "X Ambassadors",
                    "master_metadata_album_album_name": "VHS",
                    "spotify_track_uri": "spotify:track:0fYVliAYKHuPmECRs1pbRf",
                    "episode_name": null,
                    "episode_show_name": null,
                    "spotify_episode_uri": null,
                    "audiobook_title": null,
                    "audiobook_uri": null,
                    "audiobook_chapter_uri": null,
                    "audiobook_chapter_title": null,
                    "reason_start": "fwdbtn",
                    "reason_end": "fwdbtn",
                    "shuffle": true,
                    "skipped": true,
                    "offline": false,
                    "offline_timestamp": 1715269693,
                    "incognito_mode": false
                  },`}
                </code>
              </pre>
              <p>
                With this data in hand, you can explore your music habits, analyze listening trends, or even visualize how your tastes have evolved over time.
              </p>
            </div>
            <div className="info-image">
              <img src="./SpotifyRequest.png" alt="Spotify Request Image" />
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">Spotify Statistics</h2>
          <div className="methodology-grid">
            {spotifyStats.map((stat, index) => (
              <div className="methodology-card" key={index}>
                <div className="methodology-icon">{stat.emoji}</div>
                <h3 style={{ textTransform: 'capitalize', color: '#0056d2' }}>
                  {stat.name}
                </h3>
                <p>{stat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">Cleaning and Correlating with Running Activity</h2>
          <div className="info-grid">
            <div className="info-text">
              <p>
                After downloading my full listening history from Spotify, I began by cleaning and transforming the data to make it analysis-ready. Using the <code>ms_played</code> field, I was able to determine the total time I spent listing to each song.
              </p>
              <p>
                I then added a new column, <code>min_played</code>, to the dataset for easier comparison. To align this music data with my physical activity, I processed my running data from Garmin, which included timestamps for the start and duration of each run. From this, I calculated the end time for every activity by adding the elapsed duration to the start time.
              </p>
              <p>
                With both datasets time-aligned, I filtered the Spotify data to only include songs played during the time window of each run. This involved looping through every recorded activity and selecting only the tracks whose timestamps fell within that specific start and stop period.
              </p>
              <p>
                This resulted in <strong>2,104 songs</strong> played while running between December 25th, 2024 and Febuary 9th, 2025, excluding treadmill runs
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">Spotify & Garmin</h2>
          <div className="methodology-grid">
            <div className="methodology-card">
              <div className="methodology-icon">🎵</div>
              <h3 style={{ textTransform: 'capitalize', color: '#0056d2' }}>
                104 / 274 activities
              </h3>
              <p>37.9% of activites have music playing 70% of the time or more </p>
            </div>

            <div className="methodology-card">
              <div className="methodology-icon">🎵</div>
              <h3 style={{ textTransform: 'capitalize', color: '#0056d2' }}>
                170 / 274 activities
              </h3>
              <p>62.1% of activites have music playing less than 70% of the time </p>
            </div>

            <div className="methodology-card">
              <div className="methodology-icon">📊</div>
              <h3 style={{ textTransform: 'capitalize', color: '#0056d2' }}>
                Mean: 51.12%
              </h3>
              <p>On average, I spent 51.12% of each activity listing to music </p>
            </div>

            <div className="methodology-card">
              <div className="methodology-icon">📊</div>
              <h3 style={{ textTransform: 'capitalize', color: '#0056d2' }}>
                27.88 minutes
              </h3>
              <p>Average time spent listening to music during activities where music was played</p>
            </div>

            
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">How Music impacts speed</h2>
          <MusicSpeedChart />
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <h2 className="section-title">How Music impacts speed</h2>
          <SpeedComparisonTrack />
        </div>
      </section>

      <section className="content-section cta-section">
        <div className="container">
          <h2 className="section-title">Fun Running Facts</h2>
          <p className="cta-description">
            Hope your friends aren't driving by as you're running on Metacom. Apparently, you do in fact, tend to drive towards what you're looking at!
          </p>
        </div>
      </section>
    </div>
  );
}