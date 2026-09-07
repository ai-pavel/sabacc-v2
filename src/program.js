// =============================================================================
// Sabacc Tournament — game logic (refactored 2025 from 2005 original)
//
// Single-file plain script (no module syntax, works via file://).
// Pure rule functions are attached to window.Sabacc for unit testing;
// DOM-mutating functions are attached to `window` for the event handlers
// registered in index.html.
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
/** Tournament winner crosses this threshold */
const WIN_THRESHOLD = 500;
/** Sentinel for an empty card slot */
const EMPTY = 20;

const SUITS = { c: "Coins", f: "Flasks", p: "Sabers", s: "Staves" };

// Face cards: code prefix -> { value, name }
const FACE_CARDS = {
  i: { value: 0,  name: "Idiot" },
  q: { value: 2,  name: "Queen of Madness" },
  e: { value: 6,  name: "Endurance" },
  b: { value: 8,  name: "Balance" },
  d: { value: 11, name: "Duelist" },
  c: { value: 13, name: "Commander" },
  a: { value: 15, name: "Ace" },
  s: { value: 17, name: "Senator" },
};

// CPU opponents (analysis.md table)
const CPU_RACES = [
  { name: "Human",          threshold: 15 },
  { name: "Jedi-Killer",    threshold: 16 },
  { name: "Gambler",        threshold: 17 },
  { name: "Smuggler",       threshold: 18 },
  { name: "Bounty Hunter",  threshold: 19 },
];

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
    const sign = fm[2] === "2" ? "(-)" : "(+)";
    return fm[1] === "i" ? "Idiot" : `${name} ${sign}`;
  }
  return "Empty!";
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
 * @param {number[]} points - Tournament totals [cpu1, cpu2, human].
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
 * Pick two distinct race names for the two CPU opponents.
 * @returns {[string, string]}
 */
