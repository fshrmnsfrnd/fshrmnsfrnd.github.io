import { createCard, formatNumber, attachSettingsToExistingCard } from '../../componentsUtil.js';
import { ensureMotionPermissionWithModal, ensureMotionPermission } from '../../Services/permissions.js';
import * as motion from '../../Services/motion.js';
import { LineChart } from '../../chart.js';

function currGWidget() {
  const card = createCard('Aktuelle G-Kraft');
  let unsub = null;

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Sensor aktivieren';

  card.setValue('---');

  btn.onclick = async () => {
    const ok = await ensureMotionPermissionWithModal();
    if (!ok) {
      card.setValue('---');
      return;
    }
    btn.remove();
    unsub = motion.subscribe(({ g }) => {
      card.setValue(formatNumber(g || 0, 2));
    });
  };

  const body = card.el.querySelector('.card-body') || card.el;
  body.appendChild(btn);
  card.setSettings([]); // Keine speziellen Einstellungen

  return { node: card.el, unmount: () => unsub && unsub() };
}

function maxGWidget() {
  const card = createCard('Maximale G-Kraft');
  let unsub = null;
  let max = 0;

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Sensor aktivieren';

  card.setValue('---');

  btn.onclick = async () => {
    const ok = await ensureMotionPermissionWithModal();
    if (!ok) {
      card.setValue('---');
      return;
    }
    btn.remove();
    unsub = motion.subscribe(({ g }) => {
      const val = g || 0;
      if (val > max) max = val;
      card.setValue(formatNumber(max, 2));
    });
  };

  const body = card.el.querySelector('.card-body') || card.el;
  body.appendChild(btn);

  card.setSettings([
    { label: 'Zurücksetzen', onClick: () => { max = 0; card.setValue(formatNumber(0, 2)); } },
  ]);

  return { node: card.el, unmount: () => unsub && unsub() };
}

function gGraphWidget() {
  const el = document.createElement('section');
  el.className = 'card graph-card';
  el.innerHTML = `
    <header class="card-title">
      <span class="card-title-text">G-Kraft Graph</span>
    </header>
    <div class="card-body">
      <canvas class="chart" aria-label="G graph"></canvas>
      <button class="btn">Sensor aktivieren</button>
    </div>`;

  const canvas = el.querySelector('canvas');
  const btn = el.querySelector('button');
  const body = el.querySelector('.card-body');

  const chart = new LineChart({ color: '#22c55e', maxSeconds: 180, lineWidth: 2 });
  if (typeof chart.attach === 'function') chart.attach(canvas);

  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  placeholder.textContent = '---';
  body.insertBefore(placeholder, canvas);

  let unsub = null;

  attachSettingsToExistingCard(el, [
    {
      type: 'range',
      label: 'Zeitfenster (s)',
      min: 10,
      max: 600,
      step: 10,
      get: () => chart.maxSeconds,
      onChange: (v) => { chart.maxSeconds = v; if (typeof chart.draw === 'function') chart.draw(); },
    },
  ]);

  btn.onclick = async () => {
    if (await ensureMotionPermission()) {
      btn.remove();
      placeholder.remove();
      unsub = motion.subscribe(({ g }) => chart.push(Math.max(0, g || 0)));
    } else {
      alert('Sensor-Zugriff verweigert');
    }
  };

  return { node: el, unmount: () => { unsub && unsub(); if (typeof chart.detach === 'function') chart.detach(); } };
}

export const widgets = {
  optCurrGForce: () => currGWidget(),
  optMaxGForce: () => maxGWidget(),
  optGraphGForce: () => gGraphWidget(),
};
