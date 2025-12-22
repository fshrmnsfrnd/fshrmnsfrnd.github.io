import { createCard, formatNumber } from '../../componentsUtil.js';
import * as motion from '../../Services/motion.js';
import { ensureMotionPermission } from '../../Services/permissions.js';

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
  return { node: card.el, unmount: () => unsub && unsub() };
}

function maxGWidget() {
  const card = createCard('Max G-Kraft');
  card.setSub('g (Session)');
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
  return { node: card.el, unmount: () => unsub && unsub() };
}

function gGraphWidget() {
  const el = document.createElement('section');
  el.className = 'card';
  el.innerHTML = `
    <header class="card-title">G-Kraft Graph</header>
    <div class="card-body">
      <div class="sparkline" aria-label="G graph"></div>
      <button class="btn">Sensor aktivieren</button>
    </div>`;
  const spark = el.querySelector('.sparkline');
  const btn = el.querySelector('button');
  const bars = [];
  let unsub = null;
  function pushVal(g) {
    const v = Math.min(2.5, Math.max(0, g || 0));
    const b = document.createElement('i');
    b.style.height = (v / 2.5) * 100 + '%';
    spark.appendChild(b);
    bars.push(b);
    if (bars.length > 24) bars.shift().remove();
  }
  btn.onclick = async () => {
    if (await ensureMotionPermission()) {
      btn.remove();
      unsub = motion.subscribe(({ g }) => pushVal(g));
    } else {
      alert('Sensor-Zugriff verweigert');
    }
  };
  return { node: el, unmount: () => unsub && unsub() };
}

export const widgets = {
  optCurrGForce: () => currGWidget(),
  optMaxGForce: () => maxGWidget(),
  optGraphGForce: () => gGraphWidget(),
};
