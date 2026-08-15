# THE BLACK RELIQUARY

A browser detective / cosmic-horror mystery. Blackwater Bay, Massachusetts,
October 1936. You are Elias Ward, a private detective handed a black stone that
should have stayed buried. Investigate the town, gather evidence, form
deductions, and reach one of six endings.

Play it in any modern desktop or mobile browser. Headphones recommended.

---

## Quick start

### Play locally (no build step)

Open `index.html` in a browser. There is no build, no bundler, and no runtime
dependency beyond a network connection for the Google Fonts (Cinzel / Crimson
Text / Special Elite). If the fonts cannot load, the game falls back to Georgia
and Courier New and remains fully playable.

For the most reliable experience, serve the folder over HTTP rather than
`file://` (localStorage and audio behave identically either way, but HTTP is the
closest match to a real deployment):

```
python3 -m http.server 8080
# then open http://localhost:8080
```

### Deploy as a static site

The entire folder is a self-contained static site. Drop it on any static host:

- Netlify / Vercel / Cloudflare Pages - point the deploy at this folder; no
  build command is needed.
- nginx / Apache - copy the folder to the web root.
- GitHub Pages - push the folder and enable Pages on the branch.

No server-side code, no database, no API keys. Everything runs in the browser.

---

## Controls

| Input | Action |
|-------|--------|
| Click a hotspot | Investigate / pick up / talk / move |
| Click an item in your coat | Examine it (opens its case-note card) |
| N / Notebook button | Open Ward's Notebook |
| B / Board button | Open the Evidence Board |
| M / Map button | Open the map and travel |
| Day / Night button | Toggle night (some people only talk after dark) |
| Esc | Close a modal, or return to the menu |

The game autosaves continuously. Continue resumes the last investigation;
Case Archive records which endings you have unlocked.

---

## The game

A prologue, then Acts I-V: 19 locations, 13 characters, 50 clues, 21 deductions
(D-20 is intentionally skipped) and six endings - The Guardian, The Scholar,
The Drowned Star, The Drowned World, The Detective, and the secret
"The Investigation Continues."

Clues feed deductions automatically as you find them. Deductions advance the
acts and unlock new locations on the map. The ending you reach is decided by
what you learned and what you chose in the Sealed Hall.

---

## File layout

```
index.html          screens, overlays, modals, script tags
css/tokens.css      design tokens (colors, fonts, spacing) as CSS variables
css/                base, shell, screens, transitions, game, responsive
js/core/            shell: events, fx, audio, transitions, cursor, scenes
js/engine/engine.js DOM-free detective engine (createEngine, validateContent)
js/game/clues.js    50 clues
js/game/items.js    11 items
js/game/dialogues.js 14 dialogue trees
js/game/scenes.js   20 scene cards
js/game/story.js    deductions, endings, act gates, documents
js/game/content.js  assembles the engine content object
js/game/game.js     render layer + orchestration
js/ui/title.js      menu, continue/load, case archive
js/ui/loading.js    loading cards
js/main.js          startup wiring
```

## Architecture

- Engine (`js/engine/engine.js`) owns all state - scene graph, hotspots,
  inventory, clue inspection, branching dialogue, flags, save/load - and knows
  nothing about the DOM. Content (`js/game/*`) is pure data.
- Shell (`js/core/`, `css/*`) is presentation: screen transitions, film grain,
  rain, fog, procedural Web Audio ambience and SFX.
- Game layer (`js/game/game.js`) bridges them: prologue scripting, act gates,
  deduction evaluation, notebook/board/map UI, and ending evaluation.

## Accessibility and settings

The Settings menu offers master / ambience / music / effects volume sliders, a
reduced-motion toggle (disables grain, rain and flicker), and a readable-font
toggle that swaps the display faces for heavier legibility.

---

## Verification

- Content validates: all clue, item, dialogue, scene and deduction references
  resolve; `createEngine` builds with zero problems.
- Every JavaScript file passes `node --check`.
- Played end to end in a real browser: title -> prologue -> act progression ->
  Sealed Hall -> ending; all six endings render; save/load round-trips
  (including mid-prologue saves).
