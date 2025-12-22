import { createCard, formatNumber } from '../../componentsUtil.js';
import * as geo from '../../Services/geo.js';

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
  el.className = 'card';
  el.innerHTML = `
    <header class="card-title">
    <span class="card-title-text">Speed Graph</span>
    </header>
    <div class="card-body">
      <div class="sparkline" aria-label="Speed graph"></div>
    </div>`;
  const spark = el.querySelector('.sparkline');
  const bars = [];
  function pushVal(kmh) {
    const b = document.createElement('i');
    const clamped = Math.max(0, Math.min(160, kmh || 0));
    b.style.height = (clamped / 160) * 100 + '%';
    spark.appendChild(b);
    bars.push(b);
    if (bars.length > 24) bars.shift().remove();
  }
  const unsub = geo.subscribe(({ kmh }) => pushVal(kmh));
  return { node: el, unmount: () => unsub() };
}

export const widgets = {
  optCurrSpeed: () => currentSpeedWidget(),
  optAverageSpeed: () => averageSpeedWidget(),
  optMaxSpeed: () => maxSpeedWidget(),
  optGraphSpeed: () => speedGraphWidget(),
};
