/* ============================================================================
   THE BLACK RELIQUARY — DIALOGUE TREES (Game Bible §9, canonical lines)
   Engine format: { start, nodes: { id: { speaker, text, effects?, choices? } } }
   Choices: { label, next|null, condition?, effects? }  Node-entry effects fire on arrival.
   ============================================================================ */
window.BR = window.BR || {};

BR.dialogues = {

  /* ---------------------------------------------------------- D-WH (Prologue) */
  whitlock: {
    start: 'wh01',
    nodes: {
      wh01: {
        speaker: 'Professor Henry Whitlock',
        text: 'Mr. Ward. You do not know me. I am the man who is about to ruin your evening. (He closes the door, locks it, looks at the window.) I have been walking the streets for an hour trying to decide whether to come up. The rain made the decision for me.',
        choices: [{ label: '…', next: 'wh02' }]
      },
      wh02: {
        speaker: 'Elias Ward',
        text: 'The rain is a good lawyer. Sit down before you drip on the file cabinet.',
        choices: [{ label: '…', next: 'wh03' }]
      },
      wh03: {
        speaker: 'Professor Henry Whitlock',
        text: 'I will stand. I have been sitting in my own fear for two weeks. Standing is the only honest posture left. (A beat.) Professor Henry Whitlock. Archaeology, retired. You do not read the journals, so the name means nothing — that is fine. What I brought means something.',
        choices: [{ label: '…', next: 'wh04' }]
      },
      wh04: {
        speaker: 'Elias Ward',
        text: 'You brought rain. And a package. The package is new.',
        choices: [{ label: '…', next: 'wh05' }]
      },
      wh05: {
        speaker: 'Professor Henry Whitlock',
        text: 'I made a mistake, Mr. Ward. I found something that should have remained buried.',
        effects: [{ setFlag: { hasEye: true } }, { addItem: 'eye' }],
        choices: [{ label: '…', next: 'wh06' }]
      },
      wh06: {
        speaker: 'Elias Ward',
        text: 'This is a mistake? This is the mistake. Eighteen centimeters of it. What is it?',
        choices: [
          { label: 'Ask about the expedition', next: 'wh11' },
          { label: 'Ask who "they" are', next: 'wh12' },
          { label: 'Ask why me', next: 'wh13' },
          { label: 'Press — what do they want with it?', next: 'wh15' }
        ]
      },
      wh11: {
        speaker: 'Professor Henry Whitlock',
        text: 'The September storm tore the north wall off a ruin the locals call the Sunken Chapel. We opened a chamber under the floor. There was a socket in the center, star-shaped, and water in it the color of ink. The Eye was in a cache beneath, wrapped in cloth two hundred years old. I read the inscription with my mentor notes. Crane. He knew in 1912. They killed him for it — and they drowned my wife to make the point. I have been a coward about that for twenty-four years. This is me, un-cowarding.',
        choices: [
          { label: 'Ask who "they" are', next: 'wh12' },
          { label: 'Ask why me', next: 'wh13' },
          { label: 'Press — what do they want with it?', next: 'wh15' }
        ]
      },
      wh12: {
        speaker: 'Professor Henry Whitlock',
        text: 'The Order of the Drowned Star. They have owned this town since 1711 — through the church, the docks, the records office, the police. You do not see them because they are the wallpaper. I am telling you so that you understand what you are holding: the most wanted object in Blackwater Bay. (He checks the window again.)',
        choices: [
          { label: 'Ask about the expedition', next: 'wh11' },
          { label: 'Ask why me', next: 'wh13' },
          { label: 'Press — what do they want with it?', next: 'wh15' }
        ]
      },
      wh13: {
        speaker: 'Professor Henry Whitlock',
        text: 'Because you looked, once. 1929. Harbor Lights. Three men dead and a witness named Ruth Corbin, and you looked at the mayor story and you did not believe it — and then they broke you, and you stopped. A friend of mine — an admirer of the true text — told me you are the only man in this town who ever looked. (Quietly.) I need you to look again. I am too old to be the one who finishes this, and too cowardly to be the one who dies for it.',
        choices: [
          { label: 'Ask about the expedition', next: 'wh11' },
          { label: 'Ask who "they" are', next: 'wh12' },
          { label: 'Press — what do they want with it?', next: 'wh15' }
        ]
      },
      wh15: {
        speaker: 'Professor Henry Whitlock',
        text: 'If they find it, they will believe the door can be opened. (Headlights sweep past the window. His face changes.) They are wrong. (Beat. Very quiet.) But the door is real, Mr. Ward. The door is real, and the Eye is what keeps it shut. I pulled the cork. I need you to put it back.',
        effects: [{ setFlag: { autoSeen: true } }],
        choices: [{ label: 'He is already moving toward the rear stair.', next: 'wh16' }]
      },
      wh16: {
        speaker: 'Professor Henry Whitlock',
        text: 'Keep it wrapped. Do not show it to the church. Do not show it to the police. Show it only to the man who reads the true text — she will find you. (At the door, without turning.) I was going to publish. The find of the century. That is the sin at the bottom of all of this — I wanted it known. (Gone. Rain. Then two gunshots.)',
        effects: [{ setFlag: { whitlockGone: true } }],
        choices: [{ label: 'Run to the alley', next: null }]
      }
    }
  },

  /* -------------------------------------------------------------- D-EV Evelyn */
  evelyn: {
    start: 'ev01',
    nodes: {
      ev01: {
        speaker: 'Evelyn Whitlock',
        text: 'You are Ward. The detective. My father mentioned you, which is strange, because my father did not mention people. He collected them in files. (She blocks the door.) He is missing, and the police closed the case in a day, and I have had three men in Vane Lines oilskins walk past this house this morning. So you will forgive me if I do not invite in the fourth stranger.',
        choices: [
          { label: 'Ask when she last saw him', next: 'ev03' },
          { label: 'Ask to see his study', next: 'ev05' },
          { label: 'Show the Eye', next: 'ev09', condition: { flag: 'hasEye', equals: true } },
          { label: 'Give her the undelivered letter', next: 'evletter', condition: 'hasUndeliveredLetter' },
          { label: 'Leave', next: null }
        ]
      },
      ev03: {
        speaker: 'Evelyn Whitlock',
        text: 'October 15th. He came home from the dig, soaked, and told me he would be gone a few days — "important business, do not wait up." He hugged me. He never hugs me. He hugged me like a man saying goodbye. He knew something was coming. It is the knowing that is the disease.',
        choices: [
          { label: 'Ask to see his study', next: 'ev05' },
          { label: 'Press — what did he know?', next: 'ev07' },
          { label: 'Show the Eye', next: 'ev09', condition: { flag: 'hasEye', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      ev05: {
        speaker: 'Evelyn Whitlock',
        text: 'No. I do not know you. His study is his — the only place he was ever himself. You can have the house when I have a reason.',
        choices: [
          { label: 'Show the Eye', next: 'ev09', condition: { flag: 'hasEye', equals: true } },
          { label: 'Press — what did he know?', next: 'ev07' },
          { label: 'Leave', next: null }
        ]
      },
      ev07: {
        speaker: 'Evelyn Whitlock',
        text: 'He knew something about mother. He has known since I was a child. When I was twelve I found him in the study at 3 AM, holding a photograph of her, and he said — he said, "The sea gives, Evelyn, and the sea takes, and I have been a coward about the taking." I did not understand. I am twenty-nine and I still do not understand. If you find out, Mr. Ward — tell me before you tell the police.',
        choices: [
          { label: 'Show the Eye', next: 'ev09', condition: { flag: 'hasEye', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      ev09: {
        speaker: 'Evelyn Whitlock',
        text: '(Staring, the first real crack.) …That is the thing from the study wall. When I was a child, his desk had a drawing pinned above it — this. Five points, one bent. I asked what it was. He said it was "the family old trouble." I thought he meant the name. (Long beat.) You can see the study. Keep the key.',
        effects: [{ setFlag: { evTrust: true } }, { addItem: 'studykey' }],
        choices: [{ label: 'Thank her and enter the study', next: null }]
      },
      evletter: {
        speaker: 'Evelyn Whitlock',
        text: '(Reading the undelivered letter. Her face does a long, complicated thing.) …He knew. About mother. He knew all along, and he was afraid, and he built books on top of it. (She folds the letter carefully.) The study is open. Everything is open. And Mr. Ward — when you find him — you tell him I forgive him the cowardice. Just the cowardice. Not the books.',
        effects: [{ setFlag: { evTrustMax: true } }],
        choices: [{ label: 'Take your leave', next: null }]
      }
    }
  },

  /* ---------------------------------------------------------------- D-HA Hale */
  hale: {
    start: 'ha01',
    nodes: {
      ha01: {
        speaker: 'Detective Arthur Hale',
        text: 'Elias. Seven years and you come back to the house I work in. (He waves Ward in.) What is it this time — a missing husband or a missing bottle?',
        choices: [
          { label: 'The missing professor — the report was pre-filed', next: 'ha03' },
          { label: 'Ask about the 1929 file', next: 'ha05' },
          { label: 'Ask about Ruth Corbin', next: 'ha07' },
          { label: 'Leave', next: null }
        ]
      },
      ha03: {
        speaker: 'Detective Arthur Hale',
        text: 'Filed last night? The report came in this morning. I read it at ten. (He pulls the file; the complainant line is blank.) No complainant. No time of filing. This came from upstairs. (He closes it.) Elias, there are things in this building I have learned not to pull on. That file is one of them.',
        effects: [{ revealClue: 'C-04' }],
        choices: [
          { label: 'Ask about the 1929 file', next: 'ha05' },
          { label: 'Ask about Ruth Corbin', next: 'ha07' },
          { label: 'Leave', next: null }
        ]
      },
      ha05: {
        speaker: 'Detective Arthur Hale',
        text: 'The 1929 file does not exist. I can tell you that with authority. I am the one who made it not exist. (He pours two whiskies.) I was following orders, Elias. The mayor office. "The town nerves, Art. The town nerves are the asset." I was twenty-nine years old and I believed in the job, so I did it. (He drinks.) I have buried three men from that night. I would rather not bury you.',
        choices: [
          { label: 'Show him the evidence', next: 'ha11', condition: { flag: 'hasLedger', equals: true } },
          { label: 'Ask about Ruth Corbin', next: 'ha07' },
          { label: 'Threaten him with Boston', next: 'ha13' },
          { label: 'Leave', next: null }
        ]
      },
      ha07: {
        speaker: 'Detective Arthur Hale',
        text: '(Low.) She disappeared the night you were taken off the case. No body. No note. Her room at the boarding house was clean — too clean. Folded clothes, scrubbed floor. Someone wiped the room, Elias. Someone wiped a whole person out of the world with a mop. (He meets Ward eyes.) I think about her every time I sign a report I do not believe.',
        choices: [
          { label: 'Ask about the 1929 file', next: 'ha05' },
          { label: 'Leave', next: null }
        ]
      },
      ha11: {
        speaker: 'Detective Arthur Hale',
        text: '(Reading the ledger. His hand goes still on the glass.) …The register says you. (He looks up; something old and scared in his face.) Elias. I stood on the pier with your widow. There was no widow. There was never a widow. (He swallows it.) The file is in the records room, false bottom of the third cabinet. Take it. And when you need me — for anything that is not official — you call this number and you say the fish are biting.',
        effects: [{ setFlag: { haAlly: true } }, { revealClue: 'C-49' }],
        choices: [{ label: 'Take the number', next: null }]
      },
      ha13: {
        speaker: 'Detective Arthur Hale',
        text: '(Cold, hurt.) …That is how you thank the man who buried three men to keep your name off the pier? (He stands, suddenly a cop again.) You watch your back, Ward. The town has got more eyes than I do.',
        effects: [{ setFlag: { haleBetrayed: true } }],
        choices: [{ label: 'Leave the station', next: null }]
      }
    }
  },

  /* ---------------------------------------------------------------- D-VA Vale */
  vale: {
    start: 'va01',
    nodes: {
      va01: {
        speaker: 'Dr. Eleanor Vale',
        text: 'Mr. Ward. I was told you would come. The Gazette has been quiet about the professor, which means the police have been loud about something else, and a detective who reads between those two lines usually ends up here. (She does not smile.) Ask your questions. I will decide which to answer.',
        choices: [
          { label: 'Ask about Whitlock', next: 'va03' },
          { label: 'Ask about the 1712 ledger', next: 'va05' },
          { label: 'Ask about Crane monograph', next: 'va07' },
          { label: 'Leave', next: null }
        ]
      },
      va03: {
        speaker: 'Dr. Eleanor Vale',
        text: 'I knew his work. He was the only living scholar who took the North Shore ruins seriously. He was also the only scholar who ever asked me about the museum provenance records. (Beat.) He was afraid of something, Mr. Ward. Scholars get afraid of archives, not of things. He was afraid of a thing.',
        choices: [
          { label: 'Ask about the 1712 ledger', next: 'va05' },
          { label: 'Ask about Crane monograph', next: 'va07' },
          { label: 'Show the Eye', next: 'va09', condition: { flag: 'hasEye', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      va05: {
        speaker: 'Dr. Eleanor Vale',
        text: 'In storage. It has been in storage since before the museum existed — the deed says "the cellar," and the cellar has been the cellar for two hundred years. It is catalogued as a Pacific idol, provenance uncertain. (She studies him.) Why does a missing-professor case care about a rock in the cellar?',
        effects: [{ revealClue: 'C-11' }],
        choices: [
          { label: 'Ask about Crane monograph', next: 'va07' },
          { label: 'Show the Eye', next: 'va09', condition: { flag: 'hasEye', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      va07: {
        speaker: 'Dr. Eleanor Vale',
        text: 'The restricted shelf — you mean the shelf I control. Crane monograph is there because every copy has a missing final chapter, and every scholar who requested it left Blackwater within a year. I stopped lending it. (She takes it down.) You may read it here. And if you finish it and go pale, you will be the fourth.',
        effects: [{ setFlag: { vaTrust1: true } }, { revealClue: 'C-12' }],
        choices: [
          { label: 'Show the Eye', next: 'va09', condition: { flag: 'hasEye', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      va09: {
        speaker: 'Dr. Eleanor Vale',
        text: '(A long, professional silence.) …The socket pattern. The base. I have seen this geometry before — in the cataloguing of the cellar stone, and in a drawing in my husband journal. (She stops.) Daniel was a fisherman, Mr. Ward. He was not supposed to be right about anything the sea showed him. He was right about this. (She takes Daniel journal from a locked drawer.) Read it. Then tell me what you think the water is doing under the docks.',
        effects: [{ setFlag: { vaTrust2: true } }, { revealClue: 'C-29' }],
        choices: [
          { label: 'Ask about the crypt', next: 'va13', condition: { flag: 'vaTrust2', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      va13: {
        speaker: 'Dr. Eleanor Vale',
        text: 'The basement is older than the town, Mr. Ward. The museum was built on a site that was a church before the church existed — the builders found walls under the footings and built over them. (She leads him down.) I have never shown this to anyone. Try not to make me regret it.',
        effects: [{ setFlag: { vaTrust3: true, cryptShown: true } }, { revealClue: 'C-37' }, { addItem: 'armseal' }],
        choices: [{ label: 'The Barrow Stone is yours', next: null }]
      }
    }
  },

  /* -------------------------------------------------------------- D-ME Mercer */
  mercer: {
    start: 'me01',
    nodes: {
      me01: {
        speaker: 'Father Thomas Mercer',
        text: 'Mr. Ward. I have heard the name — the town detective, the one who left the force. I have also heard you are looking into Professor Whitlock disappearance. (He lets Ward in.) I knew the professor, of course. A difficult man, a good man. The town will miss him.',
        choices: [
          { label: 'Ask if he knew him personally', next: 'me03' },
          { label: 'Ask about the parish records', next: 'me05' },
          { label: 'Ask about the Order', next: 'me07' },
          { label: 'Show the 1934 photograph', next: 'me09', condition: { flag: 'hasPhoto34', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      me03: {
        speaker: 'Father Thomas Mercer',
        text: '(The lie, delivered smoothly.) I never met Professor Whitlock. (A beat — the beat is the only tell.) I knew him as the parish knows its notable names. We corresponded, once or twice, about the church old records. Nothing more.',
        choices: [
          { label: 'Ask about the parish records', next: 'me05' },
          { label: 'Ask about the Order', next: 'me07' },
          { label: 'Show the 1934 photograph', next: 'me09', condition: { flag: 'hasPhoto34', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      me05: {
        speaker: 'Father Thomas Mercer',
        text: 'He asked about the crypt. Whether the church had ever kept anything besides the dead down there. (A priest practiced smile.) I told him the crypt holds nothing but bones and old boxes. Which is true. It is the boxes that are not empty.',
        choices: [
          { label: 'Ask about the Order', next: 'me07' },
          { label: 'Show the 1934 photograph', next: 'me09', condition: { flag: 'hasPhoto34', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      me07: {
        speaker: 'Father Thomas Mercer',
        text: 'I know the name, of course. It is a local superstition — the fishermen bogeyman. (A pause.) I also know that superstitions do not get detectives killed. Whatever you are chasing, Mr. Ward, I would advise you to chase it quietly.',
        choices: [
          { label: 'Show the 1934 photograph', next: 'me09', condition: { flag: 'hasPhoto34', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      me09: {
        speaker: 'Father Thomas Mercer',
        text: '(The mask comes off. A long silence.) …Where did you get that photograph? (Ward tells him — the false wall.) The wall. He kept it. (He sits down, suddenly old.) I met him in 1934. I was sent to meet him — sent by the church, which is to say, sent by them. They wanted to know if the professor was dangerous. I reported that he was a scholar and a coward, and they let him live. (His hands shake.) I have been the Order man in the church for twenty years, Mr. Ward. I took holy orders to escape them, and I have spent the rest of my life being useful to them, because usefulness is the price of my sister life.',
        effects: [{ setFlag: { meBroken: true } }],
        choices: [
          { label: 'Ask about the Grey Chapter', next: 'me11' },
          { label: 'Ask for the crypt key', next: 'me13' },
          { label: 'Leave', next: null }
        ]
      },
      me11: {
        speaker: 'Father Thomas Mercer',
        text: '(Quietly.) The Order has the wrong words. The ones who know — the old ones, the archivists, the quiet ones — they have known for a century that the doctrine is a mistranslation. The church real work has been to keep the fanatics from opening anything.',
        effects: [{ setFlag: { greyHint: true } }],
        choices: [{ label: 'Ask for the crypt key', next: 'me13' }, { label: 'Leave', next: null }]
      },
      me13: {
        speaker: 'Father Thomas Mercer',
        text: '(He takes a key from his cassock.) This opens the crypt door and the vestry cabinet. The boxes hold the church records — 1834 to 1912, when they stopped keeping them here. Whatever you find, Mr. Ward — find it gently. The dead are the only parishioners who never lied to me.',
        effects: [{ addItem: 'cryptkey' }, { setFlag: { cryptOpen: true } }],
        choices: [{ label: 'Go to the crypt', next: null }]
      }
    }
  },

  /* ---------------------------------------------------------------- D-PI Pike */
  pike: {
    start: 'pi01',
    nodes: {
      pi01: {
        speaker: 'Jonah Pike',
        text: 'You are the detective. The one from 1929. I remember you. (He does not look at Ward.) You had a face like a man reading his own obituary. It is still the same face. (He spits.) What do you want — the professor? Everybody wants the professor. He went in the water. That is what the water does.',
        choices: [
          { label: 'Buy him a drink', next: 'pi05' },
          { label: 'Ask what he saw under the docks', next: 'pi03' },
          { label: 'Accuse him — the badge path', next: 'pi09' },
          { label: 'Pike looks shaken — ask what happened', next: 'piThreat', condition: 'act3' },
          { label: 'Leave', next: null }
        ]
      },
      pi03: {
        speaker: 'Jonah Pike',
        text: 'I was a rigger. I rigged. I do not know nothing about tunnels. (A lie, and a bad one.) Ask the harbormaster. Finch knows the tunnels. Finch knows everything Finch employer wants him to know.',
        choices: [
          { label: 'Buy him a drink', next: 'pi05' },
          { label: 'Accuse him — the badge path', next: 'pi09' },
          { label: 'Leave', next: null }
        ]
      },
      pi05: {
        speaker: 'Jonah Pike',
        text: '(Taking the glass, watching it.) That is the first honest offer I have had since 1929. (He drinks.) Alright. You want to know what I saw under the docks. (He rolls up his sleeve — a scar across the forearm.) This is from a chain, 1932, when I was working the night crew at the cannery. The night crew — they are the Order. Every man of them. The day crew has a union; the night crew has a religion. (His hand steadies on the glass.) There is a harbor under the town, mister. Boats fit in it. And the water in it is black, and it does not move like water — it moves like something breathing.',
        effects: [{ setFlag: { pikeTalk: true } }, { revealClue: 'C-20' }],
        choices: [
          { label: 'Ask him to draw the tunnels', next: 'pi07' },
          { label: 'Leave', next: null }
        ]
      },
      pi07: {
        speaker: 'Jonah Pike',
        text: '(A long hesitation; then he takes the bar napkin.) I can draw it wrong, and some of it right, and I will not know which is which till it matters. (He draws.) There are two ways in that are not sealed. The cannery cold store, through the back of the chapel — and the Old Harbor grate, the one from the 1834 map. The Old Harbor is safer. The cannery has eyes. (He slides the napkin across.) You find my girl in this mess, you tell her her old man finally talked to a cop without getting anybody drowned.',
        effects: [{ setFlag: { pikeMap: true } }, { revealClue: 'C-21' }],
        choices: [{ label: 'Take the map', next: null }]
      },
      pi09: {
        speaker: 'Jonah Pike',
        text: '(Flat.) Then you are thinking what they want you to think. That is what they do — they make the truth look like the drunk and the drunk look like the truth. (He turns back to the crane.) You want to know about the tunnels, ask the water. The water is honest. It just is not kind.',
        choices: [{ label: 'Leave', next: null }]
      },
      piThreat: {
        speaker: 'Jonah Pike',
        text: '(His hands shaking.) They put a note under my door. "The tide takes her." My girl — she is at the boarding house on Merrow, the one with the green door. I talked, and now they are going to take her, and I cannot go back under that water, mister, I cannot.',
        effects: [{ revealClue: 'C-35' }],
        choices: [
          { label: 'Protect her via Hale', next: 'pi11', condition: { flag: 'haAlly', equals: true } },
          { label: 'Send her out of town', next: 'pi12' },
          { label: 'Dismiss the threat', next: 'pi13' }
        ]
      },
      pi11: {
        speaker: 'Jonah Pike',
        text: '(Watching Ward make the call.) …You would do that. For a drunk with a map. (He grips Ward arm — a dockworker grip, brief.) Whatever you need, whatever you find under that town — you call me, and I will be there with a crowbar and a grudge.',
        effects: [{ setFlag: { pikeSaved: true } }],
        choices: [{ label: 'Leave the bar', next: null }]
      },
      pi12: {
        speaker: 'Jonah Pike',
        text: '(He goes, grey-faced, and is gone for a day.) She is in Fall River with my sister. She does not know why. She is safe.',
        effects: [{ setFlag: { pikeSaved: true } }],
        choices: [{ label: 'Leave the bar', next: null }]
      },
      pi13: {
        speaker: 'Jonah Pike',
        text: '(A long look.) …Yeah. Fine. You are the detective. (He leaves. The threat was real — but Pike survives, and gives no further help.)',
        effects: [{ setFlag: { pikeLost: true } }],
        choices: [{ label: 'Leave the bar', next: null }]
      }
    }
  },

  /* -------------------------------------------------------------- D-FI Finch */
  finch: {
    start: 'fi01',
    nodes: {
      fi01: {
        speaker: 'Albert Finch',
        text: 'Mr. Ward. The detective. I have nothing for you — the professor case is closed, the Gazette says so, the police say so, and the harbormaster office agrees with both. (He is a man who has rehearsed this speech and is unhappy with his performance.)',
        choices: [
          { label: 'Ask about the manifest', next: 'fi03' },
          { label: 'Show the 1891 survey', next: 'fi05', condition: { flag: 'hasSurvey', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      fi03: {
        speaker: 'Albert Finch',
        text: 'The manifest is the manifest, Mr. Ward. I do not know what you are implying. Mr. Vane is a generous man — he remembers his friends, and he remembers his enemies. The manifest is corrected because manifests get corrected. That is all. (He is lying, and both of them know it.)',
        effects: [{ revealClue: 'C-16' }],
        choices: [
          { label: 'Show the 1891 survey', next: 'fi05', condition: { flag: 'hasSurvey', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      fi05: {
        speaker: 'Albert Finch',
        text: '…I did not know about the watermark. I did not know about any of it until — (He stops, breathes.) Until 1933. When the old man died, Vane called me in. He did not threaten me. That is what made it worse. He just said, "The town records are the town memory, Albert, and memories need a keeper." And I have been the keeper of lies ever since. (He looks at his own hands.) I have got a wife and a boy. The boy is eleven. Vane owns the school board.',
        choices: [
          { label: 'Offer him protection — the flip', next: 'fi07', condition: { flag: 'haAlly', equals: true } },
          { label: 'Push too hard', next: 'fi08' },
          { label: 'Leave', next: null }
        ]
      },
      fi07: {
        speaker: 'Albert Finch',
        text: '…There is a ledger in the safe. The real ledger — every alteration I have made since 1933, with the dates and the reasons Vane gave. It has his initials on the orders. It is not much, but it is mine, and it is proof. (He gets it.) You take it, and you take care of my boy, and you never tell anyone which clerk gave it to you until the man is in handcuffs.',
        effects: [{ setFlag: { finchFlipped: true } }, { revealClue: 'C-48' }],
        choices: [{ label: 'Take the ledger', next: null }]
      },
      fi08: {
        speaker: 'Albert Finch',
        text: 'I am sorry. I am sorry, Mr. Ward — I have got a boy. I have got a boy. (He calls the cannery that night.)',
        effects: [{ setFlag: { finchWarned: true } }],
        choices: [{ label: 'Leave', next: null }]
      }
    }
  },

  /* -------------------------------------------------------------- D-DO Doyle */
  doyle: {
    start: 'do01',
    nodes: {
      do01: {
        speaker: 'Frank Doyle',
        text: 'The detective who does not read the paper. I write the obituaries other papers call the news. (He pours two.) You are here about the professor. The police closed it in a day, which means the mayor closed it in an hour. (He taps the classifieds.) Start with the fish orders. Every Friday before a new moon, for years. The cannery does not can fish on Fridays — I checked. It is a summons.',
        effects: [{ revealClue: 'C-33' }],
        choices: [
          { label: 'Ask about the archives', next: 'do03' },
          { label: 'Ask about his own investigation', next: 'do05' },
          { label: 'Leave', next: null }
        ]
      },
      do03: {
        speaker: 'Frank Doyle',
        text: 'The morgue is in the back, and the morgue is mine. 1912 is in the fireproof cabinet — the professor wife, and Crane, one week apart. The Order was polite enough to use the Gazette own type for their alibis. (He leads Ward back.) 1929 is a different animal. The original front page was pulled and reset — I found the ghost plate under the floorboards. "Witness sought." Ruth Corbin. Your case, I hear. (A beat of respect.) Ask about the harbor drownings and people stop talking to you. Ask about the witnesses and they stop breathing.',
        effects: [{ revealClue: 'C-31' }, { revealClue: 'C-32' }],
        choices: [
          { label: 'Ask about his own investigation', next: 'do05' },
          { label: 'Leave', next: null }
        ]
      },
      do05: {
        speaker: 'Frank Doyle',
        text: 'Two years, off and on. The night crew walks like pallbearers. There is a store-room that is always locked and always cold. And the Fidelity takes the tide on nights the almanac says the water is wrong. (He grins, but it does not reach.) I am going to get the photograph that breaks it. One good photograph.',
        choices: [{ label: 'Wish him luck', next: null }]
      }
    }
  },

  /* -------------------------------------------------------------- D-MA Marsh */
  marsh: {
    start: 'ma01',
    nodes: {
      ma01: {
        speaker: 'Dr. Abel Marsh',
        text: 'You came at night. Good. The daylight version of me has a bad memory. (He lets Ward in; the house smells of iodine and pipe smoke.) Sit. You want to know about the dry drownings, and you are the first man since 1929 to ask me in my own house.',
        choices: [
          { label: 'Ask about the 1929 bodies', next: 'ma03' },
          { label: 'Ask about the Elias Ward entry', next: 'ma05' },
          { label: 'Ask about the current drownings', next: 'ma07' },
          { label: 'Leave', next: null }
        ]
      },
      ma03: {
        speaker: 'Dr. Abel Marsh',
        text: 'I signed what I was told to sign. The truth was in my private ledger — the one I kept at home, because the hospital records have a way of getting "borrowed" and coming back cleaner. (He fetches it.) Dry lungs, Mr. Ward. Every one of them. Seawater on the skin, no water in the body. You cannot drown a man and leave his lungs dry. I have stood over enough of them to know. The 1929 story was a lie. The 1931 boy was a lie. My soul is a filing cabinet of false certificates.',
        effects: [{ setFlag: { hasLedger: true } }, { revealClue: 'C-17' }],
        choices: [
          { label: 'Ask about the Elias Ward entry', next: 'ma05' },
          { label: 'Ask about the current drownings', next: 'ma07' },
          { label: 'Leave', next: null }
        ]
      },
      ma05: {
        speaker: 'Dr. Abel Marsh',
        text: '(A long silence. The doctor studies Ward face.) …You are asking me to identify a corpse that is sitting in my parlor. (Medically, without drama.) I signed that certificate because I was told to. I remember the body — thirty-seven, grey eyes, a scar through the eyebrow, a detective hands. (He looks at Ward hands.) The file says unclaimed. The file says closed. The file is a liar, and I am a liar, and you are either a very good impersonation or the one patient I have ever signed who got back up. (He will not say more.)',
        effects: [{ setFlag: { wardCert: true } }, { revealClue: 'C-40' }],
        choices: [
          { label: 'Ask about the current drownings', next: 'ma07' },
          { label: 'Leave', next: null }
        ]
      },
      ma07: {
        speaker: 'Dr. Abel Marsh',
        text: 'The hospital has had two in the last week — a dockhand and a deckhand off the Fidelity. Both wet, both dry-lunged, both "cardiac syncope with exposure" on the certificates I signed under protest. (He taps the ledger.) The tide has been taking them since the professor vanished. Whatever held it back, Mr. Ward — I think your missing professor was holding it.',
        effects: [{ setFlag: { seepWorsening: true } }],
        choices: [{ label: 'Leave', next: null }]
      }
    }
  },

  /* ------------------------------------------------------------ D-BR Briggs */
  briggs: {
    start: 'br01',
    nodes: {
      br01: {
        speaker: 'Samuel Briggs',
        text: 'You climbed two hundred steps to talk to an old man. Either you are lost or you are serious. (He turns.) Detective. I remember the name. You are the one who looked in 1929 and then did not.',
        choices: [
          { label: 'Ask about the logbook', next: 'br03' },
          { label: 'Ask about the next starless night', next: 'br05' },
          { label: 'Leave', next: null }
        ]
      },
      br03: {
        speaker: 'Samuel Briggs',
        text: 'The starless nights. Every new moon, marked, for two hundred years — my grandfather hand, his grandfather, and mine at the bottom of the column. (He brings the volume.) Men on the water without lamps. The Order calendar, kept by the keepers who would not join. My family has kept the light and the count for four generations. The light is for the living. The dark is for the other kind. (He looks out at the bay.) Do not ask me which is which.',
        effects: [{ revealClue: 'C-23' }],
        choices: [
          { label: 'Ask about the next starless night', next: 'br05' },
          { label: 'Leave', next: null }
        ]
      },
      br05: {
        speaker: 'Samuel Briggs',
        text: 'October 24th. New moon, 11:14. And the lowest tide of the year an hour after midnight. (He spits over the rail.) The water that hides the door will be holding its breath. That is the night they have been waiting for since 1929 — and the night my family has been dreading since 1712. (He taps Ward chest.) You have got the look of a man who is going to be on the water that night. When the light goes out — and it will go out — you keep your eyes off the basin and your hand on the stone, and you will live to be an old man with a bad story.',
        effects: [{ revealClue: 'C-24' }, { setFlag: { ritualDate: true } }],
        choices: [{ label: 'Leave the gallery', next: null }]
      }
    }
  },

  /* ------------------------------------------------------------ D-TO Old Tom */
  oldtom: {
    start: 'to01',
    nodes: {
      to01: {
        speaker: 'Old Tom Rath',
        text: 'You are the one asking about the professor dig. (He settles against a stump.) I will tell you what I told the police, which is nothing, and then I will tell you what I did not, because you have got the look. Four of them, two weeks before the professor people come with their shovels. In the rain, hauling a stone out of the ruin — a black stone, about the size of a man head. I asked what they was doing. They said it was for the new cemetery gate. There is no new cemetery gate. (He draws it.) The one hauling the head had a scar like a fishhook along the jaw. You find a man with a scar like that, you have found your four.',
        effects: [{ revealClue: 'C-13' }, { revealClue: 'C-47' }],
        choices: [{ label: 'Take the sketch', next: null }]
      }
    }
  },

  /* ------------------------------------------------------------ D-CR Crowley */
  crowley: {
    start: 'cr01',
    nodes: {
      cr01: {
        speaker: 'Margaret Crowley',
        text: 'Mr. Ward. The detective. I have been expecting you — the archive is where the town secrets come to be forgotten, and you are the man who has been un-forgetting them. (A small smile.) How may I help you not find what you are looking for?',
        choices: [
          { label: 'Ask about the Drowned Star', next: 'cr03' },
          { label: 'Ask about Whitlock', next: 'cr05' },
          { label: 'Answer — the Eye is a seal', next: 'cr09', condition: { flag: 'knowsSeal', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      cr03: {
        speaker: 'Margaret Crowley',
        text: 'The Drowned Star. The Order of the Drowned Star, properly — founded 1711, by a whaling captain who hauled up something he should have thrown back. (She recites it like a familiar, hated family name.) They have owned this town records for two centuries, Mr. Ward. The archive oldest holdings are their holdings — church books, surveys, manifests. My job is to make sure the true text survives among the false ones.',
        choices: [
          { label: 'Ask about Whitlock', next: 'cr05' },
          { label: 'Answer — the Eye is a seal', next: 'cr09', condition: { flag: 'knowsSeal', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      cr05: {
        speaker: 'Margaret Crowley',
        text: '(A pause; then, quietly.) Yes. I sent him to you. I sent him because he was the only man in this town who ever looked — and I am sorry for it, and I am not sorry, both at once. (She folds her hands.) I have spent thirty years losing arguments with men who cannot read. The professor could read. When he found the Eye, I knew two things: the Order would tear the town apart to get it back, and the only man who could carry it through the middle of them was the man who had already walked through the Harbor Lights and come out the other side.',
        effects: [{ revealClue: 'C-34' }],
        choices: [
          { label: 'Answer — the Eye is a seal', next: 'cr09', condition: { flag: 'knowsSeal', equals: true } },
          { label: 'Leave', next: null }
        ]
      },
      cr09: {
        speaker: 'Margaret Crowley',
        text: '(The mask drops; something like relief.) …"The stone that holds the line." You read Crane. (She stands, returns with a folio — the translation ledger.) Then you are the second kind of man, and I have been waiting forty years for the second kind of man. (She opens the ledger — two translations, side by side.) This is the Order scripture, and this is the truth. Same words, opposite meaning. I have spent my life making sure the faithful never see the right column — because the faithful, Mr. Ward, would rather drown the world than admit their god is a warning.',
        effects: [{ setFlag: { crTrust: true, greyFull: true } }, { revealClue: 'C-30' }],
        choices: [
          { label: 'Ask for her full aid', next: 'cr11' },
          { label: 'Leave', next: null }
        ]
      },
      cr11: {
        speaker: 'Margaret Crowley',
        text: 'I know where I keep them. (She leads Ward to the reading room behind the stacks — a door with no sign, a green lamp, and the archive real catalog.) I am the last of the quiet ones, Mr. Ward. When I am gone, the quiet ones end. So I am giving you the whole file — take it, use it, and if you survive, come back and let me write your name at the bottom of the list of people the Order never managed to lose.',
        effects: [{ setFlag: { crowleyAid: true } }],
        choices: [{ label: 'Take the file', next: null }]
      }
    }
  },

  /* ------------------------------------------------------- D-FE The Ferryman */
  ferryman: {
    start: 'fe01',
    nodes: {
      fe01: {
        speaker: 'The Ferryman',
        text: '(The boat materializes out of the dark; the water makes no sound against the hull.) Get in. (Ward gets in. The boat moves without oars.) You will be wanting a question. Everyone wants a question.',
        choices: [
          { label: 'Ask who he is', next: 'fe02' },
          { label: 'Ask about Whitlock', next: 'fe03' },
          { label: 'Ask about the town', next: 'fe04' },
          { label: 'Ask about yourself', next: 'fe05' }
        ]
      },
      fe02: {
        speaker: 'The Ferryman',
        text: 'Fares are paid in what you are willing to forget. (Nothing more.)',
        choices: [{ label: 'The boat glides on', next: null }]
      },
      fe03: {
        speaker: 'The Ferryman',
        text: 'Your man is alive. The water has not finished with him. It has not finished with you either.',
        effects: [{ setFlag: { whitlockHint: true } }],
        choices: [{ label: 'The boat glides on', next: null }]
      },
      fe04: {
        speaker: 'The Ferryman',
        text: 'Blackwater is a passenger. It always was. The bay carried it here, and the bay will carry it away, and the bay remembers the carrying. That is all the doctrine there is.',
        choices: [{ label: 'The boat glides on', next: null }]
      },
      fe05: {
        speaker: 'The Ferryman',
        text: 'You have paid twice already, Mr. Ward. You just do not remember.',
        effects: [{ setFlag: { paidTwice: true } }],
        choices: [{ label: 'The boat glides on', next: null }]
      },
      fe06: {
        speaker: 'The Ferryman',
        text: 'Last fare, Mr. Ward. The water has been expecting you. (If asked who he is — the only time he ever answers:) I am the one who rows. That is the whole job. When the line breaks, one shall remain who rows — and the line broke a long time ago, and I am still rowing.',
        choices: [{ label: 'The boat glides on', next: null }]
      }
    }
  },

  /* ------------------------------------------------- D-VANE the confrontation */
  vane: {
    start: 'vf01',
    nodes: {
      vf01: {
        speaker: 'Silas Vane',
        text: 'Mr. Ward. I wondered when you would come. (He turns; the signet ring catches the lamplight — the star.) You have been walking the town bones for a week. I have been walking them since I was a boy. Welcome to the floor of the house. (He gestures at the basin.) You are just in time to see the door open.',
        choices: [
          { label: 'It is not a door. It is a seal.', next: 'vf03' },
          { label: 'Reveal the false Eye', next: 'vf05', condition: { flag: 'D-08', equals: true } },
          { label: 'Give him the Eye', next: 'vf06', condition: { flag: 'hasEye', equals: true } },
          { label: 'Claim you destroyed it', next: 'vf08' },
          { label: 'Seal the arms and the Eye', next: 'vf09', condition: { flag: 'D-08', equals: true } }
        ]
      },
      vf03: {
        speaker: 'Silas Vane',
        text: 'The line. The line is the Order oldest lie, Mr. Ward — the lie the quiet ones tell to keep the faithful afraid. I have read the old texts. I have read them properly. (He holds up the false Eye.) The star is the gate. The Eye is the key. And the tide — (his voice drops, almost tender) — the tide is the hand of the Drowned One, and it has been patient for two hundred years, and tonight it returns what it took. (Beat.) It returns the drowned, Mr. Ward. I buried my first wife believing the sea took her. I learned better. I learned the sea keeps them — and the star can give them back.',
        choices: [
          { label: 'Reveal the false Eye', next: 'vf05', condition: { flag: 'D-08', equals: true } },
          { label: 'Seal the arms and the Eye', next: 'vf09', condition: { flag: 'D-08', equals: true } },
          { label: 'Give him the Eye', next: 'vf06', condition: { flag: 'hasEye', equals: true } },
          { label: 'Claim you destroyed it', next: 'vf08' }
        ]
      },
      vf05: {
        speaker: 'Silas Vane',
        text: '(A long silence. Vane looks at the stone in his own hand — turns it, sees the socket smooth lie — and for one second, the man under the Warden: the grief, the forty years of faith, the bottom falling out.) …It is a copy. (His hand shakes.) …It is a copy, and you have brought me the real one, and you have brought it here, to the night it was made for. (He straightens — and the steel comes back.) Then let us not waste the night. The mechanism does not care which stone is true. It only cares that a stone sits in the socket — and yours is the true one. Give it to me, and I will open the door myself, and the drowned will rise, and you will be remembered as the man who brought the key to the lock.',
        effects: [{ setFlag: { vaneBroken: true } }],
        choices: [
          { label: 'Seal the arms and the Eye', next: 'vf09', condition: { flag: 'D-08', equals: true } },
          { label: 'Give him the Eye', next: 'vf06', condition: { flag: 'hasEye', equals: true } },
          { label: 'Call in Hale', next: 'vf10', condition: { flag: 'haAlly', equals: true } }
        ]
      },
      vf06: {
        speaker: 'Silas Vane',
        text: '(The rite is read. The faithful sing the catechism. And the mechanism does what it was built to do: the seal engages.) The water does not rise. It drops — and the star floor opens, five slits at the five points, and the water comes up through the slits, not as a flood but as a rising patience: it takes the faithful one by one. Vane is the last. His last words are a whisper of wonder, not fear: "We were wrong."',
        effects: [{ setFlag: { ending: 'drownedStar' } }],
        choices: [{ label: 'The hall empties', next: null }]
      },
      vf08: {
        speaker: 'Silas Vane',
        text: '(The grief becomes something else.) …You threw the key into the sea. (A stillness. Then, quietly:) Then the door opens anyway, Mr. Ward. The mechanism is patient — the arms have been unsealing since October, and a door that has waited two centuries will wait one more night for its stones. But you — you, I will remember. (He nods once; the Inner Tide moves — the confrontation turns violent.)',
        effects: [{ setFlag: { eyeDestroyed: true } }],
        choices: [{ label: 'Escape to the tunnel mouth', next: null }]
      },
      vf09: {
        speaker: 'Silas Vane',
        text: '(Ward walks the star — the five stations — and places the arm-seals, one by one, each a sound like a bell under water. Then, at the center, Ward holds the Eye over the socket.) The star is a floor, Vane. The door is the thing that is kept shut. You have spent two centuries praying for the wrong door — and I am here to close it. (He seats the Eye.) The basin water drops — a foot, then another — as if the hall itself exhales.',
        effects: [{ setFlag: { sealed: true } }],
        choices: [
          { label: 'Look at the basin', next: 'vaneLook' },
          { label: 'Do not look', next: 'vaneAvert' }
        ]
      },
      vaneLook: {
        speaker: 'Silas Vane',
        text: '(Vane watches the water fall, emptied of everything but wonder.) We were wrong. We were always wrong. The star was a floor. The god was the door. And doors, Mr. Ward, are made to be kept shut. (He drops the false Eye; it rolls and stops against the basin rim.) …She knew. The archivist knew, and she let me believe. It is the kindest thing anyone has ever done for me, and I am going to hate her forever.',
        effects: [{ setFlag: { lookedAtBasin: true } }],
        choices: [{ label: 'The water closes', next: null }]
      },
      vaneAvert: {
        speaker: 'Silas Vane',
        text: '(Vane watches the water fall.) We were wrong. We were always wrong. The star was a floor. The god was the door. And doors, Mr. Ward, are made to be kept shut. (He drops the false Eye.) …She knew. The archivist knew, and she let me believe. It is the kindest thing anyone has ever done for me, and I am going to hate her forever.',
        effects: [{ setFlag: { avertedBasin: true } }],
        choices: [{ label: 'The hall is quiet', next: null }]
      },
      vf10: {
        speaker: 'Detective Arthur Hale',
        text: '(Ward, without turning:) Art. Now. — The tunnel mouth floods with torchlight. Hale voice, enormous: "BLACKWATER POLICE. NOBODY MOVES. THE BUILDING IS SURROUNDED AND I HAVE GOT FOURTEEN WITNESSES WHO ARE NOT AFRAID OF THE WATER." (The last part is a lie — there are three of them — but it lands.) The human conspiracy is arrested; the ritual interrupted.',
        effects: [{ setFlag: { haleStorm: true } }],
        choices: [{ label: 'Seal the arms and the Eye', next: 'vf09', condition: { flag: 'D-08', equals: true } }]
      }
    }
  }
};
