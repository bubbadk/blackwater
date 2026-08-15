/* Visual effects: film grain, rain, flicker. Vignette + letterbox are CSS. */
(function (GS) {
  'use strict';
  class FilmGrain {
    constructor(canvas) { this.cv = canvas; this.ctx = canvas.getContext('2d'); this._timer = null; this._enabled = true; this._resize = this._resize.bind(this); }
    start() { this._resize(); this._render(); window.addEventListener('resize', this._resize); this._timer = setInterval(() => this._render(), 83); }
    _resize() { this.cv.width = Math.max(64, Math.round(window.innerWidth / 4)); this.cv.height = Math.max(64, Math.round(window.innerHeight / 4)); }
    _render() {
      if (!this._enabled) return;
      const img = this.ctx.createImageData(this.cv.width, this.cv.height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 256) | 0; d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255; }
      this.ctx.putImageData(img, 0, 0);
    }
    setEnabled(on) { this._enabled = on; this.cv.style.opacity = on ? '' : '0'; if (on) this._render(); }
    stop() { clearInterval(this._timer); window.removeEventListener('resize', this._resize); }
  }
  class Rain {
    constructor(canvas) { this.cv = canvas; this.ctx = canvas.getContext('2d'); this._drops = []; this._raf = null; this._running = false; this._enabled = true; this._resize = this._resize.bind(this); }
    start(density) { this._density = density || 160; this._resize(); window.addEventListener('resize', this._resize); this._running = true; this._raf = requestAnimationFrame((t) => this._loop(t)); }
    _resize() {
      this.cv.width = this.cv.clientWidth || window.innerWidth;
      this.cv.height = this.cv.clientHeight || window.innerHeight;
      const n = this._density || 160; this._drops = [];
      for (let i = 0; i < n; i++) { this._drops.push({ x: Math.random() * this.cv.width, y: Math.random() * this.cv.height, len: 6 + Math.random() * 14, speed: 5 + Math.random() * 9, wind: -0.4 + Math.random() * 1.2 }); }
    }
    _loop() { if (!this._running) return; if (this._enabled) this._draw(); this._raf = requestAnimationFrame(() => this._loop()); }
    _draw() {
      const ctx = this.ctx; const w = this.cv.width; const h = this.cv.height;
      ctx.clearRect(0, 0, w, h); ctx.strokeStyle = 'rgba(150, 170, 195, 0.28)'; ctx.lineWidth = 1; ctx.beginPath();
      for (const d of this._drops) { d.y += d.speed; d.x += d.wind; if (d.y > h + 20) { d.y = -20; d.x = Math.random() * w; } if (d.x > w + 20) d.x = -20; if (d.x < -20) d.x = w + 20; ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.wind * 2, d.y - d.len); }
      ctx.stroke();
    }
    setEnabled(on) { this._enabled = on; this.cv.style.opacity = on ? '' : '0'; }
    stop() { this._running = false; cancelAnimationFrame(this._raf); window.removeEventListener('resize', this._resize); }
  }
  function flicker(el, opts) {
    opts = opts || {};
    const base = opts.baseOpacity != null ? opts.baseOpacity : 1;
    const duration = opts.duration || 700;
    const intensity = opts.intensity != null ? opts.intensity : 0.5;
    const orig = el.style.opacity; const start = performance.now(); let raf = null;
    function tick(now) {
      const p = (now - start) / duration;
      if (p >= 1) { el.style.opacity = orig || String(base); if (opts.done) opts.done(); return; }
      const f = Math.random() < 0.5 ? 1 - Math.random() * intensity : 1;
      el.style.opacity = String(base * f);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return { cancel() { cancelAnimationFrame(raf); el.style.opacity = orig || String(base); } };
  }
  GS.FX = {
    grain: null, rain: null, flicker,
    init() { const grainCv = document.getElementById('grain'); const rainCv = document.querySelector('.rain-layer'); if (grainCv) { this.grain = new FilmGrain(grainCv); this.grain.start(); } if (rainCv) { this.rain = new Rain(rainCv); this.rain.start(); } return this; },
  };
})(window.GameShell = window.GameShell || {});
