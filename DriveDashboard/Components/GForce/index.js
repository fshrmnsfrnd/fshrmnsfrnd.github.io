import { formatNumber } from '../../componentsUtil.js';
import { ValueCard, GraphCard } from '../../card.js';
import * as motion from '../../Services/motion.js';
import { ensureMotionPermissionWithModal } from '../../Services/permissions.js';
import { LineChart } from '../../chart.js';

function currGWidget() {
  const card = new ValueCard('Aktuelle G-Kraft', '---');
  let unsub = null;

  ensureMotionPermissionWithModal().then((ok) => {
    if (ok) {
      unsub = motion.subscribe(({ g }) => {
        card.setValue(formatNumber(g || 0, 2));
      });
    } else {
      card.setValue('---');
    }
  });
  card.setMenuItems([]); // Keine speziellen Einstellungen

  return { node: card.cardElement, unmount: () => unsub && unsub() };
}

function maxGWidget() {
  const card = new ValueCard('Maximale G-Kraft', '---');
  let unsub = null;
  let max = 0;

  ensureMotionPermissionWithModal().then((ok) => {
    if (ok) {
      unsub = motion.subscribe(({ g }) => {
        const val = g || 0;
        if (val > max) max = val;
        card.setValue(formatNumber(max, 2));
      });
    } else {
      card.setValue('---');
    }
  });

  card.setMenuItems([
    { label: 'Zurücksetzen', onClick: () => { max = 0; card.setValue(formatNumber(0, 2)); } },
  ]);

  card.addCardClickHandler(() => { max = 0; card.setValue(formatNumber(0, 2)); });

  return { node: card.cardElement, unmount: () => unsub && unsub() };
}

function gGraphWidget() {
  const chart = new LineChart({ color: '#22c55e', maxSeconds: 180, lineWidth: 2 });
  const card = new GraphCard('G-Kraft Graph', chart, [
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

  let unsub = null;

  ensureMotionPermissionWithModal().then((ok) => {
    if (ok) {
      card.removePlaceholder();
      unsub = motion.subscribe(({ g }) => card.push(Math.max(0, g || 0)));
    }
  });

  return { node: card.cardElement, unmount: () => { unsub && unsub(); card.detachChart(); } };
}

export const widgets = {
  optCurrGForce: () => currGWidget(),
  optMaxGForce: () => maxGWidget(),
  optGraphGForce: () => gGraphWidget(),
};
