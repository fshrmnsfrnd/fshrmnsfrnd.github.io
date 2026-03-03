// App orchestrator: mounts widgets selected via the left menu
import { widgets as speedWidgets } from './Components/Speed/index.js';
import { widgets as leanWidgets } from './Components/Lean/index.js';
import { widgets as gforceWidgets } from './Components/GForce/index.js';
import { widgets as clockWidgets } from './Components/Clock/index.js';

const STORAGE_KEY = 'dd2:widgets';
const ORDER_KEY = 'dd2:order';
const root = document.getElementById('dashboard-root');
const form = document.querySelector('.menu-list');

// Merge all widgets into a single registry
const REGISTRY = {
	...speedWidgets,
	...leanWidgets,
	...gforceWidgets,
	...clockWidgets,
};

// Load/save selection state
function loadState() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
	} catch {
		return {};
	}
}
function saveState(state) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadOrder() {
	try {
		const raw = JSON.parse(localStorage.getItem(ORDER_KEY));
		return Array.isArray(raw) ? raw : [];
	} catch {
		return [];
	}
}

function saveOrder(orderArr = []) {
	localStorage.setItem(ORDER_KEY, JSON.stringify(orderArr));
}

// Track mounted widgets
const mounted = new Map(); // id -> { node, unmount }

function renderSelection() {
	if (!form || !root) return;
	const checkboxes = Array.from(form.querySelectorAll('input[type="checkbox"]'));
	const menuOrder = checkboxes.map((cb, idx) => [cb.id, idx]).reduce((acc, [id, idx]) => {
		acc[id] = idx;
		return acc;
	}, {});
	const selectedIds = checkboxes
		.filter((cb) => cb.checked)
		.map((cb) => cb.id)
		.filter((id) => REGISTRY[id]);

	const storedOrder = loadOrder();
	const orderPos = new Map(storedOrder.map((id, idx) => [id, idx]));
	selectedIds.sort((a, b) => {
		const aHas = orderPos.has(a);
		const bHas = orderPos.has(b);
		if (aHas && bHas) return orderPos.get(a) - orderPos.get(b);
		if (aHas) return -1;
		if (bHas) return 1;
		const aMenu = menuOrder[a] ?? 9999;
		const bMenu = menuOrder[b] ?? 9999;
		return aMenu - bMenu;
	});

	// Unmount any widgets no longer selected
	for (const [id, entry] of Array.from(mounted.entries())) {
		if (!selectedIds.includes(id)) {
			try { entry.unmount && entry.unmount(); } catch { }
			entry.node.remove();
			mounted.delete(id);
		}
	}

	// Append/mount in the order of the menu
	for (const id of selectedIds) {
		if (mounted.has(id)) {
			// Move to maintain order
			root.appendChild(mounted.get(id).node);
			continue;
		}
		const factory = REGISTRY[id];
		if (!factory) continue;
		try {
			const { node, unmount } = factory();
			if (!node) {
				continue;
			}
			node.dataset.widget = id;
			node.draggable = true;
			root.appendChild(node);
			mounted.set(id, { node, unmount });
		} catch (e) {
		}
	}

	const newOrder = Array.from(root.children)
		.map((n) => n.dataset && n.dataset.widget)
		.filter(Boolean);
	saveOrder(newOrder);
}

// Initialize checkboxes from saved state
const state = loadState();
if (form) {
	for (const cb of form.querySelectorAll('input[type="checkbox"]')) {
		if (Object.prototype.hasOwnProperty.call(state, cb.id)) {
			cb.checked = !!state[cb.id];
		}
		cb.addEventListener('change', () => {
			state[cb.id] = cb.checked;
			saveState(state);
			renderSelection();
		});
	}
}

// Initial render
renderSelection();