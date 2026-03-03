/**
 * Abstrakte Basisklasse für alle Dashboard-Cards.
 * Stellt das gemeinsame Card-Shell-HTML, Settings-Menü und Click-Handler bereit.
 */
export class Card {
    constructor(title, cssClass = 'card', menuItems = []) {
        var _a;
        this.cardElement = document.createElement('section');
        this.clickHandlers = [];
        this.cardElement.className = cssClass;
        this.cardElement.innerHTML = `
      <header class="card-title">
        <span class="card-title-text">${title}</span>
        <button class="card-settings" aria-label="Einstellungen" title="Einstellungen">⚙</button>
        <div class="card-settings-menu" hidden></div>
      </header>
      <div class="card-body"></div>`;
        this.header = this.cardElement.querySelector('.card-title');
        this.settingsBtn = this.cardElement.querySelector('.card-settings');
        this.menu = this.cardElement.querySelector('.card-settings-menu');
        this.body = this.cardElement.querySelector('.card-body');
        (_a = this.settingsBtn) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
            var _a, _b;
            e.stopPropagation();
            if ((_a = this.menu) === null || _a === void 0 ? void 0 : _a.hidden) {
                this.menu.removeAttribute('hidden');
                (_b = this.header) === null || _b === void 0 ? void 0 : _b.classList.add('settings-open');
                if (!this.outsideHandler) {
                    this.outsideHandler = (ev) => {
                        var _a;
                        if (!((_a = this.menu) === null || _a === void 0 ? void 0 : _a.contains(ev.target)) && ev.target !== this.settingsBtn)
                            this.closeMenu();
                    };
                    document.addEventListener('click', this.outsideHandler, true);
                }
            }
            else {
                this.closeMenu();
            }
        });
        // Click listener für die gesamte Card
        this.cardElement.addEventListener('click', (e) => {
            var _a, _b;
            if (e.target === this.settingsBtn || ((_a = this.settingsBtn) === null || _a === void 0 ? void 0 : _a.contains(e.target)) ||
                e.target === this.menu || ((_b = this.menu) === null || _b === void 0 ? void 0 : _b.contains(e.target))) {
                return;
            }
            this.clickHandlers.forEach(handler => {
                if (typeof handler === 'function')
                    handler(e);
            });
        });
        this.setMenuItems(menuItems);
    }
    closeMenu() {
        var _a, _b;
        if (!this.menu)
            return;
        (_a = this.menu) === null || _a === void 0 ? void 0 : _a.setAttribute('hidden', '');
        (_b = this.header) === null || _b === void 0 ? void 0 : _b.classList.remove('settings-open');
        if (this.outsideHandler) {
            document.removeEventListener('click', this.outsideHandler, true);
            this.outsideHandler = null;
        }
    }
    setMenuItems(items) {
        if (!this.menu)
            return;
        this.menu.innerHTML = '';
        if (!items.length) {
            const it = document.createElement('div');
            it.className = 'settings-item disabled';
            it.textContent = 'Keine Einstellungen';
            this.menu.appendChild(it);
            return;
        }
        items.forEach((item) => {
            var _a, _b, _c;
            if (item.type === 'separator') {
                const hr = document.createElement('div');
                hr.className = 'settings-sep';
                (_a = this.menu) === null || _a === void 0 ? void 0 : _a.appendChild(hr);
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
                if (item.min != null)
                    input.min = String(item.min);
                if (item.max != null)
                    input.max = String(item.max);
                if (item.step != null)
                    input.step = String(item.step);
                const current = typeof item.get === 'function' ? item.get() : item.value;
                if (current != null)
                    input.value = String(current);
                valueSpan.textContent = String(input.value);
                input.addEventListener('input', () => {
                    valueSpan.textContent = input.value;
                    if (typeof item.onChange === 'function')
                        item.onChange(Number(input.value));
                });
                row.appendChild(span);
                row.appendChild(valueSpan);
                row.appendChild(input);
                (_b = this.menu) === null || _b === void 0 ? void 0 : _b.appendChild(row);
                return;
            }
            // default action item
            const btn = document.createElement('button');
            btn.className = 'settings-item';
            btn.textContent = item.label || 'Aktion';
            if (item.disabled)
                btn.disabled = true;
            btn.addEventListener('click', () => {
                if (typeof item.onClick === 'function')
                    item.onClick();
                this.closeMenu();
            });
            (_c = this.menu) === null || _c === void 0 ? void 0 : _c.appendChild(btn);
        });
    }
    addCardClickHandler(handler) {
        if (typeof handler === 'function') {
            this.clickHandlers.push(handler);
        }
    }
}
/**
 * Card die einen einzelnen Wert (Zahl) und optional eine Einheit anzeigt.
 */
