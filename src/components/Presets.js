import React from 'react';
import { useWheel } from '../context/WheelContext';
import styles from './Presets.module.css';

const PRESET_LIST = [
  { id: 'yesno', label: 'Yes / No', emoji: '🎲', desc: 'Quick decision maker' },
  { id: 'days', label: 'Days of Week', emoji: '📅', desc: 'Pick a weekday' },
  { id: 'numbers', label: '1–8 Numbers', emoji: '🔢', desc: 'Random number picker' },
  { id: 'food', label: 'What to Eat', emoji: '🍕', desc: 'Pick your meal' },
  { id: 'luck', label: 'Luck Wheel', emoji: '🍀', desc: 'Try your luck' },
];

export default function Presets() {
  const { loadPreset } = useWheel();

  return (
    <div className={styles.container}>
      <p className={styles.hint}>Load a preset to get started quickly:</p>
      <div className={styles.grid}>
        {PRESET_LIST.map(preset => (
          <button
            key={preset.id}
            className={styles.presetCard}
            onClick={() => loadPreset(preset.id)}
          >
            <span className={styles.emoji}>{preset.emoji}</span>
            <span className={styles.label}>{preset.label}</span>
            <span className={styles.desc}>{preset.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