const pickOpponents = () => {
  let j;
  let k;
  do {
    j = Math.floor(Math.random() * CPU_RACES.length);
    k = Math.floor(Math.random() * CPU_RACES.length);
  } while (j === k);
  return [CPU_RACES[j].name, CPU_RACES[k].name];
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
 * Apply the generator swap to all three players' hands at once (pure logic).
 * @param {Object} hands - { locs, cards } arrays for player, cpu1, cpu2.
 * @param {string} g1 - Card to replace.
 * @param {string} g2 - Replacement card.
 * @returns {{ player, cpu1, cpu2, swapped: boolean }}
 *   Each property is { locs, cards, changed }. swapped is false if g1==g2.
 */
const generatorSwap = (hands, g1, g2) => {
  if (g1 === g2) {
    return {
      player: { locs: hands.player.locs, cards: hands.player.cards, changed: false },
      cpu1:   { locs: hands.cpu1.locs,   cards: hands.cpu1.cards,   changed: false },
      cpu2:   { locs: hands.cpu2.locs,   cards: hands.cpu2.cards,   changed: false },
      swapped: false,
    };
  }
  const newValue = convert(g2);
  return {
    player: swapCardInLocations(hands.player.locs, hands.player.cards, g1, g2, newValue),
    cpu1:   swapCardInLocations(hands.cpu1.locs,   hands.cpu1.cards,   g1, g2, newValue),
    cpu2:   swapCardInLocations(hands.cpu2.locs,   hands.cpu2.cards,   g1, g2, newValue),
    swapped: true,
  };
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
const setImg = (id, src) => { $(id).src = src; };
const setAlt = (id, alt) => { $(id).alt = alt; };

const ASSET = {
  cardDir: "assets/cards/",
  avatarDir: "assets/avatars/",
  audioDir: "assets/audio/",
  field: "assets/cards/field.gif",
  wallp: "assets/cards/wallp.gif",
  blank: "assets/cards/blank.gif",
};

// -----------------------------------------------------------------------------
// Game state (module-scoped, reset by resetRound())
// -----------------------------------------------------------------------------

let game = 0;
let musicStarted = 0;
let bomb = 0;

let playerName = "";
let cpu1Name = "";
let cpu2Name = "";
let race1 = "none";
let race2 = "none";
let opponentsRolled = false; // keep same opponents through the tournament

let passed = 0;
let cpu1Passed = 0;
let cpu2Passed = 0;
let cpu1FieldUsed = 0;
let cpu2FieldUsed = 0;

let score = 0;
let score1 = 0;
let score2 = 0;

let playerFieldValue = EMPTY;
let cpu1FieldValue = EMPTY;
let cpu2FieldValue = EMPTY;

let points1 = 0;
let points2 = 0;
let points3 = 0;

let cards = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
let cards1 = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
let cards2 = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];

let cardFiles = ["jpg", "jpg", "jpg", "jpg", "jpg"];
let cardFiles1 = ["jpg", "jpg", "jpg", "jpg", "jpg"];
let cardFiles2 = ["jpg", "jpg", "jpg", "jpg", "jpg"];

let favorites1 = Array(10).fill("jpg");
let favorites2 = Array(10).fill("jpg");

let deck = buildDeck();

// interference-field bookkeeping for human
let interIdx = -1;
let blankedImgId = "";
let interSavedFile = "";

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
  // Force reflow so the transition plays
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

const scrollLog = () => { $("eventLog").scrollTop = $("eventLog").scrollHeight; };

const clearLog = () => {
  opps();
  if (game === 0) {
    $("eventLog").value = `${playerName}, good luck and don't get cocky!`;
    game = 2;
  } else {
    $("eventLog").value = `Round ${game}`;
    game += 1;
    logMessage(
      `***** Tournament table *****\n` +
      `${race1} - ${points1}\n${playerName} - ${points3}\n${race2} - ${points2}\n` +
      `************************************************************`,
    );
  }
  updateScore();
  $("genCard1").value = "";
  $("genCard2").value = "";
};

// -----------------------------------------------------------------------------
// Score display
// -----------------------------------------------------------------------------

const updateScore = () => {
  score = scoreHand(cards, playerFieldValue);
  logMessage(`- Your current score: ${score}`);
};

// -----------------------------------------------------------------------------
// Hand evaluation / bomb detection
// -----------------------------------------------------------------------------

const checkBomb = () => {
  if (bomb === 1) return;
  if (score === 0 || score > PURE_SABACC || score < -PURE_SABACC) {
    showToast("You bombed!", "error");
    $("turnBtn").disabled = true;
    passed = 1;
    bomb = 1;
  } else if (score === PURE_SABACC || score === -PURE_SABACC) {
    showToast("Pure Sabacc!", "success");
    $("turnBtn").disabled = true;
    passed = 1;
    bomb = 1;
  }
};

// -----------------------------------------------------------------------------
// Round end / scoring / tournament progression
// -----------------------------------------------------------------------------

const msg = (inputScore) => {
  if (inputScore === 0 || inputScore > PURE_SABACC || inputScore < -PURE_SABACC) {
    return " bombed :(";
  }
  if (inputScore === PURE_SABACC || inputScore === -PURE_SABACC) {
    return " Pure Sabacc!";
  }
  return ` scored ${Math.abs(inputScore)} pts.`;
};

const scoreRound = () => {
  const humanIdiot = isIdiotsArray(cards, playerFieldValue);
  const cpu1Idiot = isIdiotsArray(cards1, cpu1FieldValue);
  const cpu2Idiot = isIdiotsArray(cards2, cpu2FieldValue);

  const r1 = evaluateRound(score1, { idiotsArray: cpu1Idiot });
  const r2 = evaluateRound(score2, { idiotsArray: cpu2Idiot });
  const r3 = evaluateRound(score,  { idiotsArray: humanIdiot  });

  points1 += r1.tournamentDelta;
  points2 += r2.tournamentDelta;
  points3 += r3.tournamentDelta;

  const roundPoints = [r1.roundPoints, r2.roundPoints, r3.roundPoints];
  const tournamentPoints = [points1, points2, points3];
  const [p1, p2, p3] = applyLeaderBonus(tournamentPoints, roundPoints);
  points1 = p1;
  points2 = p2;
  points3 = p3;
};

// -----------------------------------------------------------------------------
// Turn processing
// -----------------------------------------------------------------------------

const placeCard = (handCards, handLocs, slotIds, value, cardFile, cardName) => {
  for (let s = 2; s <= 4; s++) {
    if (handCards[s] === EMPTY) {
      handCards[s] = value;
      handLocs[s] = cardFile;
      setImg(slotIds[s - 2], `assets/cards/${cardFile}`);
      setAlt(slotIds[s - 2], cardName);
      return s;
    }
  }
  return -1;
};

const cpuTurn = (raceName, cpuScore, handCards, handLocs, slotIds, passFlag) => {
  if (passFlag === 1) return { passed: true, score: cpuScore };
  const threshold = cpuPassThreshold(raceName);
  if (cpuWantsToDraw(cpuScore, threshold)) {
    if (deckRemaining(deck) === 0) {
      logMessage(`- ${raceName} passes (deck depleted)`);
      return { passed: true, score: cpuScore };
    }
    const card = drawFromDeck(deck);
    const value = convert(card);
    const cardName = compile(card);
    logMessage(`- ${raceName} drew card "${cardName}"`);
    const slot = placeCard(handCards, handLocs, slotIds, value, card, cardName);
    if (slot === 4) {
      logMessage(`- ${raceName} passes`);
      return { passed: true, score: scoreHand(handCards, EMPTY) };
    }
    return { passed: false, score: scoreHand(handCards, EMPTY) };
  }
  logMessage(`- ${raceName} passes`);
  return { passed: true, score: cpuScore };
};

const humanTurn = () => {
  if (passed === 1) return;
  if (deckRemaining(deck) === 0) {
    logMessage("- Deck depleted — no more draws");
    $("turnBtn").disabled = true;
    passed = 1;
    return;
  }
  const card = drawFromDeck(deck);
  const value = convert(card);
  const cardName = compile(card);
  logMessage(`- You drew card "${cardName}"`);
  const slot = placeCard(cards, cardFiles, ["playerCard2", "playerCard3", "playerCard4"], value, card, cardName);
  if (slot === 4) {
    $("turnBtn").disabled = true;
    passed = 1;
  }
};

const turn = () => {
  logMessage("************************************************************");
  const r1 = cpuTurn(race1, score1, cards1, cardFiles1, ["cpu1Card2", "cpu1Card3", "cpu1Card4"], cpu1Passed);
  cpu1Passed = r1.passed ? 1 : cpu1Passed;
  score1 = r1.score;
  humanTurn();
  checkBomb();
  const r2 = cpuTurn(race2, score2, cards2, cardFiles2, ["cpu2Card2", "cpu2Card3", "cpu2Card4"], cpu2Passed);
  cpu2Passed = r2.passed ? 1 : cpu2Passed;
  score2 = r2.score;

  cpu1InterAI();
  cpu2InterAI();
  generate();
  scrollLog();
  score = scoreHand(cards, playerFieldValue);
  score1 = scoreHand(cards1, cpu1FieldValue);
  score2 = scoreHand(cards2, cpu2FieldValue);
  checkBomb();
};

const pass = () => {
  passed = 1;
  do {
    turn();
  } while (cpu1Passed !== 1 || cpu2Passed !== 1);

  $("cpu1Card0").src = `assets/cards/${cardFiles1[0]}`;
  $("cpu1Card1").src = `assets/cards/${cardFiles1[1]}`;
  $("cpu2Card0").src = `assets/cards/${cardFiles2[0]}`;
  $("cpu2Card1").src = `assets/cards/${cardFiles2[1]}`;
  score = scoreHand(cards, playerFieldValue);
  score1 = scoreHand(cards1, cpu1FieldValue);
  score2 = scoreHand(cards2, cpu2FieldValue);

  showToast(
    `Round over! ${race1}${msg(score1)} | ${playerName}${msg(score)} | ${race2}${msg(score2)}`,
    "info",
  );
  scoreRound();
  resetRound();

  const winner = decideWinner([points1, points2, points3]);
  if (winner.index < 0) {
    gamer();
  } else if (winner.tie) {
    showToast("Tournament ends in a tie!", "info");
    setTimeout(ref, 2000);
  } else {
    const names = [cpu1Name, cpu2Name, playerName];
    showToast(`${names[winner.index]} wins the tournament!`, "success");
    setTimeout(ref, 3000);
  }
};

const ref = () => { self.location.reload(); };

// -----------------------------------------------------------------------------
// Deal / new round
// -----------------------------------------------------------------------------

const dealCards = () => {
  const a = drawFromDeck(deck);
  const b = drawFromDeck(deck);
  cardFiles[0] = a;
  cardFiles[1] = b;
  setImg("playerCard0", `assets/cards/${a}`);
  setImg("playerCard1", `assets/cards/${b}`);
  cards[0] = convert(a);
  cards[1] = convert(b);
  setAlt("playerCard0", compile(a));
  setAlt("playerCard1", compile(b));
  const a1 = drawFromDeck(deck);
  const b1 = drawFromDeck(deck);
  cardFiles1[0] = a1;
  cardFiles1[1] = b1;
  cards1[0] = convert(a1);
  cards1[1] = convert(b1);
  setAlt("cpu1Card0", "");
  setAlt("cpu1Card1", "");
  const a2 = drawFromDeck(deck);
  const b2 = drawFromDeck(deck);
  cardFiles2[0] = a2;
  cardFiles2[1] = b2;
  cards2[0] = convert(a2);
  cards2[1] = convert(b2);
  setAlt("cpu2Card0", "");
  setAlt("cpu2Card1", "");
  clearLog();
  scrollLog();
  checkBomb();
};

const gamer = () => {
  cpu1FieldUsed = 0;
  cpu2FieldUsed = 0;
  passed = 0;
  cpu1Passed = 0;
  cpu2Passed = 0;
  playerName = $("nameInput").value;
  if (playerName === "") playerName = "Player";
  $("turnBtn").disabled = false;
  setAlt("playerAvatar", playerName);
  $("startPanel").style.display = "none";
  $("game").style.display = "block";
  startMusic();
  rollCpuFavorites();
  dealCards();
  setupDragAndDrop();
};

const resetRound = () => {
  bomb = 0;
  playerFieldValue = EMPTY;
  cpu1FieldValue = EMPTY;
  cpu2FieldValue = EMPTY;
  interIdx = -1;
  blankedImgId = "";
  interSavedFile = "";
  score = 0;
  score1 = 0;
  score2 = 0;
  // Keep opponents across rounds (opponentsRolled stays true).

  cards = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
  cards1 = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
  cards2 = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
  cardFiles = ["jpg", "jpg", "jpg", "jpg", "jpg"];
  cardFiles1 = ["jpg", "jpg", "jpg", "jpg", "jpg"];
  cardFiles2 = ["jpg", "jpg", "jpg", "jpg", "jpg"];
  favorites1 = Array(10).fill("jpg");
  favorites2 = Array(10).fill("jpg");
  deck = buildDeck();

  for (const id of ["playerField", "cpu1Field", "cpu2Field"]) setImg(id, ASSET.field);
  setAlt("playerField", "Your interference field");
  setAlt("cpu1Field", "Opponent's interference field");
  setAlt("cpu2Field", "Opponent's interference field");
  for (const id of ["playerCard0", "playerCard1", "playerCard2", "playerCard3", "playerCard4"]) setImg(id, ASSET.blank);
  for (const id of ["cpu1Card0", "cpu1Card1", "cpu2Card0", "cpu2Card1"]) setImg(id, ASSET.wallp);
  for (const id of ["cpu1Card2", "cpu1Card3", "cpu1Card4", "cpu2Card2", "cpu2Card3", "cpu2Card4"]) setImg(id, ASSET.blank);
  for (const id of [
    "playerCard0", "playerCard1", "playerCard2", "playerCard3", "playerCard4",
    "cpu1Card0", "cpu1Card1", "cpu1Card2", "cpu1Card3", "cpu1Card4",
    "cpu2Card0", "cpu2Card1", "cpu2Card2", "cpu2Card3", "cpu2Card4",
  ]) {
    setAlt(id, "");
  }
};

// -----------------------------------------------------------------------------
// Opponent selection
// -----------------------------------------------------------------------------

const opps = () => {
  if (opponentsRolled) return;
  const [r1Name, r2Name] = pickOpponents();
  race1 = r1Name;
  race2 = r2Name;

  const avatarFor = (raceName) => {
    const idx = CPU_RACES.findIndex((r) => r.name === raceName);
    return `${ASSET.avatarDir}cpu${idx + 1}.gif`;
  };

  cpu1Name = race1;
  setImg("cpu1Avatar", avatarFor(race1));
  setAlt("cpu1Avatar", race1);

  cpu2Name = race2;
  setImg("cpu2Avatar", avatarFor(race2));
  setAlt("cpu2Avatar", race2);

  logMessage(`- Your opponents are ${cpu1Name} and ${cpu2Name}`);
  logMessage(`- Your first pair has been dealt`);
  opponentsRolled = true;
};

// -----------------------------------------------------------------------------
// CPU interference-field AI
// -----------------------------------------------------------------------------

const rollCpuFavorites = () => {
  favorites1 = rollFavorites();
  favorites2 = rollFavorites();
};

const cpuInterai = (favorites, handCards, handLocs, fieldValue, fieldUsed, fieldId, slotIdPrefix) => {
  if (fieldValue !== EMPTY || fieldUsed === 1) return { fieldValue, fieldUsed };
  for (let aj = 0; aj < favorites.length; aj++) {
    for (let ij = 0; ij < handLocs.length; ij++) {
      if (handLocs[ij] === favorites[aj]) {
        const savedValue = handCards[ij];
        const savedLoc = handLocs[ij];
        handCards[ij] = 0;
        handLocs[ij] = "field.gif";
        const cardName = compile(savedLoc);
        setImg(fieldId, `assets/cards/${savedLoc}`);
        setAlt(fieldId, `${cardName} -> opponent's interference field`);
        setAlt(`${slotIdPrefix}${ij}`, `${cardName} -> opponent's interference field`);
        setImg(`${slotIdPrefix}${ij}`, ASSET.field);
        return { fieldValue: savedValue, fieldUsed: 1 };
      }
    }
  }
  return { fieldValue, fieldUsed };
};

const cpu1InterAI = () => {
  const r = cpuInterai(favorites1, cards1, cardFiles1, cpu1FieldValue, cpu1FieldUsed, "cpu1Field", "cpu1Card");
  cpu1FieldValue = r.fieldValue;
  cpu1FieldUsed = r.fieldUsed;
};

const cpu2InterAI = () => {
  const r = cpuInterai(favorites2, cards2, cardFiles2, cpu2FieldValue, cpu2FieldUsed, "cpu2Field", "cpu2Card");
  cpu2FieldValue = r.fieldValue;
  cpu2FieldUsed = r.fieldUsed;
};

// -----------------------------------------------------------------------------
// Human interference field (drag and drop)
// -----------------------------------------------------------------------------

const moveToField = (slotIdx) => {
  const clickedImgId = `playerCard${slotIdx}`;
  const isSlotEmpty =
    (clickedImgId === "playerCard2" && cards[2] === EMPTY) ||
    (clickedImgId === "playerCard3" && cards[3] === EMPTY) ||
    (clickedImgId === "playerCard4" && cards[4] === EMPTY);
  if (isSlotEmpty) return;

  if (playerFieldValue !== EMPTY) {
    showToast("Interference field is occupied!", "error");
    return;
  }
  playerFieldValue = cards[slotIdx];
  interIdx = slotIdx;
  blankedImgId = clickedImgId;
  interSavedFile = cardFiles[slotIdx];
  const cardName = compile(cardFiles[slotIdx]);
  setImg("playerField", `assets/cards/${cardFiles[slotIdx]}`);
  setAlt("playerField", `${cardName} -> interference field`);
  setAlt(`playerCard${slotIdx}`, `${cardName} -> interference field`);
  $(clickedImgId).src = ASSET.field;
  cardFiles[slotIdx] = "jpg";
  cards[slotIdx] = 0;
};

const retrieveFromField = () => {
  if (playerFieldValue === EMPTY) {
    showToast("Nothing to put back — move a card to the field first", "error");
    return;
  }
  if (cards[interIdx] === 0) cards[interIdx] = playerFieldValue;
  cardFiles[interIdx] = interSavedFile;
  const cardName = compile(interSavedFile);
  setImg("playerField", ASSET.field);
  setAlt("playerField", "Your interference field");
  setAlt(`playerCard${interIdx}`, cardName);
  $(blankedImgId).src = `assets/cards/${interSavedFile}`;
  playerFieldValue = EMPTY;
  interIdx = -1;
  blankedImgId = "";
  interSavedFile = "";
};

// Drag and drop handlers
const onCardDragStart = (e) => {
  const img = e.currentTarget;
  const slotIdx = Number(img.dataset.slot);
  if (cards[slotIdx] === EMPTY || cards[slotIdx] === 0) {
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
  if (playerFieldValue !== EMPTY) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
};

const onCardDrop = (e) => {
  e.preventDefault();
  if (playerFieldValue !== EMPTY) retrieveFromField();
};

const setupDragAndDrop = () => {
  // Make player cards draggable
  for (let i = 0; i <= 4; i++) {
    const img = $(`playerCard${i}`);
    if (!img) continue;
    img.draggable = true;
    img.dataset.slot = String(i);
    img.addEventListener("dragstart", onCardDragStart);
    img.addEventListener("dragend", onCardDragEnd);
    img.addEventListener("dragover", onCardDragOver);
    img.addEventListener("drop", onCardDrop);
  }
  // Make the player field drop zone (a div wrapper) a drop target
  const zone = $("playerFieldDrop");
  if (zone) {
    zone.addEventListener("dragover", onFieldDragOver);
    zone.addEventListener("dragleave", onFieldDragLeave);
    zone.addEventListener("drop", onFieldDrop);
  }
  // Click on the field image also retrieves
  const field = $("playerField");
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
    logMessage("- Random generator: deck depleted");
    return;
  }
  const { g1, g2 } = picked;
  const q1 = compile(g1);
  const q2 = compile(g2);

  logMessage(`- Random generator replaced card "${q1}" with "${q2}"`);
  $("genCard1").value = q1;
  $("genCard2").value = q2;

  // Pure swap logic
  const result = generatorSwap(
    {
      player: { locs: cardFiles, cards },
      cpu1:   { locs: cardFiles1, cards: cards1 },
      cpu2:   { locs: cardFiles2, cards: cards2 },
    },
    g1, g2,
  );

  if (!result.swapped) return;

  // Render any swapped cards
  const renderSwaps = (locs, changed, slotIds) => {
    if (!changed) return;
    for (let i = 0; i < locs.length; i++) {
      if (locs[i] === g2) {
        setImg(slotIds[i], `assets/cards/${g2}`);
        setAlt(slotIds[i], q2);
      }
    }
  };
  renderSwaps(result.player.locs, result.player.changed, ["playerCard0", "playerCard1", "playerCard2", "playerCard3", "playerCard4"]);
  renderSwaps(result.cpu1.locs,   result.cpu1.changed,   ["cpu1Card0", "cpu1Card1", "cpu1Card2", "cpu1Card3", "cpu1Card4"]);
  renderSwaps(result.cpu2.locs,   result.cpu2.changed,   ["cpu2Card0", "cpu2Card1", "cpu2Card2", "cpu2Card3", "cpu2Card4"]);

  cardFiles = result.player.locs;
  cards = result.player.cards;
  cardFiles1 = result.cpu1.locs;
  cards1 = result.cpu1.cards;
  cardFiles2 = result.cpu2.locs;
  cards2 = result.cpu2.cards;

  updateScore();
};

// -----------------------------------------------------------------------------
// Music
// -----------------------------------------------------------------------------

const startMusic = () => {
  if (musicStarted !== 0) return;
  if ($("musicToggle").checked) $("musicPlayer").src = `${ASSET.audioDir}cantina.mp3`;
  musicStarted = 1;
};

// -----------------------------------------------------------------------------
// Keyboard support
// -----------------------------------------------------------------------------

const setupKeyboard = () => {
  document.addEventListener("keydown", (e) => {
    // Only act when the game screen is visible
    if ($("game").style.display !== "block") return;
    // Don't interfere with form inputs
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
// Intro video — autoplay muted, dismiss after 6 seconds
// -----------------------------------------------------------------------------

const setupIntroVideo = () => {
  const overlay = $("introVideo");
  if (!overlay) return;
  setTimeout(() => overlay.classList.add("hidden"), 6000);
};

// -----------------------------------------------------------------------------
// Init — runs on script load in the browser
// -----------------------------------------------------------------------------

// Script loads in <head> before <body> is parsed, so defer DOM access
// until the DOM is ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupIntroVideo();
    setupKeyboard();
  });
} else {
  setupIntroVideo();
  setupKeyboard();
}

// Expose DOM-coupled functions to inline HTML handlers (browser only).
window.gamer = gamer;
window.turn = turn;
window.pass = pass;

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
  };
}