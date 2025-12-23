import { createCard, formatNumber, attachSettingsToExistingCard } from '../../componentsUtil.js';
import * as orientation from '../../Services/orientation.js';
import { LineChart } from '../../chart.js';

function currLeanWidget() {
  const card = createCard('Aktuelle Neigung');
  // Custom rendering: needle gauge above, absolute value below
  card.setSub('');
  let unsub = null;
  card.setValue('---');

  // Build a simple center-zero needle gauge (SVG)
  const body = card.el.querySelector('.card-body');
  const valueEl = card.el.querySelector('.value');

  unsub = orientation.subscribe(({ angle }) => {
    const a = Number(angle) || 0;
    const rot = Math.max(-90, Math.min(90, a));
    if (needleGroup) needleGroup.setAttribute('transform', `rotate(${rot} 60 40)`);
    // Show absolute tilt value below the gauge, degrees symbol included
    card.setValue(`${formatNumber(Math.abs(a), 1)}°`);
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
  unsub = orientation.subscribe(({ angle }) => {
    const v = Math.abs(angle);
    if (v > max) max = v;
    card.setValue(formatNumber(max, 1));
  });
  card.setSettings([
    { label: 'Zurücksetzen', onClick: () => { max = 0; card.setValue(formatNumber(0, 1)); } },
  ]);
  return { node: card.el, unmount: () => unsub && unsub() };
}

// Simple numeric lean value card (no gauge)
function leanValueWidget() {
  const card = createCard('Neigung Zahl');
  card.setSub('°');
  card.setValue('---');
  let unsub = null;
  unsub = orientation.subscribe(({ angle }) => {
    const abs = Math.abs(Number(angle) || 0);
    card.setValue(`${formatNumber(abs, 1)}`);
  });
  card.setSettings([]);
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
  placeholder.remove();
  unsub = orientation.subscribe(({ angle }) => chart.push(Math.abs(angle || 0)));
  return { node: el, unmount: () => { unsub && unsub(); chart.detach(); } };
  
  
}

// Combined Lean Card: needle + current + max, large like graph cards
function combinedLeanWidget() {
  const el = document.createElement('section');
  el.className = 'card graph-card lean-combined';
  el.innerHTML = `
    <header class="card-title">
      <span class="card-title-text">Neigung</span>
    </header>
    <div class="card-body">
      <div class="lean-gauge">
        <svg class="lean-gauge-svg" viewBox="0 0 120 80" aria-label="Lean gauge">
          <g class="needle-group" transform="rotate(0 60 40)">
            <line class="needle" x1="60" y1="40" x2="60" y2="10" />
          </g>
          <circle class="pivot" cx="60" cy="40" r="3" />
          <line class="zero-mark" x1="60" y1="10" x2="60" y2="16" />
        </svg>
      </div>
      <div class="lean-values">
        <div class="value-row">
          <span class="label">Aktuell</span>
          <span class="val-number" data-role="current">---</span>
        </div>
        <div class="value-row">
          <span class="label">Max</span>
          <span class="val-number" data-role="max">---</span>
        </div>
      </div>
    </div>`;

  const needleGroup = el.querySelector('.needle-group');
  const currEl = el.querySelector('.val-number[data-role="current"]');
  const maxEl = el.querySelector('.val-number[data-role="max"]');
  let unsub = null;
  let max = 0;

  // Permission and subscription
  unsub = orientation.subscribe(({ angle }) => {
    const a = Number(angle) || 0;
    const rot = Math.max(-90, Math.min(90, a));
    if (needleGroup) needleGroup.setAttribute('transform', `rotate(${rot} 60 40)`);
    const abs = Math.abs(a);
    if (currEl) currEl.textContent = `${formatNumber(abs, 1)}°`;
    if (abs > max) {
      max = abs;
      if (maxEl) maxEl.textContent = `${formatNumber(max, 1)}°`;
    }
  });

  return { node: el, unmount: () => unsub && unsub() };
}

// Needle-only, larger card
function leanNeedleWidget() {
  const el = document.createElement('section');
  el.className = 'card';
  el.innerHTML = `
    <header class="card-title">
      <span class="card-title-text">Neigung Nadel</span>
    </header>
    <div class="card-body">
      <div class="lean-gauge">
        <svg class="lean-gauge-svg" viewBox="0 0 120 80" aria-label="Lean gauge">
          <g class="needle-group" transform="rotate(0 60 40)">
            <line class="needle" x1="60" y1="40" x2="60" y2="10" />
          </g>
          <circle class="pivot" cx="60" cy="40" r="3" />
          <line class="zero-mark" x1="60" y1="10" x2="60" y2="16" />
        </svg>
      </div>
    </div>`;
  const needleGroup = el.querySelector('.needle-group');
  let unsub = null;
  unsub = orientation.subscribe(({ angle }) => {
    const a = Number(angle) || 0;
    const rot = Math.max(-90, Math.min(90, a));
    if (needleGroup) needleGroup.setAttribute('transform', `rotate(${rot} 60 40)`);
  });
  return { node: el, unmount: () => unsub && unsub() };
}

export const widgets = {
  optCurrLean: () => currLeanWidget(),
  optMaxLean: () => maxLeanWidget(),
  optGraphLean: () => leanGraphWidget(),
  optLeanCombined: () => combinedLeanWidget(),
  optLeanNeedle: () => leanNeedleWidget(),
  optLeanValue: () => leanValueWidget(),
};

