// =============================================================================
// Sabacc Tournament — game logic (refactored 2025 from 2005 original)
//
// Single-file plain script (no module syntax, works via file://).
// Pure rule functions are attached to window.Sabacc for unit testing;
// DOM-mutating functions are attached to `window` for the event handlers
// registered in index.html.
//
// Human-facing strings live in src/i18n/*.js, loaded before this file (see
// index.html). The active locale is exposed on `window.STR` by the i18n
// loader; in Node the test harness requires loader.js + en.js first, which
// sets globalThis.STR.
// =============================================================================

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/** |score| == 23 -> pure sabacc */
const PURE_SABACC = 23;
/** Round points for bombing out */
const BOMB = -24;
const PURE_SABACC_POINTS = 46;
const BOMB_POINTS = -24;
/** Tournament winner crosses this threshold (configurable via Settings). */
let WIN_THRESHOLD = 500;
/** Sentinel for an empty card slot */
const EMPTY = 20;
/** Number of CPU opponents (the human is in addition to these). */
const NUM_CPUS = 4;
/** Total seats at the table (1 human + NUM_CPUS CPUs). */
const NUM_PLAYERS = NUM_CPUS + 1;
/**
 * Seat order around the table, left to right. The human sits in the middle.
 * With 4 CPUs the order is: cpu1, cpu2, human, cpu3, cpu4.
 * `players[]` is indexed 0..NUM_PLAYERS-1 (0 = human, 1..NUM_CPUS = CPUs);
 * `SEAT_ORDER` maps each visible position to a players[] index.
 */
const SEAT_ORDER = (() => {
  const half = Math.floor(NUM_CPUS / 2);
  const order = [];
  for (let i = 0; i < half; i++) order.push(i + 1);      // cpus left of human
  order.push(0);                                          // human in the middle
  for (let i = half; i < NUM_CPUS; i++) order.push(i + 1); // cpus right of human
  return order;
})();

const SUITS = STR.suits;

// Face cards: code prefix -> { value, name }
const FACE_CARDS = {
  i: { value: 0,  name: STR.faceCards.i },
  q: { value: 2,  name: STR.faceCards.q },
  e: { value: 6,  name: STR.faceCards.e },
  b: { value: 8,  name: STR.faceCards.b },
  d: { value: 11, name: STR.faceCards.d },
  c: { value: 13, name: STR.faceCards.c },
  a: { value: 15, name: STR.faceCards.a },
  s: { value: 17, name: STR.faceCards.s },
};

// CPU opponents (analysis.md table). Race names come from STR.cpuRaces and
// are locale-dependent; thresholds are fixed. Rebuilt by refreshCpuRaces()
// on locale change so names translate immediately.
const refreshCpuRaces = () => STR.cpuRaces.map((name, i) => ({
  name,
  threshold: 15 + i,
}));
let CPU_RACES = refreshCpuRaces();

// -----------------------------------------------------------------------------
// Deck
// -----------------------------------------------------------------------------

/**
 * Build a fresh 76-card deck.
 * 60 numbered cards (1-15 in 4 suits) + 16 face cards (8 names x +/-).
 * @returns {string[]} Array of card filenames like "1c.jpg", "q2.jpg".
 */
const buildDeck = () => {
  const deck = [];
  for (let v = 1; v <= 15; v++) {
    for (const s of "cfps") deck.push(`${v}${s}.jpg`);
  }
  for (const prefix of "iqebdcas") {
    deck.push(`${prefix}1.jpg`);
    deck.push(`${prefix}2.jpg`);
  }
  return deck;
};

/**
 * Convert a card filename to its numeric value.
 * @param {string} card - Card filename, e.g. "7c.jpg" or "q2.jpg".
 * @returns {number} The card's value (0 for Idiot, negative for "-" variants).
 */
const convert = (card) => {
  const m = card.match(/^(\d+)([cfps])\.jpg$/);
  if (m) return Number(m[1]);
  const fm = card.match(/^([iqebdcas])([12])\.jpg$/);
  if (fm) {
    const { value } = FACE_CARDS[fm[1]];
    if (value === 0) return 0;
    return fm[2] === "2" ? -value : value;
  }
  return 0;
};

/**
 * Convert a card filename to its human-readable name.
 * @param {string} card - Card filename.
 * @returns {string} Display name like "7 of Coins" or "Senator (-)".
 */
const compile = (card) => {
  const m = card.match(/^(\d+)([cfps])\.jpg$/);
  if (m) return `${m[1]} of ${SUITS[m[2]]}`;
  const fm = card.match(/^([iqebdcas])([12])\.jpg$/);
  if (fm) {
    const { name } = FACE_CARDS[fm[1]];
    const sign = fm[2] === "2" ? STR.negativeSuffix : STR.positiveSuffix;
    return fm[1] === "i" ? STR.faceCards.i : `${name} ${sign}`;
  }
  return STR.emptyCard;
};

/**
 * Pick a random card filename from the deck, removing it.
 * Uses a filtered index list instead of a retry loop.
 * @param {string[]} deck - Mutable deck array (cards set to "0" when drawn).
 * @returns {string} The drawn card filename.
 * @throws {Error} If the deck is depleted (no live cards).
 */
const drawFromDeck = (deck) => {
  const live = deck
    .map((c, i) => (c !== "0" ? i : -1))
    .filter((i) => i >= 0);
  if (live.length === 0) throw new Error("deck depleted");
  const pick = live[Math.floor(Math.random() * live.length)];
  const card = deck[pick];
  deck[pick] = "0";
  return card;
};

/**
 * Count remaining (non-"0") cards in the deck.
 * @param {string[]} deck
 * @returns {number}
 */
const deckRemaining = (deck) => deck.filter((c) => c !== "0").length;

// -----------------------------------------------------------------------------
// Scoring
// -----------------------------------------------------------------------------

/**
 * Sum the values of a 5-slot hand plus an interference-field value.
 * EMPTY (20) slots and interference value 20 are ignored.
 * @param {number[]} cards - 5 card values (EMPTY for unfilled slots).
 * @param {number} fieldValue - Interference field value (EMPTY if unused).
 * @returns {number} The hand's total score.
 */
const scoreHand = (cards, fieldValue) => {
  let total = 0;
  for (const c of cards) if (c !== EMPTY) total += c;
  if (fieldValue !== EMPTY) total += fieldValue;
  return total;
};

/**
 * Check if a hand is an Idiot's Array: Idiot (0) + 2 + 3 = 23.
 * @param {number[]} cards - 5 card values.
 * @param {number} fieldValue - Interference field value.
 * @returns {boolean}
 */
