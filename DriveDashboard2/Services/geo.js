// Geolocation service: single watch shared by subscribers
const subs = new Set();
let watchId = null;
let lastPos = null;
let lastTs = null;
let maxKmh = 0;
const samples = []; // last N km/h values
const MAX_SAMPLES = 50;

function toRad(deg) { return (deg * Math.PI) / 180; }
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function emit(data) {
  subs.forEach((fn) => {
    try { fn(data); } catch {}
  });
}

function onPosition(position) {
  const { speed, latitude, longitude } = position.coords;
  const ts = position.timestamp;
  let mps = null;
  if (speed != null && !Number.isNaN(speed)) {
    mps = speed;
  } else if (lastPos && lastTs) {
    const dist = haversine(lastPos.coords.latitude, lastPos.coords.longitude, latitude, longitude);
    const dt = (ts - lastTs) / 1000;
    if (dt > 0) mps = dist / dt;
  }
  lastPos = position;
  lastTs = ts;

  const kmh = mps != null ? mps * 3.6 : 0;
  if (kmh > maxKmh) maxKmh = kmh;
  if (!Number.isNaN(kmh)) {
    samples.push(kmh);
    if (samples.length > MAX_SAMPLES) samples.shift();
  }
  const avg = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
  emit({ kmh, avgKmh: avg, maxKmh, ts, position });
}

function onError(err) {
  emit({ error: err });
}

function start() {
  if (watchId != null) return;
  if (!('geolocation' in navigator)) {
    emit({ error: new Error('Geolocation not supported') });
    return;
  }
  watchId = navigator.geolocation.watchPosition(onPosition, onError, { enableHighAccuracy: true });
}

function stop() {
  if (watchId != null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

export function subscribe(fn) {
  subs.add(fn);
  if (subs.size === 1) start();
  return () => {
    subs.delete(fn);
    if (subs.size === 0) stop();
  };
}

export function getSnapshot() {
  const lastKmh = samples.length ? samples[samples.length - 1] : 0;
  const avg = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
  return { kmh: lastKmh, avgKmh: avg, maxKmh };
}
