import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useWheel } from '../context/WheelContext';
import { useSound } from '../hooks/useSound';
import { getWeightedRandom, easeOut } from '../utils/wheelUtils';
import styles from './SpinWheel.module.css';

export default function SpinWheel() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const rotationRef = useRef(0);
  const lastTickAngleRef = useRef(0);

  const {
    entries,
    isSpinning, setIsSpinning,
    setWinner,
    spinDuration,
    removeAfterSpin,
    removeEntry,
    addWinner,
    setShowWinner,
    confettiEnabled,
  } = useWheel();

  const { playTick, playWin } = useSound();
  const [localSpinning, setLocalSpinning] = useState(false);
  const [hoverSpin, setHoverSpin] = useState(false);

  const drawWheel = useCallback((rotation = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || entries.length === 0) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    const totalWeight = entries.reduce((s, e) => s + (e.weight || 1), 0);
    let startAngle = (rotation * Math.PI) / 180;

    // Draw shadow
    ctx.save();
    ctx.shadowColor = 'rgba(77,150,255,0.25)';
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fill();
    ctx.restore();

    // Draw slices
    entries.forEach((entry, i) => {
      const sliceAngle = ((entry.weight || 1) / totalWeight) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;

      // Slice fill with gradient
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0.2, entry.color + 'cc');
      grad.addColorStop(1, entry.color);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Slice border
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';

      const textRadius = radius * 0.75;
      const sliceDeg = (sliceAngle * 180) / Math.PI;
      const fontSize = Math.min(16, Math.max(9, sliceDeg * 0.38));

      ctx.font = `600 ${fontSize}px 'Syne', 'DM Sans', sans-serif`;
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;

      const label = entry.label.length > 18 ? entry.label.slice(0, 17) + '…' : entry.label;
      ctx.fillText(label, textRadius, fontSize / 3);
      ctx.restore();

      startAngle = endAngle;
    });

    // Center hub
    const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
    hubGrad.addColorStop(0, '#2a2a50');
    hubGrad.addColorStop(0.6, '#1a1a35');
    hubGrad.addColorStop(1, '#0f0f25');
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Spin icon in center
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⟳', cx, cy);
    ctx.restore();
  }, [entries]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const container = canvas.parentElement;
      const size = Math.min(container.clientWidth, container.clientHeight, 520);
      canvas.width = size;
      canvas.height = size;
      drawWheel(rotationRef.current);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, [drawWheel]);

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [entries, drawWheel]);

  const spin = useCallback(() => {
    if (isSpinning || entries.length < 2) return;

    const winnerIdx = getWeightedRandom(entries);
    const totalWeight = entries.reduce((s, e) => s + (e.weight || 1), 0);

    // Calculate precise angle to land winner at top (270° position)
    let cumulativeAngle = 0;
    for (let i = 0; i < winnerIdx; i++) {
      cumulativeAngle += ((entries[i].weight || 1) / totalWeight) * 360;
    }
    const sliceSize = ((entries[winnerIdx].weight || 1) / totalWeight) * 360;
    const sliceMid = cumulativeAngle + sliceSize / 2;
    const targetOffset = (270 - sliceMid + 360) % 360;
    const currentRot = rotationRef.current % 360;
    const diff = (targetOffset - currentRot + 360) % 360;
    const spins = 5 + Math.floor(Math.random() * 5);
    const targetRotation = rotationRef.current + spins * 360 + diff;

    setIsSpinning(true);
    setLocalSpinning(true);
    const startRot = rotationRef.current;
    const startTime = performance.now();
    lastTickAngleRef.current = startRot;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const eased = easeOut(progress);
      const currentAngle = startRot + (targetRotation - startRot) * eased;
      rotationRef.current = currentAngle;
      drawWheel(currentAngle);

      // Tick sound based on angle change
      const angleDiff = Math.abs(currentAngle - lastTickAngleRef.current);
      const ticksPerRev = Math.max(4, Math.min(entries.length, 24));
      if (angleDiff >= 360 / ticksPerRev) {
        playTick();
        lastTickAngleRef.current = currentAngle;
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = targetRotation;
        drawWheel(targetRotation);
        setIsSpinning(false);
        setLocalSpinning(false);
        setWinner(entries[winnerIdx]);
        addWinner(entries[winnerIdx]);
        setShowWinner(true);
        playWin();
        if (removeAfterSpin) {
          setTimeout(() => removeEntry(entries[winnerIdx].id), 1200);
        }
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, [isSpinning, entries, spinDuration, drawWheel, playTick, playWin, setIsSpinning, setWinner, addWinner, setShowWinner, removeAfterSpin, removeEntry]);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const canSpin = entries.length >= 2;

  return (
    <div className={styles.container}>
      {/* Arrow pointer */}
      <div className={styles.arrow}>
        <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <filter id="arrowShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)"/>
          </filter>
          <path d="M16 40 L2 8 Q16 0 30 8 Z" fill="url(#arrowGrad)" filter="url(#arrowShadow)"/>
          <defs>
            <linearGradient id="arrowGrad" x1="0" y1="0" x2="32" y2="40">
              <stop offset="0%" stopColor="#ffd93d"/>
              <stop offset="100%" stopColor="#ff9f43"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className={styles.wheelWrapper}>
        <canvas
          ref={canvasRef}
          className={`${styles.canvas} ${localSpinning ? styles.spinning : ''}`}
          onClick={canSpin ? spin : undefined}
          onMouseEnter={() => setHoverSpin(true)}
          onMouseLeave={() => setHoverSpin(false)}
          style={{ cursor: canSpin ? 'pointer' : 'not-allowed', opacity: canSpin ? 1 : 0.5 }}
          title={canSpin ? 'Click to spin!' : 'Add at least 2 entries'}
        />

        {/* Glow ring */}
        <div className={`${styles.glowRing} ${localSpinning ? styles.glowActive : ''} ${hoverSpin && !localSpinning ? styles.glowHover : ''}`} />
      </div>

      {!canSpin && (
        <div className={styles.emptyMsg}>
          <span>Add at least 2 entries to spin</span>
        </div>
      )}

      <button
        className={`${styles.spinBtn} ${localSpinning ? styles.spinning : ''} ${!canSpin ? styles.disabled : ''}`}
        onClick={canSpin && !localSpinning ? spin : undefined}
        disabled={!canSpin || localSpinning}
      >
        {localSpinning ? (
          <>
            <span className={styles.btnSpinner}></span>
            Spinning…
          </>
        ) : (
          <>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            SPIN IT!
          </>
        )}
      </button>
    </div>
  );
}
