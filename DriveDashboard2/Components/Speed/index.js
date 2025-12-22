import { createCard, formatNumber } from '../../componentsUtil.js';
import * as geo from '../../Services/geo.js';
import { LineChart } from '../../chart.js';

function currentSpeedWidget() {
  const card = createCard('Current Speed');
  card.setSub('km/h');
  const unsub = geo.subscribe(({ kmh }) => {
    card.setValue(String(Math.round(kmh || 0)));
  });
  return { node: card.el, unmount: () => unsub() };
}

function averageSpeedWidget() {
  const card = createCard('Average Speed');
  card.setSub('km/h');
  const unsub = geo.subscribe(({ avgKmh }) => {
    card.setValue(formatNumber(avgKmh || 0));
  });
  return { node: card.el, unmount: () => unsub() };
}

function maxSpeedWidget() {
  const card = createCard('Max Speed');
  card.setSub('km/h (Session)');
  const unsub = geo.subscribe(({ maxKmh }) => {
    card.setValue(String(Math.round(maxKmh || 0)));
  });
  return { node: card.el, unmount: () => unsub() };
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
  const unsub = geo.subscribe(({ kmh }) => chart.push(kmh || 0));
  return { node: el, unmount: () => { unsub(); chart.detach(); } };
}

export const widgets = {
  optCurrSpeed: () => currentSpeedWidget(),
  optAverageSpeed: () => averageSpeedWidget(),
  optMaxSpeed: () => maxSpeedWidget(),
  optGraphSpeed: () => speedGraphWidget(),
};
