/* SceneManager: screens are <section data-screen="id">; show() runs a cover,
   swap, reveal transition between them. */
(function (GS) {
  'use strict';
  const screens = new Map();
  let current = null;
  let busy = false;
  function register(id, hooks) { const el = document.querySelector('[data-screen="' + id + '"]'); if (!el) { console.warn('[scenes] no element for screen "' + id + '"'); return; } screens.set(id, { el, enter: hooks && hooks.enter, exit: hooks && hooks.exit }); }
  function boot(id) { const s = screens.get(id); if (!s) return; current = s; s.el.classList.add('is-active'); if (s.enter) { try { s.enter(); } catch (e) { console.error(e); } } GS.Events.emit('screen:enter', { id }); }
  function show(id, opts) {
    opts = opts || {};
    const next = screens.get(id);
    if (!next) { console.warn('[scenes] unknown screen "' + id + '"'); return Promise.resolve(false); }
    if (busy) return Promise.resolve(false);
    busy = true;
    const prev = current;
    const transition = opts.transition || 'dissolve';
    return GS.Transitions.cover({ duration: opts.coverDuration || 320 })
      .then(() => {
        if (prev && prev !== next) { prev.el.classList.remove('is-active'); if (prev.exit) { try { prev.exit(); } catch (e) { console.error(e); } } }
        next.el.classList.add('is-active');
        if (next.enter) { try { next.enter(); } catch (e) { console.error(e); } }
        current = next;
        GS.Cursor.setMode('default');
        GS.Events.emit('screen:enter', { id });
      })
      .then(() => GS.Transitions.reveal(transition, { duration: opts.revealDuration }))
      .then(() => { GS.Events.emit('transition:end', { id }); busy = false; return true; })
      .catch((e) => { busy = false; console.error('[scenes] transition failed:', e); return false; });
  }
  function currentId() { return current ? current.el.dataset.screen : null; }
  GS.Scenes = { register, boot, show, current: currentId };
})(window.GameShell = window.GameShell || {});
