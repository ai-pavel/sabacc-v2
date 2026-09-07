// =============================================================================
// Sabacc Tournament — pure game rules (no DOM access)
//
// All game logic that doesn't touch the DOM lives here. Exported on
// window.Sabacc for the test harness and game.js.
//
// Supports 3 rulesets: traditional, spike (Corellian Spike), gungan (Otoh Gunga).
// Active ruleset is set via setRuleset() and affects deck, scoring, and
// evaluation logic.
// =============================================================================

// -----------------------------------------------------------------------------
// Rulesets
// -----------------------------------------------------------------------------

const RULESETS = {
  traditional: {
    key: "traditional",
    pureSabacc: 23,
    bombPoints: -24,
    pureSabaccPoints: 46,
    useGenerator: true,
    useDice: false,
    lowestWins: false,
    deckType: "standard",
  },
  spike: {
    key: "spike",
    pureSabacc: 0,
    bombPoints: -30,
    pureSabaccPoints: 60,
    useGenerator: false,
    useDice: true,
    lowestWins: false,
    deckType: "spike",
  },
  gungan: {
    key: "gungan",
    pureSabacc: 0,
    bombPoints: -24,
    pureSabaccPoints: 46,
    useGenerator: true,
    useDice: false,
    lowestWins: true,
    deckType: "standard",
  },
};

let currentRuleset = RULESETS.traditional;
let PURE_SABACC = currentRuleset.pureSabacc;
let BOMB = currentRuleset.bombPoints;
let PURE_SABACC_POINTS = currentRuleset.pureSabaccPoints;
let BOMB_POINTS = currentRuleset.bombPoints;

const setRuleset = (key) => {
  const rs = RULESETS[key];
  if (!rs) return;
  currentRuleset = rs;
  PURE_SABACC = rs.pureSabacc;
  BOMB = rs.bombPoints;
  PURE_SABACC_POINTS = rs.pureSabaccPoints;
  BOMB_POINTS = rs.bombPoints;
};

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

let WIN_THRESHOLD = 500;
const EMPTY = 20;

let NUM_CPUS = 4;
let NUM_PLAYERS = NUM_CPUS + 1;

const FACE_CARDS = {
  i: { value: 0 },
  q: { value: 2 },
  e: { value: 6 },
  b: { value: 8 },
  d: { value: 11 },
  c: { value: 13 },
  a: { value: 15 },
  s: { value: 17 },
};

// Corellian Spike face cards: only Idiot (0), plus positive/negative 1-10
const SPIKE_FACE_CARDS = {
  i: { value: 0 },
};

const CPU_PERSONALITIES = ["normal", "bluffer", "folder", "risktaker"];

const refreshCpuRaces = () => STR.cpuRaces.map((name, i) => ({
  name,
  threshold: 15 + i,
}));
let CPU_RACES = refreshCpuRaces();

const setCpuCount = (n) => {
  NUM_CPUS = n;
  NUM_PLAYERS = n + 1;
};

const buildSeatOrder = () => {
  const half = Math.floor(NUM_CPUS / 2);
  const order = [];
  for (let i = 0; i < half; i++) order.push(i + 1);
  order.push(0);
  for (let i = half; i < NUM_CPUS; i++) order.push(i + 1);
  return order;
};

// -----------------------------------------------------------------------------
// Deck
// -----------------------------------------------------------------------------

