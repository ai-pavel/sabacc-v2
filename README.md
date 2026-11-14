# 🎲 Sabacc Tournament

A 5-player Sabacc card game (you + 4 CPU opponents) set in the Star Wars
universe, originally written in 2005 by Revan (idea + code) and
Darth Favourite (graphics), and refactored for modern browsers. The
ruleset is inspired by the Sabacc scene in James Luceno's novel
*Agents of Chaos I: Hero's Trial*.

This is an anniversary remake of the original 2005 game. The original
source code (formerly the separate
[sabacc-v1](https://github.com/ai-pavel/sabacc-v1) repository) now lives
in the [`sabacc-v1/`](sabacc-v1/) folder of this repo; rules and FAQ (in
Russian) are in `sabacc-v1/Правила.txt` and `sabacc-v1/FAQ.txt`.

Play online: https://ai-pavel.github.io/sabacc-v2/ (the 2005 original:
https://ai-pavel.github.io/sabacc-v2/sabacc-v1/)

## Quick start

Open `index.html` in any modern browser — no server or build step required.

To run the unit tests:

```sh
node --test
```

## Game loop pseudocode

The following scheme traces every main function in `src/game.js`,
showing how control flows from the main menu through a round and into
the next. Pure rule functions (no DOM access) are marked with `·`.

```
INTRO VIDEO (autoplay on page load, dismiss after 6s or Skip button)
  skipIntro()                     ← hides #introVideo overlay

MAIN MENU (HoMM-style left-aligned buttons)
  gamer()                          ← "Start Game"
  showScreen('settingsScreen')     ← "Settings"
  showRules()                      ← "Game Rules"
  showHallOfFame()                 ← "Hall of Fame"
  showCredits()                    ← "Credits"
  exitGame()                       ← "Exit Game"

SETTINGS (sub-screen, persisted in localStorage)
  #nameInput                       ← player name (key: sabacc-player-name)
  #musicToggle (dropdown)          ← music on/off (key: sabacc-music)
  #winThresholdSelect              ← 500 / 1000 / 2500 / 5000 (key: sabacc-win-threshold)
  #langSelect                      ← language picker (key: sabacc-lang)
  resetHallOfFame()                ← "Reset Hall of Fame"

HALL OF FAME (sub-screen, localStorage key: sabacc-hof)
  renderHallOfFame()                ← top 10 by score / rounds / game time
  hofSort(key)                      ← click column headers to re-sort

GAME RULES (sub-screen, scrollable dark panel)
  showRules()                       ← injects STR.rules.html into #rulesContent

CREDITS (rolling animation screen)
  showCredits()                     ← injects STR.credits.html, plays credits.mp3

────────────────────────────────────────────────────────────────────
gamer()                              ← "Start Game" button
│ read playerName from #nameInput (default from STR.defaultPlayerName)
│ savePlayerName() → localStorage
│ reset per-round state for all players
│ if first game: gameStartTime = Date.now(), roundCount = 1
│ showScreen('game')
│ startMusic()
│   · loadMusicPref() from localStorage; if "on": set #musicPlayer.src
│ buildGameBoard()
│   · generates card-table, field-slots, avatar-row, tournament-scores DOM
│   · seat order: cpu1, cpu2, human, cpu3, cpu4 (human in the middle)
│ rollCpuFavorites()
│   · rollFavorites() x4  →  players[1..4].favorites[] (10 cards each)
│ dealCards()
│   ├─ drawFromDeck(deck) x10  →  2 cards each for all 5 players
│   ├─ convert(card) → numeric value, compile(card) → display name
│   ├─ render player's cards face up, CPUs face down (wallp.gif)
│   └─ clearLog()
│       ├─ opps()
│       │   · pickOpponents() → 4 distinct race names (Fisher-Yates shuffle)
│       │   · set players[1..4].name/race, avatar images
│       │   · log "Your opponents are A, B, C and D"
│       ├─ if first game: log welcome message
│       │   else: log "Round N", increment roundCount
│       ├─ updateScore()
│       │   · scoreHand(players[0].cards, players[0].fieldValue) → score
│       │   · log "Your current score: N"
│       ├─ updateTournamentPanel()
│       └─ clear generator text fields
│ setupDragAndDrop()
└─ game board is now interactive

────────────────────────────────────────────────────────────────────
PER TURN (player clicks "Next turn"):
────────────────────────────────────────────────────────────────────

turn()                               ← onClick="turn()" on Next turn
 │ log separator line
 │
 │ for each seat in SEAT_ORDER (cpu1, cpu2, human, cpu3, cpu4):
 │   if seat is human:
 │     humanTurn()
 │       if not passed and deck not depleted:
 │         · drawFromDeck → card, convert, compile
 │         · placeCard() into player's slot 2→3→4
 │         if slot 4 filled: disable #turnBtn, passed = 1
 │     checkBomb()                      ← only for the player
 │       · score 0 / >23 / <-23  →  toast "You bombed!", disable turn
 │       · score ±23             →  toast "Pure Sabacc!", same
 │   else:
 │     cpuTurn(player, seatIdx)
 │       · cpuWantsToDraw(score, threshold)?  →  |score| < threshold && score != 0
 │       if yes:
 │         · drawFromDeck → card, convert, compile
 │         · placeCard() → first empty slot 2→3→4
 │         if slot 4 filled: passed = 1
 │       if no: passed = 1, log "X passes"
 │
 │ for each CPU seat:
 │   cpuInterAI(player, seatIdx)
 │     · scan hand for a card in player's favorites[]
 │     · if found and field unused: move it to interference field
 │       (protected from generator swaps)
 │
 │ generate()                          ← the randomizer pot
 │   · pickGeneratorCards(deck) → { g1, g2 }  (g1 lookup, g2 drawn)
 │   · compile(g1) → q1, compile(g2) → q2
 │   · log "Random generator replaced card X with Y"
 │   · display q1, q2 in #genCard1, #genCard2
 │   · generatorSwap(hands, g1, g2) → swap across all 5 players
 │   · re-render any swapped card images
 │   · updateScore()
 │
 └─ scrollLog()

────────────────────────────────────────────────────────────────────
PASS (player clicks "Pass"):
────────────────────────────────────────────────────────────────────

pass()                               ← onClick="pass()" on Pass
 │ players[0].passed = 1
 │ do:
 │   turn()                           ← keep playing CPUs until all pass
 │ while any CPU has passed != 1
 │
 │ reveal all CPU face-down cards
 │ recompute all scores
 │
 │ toast round results:
 │   "Round over! <name1><result> | <name2><result> | ... | <name5><result>"
 │
 │ scoreRound()
 │   · isIdiotsArray() check for each player (Idiot + 2 + 3 = Pure Sabacc)
 │   · evaluateRound(score) for each:
 │       bomb           → roundPoints -24, tournamentDelta -24
 │       pure sabacc    → roundPoints +24, tournamentDelta +46
 │       valid          → roundPoints |score|, tournamentDelta |score|
 │   · add tournament deltas to each player's points
 │   · applyLeaderBonus():
 │       if no pure sabacc this round:
 │         find highest roundPoints scorer
 │         if unique: +roundPoints/2 to their tournament total
 │         if tied: no bonus
 │   · updateTournamentPanel()
 │
 │ resetRound()
 │   · clear all hands, card files, field values, pass flags, scores
 │   · rebuild deck = buildDeck()
 │   · reset card images to blank/wallp, field images to field.gif
 │
 │ decideWinner(players.map(p => p.points))
 │   · find any player > WIN_THRESHOLD (configurable: 500/1000/2500/5000)
 │   if no winner yet:
 │     gamer() → deal next round
 │   else:
 │     recordHallOfFame({ name, score, rounds, time })
 │     showEndScreen(winner)
 │       · victory: 🏆 "Victory!" / defeat: 🔙 "Defeat" / tie: 🧱 "Tie!"
 │       · show winner name, player's score, rounds, game time
 │       · buttons: "Main Menu" (resetGameState + showScreen) / "Play Again" (reload)

────────────────────────────────────────────────────────────────────
PLAYER INTERFERENCE FIELD (drag and drop):
────────────────────────────────────────────────────────────────────

moveToField(slotIdx)           ← drag a player card to the field
 │ if slot is empty: return (no-op)
 │ if field is occupied: toast "Interference field is occupied!"
 │ else:
 │   move card value → fieldValue
 │   render field image with the card, blank the slot
 │   remember which slot was blanked

retrieveFromField()             ← click on the field image
 │ if field is empty: toast "Nothing to put back..."
 │ else:
 │   restore the saved card back to its original slot
 │   re-render the slot, reset field image

────────────────────────────────────────────────────────────────────
PURE RULE FUNCTIONS (no DOM access, exported for testing):
────────────────────────────────────────────────────────────────────

 · buildDeck()            → 76 card filenames (1-15 x 4 suits + 16 face cards)
 · convert(card)          → numeric value (Idiot=0, Queen=±2, ..., Senator=±17)
 · compile(card)          → "N of <Suit>" or "<Face> (+/-)" or "Idiot"
 · scoreHand(cards, field)→ sum of non-empty slots + field value
 · evaluateRound(score)   → { roundPoints, tournamentDelta }
 · applyLeaderBonus(pts)  → adjusted tournament points with +best/2 bonus
 · decideWinner(points)   → { index, tie, points } for first > WIN_THRESHOLD
 · cpuWantsToDraw(score)  → |score| < threshold && score != 0
 · pickOpponents()        → 4 distinct race names
 · swapCardInLocations()  → new { locs, cards } with oldCard replaced by newCard
 · randomGeneratorStep()  → { swapped, g1, g2, deck } (no card leak)
 · generatorSwap(hands)    → swap across arbitrary number of players
 · pickGeneratorCards()   → { g1, g2 } (g1 lookup, g2 drawn from deck)
 · rollFavorites()        → 10 random card filenames for CPU field AI
 · refreshCpuRaces()      → rebuild CPU_RACES from STR.cpuRaces (locale-aware)
```

## Game loop

### 1. Main menu

The main menu shows six HoMM-style buttons (left-aligned, with emoji
prefixes): 🎲 **Start Game**, ⚙️ **Settings**, 📜 **Game Rules**, 🏆 **Hall
of Fame**, 🎬 **Credits**, 🚪 **Exit Game**.

- **Start Game** launches a tournament immediately.
- **Settings** opens a sub-screen with player name, music dropdown,
  win-threshold dropdown (500/1000/2500/5000), language picker, and a
  "Reset Hall of Fame" button. All settings are persisted in
  `localStorage`.
- **Game Rules** shows a scrollable dark panel with the full rules
  (deck composition, scoring, generator, interference field, tournament).
- **Hall of Fame** shows the top 10 tournament results (sortable by
  score, rounds, or game time), persisted in `localStorage`.
- **Credits** opens a rolling credits animation with music.
- **Exit Game** attempts to close the tab.

Clicking **Start Game** calls `gamer()`, which hides the menu, builds the
game board, starts the music (if enabled), rolls each CPU's "favorite
cards" list, and deals the opening hands. The game timer starts on first
launch.

### 2. Opponent selection

`opps()` picks 4 distinct CPU races at random from 5 possible races using
a Fisher–Yates shuffle. Race names are locale-dependent (translated in
each `STR.cpuRaces` array). On language change, `CPU_RACES` is rebuilt
via `refreshCpuRaces()` and the `i18n.onLocaleChange` hook.

CPU pass thresholds (fixed, not shown in rules — left as a game mystery):

The threshold is the |score| at which that CPU stops drawing and passes.
CPU avatars are assigned based on race index (`cpu1.gif` through
`cpu5.gif`).

### 3. Dealing

`dealCards()` draws 2 cards each for all 5 players from a freshly built
76-card deck. The player's cards are face up; CPU cards are face down
(shown as `wallp.gif`). The event log is initialized with the player's
name and a welcome message.

### 4. Turn structure

Each click of **Next turn** runs `turn()`:

1. **All seats in table order** (cpu1, cpu2, human, cpu3, cpu4):
   - CPUs draw a card if they haven't passed and |score| < threshold
   - Human draws a card into their first empty slot (2 → 3 → 4)
   - Bomb check runs after the human's draw
2. **CPU interference-field AI** runs for all 4 CPUs — each CPU moves a
   card to its interference field if that card matches its pre-rolled
   favorites list
3. **Generator** fires (`generate()`) — see below
4. Final bomb check after the generator

A CPU automatically passes when its 5th card slot fills or its |score|
reaches its threshold. The player auto-passes when their 5th slot fills,
or can click **Pass** at any time.

### 5. The generator (randomizer pot)

After every turn, the random generator picks two cards (g1, g2) from the
deck. If they differ, every player who holds g1 has it replaced with g2 —
across all 5 slots and the interference field. If g1 == g2 the generator
"fails" and nothing happens. The swap is logged and shown in the two
generator text fields at the top of the board (left = replaced card,
right = replacement).

### 6. Interference field

Each player has an interference field that holds one card. A card in the
field still counts toward the hand's score but is protected from the
generator's swaps.

- **Player**: drag a card to your field (`moveToField()`); click your
  field image to retrieve it (`retrieveFromField()`). Only one card at
  a time.
- **CPUs**: automatically move a favorite card to their field when one
  appears in their hand (`cpuInterAI()`).

### 7. Passing and round end

When the player clicks **Pass**, `pass()` runs:

1. Sets `passed = 1` and keeps calling `turn()` until all 4 CPUs have
   passed
2. Reveals all CPUs' face-down cards
3. Shows a toast with each player's round result
4. Calls `scoreRound()` to update tournament points and the standings
   panel
5. Calls `resetRound()` to clear the board for the next round
6. Checks for a tournament winner via `decideWinner()`

### 8. Scoring

Hand score = sum of all card values (including the interference field).
Sign is irrelevant — |score| is what matters.

| Score | Result | Round points | Tournament delta |
|-------|--------|-------------|-----------------|
| 0, > 23, < -23 | Bomb | -24 | -24 |
| exactly ±23 (or Idiot's Array) | Pure Sabacc | +24 | +46 |
| 1–22 or -22 to -1 | Valid | +|score| | +|score| |

**Round-leader bonus**: the single highest scorer in a round (when no one
hit Pure Sabacc) gets an extra +roundPoints/2 added to their tournament
total. Ties for highest get no bonus.

**Idiot's Array**: Idiot (0) + 2 + 3 = 23 counts as Pure Sabacc.

### 9. Tournament end

Tournament points accumulate across rounds. The first player to exceed
the **win threshold** (configurable in Settings: 500, 1000, 2500, or
5000) ends the tournament. If two players cross the threshold in the same
round, the higher total wins; an exact tie triggers a tie.

When the tournament ends, the human player's result is recorded to the
Hall of Fame (name, score, rounds, game time) and a dedicated **end
screen** is shown:

- **Victory** (🏆) — the human player won
- **Defeat** (🔙) — a CPU opponent won
- **Tie** (🧱) — the tournament ended in a tie

The end screen shows the winner's name, the player's final score, rounds
played, and game time. Two buttons are offered: **Main Menu** (resets
game state and returns to the main menu) and **Play Again** (reloads the
page).

### 10. Cards

The 76-card deck:

- **Numbered cards (60)**: 1–15 in four suits — Coins (c), Flasks (f),
  Sabers (p), Staves (s). Value = face value.
- **Face cards (16)**: each has a positive and negative variant:

  | Code | Name | Value |
  |------|------|-------|
  | i1/i2 | Idiot | 0 |
  | q1/q2 | Queen of Madness | +2 / -2 |
  | e1/e2 | Endurance | +6 / -6 |
  | b1/b2 | Balance | +8 / -8 |
  | d1/d2 | Duelist | +11 / -11 |
  | c1/c2 | Commander | +13 / -13 |
  | a1/a2 | Ace | +15 / -15 |
  | s1/s2 | Senator | +17 / -17 |

### 11. Internationalization

The game supports 10 languages (English, Russian, Spanish, French,
German, Polish, Italian, Portuguese, Japanese, Chinese). All human-facing
strings live in `src/i18n/*.js` and are exposed on `window.STR` by the
i18n loader. The language picker is in Settings, and the choice is
persisted in `localStorage`. DOM elements with `data-i18n` attributes
are automatically translated on locale change.

## Project structure

```
index.html              Game page (intro video, main menu, settings,
                        rules, hall of fame, credits, game, end screen)
src/
  game.js               Game logic (pure rules + DOM coupling)
  style.css             Layout and theming
  i18n/
    loader.js           i18n registry + window.STR accessor + onLocaleChange hook
    init.js             Language picker + DOM [data-i18n] applier
    en.js               English (🇬🇧)
    ru.js               Russian (🇷🇺 Русский)
    es.js               Spanish (🇪🇸 Español)
    fr.js               French (🇫🇷 Français)
    de.js               German (🇩🇪 Deutsch)
    pl.js               Polish (🇵🇱 Polski)
    it.js               Italian (🇮🇹 Italiano)
    pt.js               Portuguese (🇵🇹 Português)
    ja.js               Japanese (🇯🇵 日本語)
    zh.js               Simplified Chinese (🇨🇳 简体中文)
assets/
  cards/                76 card faces + blank.gif + field.gif + wallp.gif
  audio/                cantina.mp3 (in-game) + credits.mp3 (credits screen)
  avatars/              CPU race avatars (cpu1-5.gif) + default.gif + blank.gif
  images/               bg.jpg (starfield) + table.jpg (felt) + bith.jpg (log bg)
  ui/                   gb.gif, ib.gif, back3.gif, generator.gif (panels)
  video/                intro_video.mp4 (opening animation)
  prompts/              Video generation prompts
test/
  rules.test.js         Unit tests (run with `node --test`)
analysis.md             Original 2005 code analysis and bug inventory
sabacc-v1/              Original 2005 game (formerly the sabacc-v1 repo)
```

## Credits

- **Idea**: Revan (revan1@mail.ru)
- **Code**: Revan (revan1@mail.ru)
- **Testing & debugging**: Revan
- **Graphics**: Darth Favourite (favourite_2003@mail.ru)
- **Music**: Mark Griskey (KOTOR II: Iziz Cantina) / John Williams (Star Wars: End Credits)
- **Thanks**: James Luceno, for the book *Agents of Chaos I: Hero's Trial*
- **Special thanks**: Denis Konstantin (Sabacc Tour table)
- **Packaged with**: [Natata eBook Compiler](https://web.archive.org/web/20021123121929/http://natata.hn3.net/)
- **And also**: George Lucas, for the *Star Wars* saga; Microsoft, for Notepad

All rights, design, etc. belong to Lucasfilm, Ltd. Star Wars and related
marks are trademarks of Lucasfilm.