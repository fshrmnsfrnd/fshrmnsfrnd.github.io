import { createCard, formatNumber } from '../../componentsUtil.js';
import * as orientation from '../../Services/orientation.js';
import { ensureOrientationPermission } from '../../Services/permissions.js';

function currLeanWidget() {
  const card = createCard('Aktuelle Neigung');
  card.setSub('°');
  const btn = document.createElement('button');
  btn.textContent = 'Sensor aktivieren';
  btn.className = 'btn';
  let unsub = null;
  btn.onclick = async () => {
    if (await ensureOrientationPermission()) {
      btn.remove();
      unsub = orientation.subscribe(({ angle }) => {
        card.setValue(`${formatNumber(angle, 1)}°`);
      });
    } else {
      alert('Sensor-Zugriff verweigert');
    }
  };
  card.el.querySelector('.card-body').appendChild(btn);
  return { node: card.el, unmount: () => unsub && unsub() };
}

function maxLeanWidget() {
  const card = createCard('Max Neigung');
  card.setSub('° (Session)');
  let max = 0;
  const btn = document.createElement('button');
  btn.textContent = 'Sensor aktivieren';
  btn.className = 'btn';
  let unsub = null;
  btn.onclick = async () => {
    if (await ensureOrientationPermission()) {
      btn.remove();
      unsub = orientation.subscribe(({ angle }) => {
        const v = Math.abs(angle);
        if (v > max) max = v;
        card.setValue(`${formatNumber(max, 1)}°`);
      });
    } else {
      alert('Sensor-Zugriff verweigert');
    }
  };
  card.el.querySelector('.card-body').appendChild(btn);
  return { node: card.el, unmount: () => unsub && unsub() };
}

function leanGraphWidget() {
  const el = document.createElement('section');
  el.className = 'card';
  el.innerHTML = `
    <header class="card-title">Neigung Graph</header>
    <div class="card-body">
      <div class="sparkline" aria-label="Lean graph"></div>
      <button class="btn">Sensor aktivieren</button>
    </div>`;
  const spark = el.querySelector('.sparkline');
  const btn = el.querySelector('button');
  const bars = [];
  let unsub = null;
  function pushVal(angle) {
    const b = document.createElement('i');
    const v = Math.min(90, Math.abs(angle));
    b.style.height = (v / 90) * 100 + '%';
    spark.appendChild(b);
    bars.push(b);
    if (bars.length > 24) bars.shift().remove();
  }
  btn.onclick = async () => {
    if (await ensureOrientationPermission()) {
      btn.remove();
      unsub = orientation.subscribe(({ angle }) => pushVal(angle));
    } else {
      alert('Sensor-Zugriff verweigert');
    }
  };
  return { node: el, unmount: () => unsub && unsub() };
}

export const widgets = {
  optCurrLean: () => currLeanWidget(),
  optMaxLean: () => maxLeanWidget(),
  optGraphLean: () => leanGraphWidget(),
};