export class ValueCard extends Card {
    constructor(title, value = "", unit = "", menuItems = []) {
        var _a, _b;
        super(title, 'card', menuItems);
        this.valueEl = null;
        this.unitEl = null;
        if (value !== '') {
            const valueDiv = document.createElement('div');
            valueDiv.className = 'value';
            valueDiv.innerText = value;
            (_a = this.body) === null || _a === void 0 ? void 0 : _a.appendChild(valueDiv);
            this.valueEl = valueDiv;
        }
        if (unit !== '') {
            const unitDiv = document.createElement('div');
            unitDiv.className = 'sub';
            unitDiv.innerText = unit;
            (_b = this.body) === null || _b === void 0 ? void 0 : _b.appendChild(unitDiv);
            this.unitEl = unitDiv;
        }
    }
    setValue(value) {
        var _a;
        if (!this.valueEl) {
            const valueDiv = document.createElement('div');
            valueDiv.className = 'value';
            (_a = this.body) === null || _a === void 0 ? void 0 : _a.insertBefore(valueDiv, this.unitEl);
            this.valueEl = valueDiv;
        }
        this.valueEl.textContent = value;
    }
    setSub(text) {
        var _a;
        if (!this.unitEl) {
            const unitDiv = document.createElement('div');
            unitDiv.className = 'sub';
            (_a = this.body) === null || _a === void 0 ? void 0 : _a.appendChild(unitDiv);
            this.unitEl = unitDiv;
        }
        this.unitEl.textContent = text || '';
    }
}
/**
 * Card die einen LineChart-Graphen auf einem Canvas darstellt.
 */
export class GraphCard extends Card {
    constructor(title, chart, menuItems = []) {
        var _a, _b;
        super(title, 'card graph-card', menuItems);
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'chart';
        this.canvas.setAttribute('aria-label', `${title} graph`);
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.appendChild(this.canvas);
        this.placeholder = document.createElement('div');
        this.placeholder.className = 'placeholder';
        this.placeholder.textContent = '---';
        (_b = this.body) === null || _b === void 0 ? void 0 : _b.appendChild(this.placeholder);
        this.chart = chart;
        if (this.chart && typeof this.chart.attach === 'function') {
            this.chart.attach(this.canvas);
        }
    }
    removePlaceholder() {
        try {
            this.placeholder.remove();
        }
        catch (_a) { }
    }
    push(value) {
        if (this.chart && typeof this.chart.push === 'function') {
            this.chart.push(value);
        }
    }
    detachChart() {
        if (this.chart && typeof this.chart.detach === 'function') {
            this.chart.detach();
        }
    }
}
/**
 * Generische Card für spezielle Inhalte (z.B. Neigung kombiniert, Nadel-Gauge).
 * Der Body-Inhalt wird per bodyHTML übergeben.
 */
export class CustomCard extends Card {
    constructor(title, bodyHTML = '', cssClass = 'card', menuItems = []) {
        super(title, cssClass, menuItems);
        if (bodyHTML && this.body) {
            this.body.innerHTML = bodyHTML;
        }
    }
}
