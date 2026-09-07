import { test } from "node:test";
import assert from "node:assert/strict";

// game.js is a plain script that attaches pure functions to window.Sabacc.
// In Node we shim window, require the i18n loader + English locale, then
// require game.js, then pull the exports off window.Sabacc.
globalThis.window = globalThis;
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
require("../src/i18n/loader.js");
require("../src/i18n/en.js");
require("../src/game.js");
const {
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
  PURE_SABACC,
  BOMB,
  PURE_SABACC_POINTS,
  BOMB_POINTS,
  WIN_THRESHOLD,
  EMPTY,
  cpuPassThreshold,
  cpuWantsToDraw,
  CPU_RACES,
  pickOpponents,
  swapCardInLocations,
  randomGeneratorStep,
  generatorSwap,
  pickGeneratorCards,
  rollFavorites,
} = globalThis.window.Sabacc;

// ---------------------------------------------------------------------------
// Deck composition
// ---------------------------------------------------------------------------

test("deck has 76 cards", () => {
  assert.equal(buildDeck().length, 76);
});

test("deck contains Endurance -6 (e2.jpg) exactly once", () => {
  const deck = buildDeck();
  const e2 = deck.filter((c) => c === "e2.jpg");
  assert.equal(e2.length, 1, "e2.jpg must appear exactly once (analysis.md bug #1)");
});

test("deck contains Endurance +6 (e1.jpg) exactly once", () => {
  const deck = buildDeck();
  const e1 = deck.filter((c) => c === "e1.jpg");
  assert.equal(e1.length, 1);
});

test("deck has 60 numbered cards (1-15 x 4 suits)", () => {
  const deck = buildDeck();
  const numbered = deck.filter((c) => /^\d+[cfps]\.jpg$/.test(c));
  assert.equal(numbered.length, 60);
});

test("deck has 16 face cards (8 names x positive/negative)", () => {
  const deck = buildDeck();
  const faces = deck.filter((c) => /^[iqebdcas][12]\.jpg$/.test(c));
  assert.equal(faces.length, 16);
});

// ---------------------------------------------------------------------------
// convert() — card filename -> numeric value
// ---------------------------------------------------------------------------

test("convert returns face value for numbered cards", () => {
  assert.equal(convert("1c.jpg"), 1);
  assert.equal(convert("15s.jpg"), 15);
});

test("convert returns 0 for Idiot", () => {
  assert.equal(convert("i1.jpg"), 0);
  assert.equal(convert("i2.jpg"), 0);
});

test("convert returns signed values for face cards", () => {
  assert.equal(convert("q1.jpg"), 2);
  assert.equal(convert("q2.jpg"), -2);
  assert.equal(convert("s1.jpg"), 17);
  assert.equal(convert("s2.jpg"), -17);
});

test("convert handles e2.jpg (analysis.md bug #1 fixed)", () => {
  assert.equal(convert("e2.jpg"), -6);
});

// ---------------------------------------------------------------------------
// compile() — card filename -> human-readable name
// ---------------------------------------------------------------------------

test("compile names numbered cards as 'N of <Suit>'", () => {
  assert.equal(compile("1c.jpg"), "1 of Coins");
  assert.equal(compile("7f.jpg"), "7 of Flasks");
  assert.equal(compile("10p.jpg"), "10 of Sabers");
  assert.equal(compile("15s.jpg"), "15 of Staves");
});

test("compile names face cards with sign suffix", () => {
  assert.equal(compile("i1.jpg"), "Idiot");
  assert.equal(compile("q1.jpg"), "Queen of Madness (+)");
  assert.equal(compile("q2.jpg"), "Queen of Madness (-)");
  assert.equal(compile("s1.jpg"), "Senator (+)");
});

// ---------------------------------------------------------------------------
// scoreHand() — sum of card values, treating 20 as empty slot
// ---------------------------------------------------------------------------

test("scoreHand sums filled slots and ignores empty (20) slots", () => {
  assert.equal(scoreHand([5, 10, 20, 20, 20], 20), 15);
});

test("scoreHand includes interference field value", () => {
  assert.equal(scoreHand([5, 10, 20, 20, 20], 8), 23);
});

