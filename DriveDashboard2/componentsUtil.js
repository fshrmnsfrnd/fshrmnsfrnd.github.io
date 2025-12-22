export function createCard(title) {
  const el = document.createElement('section');
  el.className = 'card';
  el.innerHTML = `
    <header class="card-title">${title}</header>
    <div class="card-body">
      <div class="value"></div>
      <div class="sub"></div>
    </div>`;
  const value = el.querySelector('.value');
  const sub = el.querySelector('.sub');
  return {
    el,
    setValue: (v) => (value.textContent = v),
    setSub: (s) => (sub.textContent = s || ''),
  };
}

export function startTicker(fn, ms = 1000) {
  const id = setInterval(fn, ms);
  return () => clearInterval(id);
}

export function formatNumber(n, digits = 0) {
  return Number(n).toFixed(digits);
}
