import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const WheelContext = createContext(null);

const DEFAULT_COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#c77dff', '#ff9f43', '#00d2d3', '#ff6b9d',
  '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd',
];

const DEFAULT_ENTRIES = [
  { id: uuidv4(), label: 'Option 1', color: DEFAULT_COLORS[0], weight: 1 },
  { id: uuidv4(), label: 'Option 2', color: DEFAULT_COLORS[1], weight: 1 },
  { id: uuidv4(), label: 'Option 3', color: DEFAULT_COLORS[2], weight: 1 },
  { id: uuidv4(), label: 'Option 4', color: DEFAULT_COLORS[3], weight: 1 },
  { id: uuidv4(), label: 'Option 5', color: DEFAULT_COLORS[4], weight: 1 },
  { id: uuidv4(), label: 'Option 6', color: DEFAULT_COLORS[5], weight: 1 },
];

const PRESETS = {
  yesno: [
    { id: uuidv4(), label: 'YES', color: '#6bcb77', weight: 1 },
    { id: uuidv4(), label: 'NO', color: '#ff6b6b', weight: 1 },
    { id: uuidv4(), label: 'MAYBE', color: '#ffd93d', weight: 1 },
  ],
  days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d,i) => ({
    id: uuidv4(), label: d, color: DEFAULT_COLORS[i % DEFAULT_COLORS.length], weight: 1
  })),
  numbers: Array.from({length:8},(_,i)=>({
    id: uuidv4(), label: String(i+1), color: DEFAULT_COLORS[i % DEFAULT_COLORS.length], weight: 1
  })),
  food: ['Pizza','Sushi','Tacos','Burger','Pasta','Salad','Ramen','BBQ'].map((f,i)=>({
    id: uuidv4(), label: f, color: DEFAULT_COLORS[i % DEFAULT_COLORS.length], weight: 1
  })),
  luck: ['Lucky!','Try Again','Jackpot!','Better Luck','Winner!','Almost!','Boom!','Nope'].map((l,i)=>({
    id: uuidv4(), label: l, color: DEFAULT_COLORS[i % DEFAULT_COLORS.length], weight: 1
  })),
};

export function WheelProvider({ children }) {
  const [entries, setEntries] = useState(DEFAULT_ENTRIES);
  const [history, setHistory] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [wheelTitle, setWheelTitle] = useState('My Wheel');
  const [spinCount, setSpinCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [confettiEnabled, setConfettiEnabled] = useState(true);
  const [spinDuration, setSpinDuration] = useState(4000);
  const [removeAfterSpin, setRemoveAfterSpin] = useState(false);
  const [activeTab, setActiveTab] = useState('entries');
  const [showWinner, setShowWinner] = useState(false);

  const addEntry = useCallback((label = '') => {
    const idx = entries.length % DEFAULT_COLORS.length;
    setEntries(prev => [...prev, {
      id: uuidv4(),
      label: label || `Option ${prev.length + 1}`,
      color: DEFAULT_COLORS[idx],
      weight: 1,
    }]);
  }, [entries.length]);

  const removeEntry = useCallback((id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateEntry = useCallback((id, field, value) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  }, []);

  const addWinner = useCallback((entry) => {
    setHistory(prev => [{
      ...entry,
      timestamp: new Date(),
      spin: spinCount + 1,
    }, ...prev].slice(0, 50));
    setSpinCount(s => s + 1);
  }, [spinCount]);

  const clearHistory = useCallback(() => setHistory([]), []);

  const loadPreset = useCallback((preset) => {
    if (PRESETS[preset]) {
      setEntries(PRESETS[preset].map(e => ({ ...e, id: uuidv4() })));
    }
  }, []);

  const shuffleEntries = useCallback(() => {
    setEntries(prev => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  const importText = useCallback((text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const newEntries = lines.map((label, i) => ({
      id: uuidv4(),
      label,
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      weight: 1,
    }));
    setEntries(newEntries);
  }, []);

  const duplicateEntry = useCallback((id) => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], id: uuidv4() };
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
    });
  }, []);

  const updateColor = useCallback((id, color) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, color } : e));
  }, []);

  return (
    <WheelContext.Provider value={{
      entries, setEntries,
      history, addWinner, clearHistory,
      isSpinning, setIsSpinning,
      winner, setWinner,
      wheelTitle, setWheelTitle,
      spinCount, setSpinCount,
      soundEnabled, setSoundEnabled,
      confettiEnabled, setConfettiEnabled,
      spinDuration, setSpinDuration,
      removeAfterSpin, setRemoveAfterSpin,
      activeTab, setActiveTab,
      showWinner, setShowWinner,
      addEntry, removeEntry, updateEntry,
      loadPreset, shuffleEntries, clearAll,
      importText, duplicateEntry, updateColor,
      DEFAULT_COLORS, PRESETS,
    }}>
      {children}
    </WheelContext.Provider>
  );
}

export function useWheel() {
  const ctx = useContext(WheelContext);
  if (!ctx) throw new Error('useWheel must be used within WheelProvider');
  return ctx;
}
