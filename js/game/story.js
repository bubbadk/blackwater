/* ============================================================================
   THE BLACK RELIQUARY — DEDUCTIONS, ENDINGS, ACTS, DOCUMENTS (Game Bible §6,§8,§12,§13.2)
   ============================================================================ */
window.BR = window.BR || {};

/* Deductions: { title, requires: [clueIds], anyOf: n (require any n of list),
   line (Ward's deduction), effect (flag). } */
BR.deductions = {
  'D-01': { title: 'Whitlock Was Being Followed', requires: ['C-01', 'C-02', 'C-03'], line: 'The telegram says trust no one. The symbol says he was marked before he knocked. The button says the men who took him work for Vane Lines. He was followed from the moment he left the chapel.' },
  'D-02': { title: 'The Cult Has Access to Police Records', requires: ['C-04', 'C-17', 'C-32'], line: 'The report was filed before I asked. The coroner 1929 notes were "borrowed." The Gazette 1929 front page reads like it was written by the same hand that buries cases. Someone inside the department — or above it — works for the Order.' },
  'D-03': { title: 'The Ship Manifest Was Altered', requires: ['C-16', 'C-18', 'C-20'], line: 'Two documents, fifty years apart, corrected by the same hand. The Order has been editing this town records for fifty years — through the harbormaster office.' },
  'D-04': { title: 'Father Mercer Lied', requires: ['C-14'], line: 'He told me he never met Whitlock. The photograph says otherwise — Boston, 1934, front row. Either the priest is lying, or someone wants me to believe he is.' },
  'D-05': { title: 'The Expedition Found a Subterranean Structure', requires: ['C-08', 'C-09', 'C-13', 'C-05'], line: 'The journal map shows the chapel sitting on top of a chamber that is not on any survey. The expedition found the Eye in a room that was never meant to be opened.' },
  'D-06': { title: 'The Drowned Star Symbol Is a Map', requires: ['C-02', 'C-37', 'C-19'], line: 'Five points. One circle. It is not a prayer — it is a floor plan. The points touch the five stations of the hall under the bay. The Order has been drawing a map for two hundred years and calling it a god.' },
  'D-07': { title: 'The Cult Does Not Understand the Original Text', requires: ['C-30', 'C-39'], line: 'The Order scripture is the sealing liturgy, read backwards. Their "prayer to open" is the Builders rite of sealing. Their god answered. It just answered the wrong question.' },
  'D-08': { title: 'The Eye Is a Seal', requires: ['C-37', 'C-39', 'D-07'], line: 'The Eye is not a key. It is a cork. The socket in the crypt matches the Eye base exactly. Whitlock pulled the cork. I have been carrying the town lock in my coat.' },
  'D-09': { title: 'Whitlock May Still Be Alive', requires: ['C-07', 'C-21'], line: 'No body. A wet footprint upstairs in a house the police swore was empty. And a tunnel map that runs from the docks to the cannery. The professor is not in the bay. He is under the cannery.' },
  'D-10': { title: 'The Order of the Drowned Star Exists', anyOf: ['C-02', 'C-13', 'C-22', 'C-25', 'C-28', 'C-33', 'C-41'], anyOfCount: 3, line: 'It is not a rumor and it is not a superstition. It has records, members, a meeting house, and two centuries of practice. It has a name — the Order of the Drowned Star.' },
  'D-11': { title: 'The 1929 Harbor Lights Case Was an Order Ritual', requires: ['C-32', 'C-17', 'C-40'], line: 'The "gas explosion" killed three men with dry lungs. The coroner private ledger says what the official record erased. It was not an accident. It was a rehearsal.' },
  'D-12': { title: 'Silas Vane Is the Warden', requires: ['C-16', 'C-28'], line: 'Every road leads back to the cannery, and the cannery leads back to Vane. The button, the manifest, the registry — his name is on all of it, just under the surface, like a drowned man hand.' },
  'D-13': { title: 'The Grey Chapter Knows the Truth', requires: ['C-30', 'C-34'], line: 'Not everyone in the Order believes the doctrine. A minority has known the truth for generations and has been quietly making sure the ritual never works. They are not my enemies. Crowley is one of them.' },
  'D-14': { title: 'The Ritual Occurs on the Starless Night', requires: ['C-23', 'C-24', 'C-33'], line: 'Every starless night for two hundred years, the Order has met. The next starless night is October 24th. The new moon. They are not waiting for a god. They are waiting for a calendar.' },
  'D-15': { title: 'The Gate Is Beneath the Cannery', requires: ['C-21', 'C-19'], line: 'Pike tunnels, the 1834 map "underworld passages," and the door I found under the cannery cold store — they all join. The Gate is not in the bay. It is under the town, and the cannery is the lid.' },
  'D-16': { title: 'The Dry Drownings Are Not the Cult Work', requires: ['C-17', 'C-29', 'D-08'], line: 'The Order kills with guns and rope, like men. The dry drownings are something else — no water in the lungs, skin wet. The cult does not do this. The cult is afraid of this. It is the leak.' },
  'D-17': { title: 'The Underground Harbor Exists', requires: ['C-19', 'C-18', 'C-21'], line: 'Three maps, one channel. There is a drowned harbor under the town — big enough for boats — and it connects to the bay. The Order has been using it for two hundred years. So can I.' },
  'D-18': { title: 'A Witness Is Lying', requires: ['C-15', 'C-16'], line: 'The story and the evidence do not agree. One of them is lying — or both are, in different directions.' },
  'D-19': { title: 'Someone Has Entered the Office', requires: ['C-36', 'C-38'], line: 'The drawer was open. The board was different. There is a photograph of me on my own desk, taken from inside this room. They are not stealing. They are telling me they can.' },
  'D-21': { title: 'Ward Died in 1929', requires: ['C-40', 'C-44', 'C-45'], line: 'The register lists me as drowned in 1929. The stone in Greyhaven carries my name and the dates I was alive. I am looking at my own death certificate and I am still holding the pen. Some doors you open once.', secret: true }
};

