// DeviceMotion service for total g including gravity (like GSensor)
// Normalizes noisy samples with a median filter (window 7) and a simple low-pass
// so the graph and max readings are more stable.
const G = 9.81;
const WINDOW_SIZE = 7;
const ALPHA = 0.15;

const subs = new Set();
let listening = false;
let maxG = 0;
let minG = Infinity;
let smoothG = null; // last low-pass output
const medianWindow = [];

function emit(data) {
  subs.forEach((fn) => { try { fn(data); } catch {} });
}

function computeMedian() {
  if (!medianWindow.length) return 0;
  const sorted = [...medianWindow].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted[mid];
}

function handler(event) {
  const acc = event.accelerationIncludingGravity;
  if (!acc) return;
  const gx = acc.x || 0;
  const gy = acc.y || 0;
  const gz = acc.z || 0;
  const gTotal = Math.sqrt(gx * gx + gy * gy + gz * gz) / G;

  // Median filter
  medianWindow.push(gTotal);
  if (medianWindow.length > WINDOW_SIZE) medianWindow.shift();
  const medianG = computeMedian();

  // Low-pass smoothing
  if (smoothG === null) smoothG = medianG;
  else smoothG = ALPHA * medianG + (1 - ALPHA) * smoothG;

  if (smoothG > maxG) maxG = smoothG;
  if (smoothG < minG) minG = smoothG;

  emit({
    g: smoothG, // normalized value used by widgets
    rawG: gTotal,
    medianG,
    maxG,
    minG,
    ts: Date.now(),
    acc,
  });
}

function start() {
  if (listening) return;
  window.addEventListener('devicemotion', handler);
  listening = true;
}

function stop() {
  if (!listening) return;
  window.removeEventListener('devicemotion', handler);
  listening = false;
}

export function subscribe(fn) {
  subs.add(fn);
  if (subs.size === 1) start();
  return () => {
    subs.delete(fn);
    if (subs.size === 0) stop();
  };
}

export function resetExtrema() {
  maxG = 0;
  minG = Infinity;
  smoothG = null;
  medianWindow.length = 0;
}
