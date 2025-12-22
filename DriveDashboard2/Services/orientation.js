// DeviceOrientation service providing lean angle depending on screen orientation
const subs = new Set();
let listening = false;
let mode = null; // 'landscape' | 'portrait'

function updateMode() {
  try {
    const t = screen.orientation?.type || '';
    if (t.startsWith('landscape')) mode = 'landscape';
    else if (t.startsWith('portrait')) mode = 'portrait';
  } catch {}
}
updateMode();
window.addEventListener('orientationchange', updateMode);

function emit(data) {
  subs.forEach((fn) => { try { fn(data); } catch {} });
}

function handler(ev) {
  // Choose axis similar to existing Neigungsmesser logic
  let angle = 0;
  if (mode === 'landscape') angle = ev.beta ?? 0;
  else if (mode === 'portrait') angle = ev.gamma ?? 0;
  else angle = (ev.beta ?? 0); // fallback
  emit({ angle, ts: Date.now(), mode });
}

function start() {
  if (listening) return;
  window.addEventListener('deviceorientation', handler);
  listening = true;
}

function stop() {
  if (!listening) return;
  window.removeEventListener('deviceorientation', handler);
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
