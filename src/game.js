// =============================================================================
// Sabacc Tournament — UI layer (DOM coupling + game state)
//
// Imports pure rules from window.Sabacc (src/rules.js).
// Imports strings from window.STR (src/i18n/*.js).
// Exposes game functions on window for inline HTML handlers.
// =============================================================================

if (typeof document !== "undefined") {

// -----------------------------------------------------------------------------
// Import pure rules from window.Sabacc
// -----------------------------------------------------------------------------

const {
  buildDeck, convert, compile, drawFromDeck, deckRemaining,
  scoreHand, isIdiotsArray, evaluateRound, applyLeaderBonus, decideWinner,
  cpuPassThreshold, cpuWantsToDraw, pickOpponents, pickPersonalities,
  swapCardInLocations, generatorSwap, pickGeneratorCards, rollFavorites,
  refreshCpuRaces, setCpuCount, buildSeatOrder, DIFFICULTY_PRESETS,
  PURE_SABACC, BOMB, PURE_SABACC_POINTS, BOMB_POINTS,
  EMPTY, CPU_RACES, CPU_PERSONALITIES,
} = window.Sabacc;

let { WIN_THRESHOLD } = window.Sabacc;

// Dynamic state — these change when CPU count changes
let NUM_CPUS = window.Sabacc.NUM_CPUS;
let NUM_PLAYERS = window.Sabacc.NUM_PLAYERS;
let SEAT_ORDER = buildSeatOrder();

// -----------------------------------------------------------------------------
// Sound effects — synthesized via Web Audio API (no asset files)
// -----------------------------------------------------------------------------

let sfxCtx = null;
const SFX_KEY = "sabacc-sfx";

const loadSfxPref = () => { try { return localStorage.getItem(SFX_KEY) || "on"; } catch { return "on"; } };
const setSfx = (val) => { try { localStorage.setItem(SFX_KEY, val); } catch {} };

const sfxEnabled = () => loadSfxPref() === "on";

const sfx = (freq, duration, type = "square", vol = 0.08) => {
  if (!sfxEnabled()) return;
  if (!sfxCtx) {
    try { sfxCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { return; }
  }
  if (!sfxCtx) return;
  const osc = sfxCtx.createOscillator();
  const gain = sfxCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, sfxCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(sfxCtx.destination);
  osc.start();
  osc.stop(sfxCtx.currentTime + duration);
};

// Named sound effects
const SFX = {
  draw: () => sfx(440, 0.08, "sine", 0.06),
  cpuDraw: () => sfx(330, 0.06, "sine", 0.04),
  swap: () => { sfx(550, 0.05, "triangle", 0.06); setTimeout(() => sfx(660, 0.05, "triangle", 0.06), 60); },
  bomb: () => { sfx(200, 0.15, "sawtooth", 0.1); setTimeout(() => sfx(150, 0.2, "sawtooth", 0.08), 100); },
  pureSabacc: () => { sfx(523, 0.08, "sine", 0.08); setTimeout(() => sfx(659, 0.08, "sine", 0.08), 80); setTimeout(() => sfx(784, 0.12, "sine", 0.08), 160); },
  idiotsArray: () => { sfx(523, 0.06, "square", 0.06); setTimeout(() => sfx(659, 0.06, "square", 0.06), 60); setTimeout(() => sfx(784, 0.06, "square", 0.06), 120); setTimeout(() => sfx(1047, 0.15, "square", 0.08), 180); },
  pass: () => sfx(300, 0.1, "triangle", 0.05),
  deal: () => { sfx(400, 0.04, "sine", 0.05); setTimeout(() => sfx(500, 0.04, "sine", 0.05), 50); },
};

// -----------------------------------------------------------------------------
// DOM helpers
// -----------------------------------------------------------------------------

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
// Game state
// -----------------------------------------------------------------------------

let game = 0;
let musicStarted = 0;
let bomb = 0;
let opponentsRolled = false;
let deck = buildDeck();
let gameStartTime = 0;
let roundCount = 0;
let pureSabaccCount = 0;
let cpuPersonalities = [];
let currentDifficulty = "knight";

// Per-player state. players[0] = human, players[1..NUM_CPUS] = CPUs.
let players = createPlayers();
let interIdx = -1;
let blankedImgId = "";
let interSavedFile = "";

function createPlayers() {
  const arr = Array.from({ length: NUM_PLAYERS }, () => ({
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
    personality: "normal",
  }));
  arr[0].isHuman = true;
  return arr;
}

// -----------------------------------------------------------------------------
// ID helpers
// -----------------------------------------------------------------------------

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const seatPrefix = (seatIdx) => {
  const pIdx = SEAT_ORDER[seatIdx];
  return pIdx === 0 ? "player" : `cpu${pIdx}`;
};
const cardId = (seatIdx, slot) => `${seatPrefix(seatIdx)}Card${slot}`;
const fieldId = (seatIdx) => `${seatPrefix(seatIdx)}Field`;
const avatarId = (seatIdx) => `${seatPrefix(seatIdx)}Avatar`;
const scoreNameId = (seatIdx) => `scoreName${cap(seatPrefix(seatIdx))}`;
const scoreValueId = (seatIdx) => `scoreValue${cap(seatPrefix(seatIdx))}`;
const playerAt = (seatIdx) => players[SEAT_ORDER[seatIdx]];

// -----------------------------------------------------------------------------
// Board builder
// -----------------------------------------------------------------------------

const buildGameBoard = () => {
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
  setTimeout(() => { toast.classList.remove("toast-show"); setTimeout(() => toast.remove(), 300); }, 3000);
};

// -----------------------------------------------------------------------------
// Logging
// -----------------------------------------------------------------------------

const logMessage = (text) => { const el = $("eventLog"); el.value = `${el.value}\n${text}`; };
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
// Bomb detection + Idiot's Array feedback
// -----------------------------------------------------------------------------

const checkBomb = () => {
  if (bomb === 1) return;
  const p = players[0];
  const sc = p.score;

  // Idiot's Array detection — celebratory toast + sound
  if (isIdiotsArray(p.cards, p.fieldValue)) {
    showToast(STR.toast.idiotsArray || "Idiot's Array!", "success");
    SFX.idiotsArray();
  }

  if (sc === 0 || sc > PURE_SABACC || sc < -PURE_SABACC) {
    showToast(STR.toast.bomb, "error");
    SFX.bomb();
    $("turnBtn").disabled = true;
    p.passed = 1;
    bomb = 1;
  } else if (sc === PURE_SABACC || sc === -PURE_SABACC) {
    showToast(STR.toast.pureSabacc, "success");
    SFX.pureSabacc();
    $("turnBtn").disabled = true;
    p.passed = 1;
    bomb = 1;
  }
};

// -----------------------------------------------------------------------------
// Round end / scoring
// -----------------------------------------------------------------------------

const msg = (inputScore) => {
  if (inputScore === 0 || inputScore > PURE_SABACC || inputScore < -PURE_SABACC) return STR.roundResult.bomb;
  if (inputScore === PURE_SABACC || inputScore === -PURE_SABACC) return STR.roundResult.pureSabacc;
  return STR.roundResult.valid.replace("{points}", Math.abs(inputScore));
};

const scoreRound = () => {
  const idiots = players.map((p) => isIdiotsArray(p.cards, p.fieldValue));
  const results = players.map((p, i) => evaluateRound(p.score, { idiotsArray: idiots[i] }));

  if (results[0].roundPoints === 24) pureSabaccCount++;

  for (let i = 0; i < NUM_PLAYERS; i++) players[i].points += results[i].tournamentDelta;

  const roundPoints = results.map((r) => r.roundPoints);
  const tournamentPoints = players.map((p) => p.points);
  const adjusted = applyLeaderBonus(tournamentPoints, roundPoints);
  for (let i = 0; i < NUM_PLAYERS; i++) players[i].points = adjusted[i];

  updateTournamentPanel();
};

// -----------------------------------------------------------------------------
// Round summary overlay
// -----------------------------------------------------------------------------

let pendingRoundEnd = null;

const showRoundSummary = () => {
  const rows = SEAT_ORDER.map((pIdx) => {
    const p = players[pIdx];
    const handCards = p.cardFiles
      .filter((f) => f !== "jpg" && f !== "field.gif" && f !== "0")
      .map((f) => compile(f))
      .join(", ");
    return `<tr><td>${p.name}</td><td>${handCards || "—"}</td><td>${p.score}</td><td>${msg(p.score)}</td></tr>`;
  }).join("");

  const container = $("roundSummaryTable");
  if (container) {
    container.innerHTML =
      `<table>` +
      `<tr><th>${STR.hof.name}</th><th>${STR.roundSummary.hand}</th><th>${STR.hof.score}</th><th>${STR.roundSummary.result}</th></tr>` +
      rows +
      `</table>`;
  }
  // Apply i18n to the overlay's data-i18n elements
  if (typeof i18n !== "undefined") i18n.apply();
  $("roundSummary").style.display = "flex";
};

const continueNextRound = () => {
  $("roundSummary").style.display = "none";
  if (!pendingRoundEnd) return;
  const { fn, args } = pendingRoundEnd;
  pendingRoundEnd = null;
  fn(...(args || []));
};

// -----------------------------------------------------------------------------
// Turn processing
// -----------------------------------------------------------------------------

const placeCard = (p, seatIdx, value, cardFile, cardName) => {
  for (let s = 2; s <= 4; s++) {
    if (p.cards[s] === EMPTY) {
      p.cards[s] = value;
      p.cardFiles[s] = cardFile;
      const imgEl = $(cardId(seatIdx, s));
      setImg(cardId(seatIdx, s), `assets/cards/${cardFile}`);
      setAlt(cardId(seatIdx, s), cardName);
      if (imgEl) { imgEl.classList.remove("card-draw"); void imgEl.offsetWidth; imgEl.classList.add("card-draw"); }
      if (p.isHuman) SFX.draw(); else SFX.cpuDraw();
      return s;
    }
  }
  return -1;
};

const cpuTurn = (p, seatIdx) => {
  if (p.passed === 1) return;
  const threshold = cpuPassThreshold(p.race);
  if (!cpuWantsToDraw(p.score, threshold, p.personality)) {
    logMessage(STR.log.cpuPasses.replace("{race}", p.name));
    SFX.pass();
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
  if (slot === 4) { logMessage(STR.log.cpuPasses.replace("{race}", p.name)); p.passed = 1; }
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
  const humanSeatIdx = SEAT_ORDER.indexOf(0);
  const slot = placeCard(p, humanSeatIdx, value, card, cardName);
  if (slot === 4) { $("turnBtn").disabled = true; p.passed = 1; }
  p.score = scoreHand(p.cards, p.fieldValue);
};

const turn = () => {
  logMessage(STR.log.separator);
  const humanSeat = SEAT_ORDER.indexOf(0);
  for (let s = 0; s < NUM_PLAYERS; s++) {
    if (s === humanSeat) { humanTurn(); checkBomb(); }
    else { cpuTurn(playerAt(s), s); }
  }
  for (let s = 0; s < NUM_PLAYERS; s++) {
    if (s === humanSeat) continue;
    cpuInterAI(playerAt(s), s);
  }
  generate();
  scrollLog();
  for (let i = 0; i < NUM_PLAYERS; i++) {
    players[i].score = scoreHand(players[i].cards, players[i].fieldValue);
  }
  checkBomb();
  autoSave();
};

const pass = () => {
  players[0].passed = 1;
  do { turn(); } while (players.some((p) => !p.isHuman && p.passed !== 1));

  const humanSeat = SEAT_ORDER.indexOf(0);
  for (let s = 0; s < NUM_PLAYERS; s++) {
    if (s === humanSeat) continue;
    const p = playerAt(s);
    for (const slot of [0, 1]) {
      const imgEl = $(cardId(s, slot));
      setImg(cardId(s, slot), `assets/cards/${p.cardFiles[slot]}`);
      if (imgEl) { imgEl.classList.remove("card-reveal"); void imgEl.offsetWidth; imgEl.classList.add("card-reveal"); }
    }
  }
  for (let i = 0; i < NUM_PLAYERS; i++) {
    players[i].score = scoreHand(players[i].cards, players[i].fieldValue);
  }

  // Show round summary overlay, defer round progression to Continue button
  pendingRoundEnd = {
    fn: () => {
      scoreRound();
      resetRound();
      const winner = decideWinner(players.map((p) => p.points));
      if (winner.index < 0) {
        gamer();
      } else {
        if (!winner.tie && winner.index === 0) {
          recordHallOfFame({
            name: players[0].name,
            score: players[0].points,
            rounds: roundCount,
            pureSabaccs: pureSabaccCount,
            time: Date.now() - gameStartTime,
            difficulty: currentDifficulty,
          });
        }
        clearSavedGame();
        showEndScreen(winner);
      }
    },
  };
  showRoundSummary();
};

// -----------------------------------------------------------------------------
// Deal / new round
// -----------------------------------------------------------------------------

const dealCards = () => {
  for (let i = 0; i < NUM_PLAYERS; i++) {
    const p = players[i];
    const a = drawFromDeck(deck);
    const b = drawFromDeck(deck);
    p.cardFiles[0] = a; p.cardFiles[1] = b;
    p.cards[0] = convert(a); p.cards[1] = convert(b);
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
  SFX.deal();
  clearLog();
  scrollLog();
  checkBomb();
};

// -----------------------------------------------------------------------------
// Difficulty selection
// -----------------------------------------------------------------------------

const showDifficulty = () => {
  const container = $("difficultyButtons");
  if (!container) return;
  container.innerHTML = "";
  const presets = Object.entries(DIFFICULTY_PRESETS);
  for (const [key, preset] of presets) {
    const btn = document.createElement("div");
    btn.className = "diff-btn";
    btn.onclick = () => startWithDifficulty(key);
    const label = STR.difficulty[key] || key;
    const desc = STR.difficulty[key + "Desc"] || "";
    btn.innerHTML =
      `<div class="diff-name">${label}</div>` +
      (desc ? `<div class="diff-desc">${desc}</div>` : "");
    container.appendChild(btn);
  }
  if (typeof i18n !== "undefined") i18n.apply();
  showScreen("difficultyScreen");
};

const startWithDifficulty = (key) => {
  const preset = DIFFICULTY_PRESETS[key];
  if (!preset) return;
  currentDifficulty = key;
  // Apply CPU count
  setCpuCount(preset.cpus);
  NUM_CPUS = preset.cpus;
  NUM_PLAYERS = preset.cpus + 1;
  SEAT_ORDER = buildSeatOrder();
  players = createPlayers();
  // Apply win threshold
  WIN_THRESHOLD = preset.winThreshold;
  window.Sabacc.WIN_THRESHOLD = preset.winThreshold;
  // Store personality pool for opps()
  window._difficultyPool = preset.personalityPool;
  gamer();
};

const gamer = () => {
  for (const p of players) {
    p.passed = 0; p.fieldUsed = 0; p.fieldValue = EMPTY; p.score = 0;
  }
  bomb = 0; interIdx = -1; blankedImgId = ""; interSavedFile = "";

  if (gameStartTime === 0) { gameStartTime = Date.now(); roundCount = 1; pureSabaccCount = 0; }

  players[0].name = $("nameInput").value || STR.defaultPlayerName;
  savePlayerName(players[0].name);
  $("turnBtn").disabled = false;
  showScreen("game");
  startMusic();
  refreshAudioSettings();
  buildGameBoard();
  setAlt("playerAvatar", players[0].name);
  // Re-apply CPU avatars if opponents already rolled (buildGameBoard resets to blank.gif)
  if (opponentsRolled) {
    for (let i = 1; i <= NUM_CPUS; i++) {
      const seatIdx = SEAT_ORDER.indexOf(i);
      const avatarIdx = CPU_RACES.findIndex((r) => r.name === players[i].race);
      if (avatarIdx >= 0) setImg(avatarId(seatIdx), `${ASSET.avatarDir}cpu${avatarIdx + 1}.gif`);
      setAlt(avatarId(seatIdx), players[i].race);
    }
  }
  rollCpuFavorites();
  dealCards();
  setupDragAndDrop();
};

const resetRound = () => {
  bomb = 0; interIdx = -1; blankedImgId = ""; interSavedFile = "";
  for (const p of players) {
    p.fieldValue = EMPTY; p.fieldUsed = 0; p.score = 0; p.passed = 0;
    p.cards = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
    p.cardFiles = ["jpg", "jpg", "jpg", "jpg", "jpg"];
    p.favorites = Array(10).fill("jpg");
  }
  deck = buildDeck();
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
// Opponent selection (with personalities)
// -----------------------------------------------------------------------------

const opps = () => {
  if (opponentsRolled) return;
  const races = pickOpponents();
  cpuPersonalities = pickPersonalities(window._difficultyPool);
  for (let i = 1; i <= NUM_CPUS; i++) {
    players[i].race = races[i - 1];
    players[i].name = races[i - 1];
    players[i].personality = cpuPersonalities[i - 1];
    const seatIdx = SEAT_ORDER.indexOf(i);
    const avatarIdx = CPU_RACES.findIndex((r) => r.name === races[i - 1]);
    setImg(avatarId(seatIdx), `${ASSET.avatarDir}cpu${avatarIdx + 1}.gif`);
    setAlt(avatarId(seatIdx), races[i - 1]);
  }
  const oppNames = players.slice(1).map((p) => p.name);
  logMessage(STR.log.opponents.replace("{names}", oppNames.join(", ")));
  logMessage(STR.log.firstPair);
  opponentsRolled = true;
};

// -----------------------------------------------------------------------------
// CPU interference-field AI
// -----------------------------------------------------------------------------

const rollCpuFavorites = () => {
  for (let i = 1; i <= NUM_CPUS; i++) players[i].favorites = rollFavorites();
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
  if (p.fieldValue !== EMPTY) { showToast(STR.toast.fieldOccupied, "error"); return; }
  p.fieldValue = p.cards[slotIdx];
  interIdx = slotIdx; blankedImgId = clickedImgId; interSavedFile = p.cardFiles[slotIdx];
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
  if (p.fieldValue === EMPTY) { showToast(STR.toast.nothingToRetrieve, "error"); return; }
  if (p.cards[interIdx] === 0) p.cards[interIdx] = p.fieldValue;
  p.cardFiles[interIdx] = interSavedFile;
  const cardName = compile(interSavedFile);
  setImg(fieldId(humanSeat), ASSET.field);
  setAlt(fieldId(humanSeat), STR.alt.yourField);
  setAlt(cardId(humanSeat, interIdx), cardName);
  $(blankedImgId).src = `assets/cards/${interSavedFile}`;
  p.fieldValue = EMPTY; interIdx = -1; blankedImgId = ""; interSavedFile = "";
};

// Drag and drop handlers
const onCardDragStart = (e) => {
  const slotIdx = Number(e.currentTarget.dataset.slot);
  const p = players[0];
  if (p.cards[slotIdx] === EMPTY || p.cards[slotIdx] === 0) { e.preventDefault(); return; }
  e.dataTransfer.setData("text/plain", String(slotIdx));
  e.dataTransfer.effectAllowed = "move";
  e.currentTarget.classList.add("dragging");
};
const onCardDragEnd = (e) => { e.currentTarget.classList.remove("dragging"); };
const onFieldDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; const z = $("playerFieldDrop"); if (z) z.classList.add("drag-over"); };
const onFieldDragLeave = () => { const z = $("playerFieldDrop"); if (z) z.classList.remove("drag-over"); };
const onFieldDrop = (e) => { e.preventDefault(); const z = $("playerFieldDrop"); if (z) z.classList.remove("drag-over"); const s = Number(e.dataTransfer.getData("text/plain")); if (!Number.isNaN(s)) moveToField(s); };
const onCardDragOver = (e) => { if (players[0].fieldValue !== EMPTY) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; } };
const onCardDrop = (e) => { e.preventDefault(); if (players[0].fieldValue !== EMPTY) retrieveFromField(); };

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
  if (zone) { zone.addEventListener("dragover", onFieldDragOver); zone.addEventListener("dragleave", onFieldDragLeave); zone.addEventListener("drop", onFieldDrop); }
  const field = $(fieldId(humanSeat));
  if (field) field.addEventListener("click", () => retrieveFromField());
};

// -----------------------------------------------------------------------------
// Generator
// -----------------------------------------------------------------------------

const generate = () => {
  const picked = pickGeneratorCards(deck);
  if (!picked) { logMessage(STR.log.generatorDeckDepleted); return; }
  const { g1, g2 } = picked;
  const q1 = compile(g1); const q2 = compile(g2);
  logMessage(STR.log.generatorReplaced.replace("{g1}", q1).replace("{g2}", q2));
  $("genCard1").value = q1; $("genCard2").value = q2;
  const hands = {};
  for (let i = 0; i < NUM_PLAYERS; i++) hands[`p${i}`] = { locs: players[i].cardFiles, cards: players[i].cards };
  const result = generatorSwap(hands, g1, g2);
  if (!result.swapped) return;
  SFX.swap();
  for (let i = 0; i < NUM_PLAYERS; i++) {
    const r = result[`p${i}`]; const seatIdx = SEAT_ORDER.indexOf(i);
    if (r.changed) {
      for (let s = 0; s < r.locs.length; s++) {
        if (r.locs[s] === g2) {
          const imgEl = $(cardId(seatIdx, s));
          setImg(cardId(seatIdx, s), `assets/cards/${g2}`);
          setAlt(cardId(seatIdx, s), q2);
          if (imgEl) { imgEl.classList.remove("card-swap"); void imgEl.offsetWidth; imgEl.classList.add("card-swap"); }
        }
      }
    }
    players[i].cardFiles = r.locs; players[i].cards = r.cards;
  }
  updateScore();
};

// -----------------------------------------------------------------------------
// Music + Settings persistence
// -----------------------------------------------------------------------------

const MUSIC_KEY = "sabacc-music";
const VOLUME_KEY = "sabacc-music-volume";
const NAME_KEY = "sabacc-player-name";
const WIN_THRESHOLD_KEY = "sabacc-win-threshold";
const CPU_COUNT_KEY = "sabacc-cpu-count";
const VALID_THRESHOLDS = [100, 500, 1000, 2500, 5000];
const VALID_CPU_COUNTS = [1, 2, 3, 4];

const loadMusicPref = () => { try { return localStorage.getItem(MUSIC_KEY) || "on"; } catch { return "on"; } };
const setMusic = (val) => {
  try { localStorage.setItem(MUSIC_KEY, val); } catch {}
  const mp = $("musicPlayer");
  if (mp) {
    if (val === "off") { mp.pause(); }
    else {
      mp.volume = loadMusicVolume() / 100;
      if (!mp.src || mp.src.endsWith("cantina.mp3") === false) {
        mp.src = `${ASSET.audioDir}cantina.mp3`;
      }
      mp.currentTime = 0;
      mp.play().catch(() => {});
    }
  }
};
const loadMusicVolume = () => { try { const v = Number(localStorage.getItem(VOLUME_KEY)); return isNaN(v) ? 50 : v; } catch { return 50; } };
const setMusicVolume = (val) => {
  const n = Number(val) / 100;
  try { localStorage.setItem(VOLUME_KEY, val); } catch {}
  const mp = $("musicPlayer"); if (mp) mp.volume = n;
  const ca = $("creditsAudio"); if (ca) ca.volume = n;
};
const loadPlayerName = () => { try { return localStorage.getItem(NAME_KEY) || ""; } catch { return ""; } };
const savePlayerName = (name) => { try { localStorage.setItem(NAME_KEY, name); } catch {} };
const loadWinThreshold = () => { try { const v = Number(localStorage.getItem(WIN_THRESHOLD_KEY)); if (VALID_THRESHOLDS.includes(v)) return v; } catch {} return 500; };
const setWinThreshold = (val) => { const n = Number(val); if (VALID_THRESHOLDS.includes(n)) { WIN_THRESHOLD = n; window.Sabacc.WIN_THRESHOLD = n; try { localStorage.setItem(WIN_THRESHOLD_KEY, String(n)); } catch {} } };
const loadCpuCount = () => { try { const v = Number(localStorage.getItem(CPU_COUNT_KEY)); if (VALID_CPU_COUNTS.includes(v)) return v; } catch {} return 4; };
const setCpuCountSetting = (val) => {
  const n = Number(val);
  if (VALID_CPU_COUNTS.includes(n)) {
    setCpuCount(n);
    NUM_CPUS = n; NUM_PLAYERS = n + 1; SEAT_ORDER = buildSeatOrder();
    players = createPlayers();
    try { localStorage.setItem(CPU_COUNT_KEY, String(n)); } catch {}
  }
};

const startMusic = () => {
  if (musicStarted !== 0) return;
  if (loadMusicPref() === "on") {
    const mp = $("musicPlayer");
    if (mp) {
      mp.src = `${ASSET.audioDir}cantina.mp3`;
      mp.volume = loadMusicVolume() / 100;
      mp.play().catch(() => {});
    }
  }
  musicStarted = 1;
};

const pauseCantina = () => {
  const mp = $("musicPlayer");
  if (mp) mp.pause();
};

const resumeCantina = () => {
  const mp = $("musicPlayer");
  if (mp && loadMusicPref() === "on") {
    mp.volume = loadMusicVolume() / 100;
    mp.play().catch(() => {});
  }
};

// Refresh live settings (called when returning to game from Settings via Esc/Continue)
const refreshAudioSettings = () => {
  const mp = $("musicPlayer");
  if (mp) {
    mp.volume = loadMusicVolume() / 100;
    if (loadMusicPref() === "off") { mp.pause(); }
    else if (mp.src && mp.paused) { mp.play().catch(() => {}); }
  }
};

// -----------------------------------------------------------------------------
// Keyboard support
// -----------------------------------------------------------------------------

const setupKeyboard = () => {
  document.addEventListener("keydown", (e) => {
    if ($("game").style.display !== "block") return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.code === "Space") { e.preventDefault(); if (!$("turnBtn").disabled) turn(); }
    else if (e.key === "p" || e.key === "P") { e.preventDefault(); pass(); }
    else if (e.key === "Escape") { e.preventDefault(); autoSave(); showScreen("startPanel"); }
  });
};

// -----------------------------------------------------------------------------
// Game state save/load
// -----------------------------------------------------------------------------

const SAVE_KEY = "sabacc-save";

const saveGameState = () => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      players, game, gameStartTime, roundCount, pureSabaccCount,
      cpuPersonalities, opponentsRolled, deck, bomb,
      winThreshold: window.Sabacc.WIN_THRESHOLD,
      difficulty: currentDifficulty,
    }));
  } catch {}
};

