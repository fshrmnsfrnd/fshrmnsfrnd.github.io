import { createCard, formatNumber, attachSettingsToExistingCard } from '../../componentsUtil.js';
import * as geo from '../../Services/geo.js';
import { ensureGeoPermissionWithModal } from '../../Services/permissions.js';
import { LineChart } from '../../chart.js';

function currentSpeedWidget() {
  const card = createCard('Current Speed');
  card.setSub('km/h');
  card.setValue('---');
  let unsub = () => {};
  ensureGeoPermissionWithModal().then((ok) => {
    if (ok) {
      unsub = geo.subscribe((data) => {
        if (data && typeof data.kmh === 'number' && !Number.isNaN(data.kmh)) {
          card.setValue(String(Math.round(data.kmh)));
        } else {
          card.setValue('---');
        }
      });
    }
  });
  card.setSettings([
    { label: 'Zurücksetzen', onClick: () => geo.reset && geo.reset() },
  ]);
  return { node: card.el, unmount: () => unsub && unsub() };
}

function averageSpeedWidget() {
  const card = createCard('Average Speed');
  card.setSub('km/h');
  card.setValue('---');
  let unsub = () => {};
  ensureGeoPermissionWithModal().then((ok) => {
    if (ok) {
      unsub = geo.subscribe((data) => {
        if (data && typeof data.avgKmh === 'number' && !Number.isNaN(data.avgKmh)) {
          card.setValue(formatNumber(data.avgKmh));
        } else {
          card.setValue('---');
        }
      });
    }
  });
  card.setSettings([
    { label: 'Zurücksetzen', onClick: () => geo.reset && geo.reset() },
  ]);
  return { node: card.el, unmount: () => unsub && unsub() };
}

function maxSpeedWidget() {
  const card = createCard('Max Speed');
  card.setSub('km/h (Session)');
  card.setValue('---');
  let unsub = () => {};
  ensureGeoPermissionWithModal().then((ok) => {
    if (ok) {
      unsub = geo.subscribe((data) => {
        if (data && typeof data.maxKmh === 'number' && !Number.isNaN(data.maxKmh)) {
          card.setValue(String(Math.round(data.maxKmh)));
        } else {
          card.setValue('---');
        }
      });
    }
  });
  card.setSettings([
    { label: 'Zurücksetzen', onClick: () => geo.reset && geo.reset() },
  ]);
  return { node: card.el, unmount: () => unsub && unsub() };
}

function speedGraphWidget() {
  const el = document.createElement('section');
  el.className = 'card graph-card';
  el.innerHTML = `
    <header class="card-title">
    <span class="card-title-text">Speed Graph</span>
    </header>
    <div class="card-body">
      <canvas class="chart" aria-label="Speed graph"></canvas>
    </div>`;
  const canvas = el.querySelector('canvas');
  const chart = new LineChart({ color: '#22c55e', maxSeconds: 180, lineWidth: 2 });
  chart.attach(canvas);
  const body = el.querySelector('.card-body');
  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  placeholder.textContent = '---';
  body.appendChild(placeholder);
  let unsub = () => {};
  ensureGeoPermissionWithModal().then((ok) => {
    if (ok) {
      unsub = geo.subscribe((data) => {
        if (data && typeof data.kmh === 'number' && !Number.isNaN(data.kmh)) {
          try { placeholder.remove(); } catch {}
          chart.push(data.kmh);
        }
      });
    }
  });
  // Settings: time window for visible graph (seconds)
  attachSettingsToExistingCard(el, [
    {
      type: 'range',
      label: 'Zeitfenster (s)',
      min: 10,
      max: 600,
      step: 10,
      get: () => chart.maxSeconds,
      onChange: (v) => { chart.maxSeconds = v; chart.draw(); },
    },
    { type: 'separator' },
    { label: 'Zurücksetzen', onClick: () => geo.reset && geo.reset() },
  ]);
  return { node: el, unmount: () => { unsub(); chart.detach(); } };
}

export const widgets = {
  optCurrSpeed: () => currentSpeedWidget(),
  optAverageSpeed: () => averageSpeedWidget(),
  optMaxSpeed: () => maxSpeedWidget(),
  optGraphSpeed: () => speedGraphWidget(),
};