/* Act gates: what the player needs before the act advances. Each gate lists
   deduction ids (all required). */
BR.actGates = {
  'act1': { title: 'ACT I — The Missing Professor', requires: [], open: ['police', 'estate', 'museum', 'gazette', 'docks', 'harbormaster', 'oldharbor', 'church', 'hospital', 'witchwood', 'lighthouse'] },
  'act2': { title: 'ACT II — The Drowned Star', requires: ['D-01', 'D-10'], open: ['archive', 'mariner', 'cannery', 'graveyard'] },
  'act3': { title: 'ACT III — The Investigation Turns', requires: ['D-02', 'D-06', 'D-11', 'D-17'], open: [] },
  'act4': { title: 'ACT IV — Beneath Blackwater', requires: ['D-19', 'D-15', 'D-08'], open: ['undercity', 'chapel_first_tide', 'graveyard'] },
  'act5': { title: 'ACT V — The Drowned Gate', requires: ['D-07', 'D-08', 'D-09', 'D-14'], open: ['sealed_hall'] }
};

/* Endings: { title, unlock, condition (fn state), epilogue: [paragraphs] } */
BR.endings = {
  guardian: {
    title: 'THE GUARDIAN',
    unlock: 'You closed the door. Whether it stays closed is a different investigation.',
    epilogue: [
      'The rain is back. It has been back — it never really left; it just got honest about it. The Gazette ran the story the Order wrote: the cannery foundations gave way, a sinkhole, a shameful end to a great man empire. The truth is in my cabinet, behind the good whiskey.',
      'The box is locked. I checked it twice tonight. The stone has been quiet — the way a sleeping animal is quiet.',
      'The phone rang at 3:47. I let it ring. Some things you only answer once.',
      'The box is locked. I am going to stop checking.'
    ],
    last: 'The cabinet, the box, the desk, the rain on the glass. The camera holds on the box a second too long. The box lid is ajar — just barely, a hairline of dark.'
  },
  scholar: {
    title: 'THE SCHOLAR',
    unlock: 'You learned more than a human mind should know. The mind is still learning.',
    epilogue: [
      'I know now why the town never changed. The calendar has been October for a month, and I have stopped being surprised.',
      'The text said the deep remembers the land. I understand it now, the way you understand a language you have been hearing your whole life. Blackwater was never a town. It is a sentence, written in water, waiting for someone to read it aloud.',
      'I read it aloud.',
      'The box is open. The stone is warm. I do not remember unlocking the box. I remember the figure under the water, and I remember that it waved, and I remember that I knew its face because I have been shaving it for forty-four years.'
    ],
    last: 'Ward at the desk, writing. The handwriting is beautiful and unfamiliar. The calendar flips — October 17, 1929. The bay, from above, is the shape of an eye.'
  },
  drownedStar: {
    title: 'THE DROWNED STAR',
    unlock: 'You joined a church that never existed. You are now its only member — and its only staff.',
    epilogue: [
      'The Order is gone. Not destroyed — gone, the way a tide pool empties. The faithful are with the water now, and the water remembers them, and they are probably still singing. I cannot hear them. I can hear everything else.',
      'I am the last one. The last Warden of a church that worshipped its own warning. I know what the star is. I know what the door is. I know what I am now — I am the keeper of the thing they were all running toward, and I am the one who has to keep it shut.',
      'The Ferryman said fares are paid in what you are willing to forget. I have forgotten everything except the job. I think that was the fare.',
      'The box is on the desk. The stone is in the box. I am going to learn to row.'
    ],
    last: 'Ward in a boat, on black water, under the town. The oars move without sound. His face is older, and it is the Ferryman face, in the way that matters.'
  },
  drownedWorld: {
    title: 'THE DROWNED WORLD',
    unlock: 'The deep remembered the land. The land was remembered.',
    epilogue: [
      'I should have buried it. That is the whole case, that is the whole confession: I should have buried it, and instead I carried it around the town like a badge.',
      'The lights are out on Harbor Road. The cannery is gone. The church is gone — I can see the steeple, and the water is up to the bell. The bell is not ringing. It is underwater. It will never ring again.',
      'I can hear them. Not the town — the town is quiet. I can hear the water, and the water is full of voices, and the voices are singing the catechism, and they are happy. They are happy, and they are wrong, and it does not matter anymore.',
      'The water is at the window. My reflection is in the glass. The water is rising past my reflection. The reflection is not rising with it. It is standing on the street below, looking up at me, and it is younger, and it is wearing a police uniform, and it waves.',
      'I am going to open the window. The tide has been waiting for me since 1929.'
    ],
    last: 'The window opens. The black water comes in, unhurried. The screen goes deep, and from below, the star floor glows, faint and patient. Above, the Kettle — a dark pupil in grey water. The pupil opens.'
  },
  detective: {
    title: 'THE DETECTIVE',
    unlock: 'You solved the case. The case is still solving you.',
    epilogue: [
      'The Gazette headline was theirs, this time: "VANE EMPIRE CRUMBLES — FRAUD AND KIDNAPPING CHARGES." It is not the whole story. It is the story the town can carry without going mad, and I have made my peace with carrying the rest myself.',
      'Hale came through. He has the department now, and the department has a spine, and the spine has my number on it. The fish are biting. That is our code. It means: alive, and watching.',
      'Evelyn is at St. Agnes. She forgave him the cowardice, not the books. She asked me if the water took him. I told her the truth: the water never got him. The Order did.',
      'Eleanor is at the museum. She is writing the true account of the Order, for the archive locked room. Crowley gave her the key. I believe in Eleanor, and I believe in the box.',
      'The box is in the cabinet. The stone is quiet. The tide is quiet. The town is quiet — the quiet of a thing that almost drowned and knows it.',
      'The phone has been ringing all morning. A new case — a missing boy, up near Witchwood. The boy mother says he went into the forest and the forest gave her a hat back.',
      'I am going to take the case.'
    ],
    last: 'Ward puts on his coat. The office door opens onto the rainy street. The camera stays in the office. The cabinet door is open. The box has moved six inches to the left.'
  },
  secret: {
    title: 'THE INVESTIGATION CONTINUES',
    unlock: 'You found the truth about yourself. The truth is still investigating.',
    epilogue: [
      'I went back to the office. Of course I went back to the office. The office is where I live. The office is where I died — that is the sentence I cannot unwrite, and I have stopped trying.',
      'The calendar has been October for a month. The cigarette in the ashtray is the same length it was when I came in — the same cigarette, from the same night. Whitlock hat is on the rack. It has been October 17th for seven years.',
      'I found the register. I found the stone. I found the photograph that is older than it should be. And I found the one piece I cannot file away: the town kept me. The town needed a keeper, so the town kept the one man who looked — and the keeping felt like life, and I have been dead the whole time, and I have been happy, and I have been wrong, and both of those things are true at once.',
      'The Ferryman is still waiting. He said I can row or I can sleep. He said the water is patient. It has been patient since the Harbor Lights.',
      'I am going to keep the office open. That is my answer. If I am the keeper, I keep — the town, the records, the line, the box. The box is on the desk. The stone is in the box.',
      'The investigation continues.'
    ],
    last: 'Ward at the desk, writing. The handwriting is his — the way it was in 1929. Across the street, a figure in the doorway of the closed bakery, watching. It is wearing a police uniform. It is younger. It waves.',
    final: 'The town kept him. That is the kindest and the cruellest thing the water ever did.'
  }
};