const isIdiotsArray = (cards, fieldValue) => {
  const all = [...cards];
  if (fieldValue !== EMPTY) all.push(fieldValue);
  const vals = all.filter((v) => v !== EMPTY).sort((a, b) => a - b);
  return vals.length === 3 && vals[0] === 0 && vals[1] === 2 && vals[2] === 3;
};

/**
 * Evaluate a single player's score for a round.
 * @param {number} score - The player's hand score.
 * @param {Object} [opts]
 * @param {boolean} [opts.idiotsArray=false] - Whether the hand is an Idiot's Array.
 * @returns {{ roundPoints: number, tournamentDelta: number }}
 *   bomb -> { -24, -24 }, pure sabacc -> { +24, +46 }, valid -> { |score|, |score| }.
 */
const evaluateRound = (score, { idiotsArray = false } = {}) => {
  if (idiotsArray || score === PURE_SABACC || score === -PURE_SABACC) {
    return { roundPoints: 24, tournamentDelta: PURE_SABACC_POINTS };
  }
  if (score === 0 || score > PURE_SABACC || score < -PURE_SABACC) {
    return { roundPoints: BOMB_POINTS, tournamentDelta: BOMB_POINTS };
  }
  const abs = Math.abs(score);
  return { roundPoints: abs, tournamentDelta: abs };
};

/**
 * Round-leader bonus: the single highest round-points scorer (when no one
 * hit Pure Sabacc) gets +roundPoints/2 added to their tournament total.
 * Ties for highest get no bonus.
 * @param {number[]} tournamentPoints - Current tournament totals per player.
 * @param {number[]} roundPoints - This round's points per player.
 * @returns {number[]} Updated tournament points.
 */
const applyLeaderBonus = (tournamentPoints, roundPoints) => {
  const pure = roundPoints.some((rp) => rp === 24);
  if (pure) return tournamentPoints;
  let best = -Infinity;
  let bestIdx = -1;
  for (let i = 0; i < roundPoints.length; i++) {
    if (roundPoints[i] > best) {
      best = roundPoints[i];
      bestIdx = i;
    }
  }
  const tied = roundPoints.filter((rp) => rp === best).length > 1;
  if (tied || bestIdx < 0) return tournamentPoints;
  const out = [...tournamentPoints];
  out[bestIdx] += Math.round(best / 2);
  return out;
};

/**
 * Decide the tournament winner given tournament point totals.
 * @param {number[]} points - Tournament totals, one entry per player.
 * @returns {{ index: number, tie: boolean, points: number }}
 *   index is -1 if no one has crossed WIN_THRESHOLD yet.
 */
const decideWinner = (points) => {
  let best = -Infinity;
  let bestIdx = -1;
  let tie = false;
  for (let i = 0; i < points.length; i++) {
    if (points[i] > WIN_THRESHOLD) {
      if (points[i] > best) {
        best = points[i];
        bestIdx = i;
        tie = false;
      } else if (points[i] === best) {
        tie = true;
      }
    }
  }
  return { index: bestIdx, tie, points: best };
};

// -----------------------------------------------------------------------------
// CPU opponents
// -----------------------------------------------------------------------------

/**
 * Get the pass threshold for a CPU race.
 * @param {string} raceName
 * @returns {number} |score| at which this CPU stops drawing.
 */
const cpuPassThreshold = (raceName) =>
  CPU_RACES.find((r) => r.name === raceName)?.threshold ?? 15;

/**
 * Pick NUM_CPUS distinct race names for the CPU opponents.
 * @returns {string[]} Array of NUM_CPUS distinct race names.
 */
const pickOpponents = () => {
  const pool = [...Array(CPU_RACES.length).keys()];
  // Fisher–Yates shuffle the first NUM_CPUS slots.
  for (let i = 0; i < NUM_CPUS; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, NUM_CPUS).map((i) => CPU_RACES[i].name);
};

/**
 * Does the CPU want to keep drawing? Stops when |score| reaches threshold.
 * @param {number} score - Current hand score.
 * @param {number} threshold - Race's pass threshold.
 * @returns {boolean}
 */
const cpuWantsToDraw = (score, threshold) =>
  Math.abs(score) < threshold && score !== 0;

// -----------------------------------------------------------------------------
// Generator (randomizer pot)
// -----------------------------------------------------------------------------

/**
 * Replace every occurrence of oldCard with newCard across a player's
 * location/card arrays. Does not mutate input.
 * @param {string[]} locs - Card filenames per slot.
 * @param {number[]} cards - Card values per slot.
 * @param {string} oldCard - Filename to replace.
 * @param {string} newCard - Replacement filename.
 * @param {number} newValue - Replacement numeric value.
 * @returns {{ locs: string[], cards: number[], changed: boolean }}
 */
const swapCardInLocations = (locs, cards, oldCard, newCard, newValue) => {
  let changed = false;
  const newLocs = locs.map((l) => {
    if (l === oldCard) {
      changed = true;
      return newCard;
    }
    return l;
  });
  const newCards = changed
    ? cards.map((c, i) => (locs[i] === oldCard ? newValue : c))
    : [...cards];
  return { locs: newLocs, cards: newCards, changed };
};

/**
 * One step of the random generator. If g1 == g2 the deck is left untouched.
 * On a successful swap, no cards leak from the deck.
 * @param {string[]} deck
 * @param {string} g1 - Card to be replaced (lookup, not drawn).
 * @param {string} g2 - Replacement card (already drawn).
 * @returns {{ swapped: boolean, g1: string, g2: string, deck: string[] }}
 */
const randomGeneratorStep = (deck, g1, g2) => {
  if (g1 === g2) return { swapped: false, g1, g2, deck: [...deck] };
  return { swapped: true, g1, g2, deck: [...deck] };
};

/**
 * Apply the generator swap to every player's hand at once (pure logic).
 * @param {Object} hands - Map of { locs, cards } keyed by any identifier
 *   (e.g. { player: ..., cpu1: ..., cpu2: ... }). All values are processed.
 * @param {string} g1 - Card to replace.
 * @param {string} g2 - Replacement card.
 * @returns {{ swapped: boolean, [key]: { locs, cards, changed } }}
 *   Mirrors the input keys; each value is { locs, cards, changed }.
 *   swapped is false if g1==g2.
 */
const generatorSwap = (hands, g1, g2) => {
  const result = { swapped: g1 !== g2 };
  if (g1 === g2) {
    for (const [key, h] of Object.entries(hands)) {
      result[key] = { locs: h.locs, cards: h.cards, changed: false };
    }
    return result;
  }
  const newValue = convert(g2);
  for (const [key, h] of Object.entries(hands)) {
    result[key] = swapCardInLocations(h.locs, h.cards, g1, g2, newValue);
  }
  return result;
};

