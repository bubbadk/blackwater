/* ============================================================================
   THE BLACK RELIQUARY — SCENES (Game Bible §10, locations)
   Hotspots: { id, name, lookText, item?, clue?, dialogue?, arm?, condition? }
   Extra fields (arm, ui) are read by the render layer; the engine passes them
   through untouched.
   ============================================================================ */
window.BR = window.BR || {};

BR.scenes = {
  /* ---- hub: Ward Investigations (LOC-01) ---- */
  office: {
    title: 'Ward Investigations',
    background: 'radial-gradient(ellipse at 38% 64%, rgba(232,180,106,0.16) 0%, transparent 44%), radial-gradient(ellipse at 71% 38%, rgba(120,150,180,0.10) 0%, transparent 40%), linear-gradient(180deg, #0a0b0d 0%, #07080a 55%, #04050a 100%)',
    description: 'A second-floor office above a pawnshop. A green banker lamp on the desk, an ashtray, a bottle of rye, a rotary telephone. A cork evidence board covers the east wall. The wall clock is stopped at 3:47.',
    audio: 'office',
    hotspots: [
      { id: 'mailslot', name: 'Mail slot', lookText: 'A telegram lies under the door, unread for a day.', clue: 'C-01' },
      { id: 'desk', name: 'Desk', lookText: 'A cluttered desk. Case files, a cigarette that never burns down, a bottle of rye.' },
      { id: 'window', name: 'Window', lookText: 'Rain streaks the glass. The street below is empty. For now.', condition: { flag: 'act3', not: true } },
      { id: 'window3', name: 'Window', lookText: 'Rain on the glass. Across the street, the doorway of the closed bakery is empty — but the emptiness has a shape to it.', condition: 'act3' },
      { id: 'clock', name: 'Wall clock', lookText: 'Stopped at 3:47. It has been 3:47 for as long as you can remember.' },
      { id: 'radio', name: 'Radio', lookText: 'Static between stations. A murmur that is almost words, then nothing.' },
      { id: 'newspaper', name: 'Newspaper', lookText: 'The Gazette. October 17. It is always October 17.' },
      { id: 'casefiles', name: 'Case files', lookText: 'The Carver matter — a mundane tailing job. A contrast to everything else on this desk.' },
      { id: 'bottle', name: 'Bottle and glass', lookText: 'Rye. You pour two fingers. The shaking in your hand steadies, a little.' },
      { id: 'board', name: 'Evidence board', lookText: 'A cork board. A few pins, a red string you did not tie.', ui: 'board' },
      { id: 'drawer', name: 'Desk drawer', lookText: 'Locked, then not. A photograph you have not looked at in seven years.', clue: { id: 'C-45', condition: 'act4' }, item: 'notebook', condition: { flag: 'act4', equals: true } },
      { id: 'drawer1', name: 'Desk drawer', lookText: 'Locked. The key is in the pencil tray.', condition: { flag: 'act4', not: true } },
      { id: 'photodesk', name: 'A photograph on the desk', lookText: 'Ward, entering the Alden Archive, from across the street, blurred by rain. No note. No explanation. Taken today.', clue: 'C-36', condition: 'act3' },
      { id: 'photosleep', name: 'A print among your photographs', lookText: 'Ward, asleep at his desk, the Eye on the desk behind him. The angle is from the window. You did not take this.', clue: 'C-38', condition: 'act3' },
      { id: 'cabinet', name: 'Locked cabinet', lookText: 'A crowbar, wrapped in cloth, leans inside. Bought for the Carver case.', item: 'crowbar', condition: 'act2' },
      { id: 'coatrack', name: 'Coat rack', lookText: 'An old oilcloth hangs there — sailcloth, dark with age, a star woven into the weave.', item: 'wrap' },
      { id: 'map', name: 'City map', lookText: 'Blackwater Bay — Ward map. Locations marked in pencil.', ui: 'map' },
      { id: 'notebook', name: 'Notebook', lookText: 'A worn brown notebook with a bullet hole through the cover.', ui: 'notebook' }
    ]
  },

  /* ---- prologue: the alley ---- */
  alley: {
    title: 'The Alley Behind Merrow Street',
    background: 'linear-gradient(180deg, #0a0d13 0%, #05070c 55%, #02030a 100%)',
    description: 'Rain. No body. Only what the rain gave back.',
    audio: 'rain',
    hotspots: [
      { id: 'symbol', name: 'The mark in the brick', lookText: 'Five long points scratched deep into the wet brick, one point bent backward at the tip. Too even, too patient.', clue: 'C-02' },
      { id: 'button', name: 'Brass button', lookText: 'A brass button, anchor-and-crown, torn from an oilskin. The back is stamped VANE & SONS.', clue: 'C-03' },
      { id: 'hat', name: 'A grey fedora', lookText: 'Whitlock hat, lying crown-down in the rain. Inside the band: Crane & Sons, Boston.', item: 'hat' },
      { id: 'tracks', name: 'Tire impressions', lookText: 'A heavy automobile. The impressions fill with rain as you watch.' }
    ]
  },

  /* ---- LOC-02 Police ---- */
  police: {
    title: 'Blackwater Police Department',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #06080d 100%)',
    description: 'A granite station house. A desk sergeant who does not look up. Somewhere, a typewriter.',
    audio: 'office',
    hotspots: [
      { id: 'hale', name: 'Detective Arthur Hale', lookText: 'A worn man behind a desk with a false-bottom drawer.', dialogue: 'hale' },
      { id: 'records', name: 'Records room', lookText: 'The false bottom of the third cabinet. The 1929 file — sealed by the mayor office.', clue: 'C-49', condition: 'haAlly' },
      { id: 'registry', name: 'Mayor registry', lookText: 'The pre-filed report carries the mayor office stamp — a registry that never stamps police intake.' }
    ]
  },

  /* ---- LOC-03 Old Harbor ---- */
  oldharbor: {
    title: 'Old Harbor — the 1929 Site',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 50%, #06080d 100%)',
    description: 'Abandoned eastern piers. A memorial plaque — three names. A concrete plug, poured badly, seawater weeping from the crack.',
    audio: 'office',
    hotspots: [
      { id: 'memorial', name: 'The memorial', lookText: 'MERRITT. COLBY. ASH. Three night watchmen. You were the detective who got the "no witnesses" answer.' },
      { id: 'plug', name: 'The concrete plug', lookText: 'Poured in 1929. Cracked. Seawater weeps from the crack, slow and patient. The arm was sealed here.' },
      { id: 'watch', name: 'A pocket watch', lookText: 'A victim watch in the debris, stopped at 3:47.', item: 'watch' },
      { id: 'pier', name: 'The pier edge', lookText: 'You stand at the water. Your reflection is a beat late. You step back.' }
    ]
  },

  /* ---- LOC-04 Docks ---- */
  docks: {
    title: 'Blackwater Docks',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 50%, #05070c 100%)',
    description: 'A working waterfront. Cranes, crates, the Fidelity at the cannery wharf. Men in oilskins. The night shift walks like pallbearers.',
    audio: 'office',
    hotspots: [
      { id: 'pike', name: 'Jonah Pike', lookText: 'A rigger with a scar across his forearm, watching a crane.', dialogue: 'pike' },
      { id: 'oilskins', name: 'The night crew', lookText: 'The same oilskins as the day crew — but the boots are Vane work boots, and the shoulders carry coffins.', clue: 'C-20' },
      { id: 'fidelity', name: 'The Fidelity', lookText: 'The cannery steamer. A smell of old incense under the brine.' },
      { id: 'matchbook', name: 'The payphone', lookText: 'A matchbook in the coin return. A message in Doyle hand.', clue: 'C-27', condition: 'act3' }
    ]
  },

  /* ---- LOC-05 Museum ---- */
  museum: {
    title: 'Blackwater Museum',
    background: 'linear-gradient(180deg, #1b2430 0%, #101820 55%, #0a0d13 100%)',
    description: 'A mansion converted in 1904. Marble stairs, glass cases, half-empty plinths. A leak in the north gallery drips into a bucket that has been there since 1919.',
    audio: 'office',
    hotspots: [
      { id: 'vale', name: 'Dr. Eleanor Vale', lookText: 'A measured woman at the desk, guarded.', dialogue: 'vale' },
      { id: 'ledger', name: 'The 1712 ledger', lookText: 'Entry 4: a black stone, delivered by the estate of Captain Ezekiel Barrow, 1712. Kept in the cellar. No record of display.', clue: 'C-11' },
      { id: 'monograph', name: 'Crane monograph', lookText: 'The restricted copy. The final chapter cut out of every surviving copy.', clue: 'C-12', condition: 'vaTrust1' },
      { id: 'crypt', name: 'The basement crypt', lookText: 'Older than the town. On the wall, the star — with the points aligned correctly. The Barrow Stone, warm in a cold room, its socket geometry a match for the Eye.', clue: 'C-37', condition: 'vaTrust3' }
    ]
  },

  /* ---- LOC-06 Archive ---- */
  archive: {
    title: 'Alden Historical Archive',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #05070c 100%)',
    description: 'A granite Carnegie building, cathedral-quiet. Green lamps. The stacks go down three floors. In the stacks, a creak that is not the building.',
    audio: 'office',
    hotspots: [
      { id: 'crowley', name: 'Margaret Crowley', lookText: 'A timid archivist with steel spectacles.', dialogue: 'crowley' },
      { id: 'maproom', name: 'The 1834 map', lookText: 'Hand-drawn, varnished. In the margin, "the underworld passages" — "paid to leave vague. keep vague."', clue: 'C-19' },
      { id: 'ledger', name: 'The translation ledger', lookText: 'Two translations, side by side. Same words, opposite meaning. The Grey Chapter working ledger.', clue: 'C-30', condition: 'crTrust' }
    ]
  },

  /* ---- LOC-07 Graveyard ---- */
  graveyard: {
    title: 'Greyhaven Cemetery',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #05070c 100%)',
    description: 'The ridge above town. Old stones, newer stones, the Vane mausoleum. In the oldest quarter, a stone you have walked past before.',
    audio: 'rain',
    hotspots: [
      { id: 'grave', name: 'A weathered stone', lookText: 'ELIAS WARD — 1892–1929 — DROWNED IN THE HARBOR LIGHTS. Fresh flowers at the base.', clue: 'C-44', condition: 'act4' },
      { id: 'mausoleum', name: 'The Vane mausoleum', lookText: 'Obadiah Vane, 1890–1933. Clara Vane, 1913–1934. And a fourth stone, pre-carved, no dates: SILAS VANE — LAST OF THE NAME.' },
      { id: 'victims', name: 'The 1929 graves', lookText: 'Three in a row. Fresh flowers always. Someone tends the graves of the Harbor Lights dead.' }
    ]
  },

  /* ---- LOC-08 Hospital ---- */
  hospital: {
    title: 'St. Agnes Hospital',
    background: 'linear-gradient(180deg, #33415c 0%, #1b2430 55%, #0a0d13 100%)',
    description: 'Iodine and carbolic. Wards with screens. Evelyn station. The morgue is in the basement, cold.',
    audio: 'office',
    hotspots: [
      { id: 'marsh', name: 'Dr. Abel Marsh', lookText: 'The coroner. He will not talk at the hospital. His house, at night, is another matter.', dialogue: 'marsh', condition: 'night' },
      { id: 'evelyn', name: 'Evelyn Whitlock', lookText: 'A nurse at her station, a photograph of her father face-down in a drawer.', dialogue: 'evelyn' },
      { id: 'morgue', name: 'The morgue', lookText: 'Two recent bodies — wet, dry-lunged. "He looks surprised. They all look surprised."' }
    ]
  },

  /* ---- LOC-09 Mariner ---- */
  mariner: {
    title: 'The Mariner Hotel',
    background: 'linear-gradient(180deg, #1b2430 0%, #101820 55%, #0a0d13 100%)',
    description: 'Faded grandeur. A ballroom, white tablecloths, a desk clerk too polite. Room 7 is always "being cleaned."',
    audio: 'office',
    hotspots: [
      { id: 'registry', name: 'The guest book', lookText: 'October 15: Henry Whitlock, Boston, room 7. Fresh ink, a traced signature, a cut page pasted in.', clue: 'C-15' },
      { id: 'room7', name: 'Room 7', lookText: 'A hidden drawer under the wardrobe holds the private-dining ledger. The last entry: "room 7 — the warden table — six chairs. the detective is not invited."', clue: 'C-28' }
    ]
  },

  /* ---- LOC-10 Estate ---- */
  estate: {
    title: 'Whitlock Estate',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #05070c 100%)',
    description: 'A large old house on the Hill. Books piled everywhere, a half-packed suitcase. Five stopped clocks. The house smells of dust and old paper and, underneath, of a low tide.',
    audio: 'office',
    hotspots: [
      { id: 'evelyn', name: 'Evelyn Whitlock', lookText: 'At the door, blocking it, grief under her speed.', dialogue: 'evelyn' },
      { id: 'grate', name: 'The grate', lookText: 'Charred paper, water-stained. A ledger fragment: "the third extraction was not recorded in the parish roll."', clue: 'C-05' },
      { id: 'clocks', name: 'The five clocks', lookText: 'Mantel, wall, hall, kitchen, study. All stopped at 3:47.', clue: 'C-06' },
      { id: 'landing', name: 'The upstairs landing', lookText: 'A wet footprint — a Vane work boot, size eleven, drying from the outside in. Someone stood here, listening.', clue: 'C-07' },
      { id: 'journal', name: 'The journal', lookText: 'A calfskin journal. The first pages in clean hand, then a cipher. "Count the points of the star."', clue: 'C-08', condition: { any: ['hasStudyKey', 'hasCrowbar'] } },
      { id: 'crane', name: 'Crane papers', lookText: 'Crane notes, 1909–1912. A partial translation: "the script is not ours." A letter: "They drowned a woman for less."', clue: 'C-09', condition: { any: ['hasStudyKey', 'hasCrowbar'] } },
      { id: 'receipt', name: 'The lead receipt', lookText: 'Lead sheeting, a bell jar, sealing wax. September 28, 1936. He built the box before he found the thing.', clue: 'C-10', condition: 'hasStudyKey' },
      { id: 'photo34', name: 'The 1934 photograph', lookText: 'Boston, 1934. Whitlock lecturing. Father Mercer in the front row. And in the window glass — a third man. Vane.', clue: 'C-14', condition: { any: ['hasStudyKey', 'hasCrowbar'] } },
      { id: 'cletter', name: 'Crowley letter', lookText: 'Typed, unsigned, on Alden Archive letterhead: "Bring it to the detective who looked."', clue: 'C-34', condition: { any: ['hasStudyKey', 'hasCrowbar'] } },
      { id: 'album', name: 'The family album', lookText: 'A 1904 photograph. A young man in a boater hat with a star pin. "That is Obadiah Vane." He should be fourteen.', clue: 'C-46', condition: 'evTrustMax' },
      { id: 'letter', name: 'The mail tray', lookText: 'An undelivered letter, Whitlock hand, addressed to himself. A draft to Evelyn he never sent.', flag: 'hasUndeliveredLetter', doc: 'letter', condition: 'act2' }
    ]
  },

  /* ---- LOC-11 Church ---- */
  church: {
    title: 'Church of Saint Jude',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #05070c 100%)',
    description: 'A granite church built in 1834. Stained glass, worn pews, a confessional. The crypt below: bones, boxes, and the 1834–1912 records.',
    audio: 'office',
    hotspots: [
      { id: 'mercer', name: 'Father Thomas Mercer', lookText: 'A soft, exact man. A good liar with a guilty man pauses.', dialogue: 'mercer' },
      { id: 'crypt', name: 'The crypt', lookText: 'Iron boxes. The burial register of 1912, in code: "the professor woman — the tide took the witness."', clue: 'C-22', condition: 'cryptOpen' },
      { id: 'roll', name: 'The parish roll', lookText: 'Mercer, the Vanes, the Finches, the mayor clerk. One name struck in red, 1912: Sarah Whitlock.', clue: 'C-25', condition: 'cryptOpen' }
    ]
  },

  /* ---- LOC-12 Witchwood ---- */
  witchwood: {
    title: 'Witchwood Forest & the Sunken Chapel',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #05070c 100%)',
    description: 'Wet pines, moss, paths that match no map. Then the chapel: a ruin of black stone, a floor that dropped four feet, a chamber beneath with a star-shaped socket. On first entry — one second of total silence.',
    audio: 'rain',
    hotspots: [
      { id: 'oldtom', name: 'Old Tom Rath', lookText: 'A woodsman at the edge, axe over his shoulder.', dialogue: 'oldtom' },
      { id: 'socket', name: 'The star-shaped socket', lookText: 'A stone socket at the chamber center. The Eye empty home. Black water sits in it, still.', clue: 'C-50', item: 'rubber' },
      { id: 'dig', name: 'The abandoned dig', lookText: 'Tools left as if the crew vanished. The expedition logbook field copy confirms the timeline.' }
    ]
  },

  /* ---- LOC-13 Lighthouse ---- */
  lighthouse: {
    title: 'Kingsmouth Lighthouse',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #05070c 100%)',
    description: 'The white tower on the point. From the gallery, the bay: the Kettle is visibly darker than the surrounding sea — a black circle on grey water, like a pupil.',
    audio: 'office',
    hotspots: [
      { id: 'briggs', name: 'Samuel Briggs', lookText: 'An old man on the gallery, windburned, not turning.', dialogue: 'briggs' },
      { id: 'log', name: 'The lighthouse log', lookText: 'Leather volumes, 1712–1936. Every starless night marked with a star in the margin. Two centuries of new moons.', clue: 'C-23' },
      { id: 'almanac', name: 'The almanac', lookText: 'New moon, October 24, 11:14 PM. The starless tide. The lowest water of the year at 1:40 AM.', clue: 'C-24', condition: 'ritualDate' }
    ]
  },

  /* ---- LOC-14 Gazette ---- */
  gazette: {
    title: 'The Blackwater Gazette',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #05070c 100%)',
    description: 'A shabby newsroom. Typewriters, wire baskets, the presses below. A half-written editorial on a desk: "the town memory is for sale, and the buyer is…"',
    audio: 'office',
    hotspots: [
      { id: 'doyle', name: 'Frank Doyle', lookText: 'Feet on the desk, hat on. A drinker, a cynic with a cause.', dialogue: 'doyle', condition: { flag: 'act3', not: true } },
      { id: 'morgue', name: 'The morgue', lookText: '1912 in the fireproof cabinet. The 1929 ghost plate under the floorboards. "Witness sought."', clue: 'C-31' },
      { id: 'ghostplate', name: 'The 1929 front page', lookText: 'GAS EXPLOSION KILLS THREE. Under UV, the ghost headline: "WITNESS SOUGHT."', clue: 'C-32' },
      { id: 'doylefile', name: 'Doyle file', lookText: 'Two years of clippings, hidden in the floor. The last page, unfinished: "The tide is patient. The tide is —"', clue: 'C-26', condition: 'act3' }
    ]
  },

  /* ---- LOC-15 Harbormaster ---- */
  harbormaster: {
    title: 'Harbormaster Office',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #05070c 100%)',
    description: 'A cramped office on the pier. Charts, a barometer, a brass telephone, a safe. A photograph of Finch boy on the desk.',
    audio: 'office',
    hotspots: [
      { id: 'finch', name: 'Albert Finch', lookText: 'Sweating in his office, a rehearsed speech already failing.', dialogue: 'finch' },
      { id: 'manifest', name: 'The altered manifest', lookText: 'The Fidelity cargo tally, corrected in different ink. Under UV: "altar goods."', clue: 'C-16' },
      { id: 'survey', name: 'The 1891 survey', lookText: 'A pasted correction over the harbor entrance: "No passage." Under it, the surveyor note: "A channel runs under the town."', clue: 'C-18' },
      { id: 'safe', name: 'The safe', lookText: 'Finch private ledger — every alteration since 1933, Vane initials on the orders.', clue: 'C-48', condition: 'finchFlipped' }
    ]
  },

  /* ---- LOC-16 Cannery ---- */
  cannery: {
    title: 'The Old Cannery',
    background: 'linear-gradient(180deg, #101820 0%, #0a0d13 55%, #05070c 100%)',
    description: 'The great shed, rusted machines, conveyor belts, brine vats. The cold store is locked and smells of brine. No rats. Below it — the chapel, and beneath that, the tunnel mouth.',
    audio: 'office',
    hotspots: [
      { id: 'coldstore', name: 'The cold store', lookText: 'Locked. Always cold. A trapdoor under the false floor — the Order stair.', condition: 'act4' },
      { id: 'chapel', name: 'The chapel', lookText: 'A low stone room. The star carved over the door — correct. An altar of black stone.', condition: 'act4' },
      { id: 'altarcache', name: 'The altar cache', lookText: 'Behind the altar stone, per Crowley floor plan — an arm-seal, warm to the touch, the same socket star.', arm: true, condition: 'crowleyAid' },
      { id: 'chase', name: 'The great press', lookText: 'It groans when the tide changes. The night you were followed, you timed your movement to the groan.', condition: 'act2' }
    ]
  },

  /* ---- LOC-17 Under-City ---- */
  undercity: {
    title: 'The Under-City & the Drowned Harbor',
    background: 'linear-gradient(180deg, #000 0%, #05070c 55%, #02030a 100%)',
    description: 'Below the town: first the smugglers runs, then older stone, jointed with no mortar, doorways sized for no living architecture. Then the Drowned Harbor — a black canal under a stone vault. The water does not reflect. It shows what is behind you, or nothing at all.',
    audio: 'office',
    hotspots: [
      { id: 'ferryman', name: 'The Ferryman', lookText: 'A boat out of the dark. The water makes no sound against the hull.', dialogue: 'ferryman' },
      { id: 'forbiddentext', name: 'The Forbidden Text', lookText: 'A book of black slate pages. The sealing liturgy, whole. "THE STONE THAT HOLDS THE LINE SHALL NOT BE MOVED BY HANDS THAT PRAY FOR ITS MOVING."', clue: 'C-39' },
      { id: 'deathregister', name: 'The 1929 death register', lookText: 'WARD, Elias. Cause: drowning. Age: 37. Harbor Lights, pier 3. In the register original ink.', clue: 'C-40' },
      { id: 'chronicle', name: 'The Order chronicle', lookText: 'The true account, 1711–1933. "The son frightens the Chapter more than the father ever did."', clue: 'C-41' },
      { id: 'floodedchapel', name: 'The flooded chapel', lookText: 'An arm-seal, in the drowned chapel. The crowbar loosens it. The socket geometry matches the Barrow Stone.', arm: true }
    ]
  },

  /* ---- LOC-18 Chapel of the First Tide (mystery) ---- */
  chapel_first_tide: {
    title: 'The Chapel of the First Tide',
    background: 'linear-gradient(180deg, #101820 0%, #05070c 55%, #02030a 100%)',
    description: 'A tidal island off Kingsmouth. A mound of black stone, a doorway, a single chamber. The floor is carved with the star — correct. Ward: "I did not mark this. It is on the map."',
    audio: 'office',
    hotspots: [
      { id: 'bronzeplate', name: 'The bronze plate', lookText: 'The first doctrine, 1711, in Barrow own words: "We swear to tell our sons it is a warning and not a promise. When the line breaks, one shall remain who rows."', clue: 'C-43' },
      { id: 'fiftharm', name: 'The fifth arm-seal', lookText: 'On a stone shelf — the fifth arm-seal, the one that was never found. The floor is carved with the star. Correct.', arm: true },
      { id: 'script', name: 'The first-layer script', lookText: 'Older than the bronze. The Builders own words, complete. You understand fragments without translation, and it hurts.' }
    ]
  },

  /* ---- LOC-19 Sealed Hall ---- */
  sealed_hall: {
    title: 'The Sealed Hall',
    background: 'linear-gradient(180deg, #000 0%, #05070c 55%, #02030a 100%)',
    description: 'The floor of the world: a circular hall of black stone, five pillar-stations in a star, the basin at the center — black water, no reflection, full to the rim. The star floor is inlaid, correct. The Order lamps are islands in a cold dark.',
    audio: 'office',
    hotspots: [
      { id: 'vane', name: 'Silas Vane', lookText: 'At the center with the Eye socket before him. He holds a black stone — a false Eye. He does not know.', dialogue: 'vane' },
      { id: 'basin', name: 'The basin', lookText: 'Black water, no reflection, full to the rim. The low sound, at the threshold of hearing.' }
    ]
  }
};
