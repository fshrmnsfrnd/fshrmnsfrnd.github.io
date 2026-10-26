import { formatNumber } from '../../componentsUtil.js';
import { ValueCard, GraphCard } from '../../card.js';
import * as geo from '../../Services/geo.js';
import { LineChart } from '../../chart.js';

function currentSpeedWidget() {
	const card = new ValueCard('Current Speed', '---', 'km/h');
	let unsub = () => { };
	unsub = geo.subscribe((data) => {
		if (data && typeof data.kmh === 'number' && !Number.isNaN(data.kmh)) {
			card.setValue(String(Math.round(data.kmh)));
		} else {
			card.setValue('---');
		}
	});
	card.setMenuItems([
		{ label: 'Zurücksetzen', onClick: () => geo.reset && geo.reset() },
	]);
	return { node: card.cardElement, unmount: () => unsub && unsub() };
}

function averageSpeedWidget() {
	const card = new ValueCard('Average Speed', '---', 'km/h');
	let unsub = () => { };
	unsub = geo.subscribe((data) => {
		if (data && typeof data.avgKmh === 'number' && !Number.isNaN(data.avgKmh)) {
			card.setValue(formatNumber(data.avgKmh));
		} else {
			card.setValue('---');
		}
	});
	card.setMenuItems([
		{ label: 'Zurücksetzen', onClick: () => geo.reset && geo.reset() },
	]);
	card.addCardClickHandler(() => { card.setValue('0'); geo.reset(); });
	return { node: card.cardElement, unmount: () => unsub && unsub() };
}

function maxSpeedWidget() {
	const card = new ValueCard('Max Speed', '---', 'km/h');
	let unsub = () => { };
	unsub = geo.subscribe((data) => {
		if (data && typeof data.maxKmh === 'number' && !Number.isNaN(data.maxKmh)) {
			card.setValue(String(Math.round(data.maxKmh)));
		} else {
			card.setValue('---');
		}
	});
	card.setMenuItems([
		{ label: 'Zurücksetzen', onClick: () => geo.reset && geo.reset() },
	]);
	card.addCardClickHandler(() => { card.setValue('0'); geo.reset(); });
	return { node: card.cardElement, unmount: () => unsub && unsub() };
}

function speedGraphWidget() {
	const chart = new LineChart({ color: '#22c55e', maxSeconds: 180, lineWidth: 2 });
	const card = new GraphCard('Speed Graph', chart, [
		{
			type: 'range',
			label: 'Zeitfenster (s)',
			min: 10,
			max: 600,
			step: 10,
			get: () => chart.maxSeconds,
			onChange: (v) => { chart.maxSeconds = v; chart.draw(); },
		},
		{ type: 'separator' },
		{ label: 'Zurücksetzen', onClick: () => geo.reset && geo.reset() },
	]);
	let unsub = () => { };
	let removed = false;
	unsub = geo.subscribe((data) => {
		if (!removed) { card.removePlaceholder(); removed = true; }
		if (data && typeof data.kmh === 'number' && !Number.isNaN(data.kmh)) {
			card.push(data.kmh);
		}
	});
	return { node: card.cardElement, unmount: () => { unsub(); card.detachChart(); } };
}

function minutesPer10km() {
	const card = new ValueCard('Minutes per 10km', '---', 'm/10km');
	let unsub = () => { };
	unsub = geo.subscribe((data) => {
		if (data && typeof data.kmh === 'number' && Number.isFinite(data.kmh) && data.kmh > 0) {
			const totalSeconds = Math.round((600 / data.kmh) * 60);
			const minutes = Math.floor(totalSeconds / 60);
			const seconds = totalSeconds % 60;
			card.setValue(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
		} else {
			card.setValue('---');
		}
	});
	card.setMenuItems([
		{ label: 'Zurücksetzen', onClick: () => geo.reset && geo.reset() },
	]);
	return { node: card.cardElement, unmount: () => unsub && unsub() };
}

export const widgets = {
	optCurrSpeed: () => currentSpeedWidget(),
	optAverageSpeed: () => averageSpeedWidget(),
	optMaxSpeed: () => maxSpeedWidget(),
	optGraphSpeed: () => speedGraphWidget(),
	optMinPer10km: () => minutesPer10km(),
};
