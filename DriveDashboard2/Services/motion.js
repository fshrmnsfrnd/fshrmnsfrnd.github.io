// DeviceMotion service for total g including gravity (like GSensor)
const G = 9.81;
const subs = new Set();
let listening = false;
let maxG = 0;
let minG = Infinity;

function emit(data) {
  subs.forEach((fn) => { try { fn(data); } catch {} });
}

function handler(event) {
  const acc = event.accelerationIncludingGravity;
  if (!acc) return;
  const gx = acc.x || 0;
  const gy = acc.y || 0;
  const gz = acc.z || 0;
  const gTotal = Math.sqrt(gx * gx + gy * gy + gz * gz) / G;
  if (gTotal > maxG) maxG = gTotal;
  if (gTotal < minG) minG = gTotal;
  emit({ g: gTotal, maxG, minG, ts: Date.now(), acc });
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
  maxG = 0; minG = Infinity;
}
