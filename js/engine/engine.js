/**
 * detective-engine — a DOM-free, reusable ES-module game engine for
 * point-and-click / detective adventure games.
 *
 * The engine owns ALL game state and rules. It knows nothing about the DOM,
 * localStorage, or any rendering layer — those are injected or external.
 *
 * Usage:
 *   import { createEngine } from './engine.js';
 *   import { mockContent } from './mock-content.js';
 *   const engine = createEngine(mockContent, { storage: localStorage });
 *   engine.start();
 *   engine.inspectHotspot('desk');
 *   engine.pickUp('letter');
 *   engine.combine('paperclip', 'pen');
 *   engine.useItem('lockpick', 'door');
 *
 * The engine emits 'change' events after every mutation; a render layer can
 * subscribe with engine.onChange(fn) and re-render from engine.getState().
 */

// ---------------------------------------------------------------------------
// Tiny event emitter (no deps)
// ---------------------------------------------------------------------------
function createEmitter() {
  const listeners = new Set();
  return {
    on(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    emit(payload) {
      for (const fn of [...listeners]) fn(payload);
    },
  };
}

// ---------------------------------------------------------------------------
// Condition evaluation
//
// A condition may be:
//   null / undefined          -> always true
//   "flagName"                -> flags["flagName"] is truthy
//   { flag: "x" }             -> flags["x"] is truthy
//   { flag: "x", equals: v }  -> flags["x"] === v
//   { flag: "x", not: v }     -> flags["x"] !== v
//   { not: <condition> }      -> negation
//   { any: [c1, c2, ...] }    -> OR
//   { all: [c1, c2, ...] }    -> AND
// ---------------------------------------------------------------------------
function checkCondition(cond, flags) {
  if (cond == null) return true;
  if (typeof cond === 'string') return !!flags[cond];
  if (Array.isArray(cond)) return cond.every((c) => checkCondition(c, flags));
  if (typeof cond === 'object') {
    if ('flag' in cond) {
      if ('not' in cond) return flags[cond.flag] !== cond.not;
      if ('equals' in cond) return flags[cond.flag] === cond.equals;
      return !!flags[cond.flag];
    }
    if ('not' in cond) return !checkCondition(cond.not, flags);
    if ('any' in cond) return cond.any.some((c) => checkCondition(c, flags));
    if ('all' in cond) return cond.all.every((c) => checkCondition(c, flags));
  }
  return true;
}

// ---------------------------------------------------------------------------
// Content validation (used by tests and by createEngine at construction time)
// ---------------------------------------------------------------------------
function validateContent(content) {
  const problems = [];
  const fail = (m) => problems.push(m);

  if (!content || typeof content !== 'object') return ['content must be an object'];
  if (!content.scenes || typeof content.scenes !== 'object') {
    fail('content.scenes must be an object keyed by scene id');
  } else {
    if (!content.startingScene) fail('content.startingScene is required');
    if (content.startingScene && !content.scenes[content.startingScene]) {
      fail(`startingScene '${content.startingScene}' does not exist in scenes`);
    }
    for (const [sid, scene] of Object.entries(content.scenes)) {
      if (!scene || typeof scene !== 'object') { fail(`scene '${sid}' must be an object`); continue; }
      if (!scene.title) fail(`scene '${sid}' is missing a title`);
      for (const h of scene.hotspots || []) {
        if (!h.id) { fail(`scene '${sid}' has a hotspot without an id`); continue; }
        if (h.item && content.items && !content.items[h.item]) fail(`hotspot '${h.id}' references missing item '${h.item}'`);
        if (h.dialogue && (!content.dialogues || !content.dialogues[h.dialogue])) fail(`hotspot '${h.id}' references missing dialogue '${h.dialogue}'`);
        if (h.goto && !content.scenes[h.goto]) fail(`hotspot '${h.id}' goto references missing scene '${h.goto}'`);
      }
    }
  }
  for (const [cid, combo] of Object.entries(content.combos || {})) {
    if (content.items && !content.items[combo.a]) fail(`combo '${cid}' references missing item '${combo.a}'`);
    if (content.items && !content.items[combo.b]) fail(`combo '${cid}' references missing item '${combo.b}'`);
  }
  for (const [did, d] of Object.entries(content.dialogues || {})) {
    if (!d.nodes[d.start]) fail(`dialogue '${did}' start node '${d.start}' does not exist`);
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Engine factory
// ---------------------------------------------------------------------------
function createEngine(content, options = {}) {
  const problems = validateContent(content);
  if (problems.length) {
    throw new Error(`Invalid content:\n- ${problems.join('\n- ')}`);
  }

  const emitter = createEmitter();
  const storage = options.storage || null;
  const storageKey = options.storageKey || 'detective-engine-save';
  const autoSave = options.autoSave !== false;

  const initialState = {
    currentScene: content.startingScene,
    inventory: [],
    flags: { ...(content.initialFlags || {}) },
    visitedScenes: content.startingScene ? [content.startingScene] : [],
    takenItems: [],        // item ids removed from the world via pickup
    consumedItems: [],     // item ids removed from inventory via use/combine
    cluesSeen: {},         // clueId -> true
    dialoguesSeen: {},     // dialogueId -> last node id
    dialogueHistory: {},   // dialogueId -> [nodeId/label, ...]
  };

  const clone = (o) => JSON.parse(JSON.stringify(o));
  let state = clone(initialState);

  function commit() {
    if (autoSave) persist();
    emitter.emit({ type: 'change', state: snapshot() });
  }

  function snapshot() {
    return clone(state);
  }

  function persist() {
    if (storage && typeof storage.setItem === 'function') {
      try { storage.setItem(storageKey, JSON.stringify(snapshot())); } catch (_) { /* storage may be unavailable */ }
    }
  }

  function fail(message) {
    return { ok: false, error: message, messages: [message] };
  }

  // -- internal lookups ------------------------------------------------------
  function scene(id) { return content.scenes[id] || null; }
  function item(id) { return (content.items && content.items[id]) || null; }
  function dialogue(id) { return (content.dialogues && content.dialogues[id]) || null; }

  function findHotspot(hotspotId, sceneId) {
    const s = scene(sceneId);
    if (!s) return null;
    return (s.hotspots || []).find((h) => h.id === hotspotId) || null;
  }

  function findHotspotForItem(itemId) {
    for (const [sid, s] of Object.entries(content.scenes)) {
      const h = (s.hotspots || []).find((hp) => hp.item === itemId);
      if (h) return { sceneId: sid, hotspot: h };
    }
    return null;
  }

  function clueDef(clueId) { return (content.clues && content.clues[clueId]) || null; }

  // -- effects ---------------------------------------------------------------
  function applyEffects(effects, result) {
    if (!Array.isArray(effects)) return;
    for (const eff of effects) {
      if (eff.setFlag) {
        for (const [k, v] of Object.entries(eff.setFlag)) state.flags[k] = v;
      }
      if (eff.addItem && item(eff.addItem)) {
        if (!state.inventory.includes(eff.addItem)) state.inventory.push(eff.addItem);
      }
      if (eff.removeItem) {
        state.inventory = state.inventory.filter((i) => i !== eff.removeItem);
        if (!state.consumedItems.includes(eff.removeItem)) state.consumedItems.push(eff.removeItem);
      }
      if (eff.revealClue) {
        state.cluesSeen[eff.revealClue] = true;
        if (result) result.revealedClue = eff.revealClue;
      }
      if (eff.message) {
        if (result && !Array.isArray(result.messages)) result.messages = [];
        if (result) result.messages.push(eff.message);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Public API object (also the return value)
  // -------------------------------------------------------------------------
  const api = {
    // ---- lifecycle / state -------------------------------------------------
    start() {
      if (!state.currentScene) state.currentScene = content.startingScene;
      // Do NOT persist here: construction must never clobber an existing save.
      // The render layer is expected to call load() if hasSave() at startup.
      emitter.emit({ type: 'change', state: snapshot() });
      return snapshot();
    },
    reset() {
      state = clone(initialState);
      commit();
      return snapshot();
    },
    getState: snapshot,
    getCurrentScene() {
      const s = scene(state.currentScene);
      if (!s) return null;
      return { id: state.currentScene, ...s, hotspots: api.getActiveHotspots() };
    },
    getScene(id) {
      const s = scene(id);
      return s ? { id, ...s, hotspots: api.getActiveHotspots(id) } : null;
    },
    listScenes() { return Object.keys(content.scenes); },
    getVisitedScenes() { return [...state.visitedScenes]; },

    // ---- flags -------------------------------------------------------------
    getFlag(key) { return state.flags[key]; },
    hasFlag(key) { return !!state.flags[key]; },
    setFlag(key, value) {
      state.flags[key] = value;
      commit();
      return value;
    },

    // ---- movement ----------------------------------------------------------
    moveTo(sceneId) {
      if (!scene(sceneId)) return fail(`Unknown scene '${sceneId}'`);
      state.currentScene = sceneId;
      if (!state.visitedScenes.includes(sceneId)) state.visitedScenes.push(sceneId);
      commit();
      return { ok: true, messages: [`You move to: ${scene(sceneId).title}.`], scene: api.getCurrentScene() };
    },

    // ---- hotspots ----------------------------------------------------------
    getActiveHotspots(sceneId = state.currentScene) {
      const s = scene(sceneId);
      if (!s || !Array.isArray(s.hotspots)) return [];
      return s.hotspots
        .filter((h) => checkCondition(h.condition, state.flags))
        .map((h) => {
          const hot = { ...h };
          if (h.item) hot.hasItem = !state.takenItems.includes(h.item);
          return hot;
        });
    },
    getHotspot(hotspotId, sceneId = state.currentScene) {
      const h = findHotspot(hotspotId, sceneId);
      return h ? { ...h } : null;
    },
    inspectHotspot(hotspotId) {
      const h = findHotspot(hotspotId, state.currentScene);
      if (!h) return fail(`There is no '${hotspotId}' here.`);
      if (!checkCondition(h.condition, state.flags)) return fail(`You can't interact with '${hotspotId}' right now.`);

      const result = { ok: true, messages: [] };
      result.messages.push(h.lookText || h.description || h.name);

      // Clue reveal: `clue` may be a string (always) or { id, condition }.
      const clueRef = h.clue || null;
      if (clueRef) {
        const clueId = typeof clueRef === 'string' ? clueRef : clueRef.id;
        const cond = typeof clueRef === 'string' ? null : clueRef.condition;
        if (checkCondition(cond, state.flags)) {
          state.cluesSeen[clueId] = true;
          result.clue = clueId;
          result.messages.push(`You notice a clue: "${clueDef(clueId)?.title || clueId}".`);
        }
      }

      if (h.item && !state.takenItems.includes(h.item)) {
        result.takeable = h.item;
        result.messages.push(`You can take: ${item(h.item)?.name || h.item}.`);
      }

      if (h.dialogue && dialogue(h.dialogue)) result.startableDialogue = h.dialogue;

      if (h.goto && checkCondition(h.gotoCondition, state.flags)) {
        result.goto = h.goto;
      }

      commit();
      return result;
    },

    followExit(hotspotId) {
      const h = findHotspot(hotspotId, state.currentScene);
      if (!h) return fail(`There is no '${hotspotId}' here.`);
      if (!h.goto) return fail(`'${hotspotId}' is not an exit.`);
      if (!checkCondition(h.gotoCondition, state.flags)) return fail(`You can't go that way yet.`);
      return api.moveTo(h.goto);
    },

    // ---- inventory ---------------------------------------------------------
    getInventory() { return state.inventory.map((id) => ({ id, ...item(id) })); },
    hasItem(itemId) { return state.inventory.includes(itemId); },
    getItem(itemId) { return item(itemId) ? { id: itemId, ...item(itemId) } : null; },

    pickUp(itemId) {
      if (!item(itemId)) return fail(`Unknown item '${itemId}'`);
      if (state.inventory.includes(itemId)) return fail(`You already have the ${item(itemId).name}.`);
      if (state.takenItems.includes(itemId)) return fail('There is nothing more to take here.');

      const loc = findHotspotForItem(itemId);
      if (!loc) return fail(`The ${item(itemId).name} is not here to take.`);
      if (loc.sceneId !== state.currentScene) return fail(`The ${item(itemId).name} is not in this room.`);
      if (!checkCondition(loc.hotspot.condition, state.flags)) return fail(`You can't reach the ${item(itemId).name} right now.`);

      state.takenItems.push(itemId);
      state.inventory.push(itemId);
      const result = { ok: true, item: itemId, messages: [`You take the ${item(itemId).name}.`] };
      applyEffects(item(itemId).effects, result);
      commit();
      return result;
    },

    combine(itemA, itemB) {
      if (itemA === itemB) return fail('You need two different items to combine.');
      if (!item(itemA)) return fail(`Unknown item '${itemA}'`);
      if (!item(itemB)) return fail(`Unknown item '${itemB}'`);
      if (!state.inventory.includes(itemA) || !state.inventory.includes(itemB)) {
        return fail('You need both items in your inventory to combine them.');
      }
      const combo = (content.combos || []).find(
        (c) => (c.a === itemA && c.b === itemB) || (c.a === itemB && c.b === itemA)
      );
      if (!combo) return fail(`You can't combine ${item(itemA).name} and ${item(itemB).name}.`);
      if (!checkCondition(combo.condition, state.flags)) return fail("You can't do that yet.");

      const result = { ok: true, messages: [] };
      if (combo.text) result.messages.push(combo.text);

      // Consume the two inputs.
      state.inventory = state.inventory.filter((i) => i !== itemA && i !== itemB);
      state.consumedItems.push(itemA, itemB);

      // Optionally produce a result item.
      if (combo.result) {
        if (!state.inventory.includes(combo.result)) state.inventory.push(combo.result);
        result.combined = combo.result;
        result.messages.push(`You obtain: ${item(combo.result)?.name || combo.result}.`);
      }
      applyEffects(combo.effects, result);
      commit();
      return result;
    },

    useItem(itemId, targetId) {
      if (!item(itemId)) return fail(`Unknown item '${itemId}'`);
      if (!state.inventory.includes(itemId)) return fail(`You don't have the ${item(itemId).name}.`);

      const h = targetId ? findHotspot(targetId, state.currentScene) : null;
      if (targetId && !h) return fail(`There is no '${targetId}' here to use it on.`);

      // Use on a hotspot.
      if (h) {
        const inter = (h.interactions || []).find((i) => i.item === itemId);
        if (!inter) return fail(`You can't use the ${item(itemId).name} on ${h.name}.`);
        if (!checkCondition(inter.condition, state.flags)) return fail("You can't do that yet.");
        const result = { ok: true, messages: [] };
        if (inter.text) result.messages.push(inter.text);
        if (inter.consume) {
          state.inventory = state.inventory.filter((i) => i !== itemId);
          state.consumedItems.push(itemId);
        }
        applyEffects(inter.effects, result);
        commit();
        if (inter.goto) {
          const move = api.moveTo(inter.goto);
          if (move.ok) result.messages.push(...move.messages);
          result.goto = inter.goto;
        }
        return result;
      }

      // Bare "use" with no target.
      return fail(`Nothing happens. You'll need a target for the ${item(itemId).name}.`);
    },

    // ---- clues -------------------------------------------------------------
    getClues() {
      return Object.entries(content.clues || {}).map(([id, c]) => ({
        id,
        ...c,
        seen: !!state.cluesSeen[id],
      }));
    },
    getClue(clueId) { return clueDef(clueId) ? { id: clueId, ...clueDef(clueId) } : null; },
    isClueSeen(clueId) { return !!state.cluesSeen[clueId]; },
    inspectClue(clueId) {
      const c = clueDef(clueId);
      if (!c) return fail(`Unknown clue '${clueId}'`);
      state.cluesSeen[clueId] = true;
      commit();
      return { ok: true, clue: { id: clueId, ...c } };
    },

    // ---- dialogue ----------------------------------------------------------
    startDialogue(dialogueId) {
      const d = dialogue(dialogueId);
      if (!d) return fail(`Unknown dialogue '${dialogueId}'`);
      const start = d.start;
      state.dialoguesSeen[dialogueId] = start;
      state.dialogueHistory[dialogueId] = [start];
      commit();
      return { ok: true, dialogue: dialogueId, node: api.getDialogueNode(dialogueId, start) };
    },
    getDialogueNode(dialogueId, nodeId) {
      const d = dialogue(dialogueId);
      if (!d) return null;
      const node = d.nodes[nodeId];
      if (!node) return null;
      const choices = (node.choices || [])
        .filter((c) => checkCondition(c.condition, state.flags))
        .map(({ label, next }) => ({ label, next }));
      return { id: nodeId, speaker: node.speaker || '', text: node.text, choices };
    },
    chooseOption(dialogueId, nodeId, choiceIndex) {
      const d = dialogue(dialogueId);
      if (!d) return fail(`Unknown dialogue '${dialogueId}'`);
      const node = d.nodes[nodeId];
      if (!node) return fail(`Unknown dialogue node '${nodeId}'`);
      const visible = (node.choices || []).filter((c) => checkCondition(c.condition, state.flags));
      const choice = visible[choiceIndex];
      if (!choice) return fail('Invalid choice.');

      const result = { ok: true, messages: [] };
      if (!state.dialogueHistory[dialogueId]) state.dialogueHistory[dialogueId] = [];
      state.dialogueHistory[dialogueId].push(choice.label);
      applyEffects(choice.effects, result);

      if (choice.next) {
        const nextNode = d.nodes[choice.next];
        state.dialoguesSeen[dialogueId] = choice.next;
        state.dialogueHistory[dialogueId].push(choice.next);
        // Node-entry effects run when arriving at a node (choice effects run
        // when selecting the choice itself). Both are supported.
        applyEffects(nextNode && nextNode.effects, result);
        result.node = api.getDialogueNode(dialogueId, choice.next);
      } else {
        state.dialoguesSeen[dialogueId] = null;
        result.ended = true;
      }
      commit();
      return result;
    },

    // ---- persistence -------------------------------------------------------
    save(storageKeyOverride) {
      const key = storageKeyOverride || storageKey;
      if (!storage || typeof storage.setItem !== 'function') {
        return { ok: false, error: 'No storage backend configured.' };
      }
      storage.setItem(key, JSON.stringify(snapshot()));
      return { ok: true, key };
    },
    load(storageKeyOverride) {
      const key = storageKeyOverride || storageKey;
      if (!storage || typeof storage.getItem !== 'function') {
        return { ok: false, error: 'No storage backend configured.' };
      }
      const raw = storage.getItem(key);
      if (!raw) return { ok: false, error: 'No save found.' };
      let parsed;
      try { parsed = JSON.parse(raw); } catch (_) { return { ok: false, error: 'Corrupt save data.' }; }
      state = mergeState(parsed);
      commit();
      return { ok: true, state: snapshot() };
    },
    hasSave(storageKeyOverride) {
      const key = storageKeyOverride || storageKey;
      if (!storage || typeof storage.getItem !== 'function') return false;
      return !!storage.getItem(key);
    },
    clearSave(storageKeyOverride) {
      const key = storageKeyOverride || storageKey;
      if (storage && typeof storage.removeItem === 'function') storage.removeItem(key);
      return { ok: true };
    },

    // ---- debug -------------------------------------------------------------
    debug: {
      jumpToScene(sceneId) { return api.moveTo(sceneId); },
      reset() { return api.reset(); },
      dump() { return snapshot(); },
      setFlag(key, value) { return api.setFlag(key, value); },
      listScenes() { return api.listScenes(); },
      grantItem(itemId) {
        if (!item(itemId)) return fail(`Unknown item '${itemId}'`);
        if (!state.inventory.includes(itemId)) state.inventory.push(itemId);
        commit();
        return { ok: true, item: itemId };
      },
    },

    // ---- events ------------------------------------------------------------
    onChange(fn) { return emitter.on(fn); },
    onChangeOff(fn) { return fn; }, // kept for API symmetry; use returned unsubscribe
  };

  function mergeState(saved) {
    const base = clone(initialState);
    if (!saved || typeof saved !== 'object') return base;
    return {
      ...base,
      ...saved,
      flags: { ...base.flags, ...(saved.flags || {}) },
      inventory: Array.isArray(saved.inventory) ? saved.inventory : base.inventory,
      visitedScenes: Array.isArray(saved.visitedScenes) ? saved.visitedScenes : base.visitedScenes,
      takenItems: Array.isArray(saved.takenItems) ? saved.takenItems : base.takenItems,
      consumedItems: Array.isArray(saved.consumedItems) ? saved.consumedItems : base.consumedItems,
      cluesSeen: { ...base.cluesSeen, ...(saved.cluesSeen || {}) },
      dialoguesSeen: { ...base.dialoguesSeen, ...(saved.dialoguesSeen || {}) },
      dialogueHistory: { ...base.dialogueHistory, ...(saved.dialogueHistory || {}) },
    };
  }

  api.start();
  return api;
}



// Classic-script bridge: expose the engine for the no-build shell (file:// compatible).
window.DetectiveEngine = { createEngine, validateContent };
