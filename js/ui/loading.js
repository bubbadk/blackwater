/* Loading screen: atmospheric location/time card with typewriter note. */
(function (GS) {
  'use strict';

  let pending = null;
  let timer = null;
  let typeTimer = null;

  function prepare(cfg) { pending = cfg; }

  function enter() {
    const cfg = pending || {};
    pending = null;
    setText('loading-location', cfg.location || 'Blackwater Bay');
    setText('loading-time', cfg.time || '');
    typeNote(cfg.note || '');
    clearTimeout(timer);
    timer = setTimeout(() => {
      GS.Scenes.show(cfg.dest || 'test', { transition: cfg.transition || 'dissolve' });
    }, cfg.delay || 1800);
  }

  function exit() {
    clearTimeout(timer);
    clearInterval(typeTimer);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function typeNote(text) {
    const el = document.getElementById('loading-note');
    if (!el) return;
    el.textContent = '';
    clearInterval(typeTimer);
    if (!text) return;
    let i = 0;
    typeTimer = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i += 1;
      if (i >= text.length) clearInterval(typeTimer);
    }, 24);
  }

  GS.Loading = { prepare, enter, exit };
  GS.Scenes.register('loading', { enter, exit });
})(window.GameShell = window.GameShell || {});
