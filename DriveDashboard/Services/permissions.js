export async function ensureMotionPermission() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const res = await DeviceMotionEvent.requestPermission();
      return res === 'granted';
    } catch {
      return false;
    }
  }
  return true; // no permission gate on this platform
}

export async function ensureOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      return res === 'granted';
    } catch {
      return false;
    }
  }
  return true;
}

// One-time permission modal management per sensor type
const state = {
  motion: { asked: false, pending: null, granted: null },
  orientation: { asked: false, pending: null, granted: null },
  geo: { asked: false, pending: null, granted: null },
};

function showPermissionModal({ title, message, onAllow }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'app-modal-overlay';
    const box = document.createElement('div');
    box.className = 'app-modal-content';
    const h = document.createElement('h3');
    h.textContent = title;
    const p = document.createElement('p');
    p.textContent = message;
    const actions = document.createElement('div');
    actions.className = 'app-modal-actions';
    const allowBtn = document.createElement('button');
    allowBtn.className = 'btn';
    allowBtn.textContent = 'Zugriff erlauben';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn';
    cancelBtn.textContent = 'Abbrechen';
    const close = (result) => { try { document.body.removeChild(overlay); } catch {}; resolve(result); };
    allowBtn.addEventListener('click', async () => {
      try {
        const ok = await onAllow();
        close(ok === true);
      } catch {
        close(false);
      }
    });
    cancelBtn.addEventListener('click', () => close(false));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(false); });
    actions.appendChild(allowBtn);
    actions.appendChild(cancelBtn);
    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
}

export async function ensureMotionPermissionWithModal() {
  // If no user-gesture gating, just return true and let service subscribe
  const needsPrompt = (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function');
  if (!needsPrompt) return true;
  if (state.motion.granted === true) return true;
  if (state.motion.pending) return state.motion.pending;
  if (state.motion.asked && state.motion.granted === false) return false;
  state.motion.asked = true;
  state.motion.pending = showPermissionModal({
    title: 'Bewegungssensor erlauben',
    message: 'Damit G‑Kraft angezeigt werden kann, erlaube Zugriff auf den Bewegungssensor.',
    onAllow: ensureMotionPermission,
  }).then((ok) => { state.motion.granted = ok === true; return state.motion.granted; })
    .finally(() => { state.motion.pending = null; });
  return state.motion.pending;
}

export async function ensureOrientationPermissionWithModal() {
  const needsPrompt = (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function');
  if (!needsPrompt) return true;
  if (state.orientation.granted === true) return true;
  if (state.orientation.pending) return state.orientation.pending;
  if (state.orientation.asked && state.orientation.granted === false) return false;
  state.orientation.asked = true;
  state.orientation.pending = showPermissionModal({
    title: 'Neigungssensor erlauben',
    message: 'Damit die Neigung angezeigt werden kann, erlaube Zugriff auf den Orientierungssensor.',
    onAllow: ensureOrientationPermission,
  }).then((ok) => { state.orientation.granted = ok === true; return state.orientation.granted; })
    .finally(() => { state.orientation.pending = null; });
  return state.orientation.pending;
}

async function getGeoPermissionState() {
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const res = await navigator.permissions.query({ name: 'geolocation' });
      return res.state; // 'granted' | 'prompt' | 'denied'
    }
  } catch {}
  return 'prompt';
}

async function requestGeoViaBrowser() {
  if (!('geolocation' in navigator)) return false;
  return new Promise((resolve) => {
    try {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch {
      resolve(false);
    }
  });
}

export async function ensureGeoPermissionWithModal() {
  const stateNow = await getGeoPermissionState();
  if (stateNow === 'granted') return true;
  if (state.geo.pending) return state.geo.pending;
  if (state.geo.asked && stateNow !== 'granted') return false;
  state.geo.asked = true;
  state.geo.pending = showPermissionModal({
    title: 'Standortzugriff erlauben',
    message: 'Damit Geschwindigkeit und Durchschnittswerte angezeigt werden können, erlaube Zugriff auf den Standort (GPS).',
    onAllow: requestGeoViaBrowser,
  }).finally(() => { state.geo.pending = null; });
  return state.geo.pending;
}