const buildDeck = () => {
  if (currentRuleset.deckType === "spike") {
    // Corellian Spike: 4 suits, values 1-10, plus 2 Idiot cards
    const deck = [];
    for (let v = 1; v <= 10; v++) {
      for (const s of "cfps") deck.push(`${v}${s}.jpg`);
    }
    deck.push("i1.jpg");
    deck.push("i2.jpg");
    return deck;
  }
  // Standard deck: 4 suits 1-15 + 16 face cards
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

const convert = (card) => {
  const m = card.match(/^(\d+)([cfps])\.jpg$/);
  if (m) return Number(m[1]);
  const fm = card.match(/^([iqebdcas])([12])\.jpg$/);
  if (fm) {
    const faceMap = currentRuleset.deckType === "spike" ? SPIKE_FACE_CARDS : FACE_CARDS;
    const fc = faceMap[fm[1]];
    if (!fc) return 0;
    const { value } = fc;
    if (value === 0) return 0;
    return fm[2] === "2" ? -value : value;
  }
  return 0;
};

const compile = (card) => {
  const m = card.match(/^(\d+)([cfps])\.jpg$/);
  if (m) return `${m[1]} of ${STR.suits[m[2]]}`;
  const fm = card.match(/^([iqebdcas])([12])\.jpg$/);
  if (fm) {
    if (currentRuleset.deckType === "spike" && fm[1] !== "i") return STR.emptyCard;
    const name = STR.faceCards[fm[1]];
    const sign = fm[2] === "2" ? STR.negativeSuffix : STR.positiveSuffix;
    return fm[1] === "i" ? STR.faceCards.i : `${name} ${sign}`;
  }
  return STR.emptyCard;
};

const drawFromDeck = (deck) => {
  const live = deck.map((c, i) => (c !== "0" ? i : -1)).filter((i) => i >= 0);
  if (live.length === 0) throw new Error("deck depleted");
  const pick = live[Math.floor(Math.random() * live.length)];
  const card = deck[pick];
  deck[pick] = "0";
  return card;
};

const deckRemaining = (deck) => deck.filter((c) => c !== "0").length;

// -----------------------------------------------------------------------------
// Scoring
// -----------------------------------------------------------------------------

const scoreHand = (cards, fieldValue) => {
  let total = 0;
  for (const c of cards) if (c !== EMPTY) total += c;
  if (fieldValue !== EMPTY) total += fieldValue;
  return total;
};

const isIdiotsArray = (cards, fieldValue) => {
  const all = [...cards];
  if (fieldValue !== EMPTY) all.push(fieldValue);
  const vals = all.filter((v) => v !== EMPTY).sort((a, b) => a - b);
  return vals.length === 3 && vals[0] === 0 && vals[1] === 2 && vals[2] === 3;
};

const evaluateRound = (score, { idiotsArray = false } = {}) => {
  // Pure sabacc (or Idiot's Array in traditional)
  if (idiotsArray || score === PURE_SABACC || score === -PURE_SABACC) {
    return { roundPoints: 24, tournamentDelta: PURE_SABACC_POINTS };
  }

  if (currentRuleset.lowestWins) {
    // Gungan: lowest |score| wins, 0 is pure sabacc (handled above)
    // Any score is valid, closer to 0 = more points
    const abs = Math.abs(score);
    // Score of 0 already handled as pure sabacc above
    return { roundPoints: abs, tournamentDelta: abs };
  }

  // Traditional / Spike: bomb if 0 or beyond ±PURE_SABACC
  if (score === 0 || score > PURE_SABACC || score < -PURE_SABACC) {
    return { roundPoints: BOMB_POINTS, tournamentDelta: BOMB_POINTS };
  }
  const abs = Math.abs(score);
  return { roundPoints: abs, tournamentDelta: abs };
};

const applyLeaderBonus = (tournamentPoints, roundPoints) => {
  const pure = roundPoints.some((rp) => rp === 24);
  if (pure) return tournamentPoints;
  let best = -Infinity;
  let bestIdx = -1;
  for (let i = 0; i < roundPoints.length; i++) {
    if (roundPoints[i] > best) { best = roundPoints[i]; bestIdx = i; }
  }
  const tied = roundPoints.filter((rp) => rp === best).length > 1;
  if (tied || bestIdx < 0) return tournamentPoints;
  const out = [...tournamentPoints];
  out[bestIdx] += Math.round(best / 2);
  return out;
};

const decideWinner = (points) => {
  const threshold = (typeof window !== "undefined" ? window.Sabacc?.WIN_THRESHOLD : WIN_THRESHOLD) || WIN_THRESHOLD;
  let best = -Infinity;
  let bestIdx = -1;
  let tie = false;
  for (let i = 0; i < points.length; i++) {
    if (points[i] > threshold) {
      if (points[i] > best) { best = points[i]; bestIdx = i; tie = false; }
      else if (points[i] === best) tie = true;
    }
  }
  return { index: bestIdx, tie, points: best };
};

// -----------------------------------------------------------------------------
// CPU opponents
// -----------------------------------------------------------------------------

const cpuPassThreshold = (raceName) =>
  CPU_RACES.find((r) => r.name === raceName)?.threshold ?? 15;

const pickOpponents = () => {
  const pool = [...Array(CPU_RACES.length).keys()];
  for (let i = 0; i < NUM_CPUS; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, NUM_CPUS).map((i) => CPU_RACES[i].name);
};

const pickPersonalities = (pool) => {
  const arr = [];
  const p = pool || CPU_PERSONALITIES;
  for (let i = 0; i < NUM_CPUS; i++) {
    arr.push(p[Math.floor(Math.random() * p.length)]);
  }
  return arr;
};

const DIFFICULTY_PRESETS = {
  youngling:    { cpus: 1, personalityPool: ["normal"],              winThreshold: 100,  key: "youngling" },
  padawan:      { cpus: 2, personalityPool: ["normal", "folder"],   winThreshold: 500,  key: "padawan" },
  knight:       { cpus: 3, personalityPool: null,                   winThreshold: 1000, key: "knight" },
  sithlord:     { cpus: 4, personalityPool: ["bluffer", "risktaker"], winThreshold: 2500, key: "sithlord" },
  grandmaster:  { cpus: 4, personalityPool: ["risktaker"],         winThreshold: 5000, key: "grandmaster" },
};

const cpuWantsToDraw = (score, threshold, personality = "normal") => {
  const abs = Math.abs(score);
  if (currentRuleset.lowestWins) {
    // Gungan: want to get closer to 0, so draw if score is high
    if (score === 0) return false;
    return abs > threshold;
  }
  if (score === 0 || abs >= threshold) {
    if (personality === "folder" && abs >= threshold - 2) return false;
    return false;
  }
  if (personality === "risktaker" && abs < threshold + 2) return true;
  if (personality === "bluffer" && abs === threshold - 1) return true;
  return true;
};

// -----------------------------------------------------------------------------
// Generator / Dice
// -----------------------------------------------------------------------------

const swapCardInLocations = (locs, cards, oldCard, newCard, newValue) => {
  let changed = false;
  const newLocs = locs.map((l) => {
    if (l === oldCard) { changed = true; return newCard; }
    return l;
  });
  const newCards = changed
    ? cards.map((c, i) => (locs[i] === oldCard ? newValue : c))
    : [...cards];
  return { locs: newLocs, cards: newCards, changed };
};

const randomGeneratorStep = (deck, g1, g2) => {
  if (g1 === g2) return { swapped: false, g1, g2, deck: [...deck] };
  return { swapped: true, g1, g2, deck: [...deck] };
};

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

const pickGeneratorCards = (deck) => {
  const live = deck.filter((c) => c !== "0");
  if (live.length < 2) return null;
  const g1 = live[Math.floor(Math.random() * live.length)];
  const g1Idx = deck.indexOf(g1);
  deck[g1Idx] = "0";
  const g2 = drawFromDeck(deck);
  deck[g1Idx] = g1;
  return { g1, g2 };
};

// Corellian Spike: roll 2 dice, doubles = all cards shift (reshuffle)
const rollDice = () => {
  const d1 = 1 + Math.floor(Math.random() * 6);
  const d2 = 1 + Math.floor(Math.random() * 6);
  return { d1, d2, doubles: d1 === d2 };
};

const rollFavorites = () => {
  const favDeck = buildDeck();
  const favs = [];
  for (let i = 0; i < 10; i++) favs.push(drawFromDeck(favDeck));
  return favs;
};

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

if (typeof window !== "undefined") {
  window.Sabacc = {
    buildDeck, convert, compile, drawFromDeck, deckRemaining,
    scoreHand, isIdiotsArray, evaluateRound, applyLeaderBonus, decideWinner,
    cpuPassThreshold, cpuWantsToDraw, pickOpponents, pickPersonalities,
    swapCardInLocations, randomGeneratorStep, generatorSwap,
    pickGeneratorCards, rollFavorites, rollDice,
    refreshCpuRaces, setCpuCount, buildSeatOrder,
    setRuleset, RULESETS, DIFFICULTY_PRESETS,
    PURE_SABACC, BOMB, PURE_SABACC_POINTS, BOMB_POINTS,
    WIN_THRESHOLD, EMPTY, CPU_RACES, CPU_PERSONALITIES,
    NUM_CPUS, NUM_PLAYERS,
  };
}