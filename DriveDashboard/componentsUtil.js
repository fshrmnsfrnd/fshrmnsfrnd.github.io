export function createCard(title) {
  const el = document.createElement('section');
  el.className = 'card';
  el.innerHTML = `
    <header class="card-title">
    <span class="card-title-text">${title}</span>
    <button class="card-settings" aria-label="Einstellungen" title="Einstellungen">⚙</button>
    <div class="card-settings-menu" hidden></div>
    </header>
    <div class="card-body">
      <div class="value"></div>
    </div>`;
  const value = el.querySelector('.value');
  const header = el.querySelector('.card-title');
  const btn = el.querySelector('.card-settings');
  const menu = el.querySelector('.card-settings-menu');
  const body = el.querySelector('.card-body');
  // Optional unit/subtext element
  const sub = document.createElement('div');
  sub.className = 'sub';
  sub.textContent = '';
  body.appendChild(sub);
  let outsideHandler = null;

  function closeMenu() {
    if (!menu) return;
    menu.hidden = true;
    header.classList.remove('settings-open');
    if (outsideHandler) {
      document.removeEventListener('click', outsideHandler, true);
      outsideHandler = null;
    }
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.hidden) {
      menu.hidden = false;
      header.classList.add('settings-open');
      // Position menu within header right
      if (!outsideHandler) {
        outsideHandler = (ev) => {
          if (!menu.contains(ev.target) && ev.target !== btn) closeMenu();
        };
        document.addEventListener('click', outsideHandler, true);
      }
    } else {
      closeMenu();
    }
  });

  function setMenuItems(items = []) {
    if (!menu) return;
    menu.innerHTML = '';
    if (!items.length) {
      const it = document.createElement('div');
      it.className = 'settings-item disabled';
      it.textContent = 'Keine Einstellungen';
      menu.appendChild(it);
      return;
    }
    items.forEach((item) => {
      if (item.type === 'separator') {
        const hr = document.createElement('div');
        hr.className = 'settings-sep';
        menu.appendChild(hr);
        return;
      }
      if (item.type === 'range') {
        const row = document.createElement('label');
        row.className = 'settings-row';
        const span = document.createElement('span');
        span.textContent = item.label || '';
        const valueSpan = document.createElement('i');
        valueSpan.className = 'settings-value';
        const input = document.createElement('input');
        input.type = 'range';
        if (item.min != null) input.min = String(item.min);
        if (item.max != null) input.max = String(item.max);
        if (item.step != null) input.step = String(item.step);
        const current = typeof item.get === 'function' ? item.get() : item.value;
        if (current != null) input.value = String(current);
        valueSpan.textContent = String(input.value);
        input.addEventListener('input', () => {
          valueSpan.textContent = input.value;
          if (typeof item.onChange === 'function') item.onChange(Number(input.value));
        });
        row.appendChild(span);
        row.appendChild(valueSpan);
        row.appendChild(input);
        menu.appendChild(row);
        return;
      }
      // default action item
      const btn = document.createElement('button');
      btn.className = 'settings-item';
      btn.textContent = item.label || 'Aktion';
      if (item.disabled) btn.disabled = true;
      btn.addEventListener('click', () => {
        if (typeof item.onClick === 'function') item.onClick();
        closeMenu();
      });
      menu.appendChild(btn);
    });
  }

  return {
    el,
    setValue: (v) => (value.textContent = v),
    setSub: (txt) => { sub.textContent = txt || ''; },
    setSettings: setMenuItems,
    closeSettings: closeMenu,
  };
}

export function startTicker(fn, ms = 1000) {
  const id = setInterval(fn, ms);
  return () => clearInterval(id);
}

export function formatNumber(n, digits = 0) {
  return Number(n).toFixed(digits);
}

export function attachSettingsToExistingCard(cardEl, items = []) {
  const header = cardEl.querySelector('.card-title');
  if (!header) return;
  let btn = header.querySelector('.card-settings');
  let menu = header.querySelector('.card-settings-menu');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'card-settings';
    btn.setAttribute('aria-label', 'Einstellungen');
    btn.title = 'Einstellungen';
    btn.textContent = '⚙';
    header.appendChild(btn);
  }
  if (!menu) {
    menu = document.createElement('div');
    menu.className = 'card-settings-menu';
    menu.hidden = true;
    header.appendChild(menu);
  }
  function setItems(list) {
    menu.innerHTML = '';
    if (!list.length) {
      const it = document.createElement('div');
      it.className = 'settings-item disabled';
      it.textContent = 'Keine Einstellungen';
      menu.appendChild(it);
    } else {
      list.forEach((item) => {
        if (item.type === 'separator') {
          const hr = document.createElement('div');
          hr.className = 'settings-sep';
          menu.appendChild(hr);
          return;
        }
        if (item.type === 'range') {
          const row = document.createElement('label');
          row.className = 'settings-row';
          const span = document.createElement('span');
          span.textContent = item.label || '';
          const valueSpan = document.createElement('i');
          valueSpan.className = 'settings-value';
          const input = document.createElement('input');
          input.type = 'range';
          if (item.min != null) input.min = String(item.min);
          if (item.max != null) input.max = String(item.max);
          if (item.step != null) input.step = String(item.step);
          const current = typeof item.get === 'function' ? item.get() : item.value;
          if (current != null) input.value = String(current);
          valueSpan.textContent = String(input.value);
          input.addEventListener('input', () => {
            valueSpan.textContent = input.value;
            if (typeof item.onChange === 'function') item.onChange(Number(input.value));
          });
          row.appendChild(span);
          row.appendChild(valueSpan);
          row.appendChild(input);
          menu.appendChild(row);
          return;
        }
        const b = document.createElement('button');
        b.className = 'settings-item';
        b.textContent = item.label || 'Aktion';
        if (item.disabled) b.disabled = true;
        b.addEventListener('click', () => {
          if (typeof item.onClick === 'function') item.onClick();
          menu.hidden = true;
        });
        menu.appendChild(b);
      });
    }
  }
  setItems(items);
  let outsideHandler = null;
  const closeMenu = () => {
    menu.hidden = true;
    header.classList.remove('settings-open');
    if (outsideHandler) {
      document.removeEventListener('click', outsideHandler, true);
      outsideHandler = null;
    }
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.hidden) {
      menu.hidden = false;
      header.classList.add('settings-open');
      if (!outsideHandler) {
        outsideHandler = (ev) => {
          if (!menu.contains(ev.target) && ev.target !== btn) closeMenu();
        };
        document.addEventListener('click', outsideHandler, true);
      }
    } else {
      closeMenu();
    }
  });
  return { setItems, closeMenu };
}