test("scoreHand handles negative face cards", () => {
  assert.equal(scoreHand([-11, 10, 20, 20, 20], 20), -1);
});

// ---------------------------------------------------------------------------
// evaluateRound() — per-player round points and tournament points
// analysis.md: 0/>23/<-23 = bomb (-24), +/-23 = pure sabacc (+46),
//              otherwise +|score|; round leader gets +|score|/2 bonus
// ---------------------------------------------------------------------------

test("bomb scores -24 round points", () => {
  const result = evaluateRound(0);
  assert.equal(result.roundPoints, -24);
  assert.equal(result.tournamentDelta, -24);
});

test("score 30 (>23) is a bomb", () => {
  assert.equal(evaluateRound(30).roundPoints, -24);
});

test("score -25 (<-23) is a bomb", () => {
  assert.equal(evaluateRound(-25).roundPoints, -24);
});

test("pure sabacc (+23) gives +46 tournament points and +24 round points", () => {
  const result = evaluateRound(23);
  assert.equal(result.roundPoints, 24);
  assert.equal(result.tournamentDelta, 46);
});

test("pure sabacc (-23) gives +46 tournament points", () => {
  assert.equal(evaluateRound(-23).tournamentDelta, 46);
});

test("valid positive score gives +score", () => {
  const result = evaluateRound(17);
  assert.equal(result.roundPoints, 17);
  assert.equal(result.tournamentDelta, 17);
});

test("valid negative score gives +|score|", () => {
  const result = evaluateRound(-17);
  assert.equal(result.roundPoints, 17);
  assert.equal(result.tournamentDelta, 17);
});

test("valid score of 1 gives +1", () => {
  assert.equal(evaluateRound(1).roundPoints, 1);
});

test("valid score of -22 gives +22", () => {
  assert.equal(evaluateRound(-22).roundPoints, 22);
});

// ---------------------------------------------------------------------------
// CPU races and pass thresholds (analysis.md table)
// ---------------------------------------------------------------------------

test("CPU_RACES has 5 races with correct thresholds", () => {
  assert.equal(CPU_RACES.length, 5);
  assert.deepEqual(
    CPU_RACES.map((r) => r.name),
    ["Human", "Jedi-Killer", "Gambler", "Smuggler", "Bounty Hunter"],
  );
  assert.deepEqual(
    CPU_RACES.map((r) => r.threshold),
    [15, 16, 17, 18, 19],
  );
});

test("cpuPassThreshold returns the race's threshold", () => {
  assert.equal(cpuPassThreshold("Human"), 15);
  assert.equal(cpuPassThreshold("Bounty Hunter"), 19);
});

// ---------------------------------------------------------------------------
// pickOpponents() — two distinct random races
// ---------------------------------------------------------------------------

test("pickOpponents returns two distinct race names", () => {
  const [a, b] = pickOpponents();
  assert.notEqual(a, b);
  assert.ok(CPU_RACES.some((r) => r.name === a));
  assert.ok(CPU_RACES.some((r) => r.name === b));
});

// ---------------------------------------------------------------------------
// swapCardInLocations() — generator swap logic (analysis.md bug #4 fixed)
// ---------------------------------------------------------------------------

test("swapCardInLocations replaces matching card with new card", () => {
  const locs = ["1c.jpg", "2f.jpg", "3p.jpg"];
  const cards = [1, 2, 3];
  const result = swapCardInLocations(locs, cards, "2f.jpg", "5s.jpg", 5);
  assert.deepEqual(result.locs, ["1c.jpg", "5s.jpg", "3p.jpg"]);
  assert.deepEqual(result.cards, [1, 5, 3]);
});

test("swapCardInLocations returns unchanged if no match", () => {
  const locs = ["1c.jpg", "2f.jpg"];
  const cards = [1, 2];
  const result = swapCardInLocations(locs, cards, "9s.jpg", "5s.jpg", 5);
  assert.deepEqual(result.locs, locs);
  assert.deepEqual(result.cards, cards);
});

// ---------------------------------------------------------------------------
// randomGeneratorStep() — analysis.md bug #4: must not leak cards
// ---------------------------------------------------------------------------