const loadGameState = () => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
};

const clearSavedGame = () => {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
};

const clearSave = () => {
  clearSavedGame();
  const continueBtn = $("continueBtn");
  if (continueBtn) continueBtn.style.display = "none";
  showToast(STR.toast.saveCleared || "Save cleared", "info");
};

const hasSavedGame = () => {
  const s = loadGameState();
  return s !== null && s.players && s.players.length > 1 && s.opponentsRolled;
};

const continueGame = () => {
  const s = loadGameState();
  if (!s) { gamer(); return; }
  // Restore state
  game = s.game || 0;
  gameStartTime = s.gameStartTime || 0;
  roundCount = s.roundCount || 0;
  pureSabaccCount = s.pureSabaccCount || 0;
  cpuPersonalities = s.cpuPersonalities || [];
  currentDifficulty = s.difficulty || "knight";
  opponentsRolled = s.opponentsRolled || false;
  deck = s.deck || buildDeck();
  bomb = s.bomb || 0;
  interIdx = -1; blankedImgId = ""; interSavedFile = "";

  // Restore players
  players = s.players.map((p) => ({ ...p, cards: [...p.cards], cardFiles: [...p.cardFiles], favorites: [...p.favorites] }));
  players[0].isHuman = true;

  // Restore CPU count if different
  const numCpus = players.length - 1;
  if (numCpus !== NUM_CPUS) {
    setCpuCount(numCpus);
    NUM_CPUS = numCpus; NUM_PLAYERS = numCpus + 1; SEAT_ORDER = buildSeatOrder();
  }

  // Show game screen and rebuild board
  showScreen("game");
  startMusic();
  refreshAudioSettings();
  buildGameBoard();
  setAlt("playerAvatar", players[0].name);

  // Re-render all card images
  const humanSeat = SEAT_ORDER.indexOf(0);
  for (let s = 0; s < NUM_PLAYERS; s++) {
    const p = playerAt(s);
    for (let slot = 0; slot <= 4; slot++) {
      if (p.cardFiles[slot] && p.cardFiles[slot] !== "jpg" && p.cardFiles[slot] !== "field.gif") {
        if (p.isHuman || slot < 2) {
          // Human cards always face up; CPU dealt cards face down until round end
          setImg(cardId(s, slot), p.isHuman ? `assets/cards/${p.cardFiles[slot]}` : ASSET.wallp);
        } else {
          setImg(cardId(s, slot), p.isHuman ? `assets/cards/${p.cardFiles[slot]}` : ASSET.blank);
        }
        setAlt(cardId(s, slot), p.isHuman ? compile(p.cardFiles[slot]) : "");
      }
    }
    // Restore field images
    if (p.fieldValue !== EMPTY && p.cardFiles) {
      const fieldCard = p.cardFiles.find((f) => f !== "jpg" && f !== "field.gif" && f);
      // Field is rendered by cpuInterAI on next turn; for now show field.gif
    }
    setImg(fieldId(s), ASSET.field);
    setAlt(fieldId(s), s === humanSeat ? STR.alt.yourField : STR.alt.opponentField);

    // Restore tournament panel
    const nameEl = $(scoreNameId(s)); const valEl = $(scoreValueId(s));
    if (nameEl) nameEl.textContent = p.name || "";
    if (valEl) valEl.textContent = p.points;

    // Restore avatars for CPUs
    if (!p.isHuman && p.race !== "none") {
      const avatarIdx = window.Sabacc.CPU_RACES.findIndex((r) => r.name === p.race);
      if (avatarIdx >= 0) setImg(avatarId(s), `${ASSET.avatarDir}cpu${avatarIdx + 1}.gif`);
      setAlt(avatarId(s), p.race);
    }
  }

  // Log current state
  $("eventLog").value = STR.log.roundHeader.replace("{n}", game);
  updateScore();
  updateTournamentPanel();
  $("turnBtn").disabled = (players[0].passed === 1);
  setupDragAndDrop();
};

