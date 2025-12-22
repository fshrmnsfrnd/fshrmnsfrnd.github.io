import { createCard, formatNumber, attachSettingsToExistingCard } from '../../componentsUtil.js';
import * as orientation from '../../Services/orientation.js';
import { ensureOrientationPermissionWithModal } from '../../Services/permissions.js';
import { LineChart } from '../../chart.js';

function currLeanWidget() {
  const card = createCard('Aktuelle Neigung');
  card.setSub('°');
  let unsub = null;
  card.setValue('---');
  ensureOrientationPermissionWithModal().then((ok) => {
    if (ok) {
      unsub = orientation.subscribe(({ angle }) => {
        card.setValue(formatNumber(angle, 1));
      });
    } else {
      card.setValue('---');
    }
  });
  card.setSettings([]); // Zeige 'Keine Einstellungen'
  return { node: card.el, unmount: () => unsub && unsub() };
}

function maxLeanWidget() {
  const card = createCard('Max Neigung');
  card.setSub('°');
  let max = 0;
  let unsub = null;
  card.setValue('---');
  ensureOrientationPermissionWithModal().then((ok) => {
    if (ok) {
      unsub = orientation.subscribe(({ angle }) => {
        const v = Math.abs(angle);
        if (v > max) max = v;
        card.setValue(formatNumber(max, 1));
      });
    } else {
      card.setValue('---');
    }
  });
  card.setSettings([
    { label: 'Zurücksetzen', onClick: () => { max = 0; card.setValue(formatNumber(0, 1)); } },
  ]);
  return { node: card.el, unmount: () => unsub && unsub() };
}

function leanGraphWidget() {
  const el = document.createElement('section');
  el.className = 'card graph-card';
  el.innerHTML = `
    <header class="card-title">
    <span class="card-title-text">Neigung Graph</span>
    </header>
    <div class="card-body">
      <canvas class="chart" aria-label="Lean graph"></canvas>
    </div>`;
  const canvas = el.querySelector('canvas');
  const chart = new LineChart({ color: '#22c55e', maxSeconds: 180, lineWidth: 2 });
  chart.attach(canvas);
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
  ]);
  let unsub = null;
  // Placeholder for unavailable
  const body = el.querySelector('.card-body');
  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  placeholder.textContent = '---';
  body.appendChild(placeholder);
  ensureOrientationPermissionWithModal().then((ok) => {
    if (ok) {
      placeholder.remove();
      unsub = orientation.subscribe(({ angle }) => chart.push(Math.abs(angle || 0)));
    }
  });
  return { node: el, unmount: () => { unsub && unsub(); chart.detach(); } };
  
  
}

export const widgets = {
  optCurrLean: () => currLeanWidget(),
  optMaxLean: () => maxLeanWidget(),
  optGraphLean: () => leanGraphWidget(),
};
