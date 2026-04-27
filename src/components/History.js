import React from 'react';
import { useWheel } from '../context/WheelContext';
import { formatTime } from '../utils/wheelUtils';
import styles from './History.module.css';

export default function History() {
  const { history, clearHistory, spinCount } = useWheel();

  // Tally counts
  const tally = history.reduce((acc, h) => {
    acc[h.label] = (acc[h.label] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{spinCount}</span>
          <span className={styles.statLabel}>Total Spins</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{Object.keys(tally).length}</span>
          <span className={styles.statLabel}>Unique Winners</span>
        </div>
      </div>

      {sorted.length > 0 && (
        <div className={styles.tallySection}>
          <p className={styles.sectionTitle}>Winner Tally</p>
          {sorted.map(([label, count]) => {
            const entry = history.find(h => h.label === label);
            const pct = Math.round((count / spinCount) * 100);
            return (
              <div key={label} className={styles.tallyRow}>
                <div className={styles.tallyDot} style={{ background: entry?.color || '#666' }} />
                <span className={styles.tallyLabel}>{label}</span>
                <div className={styles.tallyBar}>
                  <div className={styles.tallyFill} style={{ width: `${pct}%`, background: entry?.color || '#666' }} />
                </div>
                <span className={styles.tallyCount}>{count}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.historySection}>
        <div className={styles.historyHeader}>
          <p className={styles.sectionTitle}>Recent Results</p>
          {history.length > 0 && (
            <button className={styles.clearBtn} onClick={clearHistory}>Clear</button>
          )}
        </div>

        {history.length === 0 ? (
          <div className={styles.empty}>
            <span>🎯</span>
            <p>Spin the wheel to see results here</p>
          </div>
        ) : (
          <div className={styles.list}>
            {history.map((item, i) => (
              <div key={`${item.spin}-${i}`} className={styles.historyItem}>
                <div className={styles.itemBadge} style={{ background: item.color }}>
                  #{item.spin}
                </div>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={styles.itemTime}>{formatTime(item.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
