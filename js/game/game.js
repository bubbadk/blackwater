/* ============================================================================
   THE BLACK RELIQUARY — GAME LAYER
   Bridges the detective engine + content to the GameShell screens.
   ============================================================================ */
(function (GS) {
  'use strict';

  const content = window.BlackReliquaryContent;
  const BR = window.BR || {};
  const $ = (s) => document.querySelector(s);

  let engine = null;
  let selectedItem = null;
  let currentDialogue = null;
  let currentDialogueNode = null;
  let act = 0;                 // 0 = prologue, 1..5
  let night = false;
  let prologueStep = 0;        // index into PROLOGUE, then special values below
  let firedDeductions = {};
  let endingShown = false;
  const SAVE_KEY = 'blackReliquary.save.v1';

  const CLUE_FLAGS = { 'C-14': 'hasPhoto34', 'C-18': 'hasSurvey', 'C-37': 'armBarrow' };
  const ARM_FLAGS = { barrowstone: 'armBarrow', altarcache: 'armAltar', floodedchapel: 'armFlooded', fiftharm: 'armFirstTide' };

  const ACT_LABEL = {
    0: 'PROLOGUE', 1: 'ACT I · OCTOBER 18', 2: 'ACT II · OCTOBER 19–20',
    3: 'ACT III · OCTOBER 21–22', 4: 'ACT IV · OCTOBER 23', 5: 'ACT V · OCTOBER 24'
  };

  /* Prologue script. kind 'line' advances on Continue; kind 'action' runs. */
  const PROLOGUE = [
    { kind: 'line', speaker: 'Elias Ward', text: '11:47 PM. The office is quiet. The rain has been falling all evening, and the harbor fog has not lifted.' },
    { kind: 'line', speaker: 'Elias Ward', text: 'A cigarette in the ashtray, always the same length. The wall clock, always 3:47. The Carver file — a cheating husband. Nothing supernatural. This is the safe room.' },
    { kind: 'line', speaker: 'Narrator', text: 'Three knocks. Not the landlord two. Not the cops four.' },
    { kind: 'action', label: 'Answer the door', do: 'answer' },
    { kind: 'line', speaker: 'Narrator', text: 'Two gunshots. Then silence. Whitlock is gone. The rain is the loudest thing again.' },
    { kind: 'action', label: 'Run down to the alley', do: 'alley' }
  ];

  const flag = (k) => engine.getFlag(k);
  const has = (k) => engine.hasFlag(k);
  const seen = (c) => engine.isClueSeen(c);

  /* ---- engine ------------------------------------------------------------- */
  let _evaluating = false;
  function setEngine(e) {
    engine = e;
    engine.onChange(() => {
      for (const id of Object.keys(BR.deductions)) if (engine.hasFlag(id)) firedDeductions[id] = true;
      if (!_evaluating) { _evaluating = true; try { evaluateDeductions(); } finally { _evaluating = false; } }
      render();
    });
  }
  function makeEngine() {
    return window.DetectiveEngine.createEngine(content, {
      storage: (typeof localStorage !== 'undefined') ? localStorage : null,
      storageKey: SAVE_KEY,
      autoSave: true
    });
  }

  /* ---- deductions --------------------------------------------------------- */
  function evaluateDeductions() {
    // Sync companion flags for clues revealed via dialogue effects.
    for (const clue in CLUE_FLAGS) { if (seen(clue) && !has(CLUE_FLAGS[clue])) engine.setFlag(CLUE_FLAGS[clue], true); }
    let changed = false;
    for (const [id, d] of Object.entries(BR.deductions)) {
      if (firedDeductions[id]) continue;
      let ok = false;
      if (d.requires) {
        ok = d.requires.every((r) => (r.indexOf('D-') === 0 ? firedDeductions[r] : seen(r)));
      } else if (d.anyOf) {
        ok = d.anyOf.filter(seen).length >= (d.anyOfCount || 3);
      }
      if (ok) {
        firedDeductions[id] = true;
        engine.setFlag(id, true);
        changed = true;
        if (d.secret) { GS.Shell.subtitle('DEDUCED — ' + d.title, 4200); }
        else showDeductionBanner(id, d);
        addNotebookEntry('DEDUCTIONS', 'DEDUCED — ' + d.title + '\n' + d.line);
      }
    }
    if (!has('knowsSeal') && seen('C-09') && seen('C-12') && seen('C-37')) engine.setFlag('knowsSeal', true);
    if (changed) checkActGates();
    return changed;
  }

  function showDeductionBanner(id, d) {
    const el = $('#deduction-banner');
    if (!el) return;
    $('#ded-title').textContent = d.title;
    $('#ded-line').textContent = d.line;
    el.classList.add('is-on');
    GS.Audio.playSfx('ring');
    clearTimeout(showDeductionBanner._t);
    showDeductionBanner._t = setTimeout(() => el.classList.remove('is-on'), 5600);
  }

  function addNotebookEntry(section, text) {
    if (!window._notebookEntries) window._notebookEntries = {};
    if (!window._notebookEntries[section]) window._notebookEntries[section] = [];
    window._notebookEntries[section].push(text);
  }

  /* ---- act gates ---------------------------------------------------------- */
  function currentActNumber() {
    let n = 0;
    for (const key of ['act1', 'act2', 'act3', 'act4', 'act5']) {
      const gate = BR.actGates[key];
      if (gate.requires.every((r) => firedDeductions[r] || has(r))) n = parseInt(key.replace('act', ''), 10);
      else break;
    }
    return n;
  }

  function checkActGates() {
    const next = currentActNumber();
    if (next > act) {
      act = next;
      engine.setFlag('act', act);
      for (let i = 1; i <= act; i++) engine.setFlag('act' + i, true);
      const gate = BR.actGates['act' + act];
      const modalOpen = !!document.querySelector('.modal.is-on');
      if (gate && GS.Scenes.current() === 'game' && !modalOpen && !endingShown) {
        GS.Loading.prepare({ location: gate.title, time: '', note: 'The town grows quieter.', dest: 'game', transition: 'dissolve', delay: 1700 });
        GS.Scenes.show('loading', { transition: 'fade' });
      }
      if (gate) GS.Shell.subtitle(gate.title, 2600);
    }
    return act;
  }

  /* ---- locations ---------------------------------------------------------- */
  const LOC_ACT = {
    office: 0, police: 1, estate: 1, museum: 1, gazette: 1, docks: 1, harbormaster: 1,
    oldharbor: 1, church: 1, hospital: 1, witchwood: 1, lighthouse: 1,
    archive: 2, mariner: 2, cannery: 2, graveyard: 2,
    undercity: 4, chapel_first_tide: 4, sealed_hall: 5
  };
  function unlockedLocations() {
    const list = [];
    for (const [id, req] of Object.entries(LOC_ACT)) if (act >= req) list.push(id);
    return list;
  }

  /* ---- render ------------------------------------------------------------- */
  function render() {
    if (!engine) return;
    const scene = engine.getCurrentScene();
    if (!scene) return;
    const bgEl = $('#game-bg');
    if (bgEl && scene.background) bgEl.style.background = scene.background;
    $('#game-title').textContent = scene.title;
    $('#game-desc').textContent = scene.description || '';
    $('#hud-location').textContent = scene.title;
    $('#hud-act').textContent = ACT_LABEL[act] || '';
    const nightBtn = $('#btn-night'); if (nightBtn) nightBtn.textContent = night ? 'NIGHT' : 'DAY';
    document.body.classList.toggle('is-night', night);
    if (GS.Audio && GS.Audio.unlocked) GS.Audio.startAmbience(scene.audio || 'rain');
    renderHotspots(scene.hotspots);
    renderInventory();
    renderStoryBar();
    renderContinueState();
  }

  function renderHotspots(hotspots) {
    const el = $('#game-hotspots');
    if (!el) return;
    el.innerHTML = '';
    for (const h of hotspots) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'game-hotspot';
      b.textContent = h.name;
      b.addEventListener('click', () => onHotspotClick(h.id));
      el.appendChild(b);
    }
    if (!hotspots.length) {
      const e = document.createElement('span');
      e.className = 'game-hotspot-empty';
      e.textContent = 'Nothing here but the quiet.';
      el.appendChild(e);
    }
  }

  function renderInventory() {
    const el = $('#game-inventory');
    if (!el) return;
    el.innerHTML = '';
    const inv = engine.getInventory();
    if (!inv.length) {
      const e = document.createElement('span');
      e.className = 'inv-empty';
      e.textContent = '— nothing in your coat —';
      el.appendChild(e);
      return;
    }
    for (const it of inv) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'inv-item' + (selectedItem === it.id ? ' is-selected' : '');
      b.textContent = it.name;
      b.title = it.description || '';
      b.addEventListener('click', () => onInventoryClick(it.id));
      el.appendChild(b);
    }
  }

  function renderStoryBar() {
    const bar = $('#game-story');
    if (!bar) return;
    const sceneId = engine.getState().currentScene;

    // Prologue line/action steps
    if (act === 0 && prologueStep < PROLOGUE.length) {
      const step = PROLOGUE[prologueStep];
      bar.hidden = false;
      $('#story-speaker').textContent = step.speaker || '';
      $('#story-text').textContent = step.text || '';
      $('#story-action').hidden = false;
      $('#story-action').textContent = step.kind === 'action' ? step.label : 'Continue';
      return;
    }
    // After the Whitlock dialogue (shots), the alley return
    if (act === 0 && sceneId === 'alley' && has('whitlockGone') && prologueStep >= PROLOGUE.length) {
      bar.hidden = false;
      $('#story-speaker').textContent = 'Elias Ward';
      $('#story-text').textContent = 'No body. Only what the rain gave back. Take what there is, then get off the street.';
      $('#story-action').hidden = false;
      $('#story-action').textContent = 'Return to the office';
      return;
    }
    // Back at office after the alley: pin the clues
    if (act === 0 && sceneId === 'office' && has('whitlockGone') && prologueStep === PROLOGUE.length) {
      bar.hidden = false;
      $('#story-speaker').textContent = 'Elias Ward';
      $('#story-text').textContent = 'Pin what you know. The board does the arguing for you.';
      $('#story-action').hidden = false;
      $('#story-action').textContent = 'Pin the clues';
      return;
    }
    // Open the case and begin the investigation
    if (act === 0 && sceneId === 'office' && has('whitlockGone') && prologueStep === PROLOGUE.length + 1) {
      bar.hidden = false;
      $('#story-speaker').textContent = 'Elias Ward';
      $('#story-text').textContent = 'Four ways to start: the Police, the Museum, the Whitlock Estate, or the Gazette. All roads lead to water, eventually.';
      $('#story-action').hidden = false;
      $('#story-action').textContent = 'Open the case';
      return;
    }
    bar.hidden = true;
  }

  function renderContinueState() {
    const el = $('[data-state="continue"]');
    if (el) el.textContent = (engine && engine.hasSave()) ? 'Case in progress' : 'No case in progress';
  }

  /* ---- prologue advance --------------------------------------------------- */
  function setPrologueStep(n) {
    prologueStep = n;
    if (engine && act === 0) engine.setFlag('_prologueStep', n);
  }

  function advancePrologue() {
    if (act !== 0) return;
    const sceneId = engine.getState().currentScene;

    if (prologueStep < PROLOGUE.length) {
      const step = PROLOGUE[prologueStep];
      if (step.kind === 'line') { setPrologueStep(prologueStep + 1); if (prologueStep === 2) GS.Audio.playSfx('knock'); renderStoryBar(); return; }
      if (step.do === 'answer') { openDialogue('whitlock'); return; }
      if (step.do === 'alley') {
        setPrologueStep(PROLOGUE.length);
        engine.moveTo('alley');
        GS.Loading.prepare({ location: BR.loadingCards.alley.location, time: BR.loadingCards.alley.time, note: BR.loadingCards.alley.note, dest: 'game', transition: 'flicker', delay: 1300 });
        GS.Scenes.show('loading', { transition: 'fade' });
        return;
      }
      return;
    }
    if (sceneId === 'alley' && has('whitlockGone')) {
      engine.moveTo('office');
      render();
      return;
    }
    if (sceneId === 'office' && has('whitlockGone')) {
      if (prologueStep === PROLOGUE.length) {
        renderBoard();
        setPrologueStep(PROLOGUE.length + 1);
        renderStoryBar();
        return;
      }
      if (prologueStep === PROLOGUE.length + 1) {
        act = 1;
        engine.setFlag('act', 1);
        engine.setFlag('act1', true);
        setPrologueStep(PROLOGUE.length + 2);
        GS.Shell.hideModal();
        GS.Shell.subtitle('The case is open. Where will you start?', 3200);
        render();
        return;
      }
      return;
    }
  }

  /* After the Whitlock dialogue ends: move past the shots line. */
  function afterDialogueEffects() {
    renderInventory();
    if (act === 0 && has('whitlockGone') && prologueStep === 3) {
      setPrologueStep(4);
      GS.Audio.playSfx('gunshot');
      renderStoryBar();
    }
  }

  /* ---- hotspot interaction ------------------------------------------------ */
  function onHotspotClick(id) {
    if (selectedItem) {
      const r = engine.useItem(selectedItem, id);
      const a = engine.getItem(selectedItem);
      selectedItem = null;
      if (r.ok) for (const m of r.messages) GS.Shell.subtitle(m, 2600);
      else GS.Shell.subtitle(r.error || ('You cannot use the ' + (a && a.name) + ' here.'), 2600);
      renderInventory();
      return;
    }
    const hs = engine.getHotspot(id);
    if (hs && hs.ui) { openUiPanel(hs.ui); return; }
    const r = engine.inspectHotspot(id);
    if (!r.ok) { GS.Shell.subtitle(r.error || 'Nothing.', 2200); return; }
    GS.Audio.playSfx('click');
    for (const m of r.messages) GS.Shell.subtitle(m, 2800);
    if (r.clue) { onClueRevealed(r.clue); showClue(r.clue); }
    if (hs && hs.flag && !has(hs.flag)) { engine.setFlag(hs.flag, true); if (hs.doc) showDocument(hs.doc); }
    if (hs && hs.arm && !has(ARM_FLAGS[hs.id])) {
      engine.setFlag(ARM_FLAGS[hs.id], true);
      GS.Shell.subtitle('You recognize an arm-seal. The same impossible black, the same socket star. You take it.', 3400);
    }
    showHotspotActions(id, r);
  }

  function showHotspotActions(hotspotId, r) {
    const bar = $('#game-actions');
    if (!bar) return;
    bar.innerHTML = '';
    const mk = (label, fn) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'game-action'; b.textContent = label;
      b.addEventListener('click', fn); return b;
    };
    if (r.takeable) {
      const nm = engine.getItem(r.takeable) ? engine.getItem(r.takeable).name : r.takeable;
      bar.appendChild(mk('Take ' + nm, () => {
        const res = engine.pickUp(r.takeable);
        GS.Shell.subtitle(res.ok ? res.messages[0] : res.error, 2600);
        bar.innerHTML = ''; renderInventory();
      }));
    }
    if (r.startableDialogue) {
      bar.appendChild(mk('Talk', () => { openDialogue(r.startableDialogue); bar.innerHTML = ''; }));
    }
    if (r.goto) {
      bar.appendChild(mk('Go', () => { engine.followExit(hotspotId); bar.innerHTML = ''; }));
    }
  }

  function onClueRevealed(clueId) {
    if (CLUE_FLAGS[clueId]) engine.setFlag(CLUE_FLAGS[clueId], true);
    addNotebookEntry('EVIDENCE', BR.clues[clueId].title + '\n' + (BR.clues[clueId].notebook || BR.clues[clueId].text));
    evaluateDeductions();
  }

  /* ---- inventory ---------------------------------------------------------- */
  function onInventoryClick(itemId) {
    showItem(itemId);
  }

  function showItem(itemId) {
    const it = engine.getItem(itemId);
    if (!it) return;
    GS.Audio.playSfx('click');
    $('#item-category').textContent = 'EVIDENCE — IN YOUR COAT';
    $('#item-title').textContent = it.name;
    $('#item-text').textContent = it.description || '';
    GS.Shell.showModal('item');
  }

  /* ---- clue / document modals -------------------------------------------- */
  function showClue(clueId) {
    const c = BR.clues[clueId];
    if (!c) return;
    $('#clue-title').textContent = c.title;
    $('#clue-category').textContent = c.category || '';
    $('#clue-text').textContent = c.text || '';
    $('#clue-notebook').textContent = c.notebook ? ('Notebook: ' + c.notebook) : '';
    const doc = clueDocument(clueId);
    const docBtn = $('#clue-doc');
    if (doc) { docBtn.hidden = false; docBtn.onclick = () => showDocument(doc); }
    else docBtn.hidden = true;
    GS.Shell.showModal('clue');
  }
  function clueDocument(clueId) {
    const map = { 'C-01': 'telegram', 'C-39': 'liturgy', 'C-40': 'deathcert', 'C-43': 'bronzeplate', 'C-08': 'journal' };
    return map[clueId] || null;
  }
  function showDocument(key) {
    const d = BR.documents[key];
    if (!d) return;
    $('#doc-title').textContent = d.title;
    $('#doc-text').textContent = d.text;
    GS.Shell.showModal('document');
  }

  /* ---- dialogue ----------------------------------------------------------- */
  function openDialogue(dialogueId) {
    const r = engine.startDialogue(dialogueId);
    if (!r.ok) { GS.Shell.subtitle(r.error, 2200); return; }
    currentDialogue = dialogueId;
    renderDialogueNode(r.node);
    GS.Shell.showModal('dialogue');
  }
  function renderDialogueNode(node) {
    currentDialogueNode = node;
    $('#dlg-speaker').textContent = node.speaker || '';
    $('#dlg-text').textContent = node.text || '';
    const box = $('#dlg-choices');
    box.innerHTML = '';
    for (let i = 0; i < node.choices.length; i++) {
      const c = node.choices[i];
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'dlg-choice'; b.textContent = c.label;
      b.addEventListener('click', () => choose(i));
      box.appendChild(b);
    }
    if (!node.choices.length) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'dlg-choice'; b.textContent = 'Continue';
      b.addEventListener('click', closeDialogue);
      box.appendChild(b);
    }
  }
  function choose(i) {
    const r = engine.chooseOption(currentDialogue, currentDialogueNode.id, i);
    for (const m of (r.messages || [])) GS.Shell.subtitle(m, 2800);
    if (!r.ok) return;
    afterDialogueEffects();
    if (r.ended) { maybeTriggerEnding(); closeDialogue(); return; }
    if (r.node) renderDialogueNode(r.node);
  }
  function closeDialogue() {
    GS.Shell.hideModal('dialogue');
    currentDialogue = null;
    currentDialogueNode = null;
    afterDialogueEffects();
  }

  /* ---- UI panels ---------------------------------------------------------- */
  function openUiPanel(which) {
    if (which === 'notebook') renderNotebook();
    else if (which === 'board') renderBoard();
    else if (which === 'map') renderMap();
  }

  function renderNotebook() {
    $('#nb-deductions').innerHTML = '';
    for (const [id, d] of Object.entries(BR.deductions)) {
      const row = document.createElement('div');
      row.className = 'nb-row ' + (firedDeductions[id] ? 'is-deduced' : 'is-locked');
      row.textContent = d.secret && !firedDeductions[id] ? '[sealed]' : ((firedDeductions[id] ? 'DEDUCED — ' : '[sealed] ') + d.title);
      $('#nb-deductions').appendChild(row);
    }
    $('#nb-clues').innerHTML = '';
    for (const c of engine.getClues().filter((c) => c.seen)) {
      const row = document.createElement('div');
      row.className = 'nb-row is-clue'; row.textContent = c.title;
      row.addEventListener('click', () => { GS.Shell.hideModal('notebook'); showClue(c.id); });
      $('#nb-clues').appendChild(row);
    }
    $('#nb-docs').innerHTML = '';
    for (const [key, d] of Object.entries(BR.documents)) {
      const row = document.createElement('div');
      row.className = 'nb-row is-doc'; row.textContent = d.title;
      row.addEventListener('click', () => { GS.Shell.hideModal('notebook'); showDocument(key); });
      $('#nb-docs').appendChild(row);
    }
    const unanswered = openThreads();
    $('#nb-questions').innerHTML = '';
    if (!unanswered.length) $('#nb-questions').innerHTML = '<div class="nb-row is-locked">None. That is either very good or very bad.</div>';
    else for (const q of unanswered) { const r = document.createElement('div'); r.className = 'nb-row is-question'; r.textContent = q; $('#nb-questions').appendChild(r); }
    GS.Shell.showModal('notebook');
  }

  function openThreads() {
    const t = [];
    if (!firedDeductions['D-01']) t.push('Who followed Whitlock the night he came to the office?');
    if (!firedDeductions['D-02']) t.push('The report was filed before I called. Who inside the station is the Order man?');
    if (!firedDeductions['D-08']) t.push('What exactly is the Eye, and why does its base match a stone in the museum cellar?');
    if (!firedDeductions['D-09']) t.push('There is no body. Where is the professor?');
    if (firedDeductions['D-10'] && !firedDeductions['D-14']) t.push('The symbol is everywhere. When does the Order move next?');
    if (firedDeductions['D-10'] && !firedDeductions['D-15']) t.push('Where is the thing the Order is guarding?');
    return t.slice(0, 5);
  }

  function renderBoard() {
    const el = $('#board-pins');
    el.innerHTML = '';
    for (const c of engine.getClues().filter((c) => c.seen)) {
      const pin = document.createElement('div');
      pin.className = 'board-pin'; pin.textContent = c.title; pin.title = c.text;
      el.appendChild(pin);
    }
    const dedEl = $('#board-deductions');
    dedEl.innerHTML = '';
    for (const id of Object.keys(firedDeductions)) {
      const d = BR.deductions[id];
      const row = document.createElement('div');
      row.className = 'board-ded'; row.textContent = 'DEDUCED — ' + d.title;
      dedEl.appendChild(row);
    }
    GS.Shell.showModal('board');
  }

  function renderMap() {
    const el = $('#map-locations');
    el.innerHTML = '';
    for (const id of unlockedLocations()) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'map-loc' + (engine.getState().currentScene === id ? ' is-current' : '');
      b.textContent = BR.scenes[id] ? BR.scenes[id].title : id;
      b.addEventListener('click', () => travelTo(id));
      el.appendChild(b);
    }
    GS.Shell.showModal('map');
  }

  function travelTo(sceneId) {
    GS.Shell.hideModal('map');
    const card = BR.loadingCards[sceneId];
    const fromScene = engine.getState().currentScene;
    if (card && sceneId !== fromScene) {
      GS.Loading.prepare({ location: card.location, time: card.time, note: card.note, dest: 'game', transition: 'dissolve', delay: 1300 });
      GS.Scenes.show('loading', { transition: 'fade' }).then(() => { engine.moveTo(sceneId); afterTravel(sceneId); });
    } else {
      engine.moveTo(sceneId);
      afterTravel(sceneId);
    }
  }

  function afterTravel(sceneId) {
    if (sceneId === 'graveyard' && night && firedDeductions['D-21'] && !has('haAlly')) {
      setTimeout(offerSecretEnding, 700);
    }
  }

  function offerSecretEnding() {
    const bar = $('#game-story');
    if (!bar) return;
    bar.hidden = false;
    $('#story-speaker').textContent = 'The Ferryman';
    $('#story-text').textContent = 'The boat waits at the waterline, where no water should be. Fares are paid in what you are willing to forget. You paid in advance.';
    const actBtn = $('#story-action');
    actBtn.hidden = false;
    actBtn.textContent = 'Look at the water';
    actBtn.onclick = () => showEnding('secret');
  }

  /* ---- endings ------------------------------------------------------------ */
  function armCount() {
    let n = 0;
    for (const f of Object.values(ARM_FLAGS)) if (has(f)) n++;
    return n;
  }
  function maybeTriggerEnding() {
    if (endingShown || !engine) return;
    const f = engine.getState().flags;
    if (f.ending === 'drownedStar') { showEnding('drownedStar'); return; }
    if (f.sealed) {
      if (f.lookedAtBasin) { showEnding('scholar'); return; }
      const truth = firedDeductions['D-07'] && firedDeductions['D-08'];
      const evidence = seen('C-48') && seen('C-26') && seen('C-17') && seen('C-22') && seen('C-41');
      const detective = truth && firedDeductions['D-12'] && firedDeductions['D-13'] && evidence && has('haAlly') && has('haleStorm') && armCount() >= 1;
      if (detective) { showEnding('detective'); return; }
      showEnding('guardian');
      return;
    }
    if (f.eyeDestroyed) { showEnding('drownedWorld'); return; }
  }

  function showEnding(key) {
    endingShown = true;
    const e = BR.endings[key];
    if (!e) return;
    GS.Shell.hideModal();
    GS.Audio.stopMusic();
    $('#end-title').textContent = e.title;
    $('#end-unlock').textContent = e.unlock;
    const body = $('#end-body');
    body.innerHTML = '';
    const addP = (text, cls) => { const p = document.createElement('p'); if (cls) p.className = cls; p.textContent = text; body.appendChild(p); };
    for (const p of e.epilogue) addP(p);
    if (key === 'guardian' && armCount() < 3) addP('The seal holds — imperfectly. Somewhere, each spring tide, the water still rises a finger width. You know.', 'end-last');
    addP(e.last, 'end-last');
    if (e.final) addP(e.final, 'end-final');
    if (typeof localStorage !== 'undefined') {
      try {
        const unlocked = JSON.parse(localStorage.getItem('blackReliquary.endings') || '{}');
        unlocked[key] = true;
        localStorage.setItem('blackReliquary.endings', JSON.stringify(unlocked));
      } catch (err) {}
    }
    GS.Scenes.show('ending', { transition: 'fade' });
  }

  /* ---- scene lifecycle ---------------------------------------------------- */
  function enter() {
    render();
    bindOnce();
  }
  function exit() {}

  let bound = false;
  function bindOnce() {
    if (bound) return;
    bound = true;
    const storyAction = $('#story-action');
    if (storyAction) storyAction.addEventListener('click', advancePrologue);
    const nightBtn = $('#btn-night');
    if (nightBtn) nightBtn.addEventListener('click', () => { night = !night; engine.setFlag('night', night); render(); });
    const bind = (id, fn) => { const el = $(id); if (el) el.addEventListener('click', fn); };
    bind('#btn-notebook', () => renderNotebook());
    bind('#btn-board', () => renderBoard());
    bind('#btn-map', () => renderMap());
    bind('#btn-menu', () => GS.Scenes.show('title', { transition: 'fade' }));
    bind('#btn-return-office', () => travelTo('office'));
    document.addEventListener('keydown', (e) => {
      if (GS.Scenes.current() !== 'game') return;
      if (e.key === 'Escape') { if (selectedItem) { selectedItem = null; renderInventory(); } return; }
      if (e.key === 'n' || e.key === 'N') renderNotebook();
      if (e.key === 'b' || e.key === 'B') renderBoard();
      if (e.key === 'm' || e.key === 'M') renderMap();
    });
  }

  /* ---- public ------------------------------------------------------------- */
  function startNew() {
    if (!engine) engine = makeEngine();
    engine.reset();
    window._notebookEntries = {};
    firedDeductions = {};
    selectedItem = null;
    endingShown = false;
    act = 0; night = false; prologueStep = 0;
    engine.setFlag('act', 0);
    GS.Loading.prepare({ location: BR.loadingCards.office.location, time: BR.loadingCards.office.time, note: BR.loadingCards.office.note, dest: 'game', transition: 'dissolve', delay: 1700 });
    GS.Scenes.show('loading', { transition: 'fade' });
  }

  function loadGame() {
    if (!engine) engine = makeEngine();
    const r = engine.load();
    if (!r.ok) { GS.Shell.subtitle(r.error || 'No save found.', 2400); return; }
    firedDeductions = {};
    for (const id of Object.keys(BR.deductions)) if (engine.hasFlag(id)) firedDeductions[id] = true;
    const savedAct = engine.getFlag('act');
    act = (savedAct != null) ? savedAct : currentActNumber();
    for (let i = 1; i <= act; i++) engine.setFlag('act' + i, true);
    night = engine.hasFlag('night');
    prologueStep = (act === 0) ? (engine.getFlag('_prologueStep') || 0) : PROLOGUE.length + 2;
    endingShown = false;
    GS.Loading.prepare({ location: 'Ward Investigations', time: 'Continuing the case', note: 'The tide has been patient.', dest: 'game', transition: 'dissolve', delay: 1200 });
    GS.Scenes.show('loading', { transition: 'fade' });
  }

  function hasSave() { return !!(engine && engine.hasSave()); }
  function reset() { engine = null; bound = false; }

  // Boot: create the engine and subscribe.
  setEngine(makeEngine());

  const debug = {
    revealAll() { for (const c of Object.keys(BR.clues)) engine.inspectClue(c); },
    jump(id) { engine.moveTo(id); render(); },
    fireEnding(key) { showEnding(key); },
    grantEye() { engine.setFlag('hasEye', true); },
    state() { return { act, night, firedDeductions, flags: engine.getState().flags, scene: engine.getState().currentScene }; }
  };

  GS.Game = { init: () => GS.Game, enter, exit, startNew, loadGame, hasSave, reset, render, _engine: () => engine, debug };
})(window.GameShell = window.GameShell || {});
