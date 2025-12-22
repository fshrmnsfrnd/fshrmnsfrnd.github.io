import { createCard, formatNumber, attachSettingsToExistingCard } from '../../componentsUtil.js';
import * as motion from '../../Services/motion.js';
import { ensureMotionPermission } from '../../Services/permissions.js';
import { LineChart } from '../../chart.js';

function currGWidget() {
  const card = createCard('Aktuelle G-Kraft');
  card.setSub('g');
  const btn = document.createElement('button');
  btn.textContent = 'Sensor aktivieren';
  btn.className = 'btn';
  let unsub = null;
  btn.onclick = async () => {
    if (await ensureMotionPermission()) {
      btn.remove();
      unsub = motion.subscribe(({ g }) => {
          card.setValue(formatNumber(g || 0, 2));
      });
    } else {
      alert('Sensor-Zugriff verweigert');
    }
  };
  card.el.querySelector('.card-body').appendChild(btn);
  card.setSettings([]); // Keine speziellen Einstellungen
  return { node: card.el, unmount: () => unsub && unsub() };
}

function maxGWidget() {
  const card = createCard('Max G-Kraft');
  card.setSub('g');
  const btn = document.createElement('button');
  btn.textContent = 'Sensor aktivieren';
  btn.className = 'btn';
  let max = 0;
  let unsub = null;
  btn.onclick = async () => {
    if (await ensureMotionPermission()) {
      btn.remove();
      unsub = motion.subscribe(({ g }) => {
        if ((g || 0) > max) max = g;
          card.setValue(formatNumber(max || 0, 2));
      });
    } else {
      alert('Sensor-Zugriff verweigert');
    }
  };
  card.el.querySelector('.card-body').appendChild(btn);
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
  const btn = el.querySelector('button');
  let unsub = null;
  btn.onclick = async () => {
    if (await ensureMotionPermission()) {
      btn.remove();
      unsub = motion.subscribe(({ g }) => chart.push(Math.max(0, g || 0)));
    } else {
      alert('Sensor-Zugriff verweigert');
    }
  };
  return { node: el, unmount: () => { unsub && unsub(); chart.detach(); } };
}

export const widgets = {
  optCurrGForce: () => currGWidget(),
  optMaxGForce: () => maxGWidget(),
  optGraphGForce: () => gGraphWidget(),
};