/* Loading cards (§13.2) — key transitions. */
BR.loadingCards = {
  office: { location: 'Ward Investigations', time: '11:47 PM · October 17, 1936', note: 'Rain continues. The harbor fog has not lifted.' },
  docks: { location: 'Blackwater Docks', time: '6:10 AM · October 18, 1936', note: 'The tide is coming in. The night shift has not gone home.' },
  estate: { location: 'Whitlock Estate', time: '9:22 AM · October 18, 1936', note: 'Five clocks. One time.' },
  police: { location: 'Blackwater Police', time: '11:05 AM · October 18, 1936', note: 'The desk sergeant does not look up.' },
  museum: { location: 'Blackwater Museum', time: '2:47 PM · October 18, 1936', note: 'The leak has been dripping since 1919.' },
  archive: { location: 'The Alden Archive', time: '8:15 PM · October 19, 1936', note: 'The stacks go down three floors.' },
  church: { location: 'Church of Saint Jude', time: '10:40 PM · October 19, 1936', note: 'The crypt air is still.' },
  cannery: { location: 'The Old Cannery', time: '1:05 AM · October 20, 1936', note: 'Somewhere a bell is ringing under water.' },
  undercity: { location: 'The Under-City', time: 'TIME UNKNOWN · DEPTH UNKNOWN', note: 'The map stops being honest.' },
  sealed_hall: { location: 'The Sealed Hall', time: '11:14 PM · October 24, 1936', note: 'The starless night.' },
  graveyard: { location: 'Greyhaven Cemetery', time: '11:58 PM · October 23, 1936', note: 'The flowers are fresh.' },
  witchwood: { location: 'Witchwood Forest', time: 'Dusk', note: 'One second of total silence.' },
  lighthouse: { location: 'Kingsmouth Lighthouse', time: 'Evening', note: 'The Kettle is darker than the sea around it.' },
  hospital: { location: 'St. Agnes Hospital', time: 'Afternoon', note: 'Iodine and carbolic.' },
  mariner: { location: 'The Mariner Hotel', time: 'Evening', note: 'A string quartet plays the same piece every night.' },
  gazette: { location: 'The Blackwater Gazette', time: 'Morning', note: 'The presses are warm from the night run.' },
  harbormaster: { location: 'Harbormaster Office', time: 'Afternoon', note: 'The barometer ticks.' },
  oldharbor: { location: 'Old Harbor', time: 'Evening', note: 'The gulls do not land on the plug.' },
  alley: { location: 'The Alley', time: '11:52 PM · October 17, 1936', note: 'Two gunshots. Then silence.' },
  chapel_first_tide: { location: 'The Chapel of the First Tide', time: 'Low tide', note: 'It is on the map. You did not put it there.' }
};

