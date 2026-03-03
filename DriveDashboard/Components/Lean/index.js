import { formatNumber } from '../../componentsUtil.js';
import { ValueCard, GraphCard, CustomCard } from '../../card.js';
import * as orientation from '../../Services/orientation.js';
import { ensureOrientationPermissionWithModal } from '../../Services/permissions.js';
import { LineChart } from '../../chart.js';

function currLeanWidget() {
	const card = new ValueCard('Aktuelle Neigung', '---');
	let unsub = null;

	// Build a simple center-zero needle gauge (SVG)
	const body = card.body;
	const valueEl = card.cardElement.querySelector('.value');

	ensureOrientationPermissionWithModal().then((ok) => {
		if (ok) {
			unsub = orientation.subscribe(({ angle }) => {
				const a = Number(angle) || 0;
				const rot = Math.max(-90, Math.min(90, a));
				if (needleGroup) needleGroup.setAttribute('transform', `rotate(${rot} 60 40)`);
				card.setValue(`${formatNumber(Math.abs(a), 1)}°`);
			});
		} else {
			card.setValue('---');
		}
	});
	card.setMenuItems([]); // Zeige 'Keine Einstellungen'
	return { node: card.cardElement, unmount: () => unsub && unsub() };
}

function maxLeanWidget() {
	const card = new ValueCard('Max Neigung', '---', '°');
	let max = 0;
	let unsub = null;
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
	card.setMenuItems([
		{ label: 'Zurücksetzen', onClick: () => { max = 0; card.setValue(formatNumber(0, 1)); } },
	]);
	card.addCardClickHandler(() => { max = 0; card.setValue(formatNumber(0, 1)); });
	return { node: card.cardElement, unmount: () => unsub && unsub() };
}

// Simple numeric lean value card (no gauge)
function leanValueWidget() {
	const card = new ValueCard('Neigung Zahl', '---', '°');
	let unsub = null;
	ensureOrientationPermissionWithModal().then((ok) => {
		if (ok) {
			unsub = orientation.subscribe(({ angle }) => {
				const abs = Math.abs(Number(angle) || 0);
				card.setValue(`${formatNumber(abs, 1)}`);
			});
		} else {
			card.setValue('---');
		}
	});
	card.setMenuItems([]);
	return { node: card.cardElement, unmount: () => unsub && unsub() };
}

function leanGraphWidget() {
	const chart = new LineChart({ color: '#22c55e', maxSeconds: 180, lineWidth: 2 });
	const card = new GraphCard('Neigung Graph', chart, [
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
	ensureOrientationPermissionWithModal().then((ok) => {
		if (ok) {
			card.removePlaceholder();
			unsub = orientation.subscribe(({ angle }) => card.push(Math.abs(angle || 0)));
		}
	});
	return { node: card.cardElement, unmount: () => { unsub && unsub(); card.detachChart(); } };
}

// Combined Lean Card: needle + current + max, large like graph cards
function combinedLeanWidget() {
	const card = new CustomCard('Neigung', `
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
      </div>`, 'card graph-card lean-combined');

	const el = card.cardElement;
	const needleGroup = el.querySelector('.needle-group');
	const currEl = el.querySelector('.val-number[data-role="current"]');
	const maxEl = el.querySelector('.val-number[data-role="max"]');
	let unsub = null;
	let max = 0;

	card.addCardClickHandler(() => { max = 0; });

	// Permission and subscription
	ensureOrientationPermissionWithModal().then((ok) => {
		if (!ok) return;
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
	});

	return { node: el, unmount: () => unsub && unsub() };
}

// Needle-only, larger card
function leanNeedleWidget() {
	const card = new CustomCard('Neigung Nadel', `
      <div class="lean-gauge">
        <svg class="lean-gauge-svg" viewBox="0 0 120 80" aria-label="Lean gauge">
          <g class="needle-group" transform="rotate(0 60 40)">
            <line class="needle" x1="60" y1="40" x2="60" y2="10" />
          </g>
          <circle class="pivot" cx="60" cy="40" r="3" />
          <line class="zero-mark" x1="60" y1="10" x2="60" y2="16" />
        </svg>
      </div>`);

	const needleGroup = card.cardElement.querySelector('.needle-group');
	let unsub = null;
	ensureOrientationPermissionWithModal().then((ok) => {
		if (!ok) return;
		unsub = orientation.subscribe(({ angle }) => {
			const a = Number(angle) || 0;
			const rot = Math.max(-90, Math.min(90, a));
			if (needleGroup) needleGroup.setAttribute('transform', `rotate(${rot} 60 40)`);
		});
	});
	return { node: card.cardElement, unmount: () => unsub && unsub() };
}

export const widgets = {
	optCurrLean: () => currLeanWidget(),
	optMaxLean: () => maxLeanWidget(),
	optGraphLean: () => leanGraphWidget(),
	optLeanCombined: () => combinedLeanWidget(),
	optLeanNeedle: () => leanNeedleWidget(),
	optLeanValue: () => leanValueWidget(),
};

