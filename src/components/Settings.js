import React from 'react';
import { useWheel } from '../context/WheelContext';
import styles from './Settings.module.css';

function Toggle({ value, onChange, label, desc }) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleInfo}>
        <span className={styles.toggleLabel}>{label}</span>
        {desc && <span className={styles.toggleDesc}>{desc}</span>}
      </div>
      <button
        className={`${styles.toggle} ${value ? styles.on : ''}`}
        onClick={() => onChange(!value)}
        aria-label={label}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  );
}

export default function Settings() {
  const {
    soundEnabled, setSoundEnabled,
    confettiEnabled, setConfettiEnabled,
    spinDuration, setSpinDuration,
    removeAfterSpin, setRemoveAfterSpin,
  } = useWheel();

  const durations = [
    { label: 'Quick', value: 2000 },
    { label: 'Normal', value: 4000 },
    { label: 'Slow', value: 6000 },
    { label: 'Extra Slow', value: 9000 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Experience</p>

        <Toggle
          value={soundEnabled}
          onChange={setSoundEnabled}
          label="Sound Effects"
          desc="Tick sounds while spinning + win fanfare"
        />

        <Toggle
          value={confettiEnabled}
          onChange={setConfettiEnabled}
          label="Confetti"
          desc="Celebrate with confetti on winner"
        />

        <Toggle
          value={removeAfterSpin}
          onChange={setRemoveAfterSpin}
          label="Remove After Spin"
          desc="Remove winning entry after each spin"
        />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Spin Speed</p>
        <div className={styles.durationGrid}>
          {durations.map(d => (
            <button
              key={d.value}
              className={`${styles.durationBtn} ${spinDuration === d.value ? styles.active : ''}`}
              onClick={() => setSpinDuration(d.value)}
            >
              <span className={styles.durationLabel}>{d.label}</span>
              <span className={styles.durationSec}>{d.value / 1000}s</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Tips</p>
        <ul className={styles.tips}>
          <li>Click the wheel or the SPIN button to spin</li>
          <li>Click any entry label to rename it inline</li>
          <li>Use weights (1–10) to change win probability</li>
          <li>Import entries from plain text, one per line</li>
          <li>Enable "Remove After Spin" for elimination mode</li>
          <li>Press <kbd>Esc</kbd> to dismiss the winner popup</li>
        </ul>
      </div>
    </div>
  );
}
