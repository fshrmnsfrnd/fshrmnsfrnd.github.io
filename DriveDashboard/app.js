// App orchestrator: mounts widgets selected via the left menu
import { widgets as speedWidgets } from './Components/Speed/index.js';
import { widgets as leanWidgets } from './Components/Lean/index.js';
import { widgets as gforceWidgets } from './Components/GForce/index.js';
import { widgets as clockWidgets } from './Components/Clock/index.js';

const STORAGE_KEY = 'dd2:widgets';
const root = document.getElementById('dashboard-root');
const form = document.querySelector('.menu-list');
const editToggleBtn = document.getElementById('editToggle');
console.log('[DriveDashboard] app.js geladen', { hasRoot: !!root, hasForm: !!form, hasEditBtn: !!editToggleBtn });

// Edit mode state
let editMode = false;
let gridOverlay = null; // single overlay element for visual grid
let cellSize = 10; // ~10px, can adapt on resize
const layout = new Map(); // widgetId -> {left, top, width, height}
const handlerStore = new WeakMap(); // card -> {dragDown, resizeDown}

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

// Persisted layout
const LAYOUT_KEY = 'dd2:layout';
function loadLayout() {
  try { return JSON.parse(localStorage.getItem(LAYOUT_KEY)) || {}; } catch { return {}; }
}
function saveLayout() {
  const obj = {};
  for (const [id, rect] of layout.entries()) obj[id] = rect;
  localStorage.setItem(LAYOUT_KEY, JSON.stringify(obj));
}
const initialLayout = loadLayout();

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
    try {
      const { node, unmount } = factory();
      if (!node) {
        continue;
      }
      node.dataset.widget = id;
      root.appendChild(node);
      mounted.set(id, { node, unmount });
      // Always enforce absolute layout; apply saved layout if present
      ensureAbsoluteLayout(node);
      if (editMode) prepareCardForEdit(node); else removeEditInteractions(node);
    } catch (e) {
    }
  }

  // Rebuild grid overlay if edit mode is active
  if (editMode) buildGridOverlay();
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
window.DD2 = Object.assign(window.DD2 || {}, {
  refresh: renderSelection,
});

// ===== Edit mode implementation =====
function computeCellSize() {
  // Approximately 10px; allow slight scaling for larger screens
  const base = 10;
  const scale = Math.min(1.6, Math.max(1, window.innerWidth / 800));
  cellSize = Math.round(base * scale);
}

function buildGridOverlay() {
  if (!root) return;
  computeCellSize();
  const rect = root.getBoundingClientRect();
  // Ensure overlay height covers all absolute cards
  let maxBottom = 0;
  for (const { node } of mounted.values()) {
    const top = parseFloat(node.style.top || '0');
    maxBottom = Math.max(maxBottom, top + node.offsetHeight);
  }
  const overlayHeight = Math.max(rect.height, maxBottom);
  // Create or update single overlay
  if (!gridOverlay) {
    gridOverlay = document.createElement('div');
    gridOverlay.className = 'grid-overlay';
    // Keep overlay behind cards visually or on top with pointer-events none
    root.prepend(gridOverlay);
  }
  //gridOverlay.style.width = `${Math.ceil(rect.width)}px`;
  //gridOverlay.style.height = `${Math.ceil(overlayHeight)}px`;
  gridOverlay.style.width = `100%`;
  gridOverlay.style.height = `100%`;
  gridOverlay.style.setProperty('--cell-size', `${cellSize}px`);
  console.log('[Bearbeiten] Grid Overlay', { cellSize, rect, overlayHeight });
}

function snap(v) { return Math.max(0, Math.round(v / cellSize) * cellSize); }

function rectsOverlap(a, b) {
  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}

function anyOverlap(target, ignoreId) {
  for (const [id, entry] of mounted.entries()) {
    if (id === ignoreId) continue;
    const node = entry.node;
    if (!node) continue;
    const r = node.getBoundingClientRect();
    if (rectsOverlap(target, r)) return true;
  }
  return false;
}

function ensureAbsoluteLayout(card) {
  const id = card.dataset.widget;
  // Preserve current visual position
  const rootRect = root.getBoundingClientRect();
  const r = card.getBoundingClientRect();
  const left = r.left - rootRect.left;
  const top = r.top - rootRect.top;
  const width = r.width;
  const height = r.height;
  const saved = initialLayout[id];
  const rectToUse = saved || { left, top, width, height };
  Object.assign(card.style, {
    left: `${rectToUse.left}px`,
    top: `${rectToUse.top}px`,
    width: `${rectToUse.width}px`,
    height: `${rectToUse.height}px`,
  });
}

