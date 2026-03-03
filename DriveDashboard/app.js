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

// Drag and drop reordering ------------------------------------------------
let dragId = null;
let touchDrag = {
  active: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  card: null,
  prevTouchAction: '',
};

function findCard(el) {
  return el && el.closest && el.closest('.card');
}

function reorderWithPointer(clientX, clientY) {
  const target = document.elementFromPoint(clientX, clientY);
  const targetCard = findCard(target);
  if (!targetCard || !targetCard.dataset.widget || targetCard.dataset.widget === dragId) return;
  const draggingEl = root.querySelector('.card.dragging');
  if (!draggingEl) return;
  const rect = targetCard.getBoundingClientRect();
  const after = (clientY - rect.top) > rect.height / 2;
  if (after) {
    root.insertBefore(draggingEl, targetCard.nextSibling);
  } else {
    root.insertBefore(draggingEl, targetCard);
  }
}

function handleDragStart(e) {
  const card = findCard(e.target);
  if (!card || !card.dataset.widget) return;
  dragId = card.dataset.widget;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragId);
  card.classList.add('dragging');
}

function handleDragOver(e) {
  if (!dragId) return;
  const targetCard = findCard(e.target);
  if (!targetCard || targetCard.dataset.widget === dragId) return;
  e.preventDefault();
  const draggingEl = root.querySelector('.card.dragging');
  if (!draggingEl) return;
  const rect = targetCard.getBoundingClientRect();
  const after = (e.clientY - rect.top) > rect.height / 2;
  if (after) {
    root.insertBefore(draggingEl, targetCard.nextSibling);
  } else {
    root.insertBefore(draggingEl, targetCard);
  }
}

function handleDrop(e) {
  if (!dragId) return;
  e.preventDefault();
  const draggingEl = root.querySelector('.card.dragging');
  if (draggingEl) draggingEl.classList.remove('dragging');
  const order = Array.from(root.children)
    .map((n) => n.dataset && n.dataset.widget)
    .filter(Boolean);
  saveOrder(order);
  dragId = null;
}

function handleDragEnd() {
  const draggingEl = root.querySelector('.card.dragging');
  if (draggingEl) draggingEl.classList.remove('dragging');
  dragId = null;
}

// Pointer-based reorder for touch (mobile browsers block HTML DnD)
function handlePointerDown(e) {
  const card = findCard(e.target);
  if (!card || !card.dataset.widget) return;
  if (e.pointerType !== 'touch') return;
  dragId = card.dataset.widget;
  e.preventDefault();
  touchDrag = {
    active: true,
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    card,
    prevTouchAction: card.style.touchAction,
  };
  card.style.touchAction = 'none';
  card.classList.add('dragging');
  try { card.setPointerCapture(e.pointerId); } catch {}
}

function handlePointerMove(e) {
  if (!touchDrag.active || touchDrag.pointerId !== e.pointerId) return;
  const dx = Math.abs(e.clientX - touchDrag.startX);
  const dy = Math.abs(e.clientY - touchDrag.startY);
  if (dx < 6 && dy < 6) return; // small movement: treat as scroll tap
  e.preventDefault();
  reorderWithPointer(e.clientX, e.clientY);
}

function finalizePointerDrag(e) {
  if (!touchDrag.active || touchDrag.pointerId !== e.pointerId) return;
  e.preventDefault();
  const draggingEl = root.querySelector('.card.dragging');
  if (draggingEl) draggingEl.classList.remove('dragging');
   if (touchDrag.card) {
    touchDrag.card.style.touchAction = touchDrag.prevTouchAction;
  }
  const order = Array.from(root.children)
    .map((n) => n.dataset && n.dataset.widget)
    .filter(Boolean);
  saveOrder(order);
  touchDrag = { active: false, pointerId: null, startX: 0, startY: 0, card: null, prevTouchAction: '' };
  dragId = null;
}

if (root) {
  root.addEventListener('dragstart', handleDragStart);
  root.addEventListener('dragover', handleDragOver);
  root.addEventListener('drop', handleDrop);
  root.addEventListener('dragend', handleDragEnd);

  // touch/pointer
  root.addEventListener('pointerdown', handlePointerDown);
  root.addEventListener('pointermove', handlePointerMove, { passive: false });
  root.addEventListener('pointerup', finalizePointerDrag);
  root.addEventListener('pointercancel', finalizePointerDrag);
  window.addEventListener('pointermove', handlePointerMove, { passive: false });
  window.addEventListener('pointerup', finalizePointerDrag);
  window.addEventListener('pointercancel', finalizePointerDrag);
}

// Expose a tiny API if needed elsewhere
window.DD2 = {
  refresh: renderSelection,
};
