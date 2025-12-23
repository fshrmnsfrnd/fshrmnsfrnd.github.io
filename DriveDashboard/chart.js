// Minimal line chart on <canvas>, similar to GSensor style
export class LineChart {
  constructor({
    color = '#38bdf8',
    maxSeconds = 180,
    lineWidth = 2,
    showYAxis = true,
    yTickCount = 4,
    yAxisWidth = 28,
    gridColor = '#24242a',
    axisColor = '#24242a',
    tickColor = '#a6a6ad',
    font = '10px system-ui',
    enablePopupOnClick = true,
    popupHeightCss = 300,
    historySeconds = 3600,
  } = {}) {
    this.color = color;
    this.maxSeconds = maxSeconds;
    this.defaultMaxSeconds = maxSeconds;
    this.lineWidth = lineWidth;
    this.showYAxis = showYAxis;
    this.yTickCount = yTickCount;
    this.yAxisWidth = yAxisWidth; // minimum left area reserved for labels
    this.gridColor = gridColor;
    this.axisColor = axisColor;
    this.tickColor = tickColor;
    this.font = font;
    this.labelPadding = 4; // gap between labels and axis line
    this.axisGap = 2; // minimal gap from canvas edge if labels are very short
    this.enablePopupOnClick = enablePopupOnClick;
    this.popupHeightCss = popupHeightCss;
    this.historySeconds = historySeconds;

    this.values = [];
    this.times = [];
    this.canvas = null;
    this.ctx = null;
    this.heightCss = 140; // px
    this._onResize = this._onResize.bind(this);
    this._onClick = null;
    this._originalCanvas = null;
    this._originalHeightCss = this.heightCss;
  }

