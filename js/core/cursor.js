/* Hotspot cursor states. The Cursor manager sets body[data-cursor-mode]; the
   actual cursor images live in shell.css. */
(function (GS) {
  'use strict';
  const MODES = ['default', 'examine', 'look', 'go', 'grab', 'grabbing'];
  let current = 'default';
  function setMode(mode) { if (MODES.indexOf(mode) === -1) mode = 'default'; current = mode; if (mode === 'default') delete document.body.dataset.cursorMode; else document.body.dataset.cursorMode = mode; }
  function currentMode() { return current; }
  function bindHotspots(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-cursor]').forEach((el) => { if (el.dataset.cursorBound) return; el.dataset.cursorBound = '1'; el.addEventListener('mouseenter', () => setMode(el.dataset.cursor)); el.addEventListener('mouseleave', () => setMode('default')); });
  }
  function bindAll() { bindHotspots(document); }
  GS.Cursor = { setMode, currentMode, bindHotspots, bindAll };
})(window.GameShell = window.GameShell || {});
