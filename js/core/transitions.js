/* Scene transitions: fade, dissolve, flicker. The overlay is #transition-overlay. */
(function (GS) {
  'use strict';
  const overlay = () => document.getElementById('transition-overlay');
  const dissolveCv = () => document.getElementById('dissolve-canvas');
  const EASE_IN = 'cubic-bezier(0.55, 0, 1, 0.45)';
  const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
  function cover(opts) {
    opts = opts || {};
    const el = overlay(); const dur = opts.duration != null ? opts.duration : 320;
    return new Promise((resolve) => { el.classList.remove('no-anim'); el.style.background = '#000'; el.style.transition = 'opacity ' + dur + 'ms ' + EASE_IN; el.style.opacity = '1'; setTimeout(resolve, dur + 20); });
  }
  function revealFade(opts) {
    opts = opts || {};
    const el = overlay(); const dur = opts.duration != null ? opts.duration : 520;
    return new Promise((resolve) => { el.style.transition = 'opacity ' + dur + 'ms ' + EASE_OUT; el.style.opacity = '0'; setTimeout(resolve, dur + 20); });
  }
  function revealDissolve(opts) {
    opts = opts || {};
    const el = overlay(); const cv = dissolveCv(); const dur = opts.duration != null ? opts.duration : 700;
    return new Promise((resolve) => {
      el.style.transition = 'none'; el.style.opacity = '1'; el.style.background = 'none';
      const cols = 26; const cellW = Math.ceil(window.innerWidth / cols); const rows = Math.ceil(window.innerHeight / cellW);
      cv.width = window.innerWidth; cv.height = window.innerHeight;
      const ctx = cv.getContext('2d'); ctx.fillStyle = '#000';
      const total = cols * rows; const order = [];
      for (let i = 0; i < total; i++) order.push(i);
      for (let i = total - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; const tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
      const start = performance.now();
      function frame(now) {
        const p = Math.min(1, (now - start) / dur); const eased = 1 - Math.pow(1 - p, 2.2); const revealed = Math.floor(eased * total);
        ctx.clearRect(0, 0, cv.width, cv.height);
        for (let k = revealed; k < total; k++) { const idx = order[k]; ctx.fillRect((idx % cols) * cellW, Math.floor(idx / cols) * cellW, cellW + 1, cellW + 1); }
        if (p < 1) { requestAnimationFrame(frame); } else { ctx.clearRect(0, 0, cv.width, cv.height); el.style.opacity = '0'; el.style.background = '#000'; resolve(); }
      }
      requestAnimationFrame(frame);
    });
  }
  function revealFlicker(opts) {
    opts = opts || {};
    const el = overlay(); const dur = opts.duration != null ? opts.duration : 650;
    return new Promise((resolve) => {
      el.style.transition = 'none'; el.style.background = '#000'; const start = performance.now();
      function frame(now) { const p = (now - start) / dur; if (p >= 1) { el.style.opacity = '0'; resolve(); return; } const r = Math.random(); el.style.opacity = r < 0.6 ? '1' : (r < 0.85 ? '0.4' : '0.75'); requestAnimationFrame(frame); }
      requestAnimationFrame(frame);
    });
  }
  const revealers = { fade: revealFade, dissolve: revealDissolve, flicker: revealFlicker };
  function reveal(type, opts) { return (revealers[type] || revealFade)(opts); }
  GS.Transitions = { cover, reveal, fade: revealFade, dissolve: revealDissolve, flicker: revealFlicker };
})(window.GameShell = window.GameShell || {});
