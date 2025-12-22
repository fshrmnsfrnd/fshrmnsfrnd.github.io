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
  motion: { asked: false, pending: null },
  orientation: { asked: false, pending: null },
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
  if (state.motion.pending) return state.motion.pending;
  if (state.motion.asked) return false;
  state.motion.asked = true;
  state.motion.pending = showPermissionModal({
    title: 'Bewegungssensor erlauben',
    message: 'Damit G‑Kraft angezeigt werden kann, erlaube Zugriff auf den Bewegungssensor.',
    onAllow: ensureMotionPermission,
  }).finally(() => { state.motion.pending = null; });
  return state.motion.pending;
}

export async function ensureOrientationPermissionWithModal() {
  const needsPrompt = (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function');
  if (!needsPrompt) return true;
  if (state.orientation.pending) return state.orientation.pending;
  if (state.orientation.asked) return false;
  state.orientation.asked = true;
  state.orientation.pending = showPermissionModal({
    title: 'Neigungssensor erlauben',
    message: 'Damit die Neigung angezeigt werden kann, erlaube Zugriff auf den Orientierungssensor.',
    onAllow: ensureOrientationPermission,
  }).finally(() => { state.orientation.pending = null; });
  return state.orientation.pending;
}
