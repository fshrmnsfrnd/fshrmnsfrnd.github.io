// Minimal line chart on <canvas>, similar to GSensor style
export class LineChart {
  constructor({
    color = '#38bdf8',
    maxSeconds = 180,
    lineWidth = 2,
    showYAxis = true,
    yTickCount = 4,
    yAxisWidth = 40,
    gridColor = '#24242a',
    axisColor = '#24242a',
    tickColor = '#a6a6ad',
    font = '10px system-ui',
  } = {}) {
    this.color = color;
    this.maxSeconds = maxSeconds;
    this.lineWidth = lineWidth;
    this.showYAxis = showYAxis;
    this.yTickCount = yTickCount;
    this.yAxisWidth = yAxisWidth; // left padding reserved for labels
    this.gridColor = gridColor;
    this.axisColor = axisColor;
    this.tickColor = tickColor;
    this.font = font;

    this.values = [];
    this.times = [];
    this.canvas = null;
    this.ctx = null;
    this.heightCss = 140; // px
    this._onResize = this._onResize.bind(this);
  }

  attach(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._fitCanvas();
    window.addEventListener('resize', this._onResize);
    this.draw();
  }

  detach() {
    window.removeEventListener('resize', this._onResize);
    this.canvas = null;
    this.ctx = null;
  }

  push(value) {
    const now = Date.now();
    this.values.push(Number(value) || 0);
    this.times.push(now);
    // Trim by time window
    const cutoff = now - this.maxSeconds * 1000;
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
    this.canvas.style.width = '100%';
    this.canvas.style.height = this.heightCss + 'px';
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(this.heightCss * dpr));
    if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.clientWidth;
    const h = this.heightCss;
    ctx.clearRect(0, 0, w, h);

    // Compute scale bounds
    const hasData = this.values.length >= 1;
    const dataMin = hasData ? Math.min(...this.values) : 0;
    const dataMax = hasData ? Math.max(...this.values) : 1;
    const { minY, maxY, step, ticks } = this._computeScale(dataMin, dataMax);

    // Plot area
    const left = this.showYAxis ? this.yAxisWidth : 0;
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
      ctx.font = this.font;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ticks.forEach((t) => {
        const y = top + ph - ((t - minY) / (maxY - minY)) * ph;
        ctx.fillText(this._formatTick(t, step), left - 6, y);
      });
      ctx.restore();
    }

    // Draw the line if we have at least 2 points
    if (this.values.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;
      const n = this.values.length;
      this.values.forEach((v, i) => {
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
}
