/* Shell coordinator: settings, modals, subtitle bar, letterbox, boot + unlock,
   and the public API surface the engine/integrator will build on. */
(function (GS) {
  'use strict';
  const SETTINGS_KEY = 'blackReliquary.settings.v1';
  const DEFAULTS = { master: 1, ambience: 0.7, music: 0.55, sfx: 0.85, reducedMotion: false, readableFont: false };
  function loadSettings() { try { const raw = localStorage.getItem(SETTINGS_KEY); if (raw) return Object.assign({}, DEFAULTS, JSON.parse(raw)); } catch (e) { /* storage unavailable or corrupt */ } return Object.assign({}, DEFAULTS); }
  let settings = loadSettings();
  let openModal = null;
  let subtitleTimer = null;
  function persist() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { /* noop */ } }
  function applySettings() {
    document.body.classList.toggle('reduced-motion', !!settings.reducedMotion);
    document.body.classList.toggle('readable-font', !!settings.readableFont);
    if (GS.Audio) { GS.Audio.setVolume('master', settings.master); GS.Audio.setVolume('ambience', settings.ambience); GS.Audio.setVolume('music', settings.music); GS.Audio.setVolume('sfx', settings.sfx); }
    if (GS.FX) { if (GS.FX.grain) GS.FX.grain.setEnabled(!settings.reducedMotion); if (GS.FX.rain) GS.FX.rain.setEnabled(!settings.reducedMotion); }
    GS.Events.emit('settings:applied', settings);
  }
  function setSetting(patch) { Object.assign(settings, patch); persist(); applySettings(); GS.Events.emit('settings:change', settings); }
  const modalLayer = () => document.getElementById('modal-layer');
  function showModal(id) {
    const m = document.querySelector('[data-modal="' + id + '"]');
    if (!m) return;
    if (openModal && openModal !== id) hideModal(openModal);
    m.hidden = false;
    requestAnimationFrame(() => { m.classList.add('is-on'); modalLayer().classList.add('is-on'); });
    openModal = id;
    GS.Events.emit('modal:open', { id });
  }
  function hideModal(id) {
    const target = id || openModal;
    if (!target) return;
    const m = document.querySelector('[data-modal="' + target + '"]');
    if (m) { m.classList.remove('is-on'); setTimeout(() => { if (!m.classList.contains('is-on')) m.hidden = true; }, 360); }
    if (id === openModal || !id) { modalLayer().classList.remove('is-on'); openModal = null; }
  }
  function subtitle(text, duration) { const bar = document.getElementById('subtitle-bar'); if (!bar) return; bar.textContent = text; bar.classList.add('is-on'); clearTimeout(subtitleTimer); if (duration) subtitleTimer = setTimeout(() => bar.classList.remove('is-on'), duration); }
  function letterbox(on) { document.getElementById('letterbox').classList.toggle('is-on', !!on); }
  function unlockOnGesture() {
    const start = () => {
      if (GS.Audio) { GS.Audio.unlock(); GS.Audio.startAmbience('rain'); GS.Audio.startMusic(); }
      document.removeEventListener('pointerdown', start);
      document.removeEventListener('keydown', start);
      GS.Events.emit('audio:unlock');
    };
    document.addEventListener('pointerdown', start);
    document.addEventListener('keydown', start);
  }
  function bindSettingsUI() {
    const slider = (id, bus) => { const el = document.getElementById(id); if (!el) return; el.value = String(Math.round(settings[bus] * 100)); el.addEventListener('input', () => setSetting({ [bus]: el.value / 100 })); };
    slider('vol-master', 'master'); slider('vol-ambience', 'ambience'); slider('vol-music', 'music'); slider('vol-sfx', 'sfx');
    const toggle = (id, key) => { const el = document.getElementById(id); if (!el) return; el.checked = !!settings[key]; el.addEventListener('change', () => setSetting({ [key]: el.checked })); };
    toggle('opt-reduced-motion', 'reducedMotion'); toggle('opt-readable-font', 'readableFont');
  }
  function bindGlobalKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (openModal) { hideModal(); return; }
        if (GS.Scenes.current() !== 'title') { GS.Scenes.show('title', { transition: 'fade' }); }
      }
    });
    modalLayer().addEventListener('click', () => hideModal());
    document.querySelectorAll('[data-close]').forEach((btn) => { btn.addEventListener('click', () => hideModal()); });
  }
  function init() { GS.FX.init(); applySettings(); bindSettingsUI(); bindGlobalKeys(); unlockOnGesture(); GS.Events.emit('boot'); return GS; }
  GS.Shell = { init, settings: () => settings, setSetting, applySettings, showModal, hideModal, subtitle, letterbox };
})(window.GameShell = window.GameShell || {});
