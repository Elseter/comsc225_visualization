import { useEffect, useRef } from 'react';
import './SpeedComparisonTrack.css';

export default function SpeedComparisonTrack() {
  const dot1 = useRef<HTMLDivElement | null>(null);
  const dot2 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let angle1 = 0;
    let angle2 = 0;
  
    const widthRadius = 150; // half of track width
    const heightRadius = 75; // half of track height
    const centerX = 150; // center of the oval (width / 2)
    const centerY = 75;  // center of the oval (height / 2)
  
    const speed1 = 0.02;
    const speed2 = 0.0152;
  
    const animate = () => {
      angle1 += speed1;
      angle2 += speed2;
  
      if (dot1.current) {
        dot1.current.style.left = `${centerX + widthRadius * Math.cos(angle1)}px`;
        dot1.current.style.top = `${centerY + heightRadius * Math.sin(angle1)}px`;
      }
  
      if (dot2.current) {
        dot2.current.style.left = `${centerX + widthRadius * Math.cos(angle2)}px`;
        dot2.current.style.top = `${centerY + heightRadius * Math.sin(angle2)}px`;
      }
  
      requestAnimationFrame(animate);
    };
  
    animate();
  }, []);
  

  return (
    <div className="track-section">
      <h2>Speed Comparison</h2>
      <p>Watch how the dot with music moves faster (8.33 mph) than without (6.32 mph)</p>
      <div className="track-container">
        <div className="dot dot1" ref={dot1}></div>
        <div className="dot dot2" ref={dot2}></div>
      </div>
      <div className="labels">
        <span className="label1">🎵 8.33 mph</span>
        <span className="label2">🧘 6.32 mph</span>
      </div>
    </div>
  );
}
