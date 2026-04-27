// Calculate weighted random winner index
export function getWeightedRandom(entries) {
  const totalWeight = entries.reduce((sum, e) => sum + (e.weight || 1), 0);
  let rand = Math.random() * totalWeight;
  for (let i = 0; i < entries.length; i++) {
    rand -= (entries[i].weight || 1);
    if (rand <= 0) return i;
  }
  return entries.length - 1;
}

// Calculate rotation angle to land on winner
export function getTargetRotation(currentRotation, winnerIndex, totalEntries, entries) {
  const totalWeight = entries.reduce((sum, e) => sum + (e.weight || 1), 0);
  let anglePerSlice = 360 / totalEntries;
  
  // Calculate the cumulative angle to winner slice
  let cumulativeAngle = 0;
  for (let i = 0; i < winnerIndex; i++) {
    cumulativeAngle += ((entries[i].weight || 1) / totalWeight) * 360;
  }
  const sliceSize = ((entries[winnerIndex].weight || 1) / totalWeight) * 360;
  const sliceMid = cumulativeAngle + sliceSize / 2;

  // We want sliceMid to be at the top (pointing to arrow at 0 deg offset)
  // Arrow points at 270 degrees in standard canvas coords (top)
  const targetOffset = 270 - sliceMid;
  const spins = 5 + Math.floor(Math.random() * 5); // 5-10 full spins
  const target = currentRotation + spins * 360 + ((targetOffset - currentRotation) % 360 + 360) % 360;
  return target;
}

// Easing function for smooth deceleration
export function easeOut(t) {
  return 1 - Math.pow(1 - t, 4);
}

// Generate a lighter variant of a color for gradient
export function lightenColor(hex, amount = 30) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Format date for history
export function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(date);
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    return false;
  }
}

// Local storage helpers
export const storage = {
  save: (key, data) => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {}
  },
  load: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (_) { return fallback; }
  },
  remove: (key) => {
    try { localStorage.removeItem(key); } catch (_) {}
  }
};