/**
 * Pick two distinct cards for the generator: g1 (to be replaced) and g2
 * (the replacement, drawn from the deck). Guards against deck depletion
 * and the g2==g1 hang.
 * @param {string[]} deck - Mutable deck.
 * @returns {{ g1: string, g2: string } | null} null if deck too depleted.
 */
const pickGeneratorCards = (deck) => {
  const live = deck.filter((c) => c !== "0");
  if (live.length < 2) return null;
  const g1 = live[Math.floor(Math.random() * live.length)];
  // Temporarily mark g1 as unavailable so drawFromDeck never picks it,
  // then restore it after drawing g2.
  const g1Idx = deck.indexOf(g1);
  deck[g1Idx] = "0";
  const g2 = drawFromDeck(deck);
  deck[g1Idx] = g1; // restore g1 to the live pool
  return { g1, g2 };
};

/**
 * Build a list of 10 "favorite" card filenames for a CPU, drawn without
 * replacement from a copy of the deck.
 * @returns {string[]}
 */
const rollFavorites = () => {
  const favDeck = buildDeck();
  const favs = [];
  for (let i = 0; i < 10; i++) favs.push(drawFromDeck(favDeck));
  return favs;
};

// -----------------------------------------------------------------------------
// DOM helpers — everything below this point runs only in a browser.
// In Node (for tests) this whole block is skipped, and the pure functions
// above are exposed on window.Sabacc by the block at the very bottom.
// -----------------------------------------------------------------------------

