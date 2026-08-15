/* Title screen: menu wiring, continue state, archive list, ambient audio. */
(function (GS) {
  'use strict';

  function enter() {
    GS.Cursor.setMode('default');
    if (GS.Audio && GS.Audio.unlocked) { GS.Audio.startAmbience('rain'); GS.Audio.startMusic(); }
    updateContinueState();
    renderArchive();
  }

  function exit() {}

  function updateContinueState() {
    const el = document.querySelector('[data-state="continue"]');
    if (el) el.textContent = (GS.Game && GS.Game.hasSave()) ? 'Case in progress' : 'No case in progress';
  }

  function renderArchive() {
    const list = document.getElementById('archive-list');
    if (!list) return;
    let unlocked = {};
    try { unlocked = JSON.parse(localStorage.getItem('blackReliquary.endings') || '{}'); } catch (e) {}
    const endings = [
      ['guardian', 'THE GUARDIAN', 'You closed the door. Whether it stays closed is a different investigation.'],
      ['scholar', 'THE SCHOLAR', 'You learned more than a human mind should know.'],
      ['drownedStar', 'THE DROWNED STAR', 'You joined a church that never existed.'],
      ['drownedWorld', 'THE DROWNED WORLD', 'The deep remembered the land.'],
      ['detective', 'THE DETECTIVE', 'You solved the case. The case is still solving you.'],
      ['secret', 'THE INVESTIGATION CONTINUES', 'You found the truth about yourself.']
    ];
    list.innerHTML = '';
    for (const [key, title, tag] of endings) {
      const li = document.createElement('li');
      li.className = 'archive-entry' + (unlocked[key] ? '' : ' archive-entry--locked');
      const name = document.createElement('span');
      name.className = 'archive-name';
      name.textContent = unlocked[key] ? title : '[REDACTED]';
      const status = document.createElement('span');
      status.className = 'archive-status';
      status.textContent = unlocked[key] ? tag : 'the file is sealed.';
      li.appendChild(name);
      li.appendChild(status);
      list.appendChild(li);
    }
  }

  function selectMenu(dir) {
    const items = Array.from(document.querySelectorAll('.menu-item'));
    if (!items.length) return;
    let idx = items.indexOf(document.activeElement);
    if (idx === -1) idx = 0;
    items[(idx + dir + items.length) % items.length].focus();
  }

  function handle(action) {
    GS.Audio.playSfx('click');
    switch (action) {
      case 'new':
        if (GS.Game) GS.Game.startNew();
        break;
      case 'continue':
        if (GS.Game && GS.Game.hasSave()) GS.Game.loadGame();
        else GS.Shell.subtitle('No case in progress.', 2400);
        break;
      case 'load':
        if (GS.Game && GS.Game.hasSave()) GS.Shell.showModal('load');
        else GS.Shell.subtitle('No case on file.', 2400);
        break;
      case 'settings':
        GS.Shell.showModal('settings');
        break;
      case 'archive':
        renderArchive();
        GS.Shell.showModal('archive');
        break;
      case 'credits':
        GS.Shell.showModal('credits');
        break;
      default:
        break;
    }
  }

  function bind() {
    document.querySelectorAll('.menu-item').forEach((btn) => {
      btn.addEventListener('click', () => handle(btn.dataset.action));
    });
    const loadBtn = document.getElementById('btn-load-now');
    if (loadBtn && !loadBtn._bound) {
      loadBtn._bound = true;
      loadBtn.addEventListener('click', () => { GS.Shell.hideModal('load'); if (GS.Game) GS.Game.loadGame(); });
    }
    const endBtn = document.getElementById('end-menu');
    if (endBtn && !endBtn._bound) {
      endBtn._bound = true;
      endBtn.addEventListener('click', () => GS.Scenes.show('title', { transition: 'fade' }));
    }
    document.addEventListener('keydown', (e) => {
      if (GS.Scenes.current() !== 'title') return;
      if (e.key === 'ArrowDown') { e.preventDefault(); selectMenu(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selectMenu(-1); }
    });
  }

  GS.Title = { enter, exit, bind, updateContinueState };
  GS.Scenes.register('title', { enter, exit });
})(window.GameShell = window.GameShell || {});
