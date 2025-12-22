// App orchestrator: mounts widgets selected via the left menu
import { widgets as speedWidgets } from './Components/Speed/index.js';
import { widgets as leanWidgets } from './Components/Lean/index.js';
import { widgets as gforceWidgets } from './Components/GForce/index.js';
import { widgets as clockWidgets } from './Components/Clock/index.js';

const STORAGE_KEY = 'dd2:widgets';
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

// Track mounted widgets
const mounted = new Map(); // id -> { node, unmount }

function renderSelection() {
  if (!form || !root) return;
  const checkboxes = Array.from(form.querySelectorAll('input[type="checkbox"]'));
  const selectedIds = checkboxes
    .filter((cb) => cb.checked)
    .map((cb) => cb.id)
    .filter((id) => REGISTRY[id]);

  // Unmount any widgets no longer selected
  for (const [id, entry] of Array.from(mounted.entries())) {
    if (!selectedIds.includes(id)) {
      try { entry.unmount && entry.unmount(); } catch {}
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
    const { node, unmount } = factory();
    node.dataset.widget = id;
    root.appendChild(node);
    mounted.set(id, { node, unmount });
  }
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

// Expose a tiny API if needed elsewhere
window.DD2 = {
  refresh: renderSelection,
};
