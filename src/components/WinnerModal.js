import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWheel } from '../context/WheelContext';
import styles from './WinnerModal.module.css';

export default function WinnerModal() {
  const { winner, showWinner, setShowWinner, confettiEnabled } = useWheel();

  useEffect(() => {
    if (showWinner) {
      const timer = setTimeout(() => setShowWinner(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showWinner, setShowWinner]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setShowWinner(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setShowWinner]);

  if (!showWinner || !winner) return null;

  return (
    <div className={styles.overlay} onClick={() => setShowWinner(false)}>
      {confettiEnabled && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          gravity={0.3}
          recycle={false}
          colors={['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9f43','#00d2d3']}
        />
      )}

      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.crown}>🎉</div>

        <div className={styles.winnerChip} style={{ background: winner.color }}>
          <span className={styles.winnerLabel}>{winner.label}</span>
        </div>

        <h2 className={styles.title}>We have a winner!</h2>
        <p className={styles.subtitle}>Click anywhere or press <kbd>Esc</kbd> to close</p>

        <button className={styles.closeBtn} onClick={() => setShowWinner(false)}>
          Spin Again →
        </button>
      </div>
    </div>
  );
}