function prepareCardForEdit(card) {
  const id = card.dataset.widget;
  console.log('[Bearbeiten] Karte vorbereiten', {
    id,
    left: parseFloat(card.style.left || '0'),
    top: parseFloat(card.style.top || '0'),
    width: parseFloat(card.style.width || `${card.offsetWidth}`),
    height: parseFloat(card.style.height || `${card.offsetHeight}`),
  });

  // Add resize handle
  let handle = card.querySelector('.resize-handle');
  if (!handle) {
    handle = document.createElement('div');
    handle.className = 'resize-handle';
    card.appendChild(handle);
  }

  // Dragging
  const onPointerDown = (ev) => {
    if (!editMode) return; // only active in edit mode
    if (ev.target === handle) return; // resize starts elsewhere
    card.classList.add('dragging');
    const startX = ev.clientX;
    const startY = ev.clientY;
    const startLeft = parseFloat(card.style.left || '0');
    const startTop = parseFloat(card.style.top || '0');
    const rootRect2 = root.getBoundingClientRect();
    const onMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = snap(startLeft + dx);
      let newTop = snap(startTop + dy);
      // Clamp to container
      newLeft = Math.min(newLeft, rootRect2.width - card.offsetWidth);
      newTop = Math.min(newTop, rootRect2.height - card.offsetHeight);
      const testRect = {
        left: rootRect2.left + newLeft,
        top: rootRect2.top + newTop,
        right: rootRect2.left + newLeft + card.offsetWidth,
        bottom: rootRect2.top + newTop + card.offsetHeight,
      };
      if (anyOverlap(testRect, id)) {
        card.classList.add('invalid');
        return;
      } else {
        card.classList.remove('invalid');
      }
      card.style.left = `${newLeft}px`;
      card.style.top = `${newTop}px`;
      console.log('[Bearbeiten] Drag', { id, left: newLeft, top: newTop });
    };
    const onUp = () => {
      card.classList.remove('dragging');
      card.classList.remove('invalid');
      layout.set(id, {
        left: parseFloat(card.style.left || '0'),
        top: parseFloat(card.style.top || '0'),
        width: card.offsetWidth,
        height: card.offsetHeight,
      });
      saveLayout();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  };
  // Ensure we don't attach duplicates
  const prev = handlerStore.get(card);
  if (prev && prev.dragDown) card.removeEventListener('pointerdown', prev.dragDown);
  card.addEventListener('pointerdown', onPointerDown);

  // Resizing via handle
  const onResizeDown = (ev) => {
    ev.stopPropagation();
    const startX = ev.clientX;
    const startY = ev.clientY;
    const startW = card.offsetWidth;
    const startH = card.offsetHeight;
    const startLeft = parseFloat(card.style.left || '0');
    const startTop = parseFloat(card.style.top || '0');
    const rootRect2 = root.getBoundingClientRect();
    const onMove = (e) => {
      let w = snap(startW + (e.clientX - startX));
      let h = snap(startH + (e.clientY - startY));
      w = Math.max(w, cellSize * 5); // minimum ~5 cells
      h = Math.max(h, cellSize * 5);
      w = Math.min(w, rootRect2.width - startLeft);
      h = Math.min(h, rootRect2.height - startTop);
      const testRect = {
        left: rootRect2.left + startLeft,
        top: rootRect2.top + startTop,
        right: rootRect2.left + startLeft + w,
        bottom: rootRect2.top + startTop + h,
      };
      if (anyOverlap(testRect, id)) {
        card.classList.add('invalid');
        return;
      } else {
        card.classList.remove('invalid');
      }
      card.style.width = `${w}px`;
      card.style.height = `${h}px`;
      console.log('[Bearbeiten] Resize', { id, width: w, height: h });
    };
    const onUp = () => {
      card.classList.remove('invalid');
      layout.set(id, {
        left: parseFloat(card.style.left || '0'),
        top: parseFloat(card.style.top || '0'),
        width: card.offsetWidth,
        height: card.offsetHeight,
      });
      saveLayout();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  };
  if (prev && prev.resizeDown) handle.removeEventListener('pointerdown', prev.resizeDown);
  handle.addEventListener('pointerdown', onResizeDown);
  handlerStore.set(card, { dragDown: onPointerDown, resizeDown: onResizeDown });
}

function removeEditInteractions(card) {
  const handlers = handlerStore.get(card);
  const handle = card.querySelector('.resize-handle');
  if (handlers) {
    card.removeEventListener('pointerdown', handlers.dragDown);
    if (handle) handle.removeEventListener('pointerdown', handlers.resizeDown);
    handlerStore.delete(card);
  }
  if (handle) handle.remove();
}

function enterEditMode() {
  if (!root) return;
  editMode = true;
  root.classList.add('edit-mode');
  console.log('[Bearbeiten] EIN', { cellSize });
  // Prepare all mounted cards
  for (const { node } of mounted.values()) {
    prepareCardForEdit(node);
  }
  buildGridOverlay();
}

function exitEditMode() {
  if (!root) return;
  editMode = false;
  root.classList.remove('edit-mode');
  console.log('[Bearbeiten] AUS');
  // Remove grid overlay
  if (gridOverlay) { try { gridOverlay.remove(); } catch {}; gridOverlay = null; }
  // Remove edit interactions, keep styles so appearance is identical
  for (const { node } of mounted.values()) {
    removeEditInteractions(node);
  }
}

// Wire the menu button
if (editToggleBtn) {
  editToggleBtn.addEventListener('click', () => {
    const next = !editMode;
    if (next) enterEditMode(); else exitEditMode();
    editToggleBtn.setAttribute('aria-pressed', String(next));
    editToggleBtn.textContent = next ? 'Bearbeiten (an)' : 'Bearbeiten';
    console.log('[Bearbeiten] Toggle', { aktiv: next });
  });
}
// Fallback: attach after DOM ready if not found initially
else {
  document.addEventListener('DOMContentLoaded', () => {
    const btn2 = document.getElementById('editToggle');
    console.log('[DriveDashboard] DOMContentLoaded: editToggle gefunden?', !!btn2);
    if (btn2) {
      btn2.addEventListener('click', () => {
        const next = !editMode;
        if (next) enterEditMode(); else exitEditMode();
        btn2.setAttribute('aria-pressed', String(next));
        btn2.textContent = next ? 'Bearbeiten (an)' : 'Bearbeiten';
        console.log('[Bearbeiten] Toggle', { aktiv: next });
      });
    }
  });
}

function updateRootHeight() {
  if (!root) return;
  if (editMode) buildGridOverlay();
}

window.addEventListener('resize', () => {
  if (editMode) {
    updateRootHeight();
    buildGridOverlay();
  }
});

