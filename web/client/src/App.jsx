import { useState } from 'react';
import confetti from 'canvas-confetti';
import './App.css';

const options = [
  { label: 'First Place', prob: 0.1, color: '#FFD700' },
  { label: 'Second Place', prob: 0.2, color: '#C0C0C0' },
  { label: 'Nothing', prob: 0.7, color: '#808080' }
];

const SPIN_DURATION = 3000;

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAligning, setIsAligning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showClapping, setShowClapping] = useState(false);
  const [showLaughing, setShowLaughing] = useState(false);

  const totalProb = options.reduce((sum, opt) => sum + opt.prob, 0);

  // ✅ PERFECTLY aligned gradient (top = 0° via from -90deg)
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

    setIsSpinning(true);
    setResult('');
    setShowClapping(false);
    setShowLaughing(false);

    // 🎯 Pick result based on probability
    let rand = Math.random() * totalProb;
    let selected = options[0];
    let cumProb = 0;

    for (let opt of options) {
      cumProb += opt.prob;
      if (rand <= cumProb) {
        selected = opt;
        break;
      }
    }

    // 🎯 Calculate angle inside selected segment
    let angle = 0;
    cumProb = 0;

    for (let opt of options) {
      if (opt === selected) {
        const segmentSize = (opt.prob / totalProb) * 360;
        const randomOffset = Math.random() * segmentSize;
        angle = (cumProb / totalProb) * 360 + randomOffset;
        break;
      }
      cumProb += opt.prob;
    }

    // normalize the wheel before the animated spin starts
    const normalized = ((rotation % 360) + 360) % 360;
    const spins = 6 + Math.random() * 4; // 6–10 full spins
    const target = 360 - angle;
    const finalRotation = normalized + spins * 360 + target;

    setIsAligning(true);
    setRotation(normalized);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAligning(false);
        setRotation(finalRotation);
      });
    });

    setTimeout(() => {
      setIsSpinning(false);
      setResult(selected.label);

      if (selected.label === 'First Place') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else if (selected.label === 'Second Place') {
        setShowClapping(true);
        setTimeout(() => setShowClapping(false), 3000);
      } else {
        setShowLaughing(true);
        setTimeout(() => setShowLaughing(false), 3000);
      }
    }, SPIN_DURATION);
  };

  const renderFlyingEmojis = (emoji, count) =>
    Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="flying-emoji"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 0.5}s`
        }}
      >
        {emoji}
      </div>
    ));

  return (
    <div className="app">
      <h1>Lap of Luck</h1>

      <div className="spinner-container">
        <div
          className="wheel"
          style={{
            background: conicGradient,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning && !isAligning
              ? `transform ${SPIN_DURATION}ms ease-out`
              : 'none'
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />

        <div className="pointer"></div>

        {showTooltip && (
          <div className="tooltip">
            <h3>Probabilities:</h3>
            <ul>
              {options.map((opt, i) => (
                <li key={i} style={{ color: opt.color }}>
                  {opt.label}:{' '}
                  {((opt.prob / totalProb) * 100).toFixed(0)}%
                </li>
              ))}
            </ul>
          </div>
        )}

        {showClapping && (
          <div className="emoji-container">
            {renderFlyingEmojis('👏', 10)}
          </div>
        )}

        {showLaughing && (
          <div className="emoji-container">
            {renderFlyingEmojis('😂', 10)}
          </div>
        )}
      </div>

      <div className="result">Result: {result}</div>

      <button onClick={spin} disabled={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
}