/* Key in-fiction documents (§8), shown in the notebook's DOCUMENTS section. */
BR.documents = {
  telegram: { title: 'The Telegram (C-01)', text: 'WESTERN UNION\nBLACKWATER BAY MASS OCT 16 1936 9:12 PM\n\nWARD INVESTIGATIONS\n47 MERRROW ST BLACKWATER BAY MASS\n\nCOMING TOMORROW NIGHT STOP DO NOT OPEN THE PACKAGE IF IT COMES BEFORE ME STOP DO NOT CALL THE POLICE STOP THEY WEAR THE STAR STOP\n\nH.W.' },
  liturgy: { title: 'The Sealing Liturgy (C-39)', text: 'First, the line was laid, and the line was the water memory of the land, and the memory was held, and the land forgot the deep.\n\nFive stones held the line against the rising, and the Eye held the five, and the Eye was the stone that holds the line.\n\nLet no hand that prays for the rising touch the stone that holds the line.\n\nFor the water is patient, and the water remembers, and when the line breaks the land shall be remembered, and the remembering is the drowning.\n\nAnd the star is the floor, and the floor is the star, and the door is the thing that is kept shut.' },
  deathcert: { title: 'The Death Certificate (C-40)', text: 'COMMONWEALTH OF MASSACHUSETTS\nCERTIFICATE OF DEATH\n\nName: WARD, Elias\nOccupation: Detective, City Police\nDate of Death: November 3, 1929  Time: 3:47 AM\nPlace: Harbor Lights, pier 3\nCause: DROWNING\nRemarks: Deceased: unclaimed. Body not recovered. File closed by order of the Mayor Office.\nSigned: Dr. A. Marsh, Coroner' },
  bronzeplate: { title: 'The Bronze Plate, 1711 (C-43)', text: 'WE WHO HAVE SEEN THE STONE SWEAR TO KEEP IT.\nWE SWEAR TO KEEP IT BURIED.\nWE SWEAR TO TELL OUR SONS IT IS A WARNING AND NOT A PROMISE.\nTHE STAR IS A WARNING.\nTHE LINE IS A LINE.\nWHEN THE LINE BREAKS, ONE SHALL REMAIN WHO ROWS.\n\n[second hand:]\nwe kept the oath. we are sorry.' },
  journal: { title: 'Whitlock Journal — Decoded (C-08)', text: 'September 27. It was there. In the cache beneath the socket — wrapped in the cloth, the cloth with the star — it was there. The Eye. Crane notes called it "the stone that holds the line." I held it and I understood, all at once, what Crane meant and why he died and why Sarah died. It is not a key. It is a cork. I have pulled the cork out of the bottom of the world and the water is coming up through the hole.\n\nIf you are reading this, Mr. Ward: the box is built. The cloth is the map. The star is the floor. Put it back. Put it back and do not look at the water.' },
  letter: { title: 'The Undelivered Letter', text: 'Evelyn,\n\nIf you are reading this, the expedition went the way I feared, and I am gone, and I need you to know the rest before the Order version reaches you. Your mother did not drown. She was killed — in 1912 — because a man named Crane had found something and would not let it go, and they drowned the closest thing to him to make him stop. I have known for twenty-four years. I have been afraid for twenty-four years. I built a life of books on top of a grave and I called it scholarship.\n\nForgive me the cowardice. Forgive me the books. Do not forgive them. — your father' },
  catechism: { title: 'The Order Catechism', text: 'THE DOCTRINE OF THE DROWNED STAR\n\nI. The Star is the gate of the Drowned One, who sleeps beneath the waters of the world.\nII. The Eye is the key that opens the gate.\nIII. When the faithful return the Eye to the heart of the star on the starless night, the gate shall open and the world shall be washed clean.\nIV. The faithful shall not fear the water.\nV. The unfaithful shall be remembered by the tide, and the tide forgets nothing.' }
};
