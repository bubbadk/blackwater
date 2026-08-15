/* ============================================================================
   THE BLACK RELIQUARY — ITEM CATALOG (Game Bible §7.2)
   ============================================================================ */
window.BR = window.BR || {};

BR.items = {
  'eye': {
    name: 'The Eye of Thal Keth',
    description: 'It is smaller than the weight of it. Eighteen centimeters of black stone, warm as a sleeping animal. It depicts something roughly humanoid — arms, a head, a posture of stillness — but the proportions refuse to settle: look away, and the hands are too long; look back, and they are not hands at all. The surface is covered in markings too small to read. The base is not flat. It is a socket.',
    effects: [{ setFlag: { hasEye: true } }]
  },
  'hat': {
    name: 'Whitlock Hat',
    description: 'A grey fedora, soaked, lying crown-down in the rain. Inside the band, a label: "Crane & Sons, Boston" — and a scrap of paper with a phone number (the Alden Archive). The crown is dented inward — it was on his head when he fell or was taken.',
    effects: [{ setFlag: { hasHat: true } }]
  },
  'wrap': {
    name: 'The Oilcloth Wrap',
    description: 'Old sailcloth, dark with age, stitched with a sailor stitch; held to the light, a star is woven into the cloth — five points, one bent back, the correct star. The Eye official wrapper.',
    effects: [{ setFlag: { hasWrap: true } }]
  },
  'notebook': {
    name: 'Ward Notebook',
    description: 'A worn brown notebook, dog-eared, with a bullet hole through the cover from 1929. Sections: CASE NOTES, PEOPLE, LOCATIONS, EVIDENCE, DEDUCTIONS, SYMBOLS, TIMELINE, UNANSWERED QUESTIONS.',
    effects: [{ setFlag: { hasNotebook: true } }]
  },
  'crowbar': {
    name: 'The Crowbar',
    description: 'A short crowbar, wrapped in cloth. Used for the false wall, the cannery gate chain, the Under-City sealed door, the crypt. "A crowbar is a question with a handle."',
    effects: [{ setFlag: { hasCrowbar: true } }]
  },
  'leadbox': {
    name: 'The Lead Box',
    description: 'A lead-lined box with a glass viewing window, sealing wax. Built by Whitlock for the Eye; Ward claims it. The Eye lives in it from Act IV onward.',
    effects: [{ setFlag: { hasLeadBox: true } }]
  },
  'studykey': {
    name: 'Evelyn Key',
    description: 'A heavy iron key to the study false wall. Given by Evelyn when her trust is earned — or bypassed with the crowbar.',
    effects: [{ setFlag: { hasStudyKey: true } }]
  },
  'cryptkey': {
    name: 'Mercer Crypt Key',
    description: 'An old skeleton key to the crypt. Given freely when Mercer breaks; stolen if the player picks the vestry lock.',
    effects: [{ setFlag: { hasCryptKey: true } }]
  },
  'watch': {
    name: 'The 1929 Watch',
    description: 'A pocket watch recovered from the concrete plug edge, 1929 — a victim watch, stopped at 3:47. The same time as the clocks.',
    effects: [{ setFlag: { hasWatch: true } }]
  },
  'armseal': {
    name: 'An Arm-Seal',
    description: 'A head-sized black stone, one of the five that held the line. Warm to the touch. Its base carries a socket pattern — five lugs in a star. The same impossible black as the Eye.',
    effects: [{ setFlag: { hasArmSeal: true } }]
  },
  'rubber': {
    name: 'Wall-Script Rubbing',
    description: 'A rubbing of the first-layer script from the chapel wall, on thin paper.',
    effects: [{ setFlag: { hasRubbing: true } }]
  }
};
