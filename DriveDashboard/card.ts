/**
 * Abstrakte Basisklasse für alle Dashboard-Cards.
 * Stellt das gemeinsame Card-Shell-HTML, Settings-Menü und Click-Handler bereit.
 */
export abstract class Card {
    cardElement: HTMLElement = document.createElement('section');
    header: Element | null;
    settingsBtn: Element | null;
    menu: HTMLElement | null;
    body: Element | null;
    clickHandlers: Array<Function> = [];
    outsideHandler: any;

    protected constructor(title: string, cssClass: string = 'card', menuItems: Array<any> = []) {
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

        this.settingsBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.menu?.hidden) {
                this.menu.removeAttribute('hidden')
                this.header?.classList.add('settings-open');
                if (!this.outsideHandler) {
                    this.outsideHandler = (ev: any) => {
                        if (!this.menu?.contains(ev.target) && ev.target !== this.settingsBtn) this.closeMenu();
                    };
                    document.addEventListener('click', this.outsideHandler, true);
                }
            } else { this.closeMenu(); }
        });

        // Click listener für die gesamte Card
        this.cardElement.addEventListener('click', (e) => {
            if (e.target === this.settingsBtn || this.settingsBtn?.contains(e.target as Node) ||
                e.target === this.menu || this.menu?.contains(e.target as Node)) {
                return;
            }
            this.clickHandlers.forEach(handler => {
                if (typeof handler === 'function') handler(e);
            });
        });

        this.setMenuItems(menuItems);
    }

    private closeMenu() {
        if (!this.menu) return;
        this.menu?.setAttribute('hidden', '');
        this.header?.classList.remove('settings-open');
        if (this.outsideHandler) {
            document.removeEventListener('click', this.outsideHandler, true);
            this.outsideHandler = null;
        }
    }

    public setMenuItems(items: Array<any>) {
        if (!this.menu) return;
        this.menu.innerHTML = '';
        if (!items.length) {
            const it = document.createElement('div');
            it.className = 'settings-item disabled';
            it.textContent = 'Keine Einstellungen';
            this.menu.appendChild(it);
            return;
        }
        items.forEach((item) => {
            if (item.type === 'separator') {
                const hr = document.createElement('div');
                hr.className = 'settings-sep';
                this.menu?.appendChild(hr);
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
                this.menu?.appendChild(row);
                return;
            }
            // default action item
            const btn = document.createElement('button');
            btn.className = 'settings-item';
            btn.textContent = item.label || 'Aktion';
            if (item.disabled) btn.disabled = true;
            btn.addEventListener('click', () => {
                if (typeof item.onClick === 'function') item.onClick();
                this.closeMenu();
            });
            this.menu?.appendChild(btn);
        });
    }

    public addCardClickHandler(handler: Function) {
        if (typeof handler === 'function') {
            this.clickHandlers.push(handler);
        }
    }
}

/**
 * Card die einen einzelnen Wert (Zahl) und optional eine Einheit anzeigt.
 */
export class ValueCard extends Card {
    valueEl: Element | null = null;
    unitEl: Element | null = null;

    public constructor(title: string, value: string = "", unit: string = "", menuItems: Array<any> = []) {
        super(title, 'card', menuItems);
        if (value !== '') {
            const valueDiv: HTMLElement = document.createElement('div');
            valueDiv.className = 'value';
            valueDiv.innerText = value;
            this.body?.appendChild(valueDiv);
            this.valueEl = valueDiv;
        }
        if (unit !== '') {
            const unitDiv: HTMLElement = document.createElement('div');
            unitDiv.className = 'sub';
            unitDiv.innerText = unit;
            this.body?.appendChild(unitDiv);
            this.unitEl = unitDiv;
        }
    }

    public setValue(value: string) {
        if (!this.valueEl) {
            const valueDiv: HTMLElement = document.createElement('div');
            valueDiv.className = 'value';
            this.body?.insertBefore(valueDiv, this.unitEl);
            this.valueEl = valueDiv;
        }
        this.valueEl!.textContent = value;
    }

    public setSub(text: string) {
        if (!this.unitEl) {
            const unitDiv: HTMLElement = document.createElement('div');
            unitDiv.className = 'sub';
            this.body?.appendChild(unitDiv);
            this.unitEl = unitDiv;
        }
        this.unitEl!.textContent = text || '';
    }
}

/**
 * Card die einen LineChart-Graphen auf einem Canvas darstellt.
 */
export class GraphCard extends Card {
    canvas: HTMLCanvasElement;
    chart: any;
    placeholder: HTMLElement;

    public constructor(title: string, chart: any, menuItems: Array<any> = []) {
        super(title, 'card graph-card', menuItems);
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'chart';
        this.canvas.setAttribute('aria-label', `${title} graph`);
        this.body?.appendChild(this.canvas);

        this.placeholder = document.createElement('div');
        this.placeholder.className = 'placeholder';
        this.placeholder.textContent = '---';
        this.body?.appendChild(this.placeholder);

        this.chart = chart;
        if (this.chart && typeof this.chart.attach === 'function') {
            this.chart.attach(this.canvas);
        }
    }

    public removePlaceholder() {
        try { this.placeholder.remove(); } catch {}
    }

    public push(value: number) {
        if (this.chart && typeof this.chart.push === 'function') {
            this.chart.push(value);
        }
    }

    public detachChart() {
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
    public constructor(title: string, bodyHTML: string = '', cssClass: string = 'card', menuItems: Array<any> = []) {
        super(title, cssClass, menuItems);
        if (bodyHTML && this.body) {
            this.body.innerHTML = bodyHTML;
        }
    }
}