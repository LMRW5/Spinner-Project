import { useState, useRef } from 'react';
import './App.css';

const options = [
  { label: 'First Place', prob: 0.2, color: '#FFD700', emoji: '🏆', prize: '2 Tickets!' },
  { label: 'Podium Finish', prob: 0.1, color: '#C0C0C0', emoji: '🥈', prize: '1 Ticket!' },
  { label: 'Finish Line', prob: 0.7, color: '#2c3e50', emoji: '🏁', prize: 'Keep Racing!' }
];

const SPIN_DURATION = 3000;

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showRacingEffect, setShowRacingEffect] = useState(false);
  
  const currentRotationRef = useRef(0);
  const spinTimeoutRef = useRef(null);

  const totalProb = options.reduce((sum, opt) => sum + opt.prob, 0);

  const conicGradient = (() => {
    let cum = 0;
    return `conic-gradient(from -90deg, ${options
      .map(opt => {
        const start = (cum / totalProb) * 360;
        cum += opt.prob;
        const end = (cum / totalProb) * 360;
        return `${opt.color} ${start}deg ${end}deg`;
      })
      .join(', ')})`;
  })();

  const spin = () => {
    if (isSpinning) return;

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    setIsSpinning(true);
    setShowRacingEffect(true);

    const fullSpins = 5 + Math.random() * 8;
    const randomExtra = Math.random() * 360;
    const newRotation = currentRotationRef.current + (fullSpins * 360) + randomExtra;
    
    setRotation(newRotation);
    currentRotationRef.current = newRotation;

    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
      setShowRacingEffect(false);
      spinTimeoutRef.current = null;
    }, SPIN_DURATION);
  };

  return (
    <div className="app">
      {/* Racing Effect Overlay */}
      {showRacingEffect && (
        <div className="racing-effect">
          <div className="speed-lines">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="speed-line" style={{
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.3}s`,
                animationDuration: `${0.3 + Math.random() * 0.4}s`,
                width: `${50 + Math.random() * 150}px`
              }}></div>
            ))}
          </div>
          
          {/* Car with exhaust trailing behind */}
          <div className="car-container">
            <div className="car-exhaust">
              <div className="exhaust-fume">💨</div>
              <div className="exhaust-fume">💨</div>
              <div className="exhaust-fume">💨</div>
              <div className="exhaust-fume">💨</div>
              <div className="exhaust-fume">💨</div>
            </div>
            <div className="zooming-car">🏎️</div>
          </div>
          
          {/* Background exhaust fumes */}
          <div className="exhaust-fumes-bg">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="fume-bg" style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}>💨</div>
            ))}
          </div>
          
          <div className="wind-effect"></div>
          <div className="engine-vibration"></div>
        </div>
      )}

      <div className="f1-header">
        <div className="f1-logo">🏎️</div>
        <h1>Lap of Luck Final Stage</h1>
        <div className="f1-logo">🏁</div>
      </div>

      <div className="main-content">
        <div className="spinner-container">
          <div
            className={`wheel ${isSpinning ? 'spinning' : ''}`}
            style={{
              background: conicGradient,
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? `transform ${SPIN_DURATION}ms cubic-bezier(0.25, 0.1, 0.15, 1)`
                : 'none'
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          
          <div className="wheel-center"></div>
          
          <div className="arrow-pointer"></div>

          {showTooltip && (
            <div className="tooltip">
              <h3>🏎️ Race Probabilities 🏁</h3>
              <ul>
                {options.map((opt, i) => (
                  <li key={i} style={{ color: opt.color }}>
                    {opt.label}: {((opt.prob / totalProb) * 100).toFixed(0)}%
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="legend">
          <h3>🏆 Race Results 🏆</h3>
          {options.map((opt, i) => (
            <div key={i} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: opt.color }}
              ></div>
              <div className="legend-info">
                <div className="legend-label">
                  <span className="legend-emoji">{opt.emoji}</span>
                  {opt.label}
                </div>
                <div className="legend-prize">{opt.prize}</div>
                <div className="legend-probability">
                  {((opt.prob / totalProb) * 100).toFixed(0)}% chance
                </div>
              </div>
            </div>
          ))}
          <div className="legend-note">
            <div className="arrow-mini"></div>
            <span>Arrow shows your result!</span>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button onClick={spin} disabled={isSpinning} className="f1-button">
          <span className="button-icon">🏎️</span>
          {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
          <span className="button-icon">🏁</span>
        </button>
      </div>
    </div>
  );
}