if (typeof document !== "undefined") {

const $ = (id) => document.getElementById(id);
const setImg = (id, src) => { const el = $(id); if (el) el.src = src; };
const setAlt = (id, alt) => { const el = $(id); if (el) el.alt = alt; };

const ASSET = {
  cardDir: "assets/cards/",
  avatarDir: "assets/avatars/",
  audioDir: "assets/audio/",
  field: "assets/cards/field.gif",
  wallp: "assets/cards/wallp.gif",
  blank: "assets/cards/blank.gif",
};

// -----------------------------------------------------------------------------
// Game state — per-player array, indexed 0 (human) .. NUM_CPUS
// -----------------------------------------------------------------------------

let game = 0;
let musicStarted = 0;
let bomb = 0;
let opponentsRolled = false;
let deck = buildDeck();
let gameStartTime = 0;
let roundCount = 0;
let pureSabaccCount = 0;

// Per-player state. players[0] = human, players[1..NUM_CPUS] = CPUs.
const players = Array.from({ length: NUM_PLAYERS }, () => ({
  name: "",
  race: "none",
  cards: [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  cardFiles: ["jpg", "jpg", "jpg", "jpg", "jpg"],
  score: 0,
  points: 0,
  passed: 0,
  fieldUsed: 0,
  fieldValue: EMPTY,
  favorites: Array(10).fill("jpg"),
}));
players[0].isHuman = true;

// Human interference-field bookkeeping (only player 0 has drag/drop)
let interIdx = -1;
let blankedImgId = "";
let interSavedFile = "";

// -----------------------------------------------------------------------------
// ID helpers — generate the DOM IDs for any seat/card slot
// -----------------------------------------------------------------------------

// Seat label: "cpu1", "player", "cpu2", "cpu3", "cpu4" in table order.
const seatPrefix = (seatIdx) => {
  const pIdx = SEAT_ORDER[seatIdx];
  return pIdx === 0 ? "player" : `cpu${pIdx}`;
};

const cardId = (seatIdx, slot) => `${seatPrefix(seatIdx)}Card${slot}`;
const fieldId = (seatIdx) => `${seatPrefix(seatIdx)}Field`;
const avatarId = (seatIdx) => `${seatPrefix(seatIdx)}Avatar`;
const scoreNameId = (seatIdx) => `scoreName${cap(seatPrefix(seatIdx))}`;
const scoreValueId = (seatIdx) => `scoreValue${cap(seatPrefix(seatIdx))}`;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// players[] index from seat index
const playerAt = (seatIdx) => players[SEAT_ORDER[seatIdx]];

// -----------------------------------------------------------------------------
// Board builder — generates all hand/field/avatar/score DOM from templates.
// Called once at gamer() time.
// -----------------------------------------------------------------------------

const buildGameBoard = () => {
  // Card table: one .hand per seat, in SEAT_ORDER
  const table = $("cardTable");
  if (table) {
    table.innerHTML = "";
    for (let s = 0; s < NUM_PLAYERS; s++) {
      const pref = seatPrefix(s);
      const hand = document.createElement("div");
      hand.className = `hand ${pref}-hand`;
      hand.innerHTML =
        `<div class="hand-drawn">` +
          `<img src="${ASSET.blank}" id="${pref}Card2">` +
          `<img src="${ASSET.blank}" id="${pref}Card3">` +
          `<img src="${ASSET.blank}" id="${pref}Card4">` +
        `</div>` +
        `<div class="hand-dealt">` +
          `<img src="${ASSET.wallp}" id="${pref}Card0">` +
          `<img src="${ASSET.wallp}" id="${pref}Card1">` +
        `</div>`;
      table.appendChild(hand);
    }
  }

  // Interference field slots: one per seat
  const fieldSlots = $("fieldSlots");
  if (fieldSlots) {
    fieldSlots.innerHTML = "";
    for (let s = 0; s < NUM_PLAYERS; s++) {
      const pref = seatPrefix(s);
      const img = document.createElement("img");
      img.src = ASSET.field;
      img.id = fieldId(s);
      img.alt = SEAT_ORDER[s] === 0 ? STR.alt.yourField : STR.alt.opponentField;
      if (SEAT_ORDER[s] === 0) {
        // Wrap the player's field in a drop zone
        const zone = document.createElement("div");
        zone.id = "playerFieldDrop";
        zone.className = "field-drop-zone";
        zone.appendChild(img);
        fieldSlots.appendChild(zone);
      } else {
        fieldSlots.appendChild(img);
      }
    }
  }

  // Avatar row
  const avatarRow = $("avatarRow");
  if (avatarRow) {
    avatarRow.innerHTML = "";
    for (let s = 0; s < NUM_PLAYERS; s++) {
      const pref = seatPrefix(s);
      const img = document.createElement("img");
      img.src = SEAT_ORDER[s] === 0 ? "assets/avatars/default.gif" : "assets/avatars/blank.gif";
      img.id = avatarId(s);
      img.alt = pref === "player" ? STR.uiGame.youAlt : `${STR.uiGame.cpuAltN ? STR.uiGame.cpuAltN.replace("{n}", SEAT_ORDER[s]) : "CPU " + SEAT_ORDER[s]}`;
      avatarRow.appendChild(img);
    }
  }

  // Tournament score cells
  const scoresDiv = $("tournamentScores");
  if (scoresDiv) {
    scoresDiv.innerHTML = "";
    for (let s = 0; s < NUM_PLAYERS; s++) {
      const pref = seatPrefix(s);
      const cell = document.createElement("div");
      cell.className = "score-cell";
      cell.id = `scoreCell${cap(pref)}`;
      cell.innerHTML =
        `<span class="score-name" id="scoreName${cap(pref)}">&nbsp;</span>` +
        `<span class="score-value" id="scoreValue${cap(pref)}">0</span>` +
        `<span class="score-unit" data-i18n="uiGame.tournamentPoints">${STR.uiGame.tournamentPoints}</span>`;
      scoresDiv.appendChild(cell);
    }
  }
};

// -----------------------------------------------------------------------------
// Toast notifications
// -----------------------------------------------------------------------------

const showToast = (message, type = "info") => {
  const container = $("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  void toast.offsetWidth;
  toast.classList.add("toast-show");
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// -----------------------------------------------------------------------------
// Logging
// -----------------------------------------------------------------------------

const logMessage = (text) => {
  const el = $("eventLog");
  el.value = `${el.value}\n${text}`;
};

const scrollLog = () => { const el = $("eventLog"); if (el) el.scrollTop = el.scrollHeight; };

const clearLog = () => {
  opps();
  if (game === 0) {
    $("eventLog").value = STR.log.welcome.replace("{name}", players[0].name);
    game = 2;
  } else {
    $("eventLog").value = STR.log.roundHeader.replace("{n}", game);
    game += 1;
    roundCount += 1;
  }
  updateScore();
  updateTournamentPanel();
  $("genCard1").value = "";
  $("genCard2").value = "";
};

// -----------------------------------------------------------------------------
// Score display
// -----------------------------------------------------------------------------

const updateScore = () => {
  players[0].score = scoreHand(players[0].cards, players[0].fieldValue);
  logMessage(STR.log.yourScore.replace("{score}", players[0].score));
};

// -----------------------------------------------------------------------------
// Tournament standings panel
// -----------------------------------------------------------------------------

const updateTournamentPanel = () => {
  for (let s = 0; s < NUM_PLAYERS; s++) {
    const p = playerAt(s);
    const nameEl = $(scoreNameId(s));
    const valEl = $(scoreValueId(s));
    if (nameEl) nameEl.textContent = p.name || "";
    if (valEl) valEl.textContent = p.points;
  }
};

// -----------------------------------------------------------------------------
// Hand evaluation / bomb detection (human only)
// -----------------------------------------------------------------------------

const checkBomb = () => {
  if (bomb === 1) return;
  const sc = players[0].score;
  if (sc === 0 || sc > PURE_SABACC || sc < -PURE_SABACC) {
    showToast(STR.toast.bomb, "error");
    $("turnBtn").disabled = true;
    players[0].passed = 1;
    bomb = 1;
  } else if (sc === PURE_SABACC || sc === -PURE_SABACC) {
    showToast(STR.toast.pureSabacc, "success");
    $("turnBtn").disabled = true;
    players[0].passed = 1;
    bomb = 1;
  }
};

// -----------------------------------------------------------------------------
// Round end / scoring / tournament progression
// -----------------------------------------------------------------------------

const msg = (inputScore) => {
  if (inputScore === 0 || inputScore > PURE_SABACC || inputScore < -PURE_SABACC) {
    return STR.roundResult.bomb;
  }
  if (inputScore === PURE_SABACC || inputScore === -PURE_SABACC) {
    return STR.roundResult.pureSabacc;
  }
  return STR.roundResult.valid.replace("{points}", Math.abs(inputScore));
};

const scoreRound = () => {
  const idiots = players.map((p) =>
    isIdiotsArray(p.cards, p.fieldValue));
  const results = players.map((p, i) =>
    evaluateRound(p.score, { idiotsArray: idiots[i] }));

  // Count human player's pure sabaccs
  if (results[0].roundPoints === 24) pureSabaccCount++;

  for (let i = 0; i < NUM_PLAYERS; i++) {
    players[i].points += results[i].tournamentDelta;
  }

  const roundPoints = results.map((r) => r.roundPoints);
  const tournamentPoints = players.map((p) => p.points);
  const adjusted = applyLeaderBonus(tournamentPoints, roundPoints);
  for (let i = 0; i < NUM_PLAYERS; i++) players[i].points = adjusted[i];

  updateTournamentPanel();
};

// -----------------------------------------------------------------------------
// Turn processing
// -----------------------------------------------------------------------------

const placeCard = (p, seatIdx, value, cardFile, cardName) => {
  for (let s = 2; s <= 4; s++) {
    if (p.cards[s] === EMPTY) {
      p.cards[s] = value;
      p.cardFiles[s] = cardFile;
      setImg(cardId(seatIdx, s), `assets/cards/${cardFile}`);
      setAlt(cardId(seatIdx, s), cardName);
      return s;
    }
  }
  return -1;
};

const cpuTurn = (p, seatIdx) => {
  if (p.passed === 1) return;
  const threshold = cpuPassThreshold(p.race);
  if (!cpuWantsToDraw(p.score, threshold)) {
    logMessage(STR.log.cpuPasses.replace("{race}", p.name));
    p.passed = 1;
    return;
  }
  if (deckRemaining(deck) === 0) {
    logMessage(STR.log.cpuPassesDeckDepleted.replace("{race}", p.name));
    p.passed = 1;
    return;
  }
  const card = drawFromDeck(deck);
  const value = convert(card);
  const cardName = compile(card);
  logMessage(STR.log.cpuDrew.replace("{race}", p.name).replace("{card}", cardName));
  const slot = placeCard(p, seatIdx, value, card, cardName);
  if (slot === 4) {
    logMessage(STR.log.cpuPasses.replace("{race}", p.name));
    p.passed = 1;
  }
  p.score = scoreHand(p.cards, p.fieldValue);
};

const humanTurn = () => {
  const p = players[0];
  if (p.passed === 1) return;
  if (deckRemaining(deck) === 0) {
    logMessage(STR.log.deckDepletedNoDraw);
    $("turnBtn").disabled = true;
    p.passed = 1;
    return;
  }
  const card = drawFromDeck(deck);
  const value = convert(card);
  const cardName = compile(card);
  logMessage(STR.log.youDrew.replace("{card}", cardName));
  // Human is always at seat index where SEAT_ORDER[s] === 0
  const humanSeatIdx = SEAT_ORDER.indexOf(0);
  const slot = placeCard(p, humanSeatIdx, value, card, cardName);
  if (slot === 4) {
    $("turnBtn").disabled = true;
    p.passed = 1;
  }
  p.score = scoreHand(p.cards, p.fieldValue);
};

const turn = () => {
  logMessage(STR.log.separator);
  // Run CPUs and human in table (seat) order; splice human turn at its seat.
  const humanSeat = SEAT_ORDER.indexOf(0);
  for (let s = 0; s < NUM_PLAYERS; s++) {
    if (s === humanSeat) {
      humanTurn();
      checkBomb();
    } else {
      cpuTurn(playerAt(s), s);
    }
  }
  // CPU interference-field AI
  for (let s = 0; s < NUM_PLAYERS; s++) {
    if (s === humanSeat) continue;
    cpuInterAI(playerAt(s), s);
  }
  generate();
  scrollLog();
  // Recompute all scores after the generator
  for (let i = 0; i < NUM_PLAYERS; i++) {
    players[i].score = scoreHand(players[i].cards, players[i].fieldValue);
  }
  checkBomb();
};

const pass = () => {
  players[0].passed = 1;
  do {
    turn();
  } while (players.some((p) => !p.isHuman && p.passed !== 1));

  // Reveal all CPU face-down cards
  const humanSeat = SEAT_ORDER.indexOf(0);
  for (let s = 0; s < NUM_PLAYERS; s++) {
    if (s === humanSeat) continue;
    const p = playerAt(s);
    setImg(cardId(s, 0), `assets/cards/${p.cardFiles[0]}`);
    setImg(cardId(s, 1), `assets/cards/${p.cardFiles[1]}`);
  }
  // Final scores
  for (let i = 0; i < NUM_PLAYERS; i++) {
    players[i].score = scoreHand(players[i].cards, players[i].fieldValue);
  }

  // Build round-over summary list in seat order
  const summaryList = SEAT_ORDER.map((pIdx) => {
    const p = players[pIdx];
    return `${p.name}${msg(p.score)}`;
  }).join(" | ");
  showToast(STR.toast.roundOver.replace("{list}", summaryList), "info");

  scoreRound();
  resetRound();

  const winner = decideWinner(players.map((p) => p.points));
  if (winner.index < 0) {
    gamer();
  } else {
    // Record human player's result to Hall of Fame (only on victory)
    if (!winner.tie && winner.index === 0) {
      recordHallOfFame({
        name: players[0].name,
        score: players[0].points,
        rounds: roundCount,
        pureSabaccs: pureSabaccCount,
        time: Date.now() - gameStartTime,
      });
    }
    showEndScreen(winner);
  }
};

const ref = () => { self.location.reload(); };

// -----------------------------------------------------------------------------
// Deal / new round
// -----------------------------------------------------------------------------

const dealCards = () => {
  // 2 cards per player from the shared deck
  for (let i = 0; i < NUM_PLAYERS; i++) {
    const p = players[i];
    const a = drawFromDeck(deck);
    const b = drawFromDeck(deck);
    p.cardFiles[0] = a;
    p.cardFiles[1] = b;
    p.cards[0] = convert(a);
    p.cards[1] = convert(b);
    const seatIdx = SEAT_ORDER.indexOf(i);
    if (p.isHuman) {
      setImg(cardId(seatIdx, 0), `assets/cards/${a}`);
      setImg(cardId(seatIdx, 1), `assets/cards/${b}`);
      setAlt(cardId(seatIdx, 0), compile(a));
      setAlt(cardId(seatIdx, 1), compile(b));
    } else {
      setImg(cardId(seatIdx, 0), ASSET.wallp);
      setImg(cardId(seatIdx, 1), ASSET.wallp);
      setAlt(cardId(seatIdx, 0), "");
      setAlt(cardId(seatIdx, 1), "");
    }
  }
  clearLog();
  scrollLog();
  checkBomb();
};

const gamer = () => {
  // Reset per-round state
  for (const p of players) {
    p.passed = 0;
    p.fieldUsed = 0;
    p.fieldValue = EMPTY;
    p.score = 0;
  }
  bomb = 0;
  interIdx = -1;
  blankedImgId = "";
  interSavedFile = "";

  // First game: start timer and round counter
  if (gameStartTime === 0) {
    gameStartTime = Date.now();
    roundCount = 1;
    pureSabaccCount = 0;
  }

  players[0].name = $("nameInput").value || STR.defaultPlayerName;
  savePlayerName(players[0].name);
  $("turnBtn").disabled = false;
  showScreen("game");
  startMusic();
  buildGameBoard();
  setAlt("playerAvatar", players[0].name);
  rollCpuFavorites();
  dealCards();
  setupDragAndDrop();
};

const resetRound = () => {
  bomb = 0;
  interIdx = -1;
  blankedImgId = "";
  interSavedFile = "";
  for (const p of players) {
    p.fieldValue = EMPTY;
    p.fieldUsed = 0;
    p.score = 0;
    p.passed = 0;
    p.cards = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
    p.cardFiles = ["jpg", "jpg", "jpg", "jpg", "jpg"];
    p.favorites = Array(10).fill("jpg");
  }
  deck = buildDeck();

  // Reset all card images and field images
  const humanSeat = SEAT_ORDER.indexOf(0);
  for (let s = 0; s < NUM_PLAYERS; s++) {
    const p = playerAt(s);
    setImg(fieldId(s), ASSET.field);
    setAlt(fieldId(s), s === humanSeat ? STR.alt.yourField : STR.alt.opponentField);
    for (let slot = 0; slot <= 4; slot++) {
      setImg(cardId(s, slot), p.isHuman ? ASSET.blank : (slot < 2 ? ASSET.wallp : ASSET.blank));
      setAlt(cardId(s, slot), "");
    }
  }
};

// -----------------------------------------------------------------------------
// Opponent selection
// -----------------------------------------------------------------------------

const opps = () => {
  if (opponentsRolled) return;
  const races = pickOpponents();
  for (let i = 1; i <= NUM_CPUS; i++) {
    players[i].race = races[i - 1];
    players[i].name = races[i - 1];
    const seatIdx = SEAT_ORDER.indexOf(i);
    const avatarIdx = CPU_RACES.findIndex((r) => r.name === races[i - 1]);
    setImg(avatarId(seatIdx), `${ASSET.avatarDir}cpu${avatarIdx + 1}.gif`);
    setAlt(avatarId(seatIdx), races[i - 1]);
  }

  const oppNames = players.slice(1).map((p) => p.name);
  const namesList = oppNames.join(", ");
  logMessage(STR.log.opponents.replace("{names}", namesList));
  logMessage(STR.log.firstPair);
  opponentsRolled = true;
};

// -----------------------------------------------------------------------------
// CPU interference-field AI
// -----------------------------------------------------------------------------

const rollCpuFavorites = () => {
  for (let i = 1; i <= NUM_CPUS; i++) {
    players[i].favorites = rollFavorites();
  }
};

const cpuInterAI = (p, seatIdx) => {
  if (p.fieldValue !== EMPTY || p.fieldUsed === 1) return;
  for (let aj = 0; aj < p.favorites.length; aj++) {
    for (let ij = 0; ij < p.cardFiles.length; ij++) {
      if (p.cardFiles[ij] === p.favorites[aj]) {
        const savedValue = p.cards[ij];
        const savedLoc = p.cardFiles[ij];
        p.cards[ij] = 0;
        p.cardFiles[ij] = "field.gif";
        const cardName = compile(savedLoc);
        const toOppField = STR.alt.cardToOpponentField.replace("{card}", cardName);
        setImg(fieldId(seatIdx), `assets/cards/${savedLoc}`);
        setAlt(fieldId(seatIdx), toOppField);
        setAlt(cardId(seatIdx, ij), toOppField);
        setImg(cardId(seatIdx, ij), ASSET.field);
        p.fieldValue = savedValue;
        p.fieldUsed = 1;
        return;
      }
    }
  }
};

// -----------------------------------------------------------------------------
// Human interference field (drag and drop)
// -----------------------------------------------------------------------------

const moveToField = (slotIdx) => {
  const p = players[0];
  const humanSeat = SEAT_ORDER.indexOf(0);
  const clickedImgId = cardId(humanSeat, slotIdx);
  if (p.cards[slotIdx] === EMPTY) return;

  if (p.fieldValue !== EMPTY) {
    showToast(STR.toast.fieldOccupied, "error");
    return;
  }
  p.fieldValue = p.cards[slotIdx];
  interIdx = slotIdx;
  blankedImgId = clickedImgId;
  interSavedFile = p.cardFiles[slotIdx];
  const cardName = compile(p.cardFiles[slotIdx]);
  const toYourField = STR.alt.cardToYourField.replace("{card}", cardName);
  setImg(fieldId(humanSeat), `assets/cards/${p.cardFiles[slotIdx]}`);
  setAlt(fieldId(humanSeat), toYourField);
  setAlt(clickedImgId, toYourField);
  $(clickedImgId).src = ASSET.field;
  p.cardFiles[slotIdx] = "jpg";
  p.cards[slotIdx] = 0;
};

const retrieveFromField = () => {
  const p = players[0];
  const humanSeat = SEAT_ORDER.indexOf(0);
  if (p.fieldValue === EMPTY) {
    showToast(STR.toast.nothingToRetrieve, "error");
    return;
  }
  if (p.cards[interIdx] === 0) p.cards[interIdx] = p.fieldValue;
  p.cardFiles[interIdx] = interSavedFile;
  const cardName = compile(interSavedFile);
  setImg(fieldId(humanSeat), ASSET.field);
  setAlt(fieldId(humanSeat), STR.alt.yourField);
  setAlt(cardId(humanSeat, interIdx), cardName);
  $(blankedImgId).src = `assets/cards/${interSavedFile}`;
  p.fieldValue = EMPTY;
  interIdx = -1;
  blankedImgId = "";
  interSavedFile = "";
};

// Drag and drop handlers
const onCardDragStart = (e) => {
  const img = e.currentTarget;
  const slotIdx = Number(img.dataset.slot);
  const p = players[0];
  if (p.cards[slotIdx] === EMPTY || p.cards[slotIdx] === 0) {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData("text/plain", String(slotIdx));
  e.dataTransfer.effectAllowed = "move";
  img.classList.add("dragging");
};

const onCardDragEnd = (e) => {
  e.currentTarget.classList.remove("dragging");
};

const onFieldDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  const zone = $("playerFieldDrop");
  if (zone) zone.classList.add("drag-over");
};

const onFieldDragLeave = () => {
  const zone = $("playerFieldDrop");
  if (zone) zone.classList.remove("drag-over");
};

const onFieldDrop = (e) => {
  e.preventDefault();
  const zone = $("playerFieldDrop");
  if (zone) zone.classList.remove("drag-over");
  const slotIdx = Number(e.dataTransfer.getData("text/plain"));
  if (Number.isNaN(slotIdx)) return;
  moveToField(slotIdx);
};

const onCardDragOver = (e) => {
  if (players[0].fieldValue !== EMPTY) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
};

const onCardDrop = (e) => {
  e.preventDefault();
  if (players[0].fieldValue !== EMPTY) retrieveFromField();
};

const setupDragAndDrop = () => {
  const humanSeat = SEAT_ORDER.indexOf(0);
  for (let i = 0; i <= 4; i++) {
    const img = $(cardId(humanSeat, i));
    if (!img) continue;
    img.draggable = true;
    img.dataset.slot = String(i);
    img.addEventListener("dragstart", onCardDragStart);
    img.addEventListener("dragend", onCardDragEnd);
    img.addEventListener("dragover", onCardDragOver);
    img.addEventListener("drop", onCardDrop);
  }
  const zone = $("playerFieldDrop");
  if (zone) {
    zone.addEventListener("dragover", onFieldDragOver);
    zone.addEventListener("dragleave", onFieldDragLeave);
    zone.addEventListener("drop", onFieldDrop);
  }
  const field = $(fieldId(humanSeat));
  if (field) {
    field.addEventListener("click", () => retrieveFromField());
  }
};

// -----------------------------------------------------------------------------
// Generator (randomizer pot)
// -----------------------------------------------------------------------------

const generate = () => {
  const picked = pickGeneratorCards(deck);
  if (!picked) {
    logMessage(STR.log.generatorDeckDepleted);
    return;
  }
  const { g1, g2 } = picked;
  const q1 = compile(g1);
  const q2 = compile(g2);

  logMessage(STR.log.generatorReplaced.replace("{g1}", q1).replace("{g2}", q2));
  $("genCard1").value = q1;
  $("genCard2").value = q2;

  // Build hands map keyed by player index string
  const hands = {};
  for (let i = 0; i < NUM_PLAYERS; i++) {
    hands[`p${i}`] = { locs: players[i].cardFiles, cards: players[i].cards };
  }
  const result = generatorSwap(hands, g1, g2);

  if (!result.swapped) return;

  // Render any swapped cards and write back
  for (let i = 0; i < NUM_PLAYERS; i++) {
    const key = `p${i}`;
    const r = result[key];
    const seatIdx = SEAT_ORDER.indexOf(i);
    if (r.changed) {
      for (let s = 0; s < r.locs.length; s++) {
        if (r.locs[s] === g2) {
          setImg(cardId(seatIdx, s), `assets/cards/${g2}`);
          setAlt(cardId(seatIdx, s), q2);
        }
      }
    }
    players[i].cardFiles = r.locs;
    players[i].cards = r.cards;
  }

  updateScore();
};

// -----------------------------------------------------------------------------
// Music
// -----------------------------------------------------------------------------

const MUSIC_KEY = "sabacc-music";
const NAME_KEY = "sabacc-player-name";

const loadMusicPref = () => {
  try { return localStorage.getItem(MUSIC_KEY) || "on"; } catch { return "on"; }
};

const setMusic = (val) => {
  try { localStorage.setItem(MUSIC_KEY, val); } catch {}
};

const loadPlayerName = () => {
  try { return localStorage.getItem(NAME_KEY) || ""; } catch { return ""; }
};

const savePlayerName = (name) => {
  try { localStorage.setItem(NAME_KEY, name); } catch {}
};

const startMusic = () => {
  if (musicStarted !== 0) return;
  if (loadMusicPref() === "on") $("musicPlayer").src = `${ASSET.audioDir}cantina.mp3`;
  musicStarted = 1;
};

// -----------------------------------------------------------------------------
// Keyboard support
// -----------------------------------------------------------------------------

const setupKeyboard = () => {
  document.addEventListener("keydown", (e) => {
    if ($("game").style.display !== "block") return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.code === "Space") {
      e.preventDefault();
      if (!$("turnBtn").disabled) turn();
    } else if (e.key === "p" || e.key === "P") {
      e.preventDefault();
      pass();
    }
  });
};

// -----------------------------------------------------------------------------
// Win threshold — configurable via Settings, persisted in localStorage
// -----------------------------------------------------------------------------

const WIN_THRESHOLD_KEY = "sabacc-win-threshold";
const VALID_THRESHOLDS = [100, 500, 1000, 2500, 5000];

const loadWinThreshold = () => {
  try {
    const v = Number(localStorage.getItem(WIN_THRESHOLD_KEY));
    if (VALID_THRESHOLDS.includes(v)) return v;
  } catch {}
  return 500;
};

const setWinThreshold = (val) => {
  const n = Number(val);
  if (VALID_THRESHOLDS.includes(n)) {
    WIN_THRESHOLD = n;
    try { localStorage.setItem(WIN_THRESHOLD_KEY, String(n)); } catch {}
  }
};

// Apply saved threshold on script load
if (typeof document !== "undefined") {
  WIN_THRESHOLD = loadWinThreshold();
  // Rebuild CPU_RACES when the locale changes so opponent names translate.
  if (typeof i18n !== "undefined" && i18n.onLocaleChange) {
    i18n.onLocaleChange(() => { CPU_RACES = refreshCpuRaces(); });
  }
}

// -----------------------------------------------------------------------------
// Screen navigation
// -----------------------------------------------------------------------------

const showScreen = (id) => {
  for (const el of document.querySelectorAll(".screen")) {
    el.style.display = "none";
  }
  const target = $(id);
  if (!target) return;
  // Menu and sub-screens use flex for left-aligned vertical centering;
  // the game screen uses block layout; credits uses block (fixed-position).
  if (target.classList.contains("game-screen") || target.classList.contains("credits-screen")) {
    target.style.display = "block";
  } else {
    target.style.display = "flex";
  }
};

// -----------------------------------------------------------------------------
// Intro video
// -----------------------------------------------------------------------------

const skipIntro = () => {
  const overlay = $("introVideo");
  if (!overlay) return;
  overlay.classList.add("hidden");
  const video = $("introPlayer");
  if (video) video.pause();
};

// -----------------------------------------------------------------------------
// End screen (win / lose / tie)
// -----------------------------------------------------------------------------

const formatTime = (ms) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const showEndScreen = (winner) => {
  const humanWon = winner.index === 0;
  const isTie = winner.tie;

  // Emoji + title
  $("endEmoji").textContent = isTie ? STR.end.tieEmoji : (humanWon ? STR.end.victoryEmoji : STR.end.defeatEmoji);
  $("endTitle").textContent = isTie ? STR.end.tie : (humanWon ? STR.end.victory : STR.end.defeat);

  // Winner name
  if (isTie) {
    $("endWinner").textContent = STR.end.tieMessage;
  } else if (humanWon) {
    $("endWinner").textContent = STR.end.youWin;
  } else {
    $("endWinner").textContent = STR.end.youLose.replace("{name}", players[winner.index].name);
  }

  // Stats
  const time = Date.now() - gameStartTime;
  $("endStats").innerHTML =
    STR.end.yourScore.replace("{score}", players[0].points) + "<br>" +
    STR.end.rounds.replace("{rounds}", roundCount) + "<br>" +
    STR.end.pureSabaccs.replace("{count}", pureSabaccCount) + "<br>" +
    STR.end.gameTime.replace("{time}", formatTime(time));

  showScreen("endScreen");
};

const resetGameState = () => {
  // Reset tournament state so a new game starts fresh
  game = 0;
  gameStartTime = 0;
  roundCount = 0;
  pureSabaccCount = 0;
  opponentsRolled = false;
  for (const p of players) {
    p.points = 0;
    p.score = 0;
    p.passed = 0;
    p.fieldUsed = 0;
    p.fieldValue = EMPTY;
    p.cards = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
    p.cardFiles = ["jpg", "jpg", "jpg", "jpg", "jpg"];
    p.favorites = Array(10).fill("jpg");
    p.name = "";
    p.race = "none";
  }
  deck = buildDeck();
  bomb = 0;
  interIdx = -1;
  blankedImgId = "";
  interSavedFile = "";
};

const playAgain = () => {
  resetGameState();
  // Restore player name from Settings input
  const nameInput = $("nameInput");
  if (nameInput && nameInput.value) {
    players[0].name = nameInput.value;
  } else {
    players[0].name = loadPlayerName() || STR.defaultPlayerName;
  }
  skipIntro();
  gamer();
};

// -----------------------------------------------------------------------------
// Hall of Fame — localStorage persistence
// -----------------------------------------------------------------------------

const HOF_KEY = "sabacc-hof";
const HOF_MAX = 10;
let hofSortKey = "score";

const loadHallOfFame = () => {
  try {
    const raw = localStorage.getItem(HOF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveHallOfFame = (data) => {
  try {
    localStorage.setItem(HOF_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
};

const recordHallOfFame = (entry) => {
  const data = loadHallOfFame();
  data.push(entry);
  saveHallOfFame(data);
};

const renderHallOfFame = () => {
  const container = $("hofTable");
  if (!container) return;
  const data = loadHallOfFame();
  if (data.length === 0) {
    container.innerHTML = `<p class="hof-empty">${STR.hof.empty}</p>`;
    return;
  }
  const sorted = [...data].sort((a, b) => {
    if (hofSortKey === "score") return b.score - a.score;
    if (hofSortKey === "rounds") return b.rounds - a.rounds;
    if (hofSortKey === "pureSabaccs") return (b.pureSabaccs || 0) - (a.pureSabaccs || 0);
    if (hofSortKey === "time") return a.time - b.time;
    return 0;
  }).slice(0, HOF_MAX);

  const rows = sorted.map((e, i) =>
    `<tr><td>${i + 1}</td><td>${e.name}</td><td>${e.score}</td><td>${e.rounds}</td><td>${e.pureSabaccs || 0}</td><td>${formatTime(e.time)}</td></tr>`
  ).join("");

  const sortAttr = (key) =>
    key === hofSortKey ? ' class="sort-active"' : "";

  container.innerHTML =
    `<table class="hof-table">` +
    `<tr>` +
      `<th>${STR.hof.rank}</th>` +
      `<th>${STR.hof.name}</th>` +
      `<th${sortAttr("score")} onclick="hofSort('score')">${STR.hof.score}</th>` +
      `<th${sortAttr("rounds")} onclick="hofSort('rounds')">${STR.hof.rounds}</th>` +
      `<th${sortAttr("pureSabaccs")} onclick="hofSort('pureSabaccs')">${STR.hof.pureSabaccs}</th>` +
      `<th${sortAttr("time")} onclick="hofSort('time')">${STR.hof.time}</th>` +
    `</tr>` +
    rows +
    `</table>`;
};

const showHallOfFame = () => {
  renderHallOfFame();
  showScreen("hofScreen");
};

// -----------------------------------------------------------------------------
// Rules screen
// -----------------------------------------------------------------------------

const showRules = () => {
  const c = $("rulesContent");
  if (c) c.innerHTML = STR.rules.html;
  showScreen("rulesScreen");
};

// -----------------------------------------------------------------------------
// Credits screen
// -----------------------------------------------------------------------------

const showCredits = () => {
  const scroll = $("creditsScroll");
  if (scroll) scroll.innerHTML = STR.credits.html;
  showScreen("creditsScreen");
  const audio = $("creditsAudio");
  if (audio) {
    audio.currentTime = 0;
    if (loadMusicPref() === "on") audio.play().catch(() => {});
  }
};

const stopCreditsMusic = () => {
  const audio = $("creditsAudio");
  if (audio) { audio.pause(); audio.currentTime = 0; }
};

const hofSort = (key) => {
  hofSortKey = key;
  renderHallOfFame();
};

const resetHallOfFame = () => {
  if (confirm(STR.hof.resetConfirm)) {
    saveHallOfFame([]);
    renderHallOfFame();
  }
};

// -----------------------------------------------------------------------------
// Exit game
// -----------------------------------------------------------------------------

const exitGame = () => {
  // In a browser tab we can't truly close, so go to a blank state.
  // Some browsers allow window.close() if opened by script; try it.
  window.close();
  // Fallback: show a goodbye screen
  document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:yellow;font-size:24px;font-family:sans-serif">May the Force be with you.</div>`;
};

// -----------------------------------------------------------------------------
// Init — runs on script load in the browser
// -----------------------------------------------------------------------------

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupKeyboard();
    const sel = $("winThresholdSelect");
    if (sel) sel.value = String(WIN_THRESHOLD);
    const musicSel = $("musicToggle");
    if (musicSel) musicSel.value = loadMusicPref();
    const nameInput = $("nameInput");
    if (nameInput) {
      const saved = loadPlayerName();
      if (saved) nameInput.value = saved;
    }
    // Auto-dismiss intro video after 6 seconds
    setTimeout(skipIntro, 6000);
  });
} else {
  setupKeyboard();
  const sel = $("winThresholdSelect");
  if (sel) sel.value = String(WIN_THRESHOLD);
  const musicSel = $("musicToggle");
  if (musicSel) musicSel.value = loadMusicPref();
  const nameInput = $("nameInput");
  if (nameInput) {
    const saved = loadPlayerName();
    if (saved) nameInput.value = saved;
  }
  setTimeout(skipIntro, 6000);
}

// Expose DOM-coupled functions to inline HTML handlers (browser only).
window.gamer = gamer;
window.turn = turn;
window.pass = pass;
window.showScreen = showScreen;
window.showHallOfFame = showHallOfFame;
window.resetHallOfFame = resetHallOfFame;
window.exitGame = exitGame;
window.hofSort = hofSort;
window.setWinThreshold = setWinThreshold;
window.showRules = showRules;
window.setMusic = setMusic;
window.showCredits = showCredits;
window.stopCreditsMusic = stopCreditsMusic;
window.skipIntro = skipIntro;
window.resetGameState = resetGameState;
window.playAgain = playAgain;

} // end of `if (typeof document !== "undefined")` block

// -----------------------------------------------------------------------------
// Expose pure rule functions to window.Sabacc for unit tests.
// This block runs in both Node and browser (window is shimmed in tests).
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  window.Sabacc = {
    buildDeck,
    convert,
    compile,
    drawFromDeck,
    deckRemaining,
    scoreHand,
    isIdiotsArray,
    evaluateRound,
    applyLeaderBonus,
    decideWinner,
    cpuPassThreshold,
    cpuWantsToDraw,
    pickOpponents,
    swapCardInLocations,
    randomGeneratorStep,
    generatorSwap,
    pickGeneratorCards,
    rollFavorites,
    PURE_SABACC,
    BOMB,
    PURE_SABACC_POINTS,
    BOMB_POINTS,
    WIN_THRESHOLD,
    EMPTY,
    CPU_RACES,
    NUM_CPUS,
    NUM_PLAYERS,
  };
}