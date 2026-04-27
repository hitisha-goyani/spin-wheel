import React, { useState } from 'react';
import { useWheel } from '../context/WheelContext';
import styles from './Header.module.css';

export default function Header() {
  const { wheelTitle, setWheelTitle, soundEnabled, setSoundEnabled } = useWheel();
  const [editing, setEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(wheelTitle);

  const handleSave = () => {
    setWheelTitle(tempTitle || 'My Wheel');
    setEditing(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="url(#grad)" strokeWidth="2.5"/>
            <path d="M20 2 L20 20 L34 28" stroke="#4d96ff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 20 L6 28" stroke="#c77dff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 20 L20 38" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="20" r="4" fill="url(#grad2)"/>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#4d96ff"/>
                <stop offset="100%" stopColor="#c77dff"/>
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#ff6b6b"/>
                <stop offset="100%" stopColor="#ffd93d"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className={styles.brand}>
          <span className={styles.brandName}>Whirlo</span>
          <span className={styles.brandTagline}>Spin to Decide</span>
        </div>
      </div>

      <div className={styles.titleArea}>
        {editing ? (
          <div className={styles.titleEdit}>
            <input
              className={styles.titleInput}
              value={tempTitle}
              onChange={e => setTempTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
              maxLength={40}
            />
            <button className={styles.saveBtn} onClick={handleSave}>✓</button>
            <button className={styles.cancelBtn} onClick={() => setEditing(false)}>✕</button>
          </div>
        ) : (
          <button className={styles.titleBtn} onClick={() => { setTempTitle(wheelTitle); setEditing(true); }}>
            <span>{wheelTitle}</span>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.iconBtn} ${soundEnabled ? styles.active : ''}`}
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
