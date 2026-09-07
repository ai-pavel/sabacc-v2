// =============================================================================
// Sabacc Tournament — pure game rules (no DOM access)
//
// All game logic that doesn't touch the DOM lives here. Exported on
// window.Sabacc for the test harness and ui.js.
// =============================================================================

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const PURE_SABACC = 23;
const BOMB = -24;
const PURE_SABACC_POINTS = 46;
const BOMB_POINTS = -24;
let WIN_THRESHOLD = 500;
const EMPTY = 20;

// CPU count — configurable via Settings (1-4). Default 4.
let NUM_CPUS = 4;
let NUM_PLAYERS = NUM_CPUS + 1;

// SUITS is read live from STR.suits in compile() for locale-awareness.

// Face cards: code prefix -> value. Names are read live from STR.faceCards
// in compile() so they translate with locale changes.
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
    const { value } = FACE_CARDS[fm[1]];
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
  if (idiotsArray || score === PURE_SABACC || score === -PURE_SABACC) {
    return { roundPoints: 24, tournamentDelta: PURE_SABACC_POINTS };
  }
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

const pickPersonalities = () => {
  const arr = [];
  for (let i = 0; i < NUM_CPUS; i++) {
    arr.push(CPU_PERSONALITIES[Math.floor(Math.random() * CPU_PERSONALITIES.length)]);
  }
  return arr;
};

const cpuWantsToDraw = (score, threshold, personality = "normal") => {
  const abs = Math.abs(score);
  if (score === 0 || abs >= threshold) {
    // Folder: passes even earlier (threshold - 2)
    if (personality === "folder" && abs >= threshold - 2) return false;
    return false;
  }
  // Risk-taker: draws past threshold up to threshold + 2
  if (personality === "risktaker" && abs < threshold + 2) return true;
  // Bluffer: normal draw logic but will never pass at exactly threshold - 1
  if (personality === "bluffer" && abs === threshold - 1) return true;
  return true;
};

// -----------------------------------------------------------------------------
// Generator
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
    pickGeneratorCards, rollFavorites,
    refreshCpuRaces, setCpuCount, buildSeatOrder,
    PURE_SABACC, BOMB, PURE_SABACC_POINTS, BOMB_POINTS,
    WIN_THRESHOLD, EMPTY, CPU_RACES, CPU_PERSONALITIES,
    NUM_CPUS, NUM_PLAYERS,
  };
}