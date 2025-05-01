import { useNavigate } from 'react-router-dom';
import './FullMapPage.css'; // optional custom CSS

function FullMapPage() {
  const navigate = useNavigate();

  return (
    <div className="full-map-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>
      <iframe
        src="/all_routes_map.html"
        title="All Routes Map"
        className="full-map-iframe"
      ></iframe>
    </div>
  );
}

export default FullMapPage;