// Auto-save after each turn
const autoSave = () => {
  if (gameStartTime > 0) saveGameState();
};

// -----------------------------------------------------------------------------
// Screen navigation
// -----------------------------------------------------------------------------

const showScreen = (id) => {
  for (const el of document.querySelectorAll(".screen")) el.style.display = "none";
  const target = $(id);
  if (!target) return;
  if (target.classList.contains("game-screen") || target.classList.contains("credits-screen")) target.style.display = "block";
  else target.style.display = "flex";
};

// -----------------------------------------------------------------------------
// Intro video
// -----------------------------------------------------------------------------

let introSkipped = false;
const skipIntro = () => {
  if (introSkipped) return;
  introSkipped = true;
  const overlay = $("introVideo");
  if (!overlay) return;
  overlay.classList.add("hidden");
  const video = $("introPlayer");
  if (video) video.pause();
  startMusic();
};

// -----------------------------------------------------------------------------
// End screen
// -----------------------------------------------------------------------------

const formatTime = (ms) => {
  const s = Math.floor(ms / 1000); const m = Math.floor(s / 60); const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const showEndScreen = (winner) => {
  const humanWon = winner.index === 0;
  const isTie = winner.tie;
  $("endEmoji").textContent = isTie ? STR.end.tieEmoji : (humanWon ? STR.end.victoryEmoji : STR.end.defeatEmoji);
  $("endTitle").textContent = isTie ? STR.end.tie : (humanWon ? STR.end.victory : STR.end.defeat);
  if (isTie) $("endWinner").textContent = STR.end.tieMessage;
  else if (humanWon) $("endWinner").textContent = STR.end.youWin;
  else $("endWinner").textContent = STR.end.youLose.replace("{name}", players[winner.index].name);
  const time = Date.now() - gameStartTime;
  $("endStats").innerHTML =
    STR.end.yourScore.replace("{score}", players[0].points) + "<br>" +
    STR.end.rounds.replace("{rounds}", roundCount) + "<br>" +
    STR.end.pureSabaccs.replace("{count}", pureSabaccCount) + "<br>" +
    STR.end.gameTime.replace("{time}", formatTime(time));
  showScreen("endScreen");
};

const resetGameState = () => {
  game = 0; gameStartTime = 0; roundCount = 0; pureSabaccCount = 0; opponentsRolled = false;
  players = createPlayers();
  deck = buildDeck(); bomb = 0; interIdx = -1; blankedImgId = ""; interSavedFile = "";
};

const playAgain = () => {
  resetGameState();
  const nameInput = $("nameInput");
  if (nameInput && nameInput.value) players[0].name = nameInput.value;
  else players[0].name = loadPlayerName() || STR.defaultPlayerName;
  skipIntro();
  gamer();
};

// -----------------------------------------------------------------------------
// Hall of Fame
// -----------------------------------------------------------------------------

const HOF_KEY = "sabacc-hof";
const HOF_MAX = 10;
let hofSortKey = "score";

const loadHallOfFame = () => { try { const raw = localStorage.getItem(HOF_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } };
const saveHallOfFame = (data) => { try { localStorage.setItem(HOF_KEY, JSON.stringify(data)); } catch {} };
const recordHallOfFame = (entry) => { const d = loadHallOfFame(); d.push(entry); saveHallOfFame(d); };

const renderHallOfFame = () => {
  const container = $("hofTable");
  if (!container) return;
  const data = loadHallOfFame();
  if (data.length === 0) { container.innerHTML = `<p class="hof-empty">${STR.hof.empty}</p>`; return; }
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
  const sortAttr = (key) => key === hofSortKey ? ' class="sort-active"' : "";
  container.innerHTML =
    `<table class="hof-table"><tr>` +
    `<th>${STR.hof.rank}</th><th>${STR.hof.name}</th>` +
    `<th${sortAttr("score")} onclick="hofSort('score')">${STR.hof.score}</th>` +
    `<th${sortAttr("rounds")} onclick="hofSort('rounds')">${STR.hof.rounds}</th>` +
    `<th${sortAttr("pureSabaccs")} onclick="hofSort('pureSabaccs')">${STR.hof.pureSabaccs}</th>` +
    `<th${sortAttr("time")} onclick="hofSort('time')">${STR.hof.time}</th>` +
    `</tr>${rows}</table>`;
};

const showHallOfFame = () => { renderHallOfFame(); showScreen("hofScreen"); };
const hofSort = (key) => { hofSortKey = key; renderHallOfFame(); };
const resetHallOfFame = () => { if (confirm(STR.hof.resetConfirm)) { saveHallOfFame([]); renderHallOfFame(); } };

// -----------------------------------------------------------------------------
// Rules + Credits screens
// -----------------------------------------------------------------------------

const showRules = () => { const c = $("rulesContent"); if (c) c.innerHTML = STR.rules.html; showScreen("rulesScreen"); };

const showCredits = () => {
  const scroll = $("creditsScroll");
  if (scroll) scroll.innerHTML = STR.credits.html;
  showScreen("creditsScreen");
  pauseCantina();
  const audio = $("creditsAudio");
  if (audio) {
    audio.volume = loadMusicVolume() / 100;
    audio.currentTime = 0;
    if (loadMusicPref() === "on") audio.play().catch(() => {});
  }
};
const stopCreditsMusic = () => {
  const a = $("creditsAudio");
  if (a) { a.pause(); a.currentTime = 0; }
  resumeCantina();
};

// -----------------------------------------------------------------------------
// Exit game
// -----------------------------------------------------------------------------

const exitGame = () => {
  window.close();
  document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:yellow;font-size:24px;font-family:sans-serif">May the Force be with you.</div>`;
};

// -----------------------------------------------------------------------------
// Init
// -----------------------------------------------------------------------------

WIN_THRESHOLD = loadWinThreshold();
window.Sabacc.WIN_THRESHOLD = WIN_THRESHOLD;

// Apply saved CPU count
const savedCpuCount = loadCpuCount();
if (savedCpuCount !== 4) {
  setCpuCount(savedCpuCount);
  NUM_CPUS = savedCpuCount; NUM_PLAYERS = savedCpuCount + 1; SEAT_ORDER = buildSeatOrder();
  players = createPlayers();
}

// Rebuild CPU_RACES on locale change
if (typeof i18n !== "undefined" && i18n.onLocaleChange) {
  i18n.onLocaleChange(() => { window.Sabacc.CPU_RACES = refreshCpuRaces(); });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupKeyboard();
    const sel = $("winThresholdSelect"); if (sel) sel.value = String(WIN_THRESHOLD);
    const musicSel = $("musicToggle"); if (musicSel) musicSel.value = loadMusicPref();
    const sfxSel = $("sfxToggle"); if (sfxSel) sfxSel.value = loadSfxPref();
    const volSlider = $("musicVolume"); if (volSlider) { volSlider.value = loadMusicVolume(); setMusicVolume(volSlider.value); }
    const nameInput = $("nameInput"); if (nameInput) { const s = loadPlayerName(); if (s) nameInput.value = s; }
    const cpuSel = $("cpuCountSelect"); if (cpuSel) cpuSel.value = String(NUM_CPUS);
    const continueBtn = $("continueBtn"); if (continueBtn) continueBtn.style.display = hasSavedGame() ? "block" : "none";
    // Start cantina music on main menu after intro dismisses
    setTimeout(skipIntro, 6000);
  });
} else {
  setupKeyboard();
  const sel = $("winThresholdSelect"); if (sel) sel.value = String(WIN_THRESHOLD);
  const musicSel = $("musicToggle"); if (musicSel) musicSel.value = loadMusicPref();
  const sfxSel = $("sfxToggle"); if (sfxSel) sfxSel.value = loadSfxPref();
  const volSlider = $("musicVolume"); if (volSlider) { volSlider.value = loadMusicVolume(); setMusicVolume(volSlider.value); }
  const nameInput = $("nameInput"); if (nameInput) { const s = loadPlayerName(); if (s) nameInput.value = s; }
  const cpuSel = $("cpuCountSelect"); if (cpuSel) cpuSel.value = String(NUM_CPUS);
  const continueBtn = $("continueBtn"); if (continueBtn) continueBtn.style.display = hasSavedGame() ? "block" : "none";
  setTimeout(skipIntro, 6000);
}

// Expose to inline HTML handlers
window.gamer = gamer;
window.showDifficulty = showDifficulty;
window.startWithDifficulty = startWithDifficulty;
window.turn = turn;
window.pass = pass;
window.showScreen = showScreen;
window.showHallOfFame = showHallOfFame;
window.resetHallOfFame = resetHallOfFame;
window.clearSave = clearSave;
window.exitGame = exitGame;
window.hofSort = hofSort;
window.setWinThreshold = setWinThreshold;
window.setCpuCountSetting = setCpuCountSetting;
window.showRules = showRules;
window.setMusic = setMusic;
window.setSfx = setSfx;
window.setMusicVolume = setMusicVolume;
window.showCredits = showCredits;
window.stopCreditsMusic = stopCreditsMusic;
window.skipIntro = skipIntro;
window.resetGameState = resetGameState;
window.playAgain = playAgain;
window.continueGame = continueGame;
window.hasSavedGame = hasSavedGame;
window.continueNextRound = continueNextRound;

} // end of `if (typeof document !== "undefined")` block