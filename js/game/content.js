/* ============================================================================
   THE BLACK RELIQUARY — CONTENT ASSEMBLER
   Assembles the engine's single content object from BR.clues/items/dialogues/
   scenes. Loaded AFTER clues.js, items.js, dialogues.js, scenes.js, story.js.
   ============================================================================ */
(function () {
  'use strict';
  const BR = window.BR || {};

  const content = {
    startingScene: 'office',
    initialFlags: {},
    scenes: BR.scenes,
    items: BR.items,
    clues: BR.clues,
    dialogues: BR.dialogues,
    combos: []
  };

  window.BlackReliquaryContent = content;
})();
