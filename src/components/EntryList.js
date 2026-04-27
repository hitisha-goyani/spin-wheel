import React, { useState, useRef } from 'react';
import { useWheel } from '../context/WheelContext';
import styles from './EntryList.module.css';

const COLORS = [
  '#ff6b6b','#ffd93d','#6bcb77','#4d96ff',
  '#c77dff','#ff9f43','#00d2d3','#ff6b9d',
  '#48dbfb','#ff9ff3','#54a0ff','#ff6348',
];

function EntryItem({ entry, onRemove, onUpdate, onDuplicate }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(entry.label);
  const inputRef = useRef(null);

  const saveLabel = () => {
    if (tempLabel.trim()) onUpdate(entry.id, 'label', tempLabel.trim());
    setEditing(false);
  };

  return (
    <div className={styles.entry}>
      {/* Color dot */}
      <div className={styles.colorArea}>
        <button
          className={styles.colorDot}
          style={{ background: entry.color }}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Change color"
        />
        {showColorPicker && (
          <div className={styles.colorPicker}>
            <div className={styles.colorGrid}>
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`${styles.colorSwatch} ${entry.color === c ? styles.selected : ''}`}
                  style={{ background: c }}
                  onClick={() => { onUpdate(entry.id, 'color', c); setShowColorPicker(false); }}
                />
              ))}
            </div>
            <input
              type="color"
              value={entry.color}
              onChange={e => onUpdate(entry.id, 'color', e.target.value)}
              className={styles.customColor}
              title="Custom color"
            />
          </div>
        )}
      </div>

      {/* Label */}
      <div className={styles.labelArea}>
        {editing ? (
          <input
            ref={inputRef}
            className={styles.labelInput}
            value={tempLabel}
            onChange={e => setTempLabel(e.target.value)}
            onBlur={saveLabel}
            onKeyDown={e => { if (e.key === 'Enter') saveLabel(); if (e.key === 'Escape') setEditing(false); }}
            autoFocus
            maxLength={50}
          />
        ) : (
          <span
            className={styles.label}
            onClick={() => { setTempLabel(entry.label); setEditing(true); }}
            title="Click to edit"
          >
            {entry.label}
          </span>
        )}
      </div>

      {/* Weight */}
      <div className={styles.weightArea}>
        <button
          className={styles.weightBtn}
          onClick={() => onUpdate(entry.id, 'weight', Math.max(1, (entry.weight || 1) - 1))}
          disabled={(entry.weight || 1) <= 1}
        >−</button>
        <span className={styles.weight}>{entry.weight || 1}</span>
        <button
          className={styles.weightBtn}
          onClick={() => onUpdate(entry.id, 'weight', Math.min(10, (entry.weight || 1) + 1))}
          disabled={(entry.weight || 1) >= 10}
        >+</button>
      </div>

      {/* Actions */}
      <div className={styles.entryActions}>
        <button className={styles.actionBtn} onClick={() => onDuplicate(entry.id)} title="Duplicate">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => onRemove(entry.id)} title="Remove">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2"/>
            <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function EntryList() {
  const {
    entries, addEntry, removeEntry, updateEntry, duplicateEntry,
    shuffleEntries, clearAll, importText,
  } = useWheel();

  const [newLabel, setNewLabel] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importText2, setImportText2] = useState('');

  const handleAdd = () => {
    if (newLabel.trim()) {
      addEntry(newLabel.trim());
      setNewLabel('');
    } else {
      addEntry();
    }
  };

  const handleImport = () => {
    importText(importText2);
    setShowImport(false);
    setImportText2('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <span className={styles.count}>{entries.length} entries</span>
        <div className={styles.toolbarActions}>
          <button className={styles.toolBtn} onClick={shuffleEntries} title="Shuffle">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <polyline points="16 3 21 3 21 8" stroke="currentColor" strokeWidth="2"/>
              <line x1="4" y1="20" x2="21" y2="3" stroke="currentColor" strokeWidth="2"/>
              <polyline points="21 16 21 21 16 21" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="15" x2="21" y2="21" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Shuffle
          </button>
          <button className={styles.toolBtn} onClick={() => setShowImport(!showImport)} title="Import">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2"/>
              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Import
          </button>
          <button className={`${styles.toolBtn} ${styles.danger}`} onClick={clearAll} title="Clear all">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2"/>
              <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Clear
          </button>
        </div>
      </div>

      {showImport && (
        <div className={styles.importBox}>
          <p className={styles.importHint}>One entry per line:</p>
          <textarea
            className={styles.importTextarea}
            value={importText2}
            onChange={e => setImportText2(e.target.value)}
            placeholder={"Monday\nTuesday\nWednesday\n..."}
            rows={6}
          />
          <div className={styles.importActions}>
            <button className={styles.importBtn} onClick={handleImport}>Import</button>
            <button className={styles.cancelImport} onClick={() => setShowImport(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          placeholder="Type an entry..."
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          maxLength={50}
        />
        <button className={styles.addBtn} onClick={handleAdd}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Add
        </button>
      </div>

      <div className={styles.list}>
        {entries.length === 0 ? (
          <div className={styles.empty}>
            <span>🎯</span>
            <p>No entries yet. Add some above!</p>
          </div>
        ) : (
          entries.map(entry => (
            <EntryItem
              key={entry.id}
              entry={entry}
              onRemove={removeEntry}
              onUpdate={updateEntry}
              onDuplicate={duplicateEntry}
            />
          ))
        )}
      </div>

      {entries.length > 0 && (
        <div className={styles.weightNote}>
          💡 Adjust weights (1–10) to change win probability
        </div>
      )}
    </div>
  );
}