test("randomGeneratorStep with equal cards does not mutate the deck", () => {
  const deck = buildDeck();
  const deckBefore = [...deck];
  const result = randomGeneratorStep(deck, "1c.jpg", "1c.jpg");
  assert.equal(result.swapped, false);
  assert.deepEqual(result.deck, deckBefore, "deck must be unchanged when g1 == g2");
});

test("randomGeneratorStep with different cards swaps and returns both to deck", () => {
  const deck = buildDeck().filter((c) => c !== "5s.jpg"); // 5s.jpg is the replacement
  const deckBeforeLen = deck.length;
  const result = randomGeneratorStep(deck, "1c.jpg", "5s.jpg");
  assert.equal(result.swapped, true);
  // Bug #4 fix: the swapped-out card (1c.jpg) must remain in the deck
  assert.ok(result.deck.includes("1c.jpg"), "swapped-out card must not leak out of deck");
  assert.equal(result.deck.length, deckBeforeLen, "deck size must be preserved");
});

// ---------------------------------------------------------------------------
// Win condition (analysis.md bug #3 fixed: proper tiebreakers)
// ---------------------------------------------------------------------------

test("PURE_SABACC and BOMB constants", () => {
  assert.equal(PURE_SABACC, 23);
  assert.equal(BOMB, -24);
});

// ---------------------------------------------------------------------------
// deckRemaining()
// ---------------------------------------------------------------------------

test("deckRemaining counts non-zero cards", () => {
  assert.equal(deckRemaining(buildDeck()), 76);
});

test("deckRemaining decreases as cards are drawn", () => {
  const deck = buildDeck();
  drawFromDeck(deck);
  assert.equal(deckRemaining(deck), 75);
  drawFromDeck(deck);
  assert.equal(deckRemaining(deck), 74);
});

test("deckRemaining is 0 for a fully depleted deck", () => {
  const deck = buildDeck().map(() => "0");
  assert.equal(deckRemaining(deck), 0);
});

// ---------------------------------------------------------------------------
// generatorSwap() — pure logic for applying the generator to all 3 hands
// ---------------------------------------------------------------------------

test("generatorSwap with g1 == g2 returns unchanged hands and swapped=false", () => {
  const hands = {
    player: { locs: ["1c.jpg", "2f.jpg"], cards: [1, 2] },
    cpu1:   { locs: ["3p.jpg", "4s.jpg"], cards: [3, 4] },
    cpu2:   { locs: ["5c.jpg", "6f.jpg"], cards: [5, 6] },
  };
  const result = generatorSwap(hands, "1c.jpg", "1c.jpg");
  assert.equal(result.swapped, false);
  assert.equal(result.player.changed, false);
  assert.equal(result.cpu1.changed, false);
  assert.equal(result.cpu2.changed, false);
  assert.deepEqual(result.player.locs, hands.player.locs);
  assert.deepEqual(result.player.cards, hands.player.cards);
});

test("generatorSwap replaces g1 with g2 in all matching hands", () => {
  const hands = {
    player: { locs: ["1c.jpg", "2f.jpg", "1c.jpg"], cards: [1, 2, 1] },
    cpu1:   { locs: ["3p.jpg", "1c.jpg"],          cards: [3, 1] },
    cpu2:   { locs: ["5c.jpg", "6f.jpg"],          cards: [5, 6] },
  };
  const result = generatorSwap(hands, "1c.jpg", "9s.jpg");
  assert.equal(result.swapped, true);
  assert.equal(result.player.changed, true);
  assert.equal(result.cpu1.changed, true);
  assert.equal(result.cpu2.changed, false);
  assert.deepEqual(result.player.locs, ["9s.jpg", "2f.jpg", "9s.jpg"]);
  assert.deepEqual(result.player.cards, [9, 2, 9]);
  assert.deepEqual(result.cpu1.locs, ["3p.jpg", "9s.jpg"]);
  assert.deepEqual(result.cpu1.cards, [3, 9]);
  assert.deepEqual(result.cpu2.locs, hands.cpu2.locs);
});

