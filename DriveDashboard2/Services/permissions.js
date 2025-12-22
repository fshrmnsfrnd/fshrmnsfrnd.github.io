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