  attach(canvas) {
    // Clean up previous bindings if reattaching
    if (this.canvas) {
      window.removeEventListener('resize', this._onResize);
      if (this._onClick) {
        try { this.canvas.removeEventListener('click', this._onClick); } catch {}
      }
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._fitCanvas();
    window.addEventListener('resize', this._onResize);
    // Enable popup click if configured and not inside popup
    if (this.enablePopupOnClick && !this._inPopup) {
      if (!this._onClick) this._onClick = () => this._openPopup();
      try { this.canvas.style.cursor = 'zoom-in'; } catch {}
      this.canvas.addEventListener('click', this._onClick);
    }
    this.draw();
    // If attached before element is in the DOM, width may be 0.
    // Schedule a re-fit and redraw on the next frame to ensure proper sizing.
    try { requestAnimationFrame(() => { this._fitCanvas(); this.draw(); }); } catch {}
  }

  detach() {
    window.removeEventListener('resize', this._onResize);
    if (this.canvas && this._onClick) {
      this.canvas.removeEventListener('click', this._onClick);
    }
    this.canvas = null;
    this.ctx = null;
  }

  push(value) {
    const now = Date.now();
    this.values.push(Number(value) || 0);
    this.times.push(now);
    // Trim by history window (retain independent of view window)
    const cutoff = now - this.historySeconds * 1000;
    while (this.times.length && this.times[0] < cutoff) {
      this.times.shift();
      this.values.shift();
    }
    this.draw();
  }

  _onResize() {
    this._fitCanvas();
    this.draw();
  }

  _fitCanvas() {
    if (!this.canvas) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    // Ensure CSS sizing
    if (!this.canvas.classList.contains('chart-modal-canvas')) {
      this.canvas.style.width = '100%';
    }
    this.canvas.style.height = this.heightCss + 'px';
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(this.heightCss * dpr));
    if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const rectNow = this.canvas.getBoundingClientRect();
    const w = Math.max(1, rectNow.width);
    const h = this.heightCss;
    ctx.clearRect(0, 0, w, h);

    // Compute scale bounds
    const hasData = this.values.length >= 1;

    // Determine the visible window based on maxSeconds
    let startIdx = 0;
    if (hasData && this.maxSeconds != null) {
      const cutoff = Date.now() - this.maxSeconds * 1000;
      let i = 0;
      const n = this.times.length;
      while (i < n && this.times[i] < cutoff) i++;
      startIdx = i;
    }
    const vis = hasData ? this.values.slice(startIdx) : [];
    const dataMin = vis.length ? Math.min(...vis) : 0;
    const dataMax = vis.length ? Math.max(...vis) : 1;
    const { minY, maxY, step, ticks } = this._computeScale(dataMin, dataMax);

    // Prepare labels and compute dynamic left space based on label width
    ctx.font = this.font;
    const labels = ticks.map((t) => this._formatTick(t, step));
    const maxLabelWidth = this.showYAxis && labels.length
      ? Math.max(...labels.map((s) => ctx.measureText(s).width))
      : 0;

    // Plot area
    const left = this.showYAxis
      ? Math.ceil(Math.max(this.yAxisWidth, maxLabelWidth + this.axisGap + this.labelPadding))
      : 0;
    const right = 4;
    const top = 4;
    const bottom = 4;
    const pw = Math.max(1, w - left - right);
    const ph = Math.max(1, h - top - bottom);

    // Draw grid + axis + labels
    if (this.showYAxis) {
      ctx.save();
      ctx.strokeStyle = this.gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ticks.forEach((t) => {
        const y = top + ph - ((t - minY) / (maxY - minY)) * ph;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(left + pw, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Y axis line
      ctx.strokeStyle = this.axisColor;
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left, top + ph);
      ctx.stroke();

      // Labels
      ctx.fillStyle = this.tickColor;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ticks.forEach((t, i) => {
        const y = top + ph - ((t - minY) / (maxY - minY)) * ph;
        ctx.fillText(labels[i], left - this.labelPadding, y);
      });
      ctx.restore();
    }

    // Draw the line if we have at least 2 points
    if (vis.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;
      const n = vis.length;
      vis.forEach((v, i) => {
        const x = left + (i / (n - 1)) * pw;
        const y = top + ph - ((v - minY) / (maxY - minY)) * ph;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }

  _formatTick(v, step) {
    const absStep = Math.abs(step);
    let decimals = 0;
    if (absStep < 1) {
      if (absStep >= 0.1) decimals = 1;
      else if (absStep >= 0.01) decimals = 2;
      else decimals = 3;
    }
    return Number(v.toFixed(decimals)).toString();
  }

  _niceNumber(range, round) {
    // Based on Graphics Gems nice number
    const exponent = Math.floor(Math.log10(range));
    const fraction = range / Math.pow(10, exponent);
    let niceFraction;
    if (round) {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    } else {
      if (fraction <= 1) niceFraction = 1;
      else if (fraction <= 2) niceFraction = 2;
      else if (fraction <= 5) niceFraction = 5;
      else niceFraction = 10;
    }
    return niceFraction * Math.pow(10, exponent);
  }

  _computeScale(minVal, maxVal) {
    let range = maxVal - minVal;
    if (range === 0) {
      // Expand symmetrical around the value
      const pad = Math.max(1, Math.abs(maxVal || 1) * 0.1);
      minVal -= pad;
      maxVal += pad;
      range = maxVal - minVal;
    }
    const niceRange = this._niceNumber(range, false);
    const step = this._niceNumber(niceRange / this.yTickCount, true);
    const minY = Math.floor(minVal / step) * step;
    const maxY = Math.ceil(maxVal / step) * step;
    const ticks = [];
    for (let v = minY; v <= maxY + step * 0.5; v += step) {
      ticks.push(Number(v.toFixed(6))); // avoid FP drift
    }
    return { minY, maxY, step, ticks };
  }

  _openPopup() {
    // If already in popup (no original recorded), record original first
    if (!this._originalCanvas) {
      this._originalCanvas = this.canvas;
      this._originalHeightCss = this.heightCss;
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'chart-modal-overlay';
    const modal = document.createElement('div');
    modal.className = 'chart-modal-content';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'chart-modal-close';
    closeBtn.textContent = '×';
    const bigCanvas = document.createElement('canvas');
    bigCanvas.className = 'chart-modal-canvas';
    modal.appendChild(closeBtn);
    modal.appendChild(bigCanvas);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Reattach chart to big canvas with larger height; disable nested popup
    this.heightCss = this.popupHeightCss;
    // Override view window in popup to default, and restore later
    this._originalMaxSeconds = this.maxSeconds;
    this.maxSeconds = this.defaultMaxSeconds;
    this._inPopup = true;
    this.attach(bigCanvas);
    // Ensure layout computed before drawing
    try { requestAnimationFrame(() => { this._fitCanvas(); this.draw(); }); } catch {}

    const cleanup = () => {
      // Restore to original canvas
      this.heightCss = this._originalHeightCss;
      this._inPopup = false;
      if (typeof this._originalMaxSeconds === 'number') {
        this.maxSeconds = this._originalMaxSeconds;
        this._originalMaxSeconds = null;
      }
      if (this._originalCanvas) this.attach(this._originalCanvas);
      this._originalCanvas = null;
      try { document.body.removeChild(overlay); } catch {}
    };

    const onOverlayClick = (e) => {
      if (e.target === overlay) cleanup();
    };
    overlay.addEventListener('click', onOverlayClick);
    closeBtn.addEventListener('click', cleanup);
    // Escape key to close
    const onKey = (e) => { if (e.key === 'Escape') { cleanup(); window.removeEventListener('keydown', onKey); } };
    window.addEventListener('keydown', onKey);
  }
}