test("generatorSwap does not mutate input arrays", () => {
  const origLocs = ["1c.jpg", "2f.jpg"];
  const origCards = [1, 2];
  const hands = {
    player: { locs: origLocs, cards: origCards },
    cpu1:   { locs: ["3p.jpg"], cards: [3] },
    cpu2:   { locs: ["4s.jpg"], cards: [4] },
  };
  generatorSwap(hands, "1c.jpg", "5s.jpg");
  assert.deepEqual(origLocs, ["1c.jpg", "2f.jpg"]);
  assert.deepEqual(origCards, [1, 2]);
});

// ---------------------------------------------------------------------------
// pickGeneratorCards() — picks g1 and g2, guards against depletion
// ---------------------------------------------------------------------------

test("pickGeneratorCards returns two distinct cards from a fresh deck", () => {
  const deck = buildDeck();
  const result = pickGeneratorCards(deck);
  assert.ok(result, "should return a result");
  assert.notEqual(result.g1, result.g2);
  assert.ok(deck.includes(result.g1));
});

test("pickGeneratorCards returns null when deck has fewer than 2 live cards", () => {
  const deck = buildDeck().map(() => "0");
  deck[0] = "1c.jpg";
  assert.equal(pickGeneratorCards(deck), null);
});

test("pickGeneratorCards draws g2 from the deck (removes it)", () => {
  const deck = buildDeck();
  const before = deckRemaining(deck);
  pickGeneratorCards(deck);
  assert.equal(deckRemaining(deck), before - 1);
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

test("PURE_SABACC_POINTS is 46", () => {
  assert.equal(PURE_SABACC_POINTS, 46);
});

test("BOMB_POINTS is -24", () => {
  assert.equal(BOMB_POINTS, -24);
});

test("WIN_THRESHOLD is 500", () => {
  assert.equal(WIN_THRESHOLD, 500);
});

test("EMPTY sentinel is 20", () => {
  assert.equal(EMPTY, 20);
});

// ---------------------------------------------------------------------------
// convert() — edge cases
// ---------------------------------------------------------------------------

test("convert returns 0 for unknown card format", () => {
  assert.equal(convert("garbage"), 0);
  assert.equal(convert(""), 0);
});

test("convert handles all face card prefixes", () => {
  const faces = [
    ["i1.jpg", 0], ["i2.jpg", 0],
    ["q1.jpg", 2], ["q2.jpg", -2],
    ["e1.jpg", 6], ["e2.jpg", -6],
    ["b1.jpg", 8], ["b2.jpg", -8],
    ["d1.jpg", 11], ["d2.jpg", -11],
    ["c1.jpg", 13], ["c2.jpg", -13],
    ["a1.jpg", 15], ["a2.jpg", -15],
    ["s1.jpg", 17], ["s2.jpg", -17],
  ];
  for (const [card, expected] of faces) {
    assert.equal(convert(card), expected, `convert(${card})`);
  }
});

test("convert handles all 4 suits for each rank 1-15", () => {
  for (let v = 1; v <= 15; v++) {
    for (const s of "cfps") {
      assert.equal(convert(`${v}${s}.jpg`), v, `convert(${v}${s}.jpg)`);
    }
  }
});

// ---------------------------------------------------------------------------
// compile() — edge cases
// ---------------------------------------------------------------------------

test("compile returns 'Empty!' for unknown card format", () => {
  assert.equal(compile("garbage"), "Empty!");
  assert.equal(compile(""), "Empty!");
});

test("compile handles all face card names", () => {
  assert.equal(compile("i1.jpg"), "Idiot");
  assert.equal(compile("i2.jpg"), "Idiot");
  assert.equal(compile("e1.jpg"), "Endurance (+)");
  assert.equal(compile("e2.jpg"), "Endurance (-)");
  assert.equal(compile("b1.jpg"), "Balance (+)");
  assert.equal(compile("b2.jpg"), "Balance (-)");
  assert.equal(compile("d1.jpg"), "Duelist (+)");
  assert.equal(compile("d2.jpg"), "Duelist (-)");
  assert.equal(compile("c1.jpg"), "Commander (+)");
  assert.equal(compile("c2.jpg"), "Commander (-)");
  assert.equal(compile("a1.jpg"), "Ace (+)");
  assert.equal(compile("a2.jpg"), "Ace (-)");
  assert.equal(compile("s1.jpg"), "Senator (+)");
  assert.equal(compile("s2.jpg"), "Senator (-)");
});

// ---------------------------------------------------------------------------
// buildDeck() — uniqueness and structure
// ---------------------------------------------------------------------------

test("deck has no duplicate cards", () => {
  const deck = buildDeck();
  const unique = new Set(deck);
  assert.equal(unique.size, deck.length, "all 76 cards must be unique");
});

test("deck contains all 4 suits for each numbered rank", () => {
  const deck = buildDeck();
  for (let v = 1; v <= 15; v++) {
    for (const s of "cfps") {
      assert.ok(deck.includes(`${v}${s}.jpg`), `deck must contain ${v}${s}.jpg`);
    }
  }
});

test("deck contains all face card variants", () => {
  const deck = buildDeck();
  for (const prefix of "iqebdcas") {
    assert.ok(deck.includes(`${prefix}1.jpg`), `deck must contain ${prefix}1.jpg`);
    assert.ok(deck.includes(`${prefix}2.jpg`), `deck must contain ${prefix}2.jpg`);
  }
});

// ---------------------------------------------------------------------------
// drawFromDeck() — drawing mechanics
// ---------------------------------------------------------------------------

test("drawFromDeck removes the drawn card from the live pool", () => {
  const deck = buildDeck();
  const card = drawFromDeck(deck);
  const liveAfter = deck.filter((c) => c !== "0");
  assert.ok(!liveAfter.includes(card), "drawn card must not be in the live pool");
});

test("drawFromDeck throws on depleted deck", () => {
  const deck = buildDeck().map(() => "0");
  assert.throws(() => drawFromDeck(deck), /deck depleted/);
});

test("drawFromDeck can draw all 76 cards without error", () => {
  const deck = buildDeck();
  const drawn = new Set();
  for (let i = 0; i < 76; i++) {
    const card = drawFromDeck(deck);
    assert.ok(!drawn.has(card), `duplicate draw: ${card}`);
    drawn.add(card);
  }
  assert.equal(drawn.size, 76);
  assert.equal(deckRemaining(deck), 0);
});

test("drawFromDeck marks drawn slot as '0'", () => {
  const deck = buildDeck();
  drawFromDeck(deck);
  const zeroCount = deck.filter((c) => c === "0").length;
  assert.equal(zeroCount, 1);
});

// ---------------------------------------------------------------------------
// scoreHand() — edge cases
// ---------------------------------------------------------------------------

test("scoreHand of all empty slots is 0", () => {
  assert.equal(scoreHand([EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], EMPTY), 0);
});

test("scoreHand of full hand with field is sum of all", () => {
  assert.equal(scoreHand([1, 2, 3, 4, 5], 6), 21);
});

test("scoreHand with negative field value", () => {
  assert.equal(scoreHand([10, 10, EMPTY, EMPTY, EMPTY], -8), 12);
});

test("scoreHand treats 0 (Idiot) as a real value, not empty", () => {
  assert.equal(scoreHand([0, 2, 3, EMPTY, EMPTY], EMPTY), 5);
});

// ---------------------------------------------------------------------------
// isIdiotsArray()
// ---------------------------------------------------------------------------

test("isIdiotsArray detects Idiot + 2 + 3 in hand", () => {
  assert.ok(isIdiotsArray([0, 2, 3, EMPTY, EMPTY], EMPTY));
});

test("isIdiotsArray detects Idiot + 2 + 3 with 2 in field", () => {
  assert.ok(isIdiotsArray([0, 3, EMPTY, EMPTY, EMPTY], 2));
});

test("isIdiotsArray detects Idiot + 2 + 3 with 3 in field", () => {
  assert.ok(isIdiotsArray([0, 2, EMPTY, EMPTY, EMPTY], 3));
});

test("isIdiotsArray detects Idiot + 2 + 3 with Idiot in field", () => {
  assert.ok(isIdiotsArray([2, 3, EMPTY, EMPTY, EMPTY], 0));
});

test("isIdiotsArray rejects wrong combination", () => {
  assert.ok(!isIdiotsArray([0, 2, 4, EMPTY, EMPTY], EMPTY));
  assert.ok(!isIdiotsArray([1, 2, 3, EMPTY, EMPTY], EMPTY));
  assert.ok(!isIdiotsArray([0, 2, EMPTY, EMPTY, EMPTY], EMPTY));
  assert.ok(!isIdiotsArray([0, 2, 3, 4, EMPTY], EMPTY));
});

test("isIdiotsArray rejects all empty", () => {
  assert.ok(!isIdiotsArray([EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], EMPTY));
});

// ---------------------------------------------------------------------------
// evaluateRound() — Idiot's Array variant
// ---------------------------------------------------------------------------

test("evaluateRound with idiotsArray flag gives pure sabacc scoring", () => {
  const result = evaluateRound(5, { idiotsArray: true });
  assert.equal(result.roundPoints, 24);
  assert.equal(result.tournamentDelta, 46);
});

test("evaluateRound with idiotsArray flag overrides bomb score", () => {
  // Idiot's Array sums to 5, which would be a valid score, but with the flag
  // it should give pure sabacc points regardless.
  const result = evaluateRound(5, { idiotsArray: true });
  assert.equal(result.tournamentDelta, PURE_SABACC_POINTS);
});

// ---------------------------------------------------------------------------
// applyLeaderBonus()
// ---------------------------------------------------------------------------

test("applyLeaderBonus gives bonus to unique highest scorer", () => {
  const points = [100, 200, 150];
  const roundPoints = [10, 20, 15];
  const result = applyLeaderBonus(points, roundPoints);
  assert.equal(result[0], 100, "cpu1 unchanged");
  assert.equal(result[1], 200 + 10, "cpu2 gets +20/2 = 10 bonus");
  assert.equal(result[2], 150, "human unchanged");
});

test("applyLeaderBonus gives no bonus when pure sabacc present", () => {
  const points = [100, 200, 150];
  const roundPoints = [10, 24, 15]; // 24 = pure sabacc
  const result = applyLeaderBonus(points, roundPoints);
  assert.deepEqual(result, points, "no bonus when pure sabacc");
});

test("applyLeaderBonus gives no bonus on tie for highest", () => {
  const points = [100, 200, 150];
  const roundPoints = [20, 20, 15];
  const result = applyLeaderBonus(points, roundPoints);
  assert.deepEqual(result, points, "no bonus on tie");
});

test("applyLeaderBonus with all equal scores gives no bonus", () => {
  const points = [100, 100, 100];
  const roundPoints = [15, 15, 15];
  const result = applyLeaderBonus(points, roundPoints);
  assert.deepEqual(result, points);
});

test("applyLeaderBonus with negative round points (bomb)", () => {
  const points = [100, 200, 150];
  const roundPoints = [-24, 10, 15];
  const result = applyLeaderBonus(points, roundPoints);
  // 15 is highest (index 2, human), gets +15/2 = 7 bonus (rounded)
  assert.equal(result[0], 100);
  assert.equal(result[1], 200);
  assert.equal(result[2], 150 + Math.round(15 / 2), "human gets +15/2 = 8 bonus (rounded)");
});

test("applyLeaderBonus does not mutate input", () => {
  const points = [100, 200, 150];
  const roundPoints = [10, 20, 15];
  const pointsCopy = [...points];
  applyLeaderBonus(points, roundPoints);
  assert.deepEqual(points, pointsCopy, "input must not be mutated");
});

// ---------------------------------------------------------------------------
// decideWinner()
// ---------------------------------------------------------------------------

test("decideWinner returns no winner when nobody crossed 500", () => {
  const result = decideWinner([100, 200, 150]);
  assert.equal(result.index, -1);
  assert.equal(result.tie, false);
});

test("decideWinner finds unique winner above 500", () => {
  const result = decideWinner([300, 510, 200]);
  assert.equal(result.index, 1);
  assert.equal(result.tie, false);
  assert.equal(result.points, 510);
});

test("decideWinner finds human winner (index 2)", () => {
  const result = decideWinner([200, 300, 600]);
  assert.equal(result.index, 2);
  assert.equal(result.points, 600);
});

test("decideWinner detects tie when two players have same score above 500", () => {
  const result = decideWinner([510, 510, 200]);
  assert.equal(result.tie, true);
  assert.equal(result.points, 510);
});

test("decideWinner picks higher score when two players cross 500", () => {
  const result = decideWinner([600, 510, 200]);
  assert.equal(result.index, 0);
  assert.equal(result.tie, false);
  assert.equal(result.points, 600);
});

test("decideWinner with all three above 500 picks highest", () => {
  const result = decideWinner([520, 600, 550]);
  assert.equal(result.index, 1);
  assert.equal(result.points, 600);
});

test("decideWinner with all three tied above 500", () => {
  const result = decideWinner([550, 550, 550]);
  assert.equal(result.tie, true);
  assert.equal(result.points, 550);
});

test("decideWinner with exactly 500 does not win (must exceed)", () => {
  const result = decideWinner([500, 200, 100]);
  assert.equal(result.index, -1, "500 is not > 500, no winner");
});

// ---------------------------------------------------------------------------
// cpuWantsToDraw()
// ---------------------------------------------------------------------------

test("cpuWantsToDraw returns true when below threshold", () => {
  assert.ok(cpuWantsToDraw(10, 15));
  assert.ok(cpuWantsToDraw(14, 15));
});

test("cpuWantsToDraw returns false at threshold", () => {
  assert.ok(!cpuWantsToDraw(15, 15));
  assert.ok(!cpuWantsToDraw(19, 19));
});

test("cpuWantsToDraw returns false above threshold", () => {
  assert.ok(!cpuWantsToDraw(16, 15));
  assert.ok(!cpuWantsToDraw(20, 15));
});

test("cpuWantsToDraw returns false for score 0 (bomb)", () => {
  assert.ok(!cpuWantsToDraw(0, 15));
});

test("cpuWantsToDraw works with negative scores", () => {
  assert.ok(cpuWantsToDraw(-10, 15));
  assert.ok(cpuWantsToDraw(-14, 15));
  assert.ok(!cpuWantsToDraw(-15, 15));
  assert.ok(!cpuWantsToDraw(-16, 15));
});

// ---------------------------------------------------------------------------
// cpuPassThreshold()
// ---------------------------------------------------------------------------

test("cpuPassThreshold returns 15 for unknown race (default)", () => {
  assert.equal(cpuPassThreshold("Unknown Race"), 15);
  assert.equal(cpuPassThreshold(""), 15);
});

test("cpuPassThreshold returns correct threshold for each race", () => {
  assert.equal(cpuPassThreshold("Human"), 15);
  assert.equal(cpuPassThreshold("Jedi-Killer"), 16);
  assert.equal(cpuPassThreshold("Gambler"), 17);
  assert.equal(cpuPassThreshold("Smuggler"), 18);
  assert.equal(cpuPassThreshold("Bounty Hunter"), 19);
});

// ---------------------------------------------------------------------------
// pickOpponents() — distribution
// ---------------------------------------------------------------------------

test("pickOpponents returns valid race names from the list", () => {
  for (let i = 0; i < 50; i++) {
    const [a, b] = pickOpponents();
    assert.ok(CPU_RACES.some((r) => r.name === a), `${a} is a valid race`);
    assert.ok(CPU_RACES.some((r) => r.name === b), `${b} is a valid race`);
    assert.notEqual(a, b, "opponents must be distinct");
  }
});

// ---------------------------------------------------------------------------
// rollFavorites()
// ---------------------------------------------------------------------------

test("rollFavorites returns 10 cards", () => {
  const favs = rollFavorites();
  assert.equal(favs.length, 10);
});

test("rollFavorites returns valid card filenames", () => {
  const deck = buildDeck();
  const favs = rollFavorites();
  for (const f of favs) {
    assert.ok(deck.includes(f), `${f} must be a valid card`);
  }
});

test("rollFavorites returns no duplicates", () => {
  const favs = rollFavorites();
  const unique = new Set(favs);
  assert.equal(unique.size, favs.length, "favorites must be unique");
});

// ---------------------------------------------------------------------------
// swapCardInLocations() — edge cases
// ---------------------------------------------------------------------------

test("swapCardInLocations replaces all matching occurrences", () => {
  const locs = ["1c.jpg", "1c.jpg", "1c.jpg"];
  const cards = [1, 1, 1];
  const result = swapCardInLocations(locs, cards, "1c.jpg", "5s.jpg", 5);
  assert.deepEqual(result.locs, ["5s.jpg", "5s.jpg", "5s.jpg"]);
  assert.deepEqual(result.cards, [5, 5, 5]);
  assert.ok(result.changed);
});

test("swapCardInLocations does not mutate input", () => {
  const locs = ["1c.jpg", "2f.jpg"];
  const cards = [1, 2];
  const locsCopy = [...locs];
  const cardsCopy = [...cards];
  swapCardInLocations(locs, cards, "1c.jpg", "5s.jpg", 5);
  assert.deepEqual(locs, locsCopy);
  assert.deepEqual(cards, cardsCopy);
});

test("swapCardInLocations with empty locs returns unchanged", () => {
  const result = swapCardInLocations([], [], "1c.jpg", "5s.jpg", 5);
  assert.equal(result.changed, false);
  assert.deepEqual(result.locs, []);
  assert.deepEqual(result.cards, []);
});

// ---------------------------------------------------------------------------
// generatorSwap() — edge cases
// ---------------------------------------------------------------------------

test("generatorSwap with no matching cards in any hand", () => {
  const hands = {
    player: { locs: ["1c.jpg"], cards: [1] },
    cpu1:   { locs: ["2f.jpg"], cards: [2] },
    cpu2:   { locs: ["3p.jpg"], cards: [3] },
  };
  const result = generatorSwap(hands, "9s.jpg", "5s.jpg");
  assert.equal(result.swapped, true);
  assert.equal(result.player.changed, false);
  assert.equal(result.cpu1.changed, false);
  assert.equal(result.cpu2.changed, false);
});

test("generatorSwap replaces in all three hands simultaneously", () => {
  const hands = {
    player: { locs: ["1c.jpg", "2f.jpg"], cards: [1, 2] },
    cpu1:   { locs: ["1c.jpg", "3p.jpg"], cards: [1, 3] },
    cpu2:   { locs: ["1c.jpg", "4s.jpg"], cards: [1, 4] },
  };
  const result = generatorSwap(hands, "1c.jpg", "5s.jpg");
  assert.equal(result.swapped, true);
  assert.equal(result.player.changed, true);
  assert.equal(result.cpu1.changed, true);
  assert.equal(result.cpu2.changed, true);
  assert.deepEqual(result.player.locs, ["5s.jpg", "2f.jpg"]);
  assert.deepEqual(result.cpu1.locs, ["5s.jpg", "3p.jpg"]);
  assert.deepEqual(result.cpu2.locs, ["5s.jpg", "4s.jpg"]);
});

// ---------------------------------------------------------------------------
// pickGeneratorCards() — edge cases
// ---------------------------------------------------------------------------

test("pickGeneratorCards g1 is not removed from deck (only g2 is drawn)", () => {
  const deck = buildDeck();
  const result = pickGeneratorCards(deck);
  // g1 should still be in the live pool (it was only looked up, not drawn)
  const live = deck.filter((c) => c !== "0");
  assert.ok(live.includes(result.g1), "g1 must remain in the deck");
});

test("pickGeneratorCards with exactly 2 live cards returns result", () => {
  const deck = buildDeck().map(() => "0");
  deck[0] = "1c.jpg";
  deck[1] = "2f.jpg";
  const result = pickGeneratorCards(deck);
  assert.ok(result);
  assert.notEqual(result.g1, result.g2);
});

test("pickGeneratorCards with 0 live cards returns null", () => {
  const deck = buildDeck().map(() => "0");
  assert.equal(pickGeneratorCards(deck), null);
});