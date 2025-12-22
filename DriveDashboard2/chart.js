// Minimal line chart on <canvas>, similar to GSensor style
export class LineChart {
  constructor({ color = '#38bdf8', maxSeconds = 180, lineWidth = 2 } = {}) {
    this.color = color;
    this.maxSeconds = maxSeconds;
    this.lineWidth = lineWidth;
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
    if (!this.ctx || this.values.length < 2) {
      if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }
    const ctx = this.ctx;
    const w = this.canvas.clientWidth;
    const h = this.heightCss;
    ctx.clearRect(0, 0, w, h);

    const minVal = Math.min(...this.values);
    const maxVal = Math.max(...this.values);
    const span = maxVal - minVal || 1;

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    this.values.forEach((v, i) => {
      const x = (i / (this.values.length - 1)) * w;
      const y = h - ((v - minVal) / span) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}
