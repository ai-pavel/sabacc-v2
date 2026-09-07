# Sabacc Tournament

A 3-player Sabacc card game (you + 2 CPU opponents) set in the Star Wars
universe, originally written in 2005 by Revan (idea + code) and
Darth Favourite (graphics), and refactored for modern browsers. The
ruleset is inspired by the Sabacc scene in James Luceno's novel
*Agents of Chaos I: Hero's Trial*.

## Quick start

Open `index.html` in any modern browser — no server or build step required.

To run the unit tests:

```sh
node --test
```

## Game loop pseudocode

The following scheme traces every main function in `src/game.js`,
showing how control flows from the start screen through a round and into
the next. Pure rule functions (no DOM access) are marked with `·`.

```
gamer()                              ← onClick="gamer()" on Start game
│ read playerName from #nameInput (default "Player")
│ read avatar from #avatarInput
│ hide #startPanel, show #game
│ startMusic()
│   · if music checkbox checked: set #musicPlayer.src = cantina.mp3
│ rollCpuFavorites()
│   · rollFavorites() x2  →  favorites1[], favorites2[]  (10 cards each)
│ dealCards()
│   ├─ drawFromDeck(deck) x6  →  2 cards each for player, cpu1, cpu2
│   ├─ convert(card) → numeric value, compile(card) → display name
│   ├─ render player's cards face up, CPUs face down (wallp.gif)
│   └─ clearLog()
│       ├─ opps()
│       │   · pickOpponents() → two distinct race names
│       │   · set race1/race2, cpu1Name/cpu2Name, avatar images
│       │   · log "Your opponents are X and Y"
│       ├─ if first game: log welcome message
│       │   else: log "Round N" + tournament table (race - points)
│       ├─ updateScore()
│       │   · scoreHand(cards, playerFieldValue) → score
│       │   · log "Your current score: N"
│       └─ clear generator text fields
└─ game board is now interactive

────────────────────────────────────────────────────────────────────
PER TURN (player clicks "Next turn"):
────────────────────────────────────────────────────────────────────

turn()                               ← onClick="turn()" on Next turn
│ log separator line
│
│ ┌─ CPU 1: cpuTurn(race1, score1, cards1, cardFiles1, cpu1Slots, cpu1Passed)
│ │   · cpuWantsToDraw(score, threshold)?  →  |score| < threshold && score != 0
│ │   if yes:
│ │     · drawFromDeck(deck) → card
│ │     · convert(card), compile(card)
│ │     · placeCard() → first empty slot 2→3→4
│ │     if slot 4 filled: cpu1Passed = 1
│ │   if no: cpu1Passed = 1, log "X passes"
│ │
│ ├─ Player: humanTurn()
│ │   if player has not passed:
│ │     · drawFromDeck(deck) → card
│ │     · placeCard() into player's slot 2→3→4
│ │     if slot 4 filled: disable #turnBtn, passed = 1
│ │
│ ├─ checkBomb()                      ← only for the player
│ │   · score 0 / >23 / <-23  →  alert "You bombed!", disable turn, passed=1, bomb=1
│ │   · score ±23             →  alert "Pure Sabacc!", same
│ │
│ ├─ CPU 2: cpuTurn(race2, score2, cards2, cardFiles2, cpu2Slots, cpu2Passed)
│ │   (same logic as CPU 1)
│ │
│ ├─ cpu1InterAI()
│ │   · scan cpu1's hand for a card in favorites1[]
│ │   · if found and field unused: move it to cpu1's interference field
│ │     (protected from generator swaps)
│ │
│ ├─ cpu2InterAI()                    (same for cpu2)
│ │
│ ├─ generate()                       ← the randomizer pot
│ │   · pick g1 = random card from deck (lookup, not removed)
│ │   · pick g2 = drawFromDeck(deck) (removed), retry if g2 == g1
│ │   · compile(g1) → q1, compile(g2) → q2
│ │   if g1 == g2:
│ │     log "Random generator failed..."
│ │   else:
│ │     log "Random generator replaced card X with Y"
│ │     · swapCardInLocations() for player, cpu1, cpu2
│ │       (replace every occurrence of g1 with g2 in cardFiles[]/cards[])
│ │     re-render any swapped card images
│ │     updateScore()
│ │
│ └─ scrollLog()

────────────────────────────────────────────────────────────────────
PASS (player clicks "Pass"):
────────────────────────────────────────────────────────────────────

pass()                               ← onClick="pass()" on Pass
│ passed = 1
│ do:
│   turn()                           ← keep playing CPUs until both pass
│ while cpu1Passed != 1 OR cpu2Passed != 1
│
│ reveal cpu1 and cpu2 face-down cards
│ recompute scores
│
│ alert round results:
│   "Round over! Results:
│    <race1> <bombed|Pure Sabacc|scored N pts.>
│    <player> <...>
│    <race2> <...>"
│
│ scoreRound()
│   · isIdiotsArray() check for each player (Idiot + 2 + 3 = Pure Sabacc)
│   · evaluateRound(score) for each:
│       bomb           → roundPoints -24, tournamentDelta -24
│       pure sabacc    → roundPoints +24, tournamentDelta +46
│       valid          → roundPoints |score|, tournamentDelta |score|
│   · add tournament deltas to points1/points2/points3
│   · applyLeaderBonus():
│       if no pure sabacc this round:
│         find highest roundPoints scorer
│         if unique: +roundPoints/2 to their tournament total
│         if tied: no bonus
│
│ resetRound()
│   · clear all hands, card files, field values, pass flags, scores
│   · reset race1/race2 to "none" (so opps() re-rolls next round)
│   · rebuild deck = buildDeck()
│   · reset card images to blank/wallp, field images to field.gif
│
│ decideWinner([points1, points2, points3])
│   · find any player > 500
│   · if unique winner: alert "Victory ... went to <name>!", ref() (reload)
│   · if tie at top:    alert "Tie at the top!", ref()
│   · if no winner yet: gamer() → deal next round
│
└─ ref() = self.location.reload()  OR  gamer() = start next round

────────────────────────────────────────────────────────────────────
PLAYER INTERFERENCE FIELD (clicking cards):
────────────────────────────────────────────────────────────────────

moveToField(slotIdx, imgSrc, clickedImgId)   ← onClick on a player card
│ if clicked slot is empty: return (no-op)
│ if player's field is empty:
│   move card value → playerFieldValue
│   move card file → saved, slot cleared
│   render field image with the card, blank the slot
│   remember which slot/element was blanked
│ else:
│   alert "Interference field is occupied!"

retrieveFromField(imgSrc)                     ← onClick on the field image
│ if field is empty:
│   alert "Nothing to put back, try moving it to the interference field first"
│ else:
│   restore the saved card value back to its original slot
│   re-render the slot, reset field image
│   clear playerFieldValue

────────────────────────────────────────────────────────────────────
PURE RULE FUNCTIONS (no DOM access, exported for testing):
────────────────────────────────────────────────────────────────────

· buildDeck()            → 76 card filenames (1-15 x 4 suits + 16 face cards)
· convert(card)          → numeric value (Idiot=0, Queen=±2, ..., Senator=±17)
· compile(card)          → "N of <Suit>" or "<Face> (+/-)" or "Idiot"
· scoreHand(cards, field)→ sum of non-empty slots + field value
· evaluateRound(score)   → { roundPoints, tournamentDelta }
· applyLeaderBonus(pts)  → adjusted tournament points with +best/2 bonus
· decideWinner(points)   → { index, tie, points } for first > 500
· cpuWantsToDraw(score)  → |score| < threshold && score != 0
· pickOpponents()        → two distinct race names
· swapCardInLocations()  → new { locs, cards } with oldCard replaced by newCard
· randomGeneratorStep()  → { swapped, g1, g2, deck } (no card leak)
· rollFavorites()        → 10 random card filenames for CPU field AI
```

## Game loop

### 1. Main menu

The main menu shows five HoMM-style buttons (left-aligned): **Start Game**,
**Settings**, **Hall of Fame**, **Credits**, **Exit Game**.

- **Start Game** launches a tournament immediately.
- **Settings** opens a sub-screen with player name, music toggle, language
  picker, and a "Reset Hall of Fame" button.
- **Hall of Fame** shows the top 10 tournament results (sortable by score,
  rounds, or game time), persisted in `localStorage`.
- **Credits** opens the rolling credits page.
- **Exit Game** attempts to close the tab.

Clicking **Start game** calls `gamer()`, which hides the menu, reveals the
game board, starts the music (if enabled), rolls each CPU's "favorite cards"
list, and deals the opening hands. The game timer starts on first launch.

### 2. Opponent selection

`opps()` picks two distinct CPU races at random from:

| Race | Pass threshold (±) | Behavior |
|------|-------------------|----------|
| Human | 15 | cautious |
| Jedi-Killer | 16 | |
| Gambler | 17 | |
| Smuggler | 18 | |
| Bounty Hunter | 19 | boldest |

The threshold is the |score| at which that CPU stops drawing and passes.
CPU avatars are assigned based on race index (`cpu1.gif` through `cpu5.gif`).

### 3. Dealing

`dealCards()` draws 2 cards each for the player and both CPUs from a
freshly built 76-card deck. The player's cards are face up; CPU cards are
face down (shown as `wallp.gif`). The event log is initialized with the
player's name and a welcome message.

### 4. Turn structure

Each click of **Next turn** runs `turn()`:

1. **CPU 1** draws a card (if it hasn't passed and |score| < threshold)
2. **Player** draws a card into their first empty slot (2 → 3 → 4)
3. **CPU 2** draws a card (same logic as CPU 1)
4. **CPU interference-field AI** runs for both CPUs (`cpu1InterAI()`,
   `cpu2InterAI()`) — each CPU moves a card to its interference field if
   that card matches its pre-rolled favorites list
5. **Generator** fires (`generate()`) — see below
6. **Bomb check** runs for the player (`checkBomb()`)

A CPU automatically passes when its 5th card slot fills or its |score|
reaches its threshold. The player auto-passes when their 5th slot fills,
or can click **Pass** at any time.

### 5. The generator (randomizer pot)

After every turn, the random generator picks two cards (g1, g2) from the
deck. If they differ, every player who holds g1 has it replaced with g2 —
across all 5 slots and the interference field. If g1 == g2 the generator
"fails" and nothing happens. The swap is logged and shown in the two
generator text fields at the top of the board.

### 6. Interference field

Each player has an interference field that holds one card. A card in the
field still counts toward the hand's score but is protected from the
generator's swaps.

- **Player**: click a card to move it to your field
  (`moveToField()`); click your field image to retrieve it
  (`retrieveFromField()`). Only one card at a time.
- **CPUs**: automatically move a favorite card to their field when one
  appears in their hand (`cpuInterAI()`).

### 7. Passing and round end

When the player clicks **Pass**, `pass()` runs:

1. Sets `passed = 1` and keeps calling `turn()` until both CPUs have passed
2. Reveals both CPUs' face-down cards
3. Shows an alert with each player's round result
4. Calls `scoreRound()` to update tournament points
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

### 9. Tournament win

Tournament points accumulate across rounds. The first player to exceed
**500** points wins. If two players cross 500 in the same round, the
higher total wins; an exact tie triggers a tie message.

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

## Project structure

```
index.html          Game page (start screen + game board)
credits.html        Rolling end-credits screen with music
src/
  game.js           Game logic (pure rules + DOM coupling)
  style.css         Layout and theming
  i18n/
    loader.js       i18n registry + window.STR accessor
    init.js         Language picker + DOM [data-i18n] applier
    en.js           English (🇬🇧)
    ru.js           Russian (🇷🇺 Русский)
    es.js           Spanish (🇪🇸 Español)
    fr.js           French (🇫🇷 Français)
    de.js           German (🇩🇪 Deutsch)
    pl.js           Polish (🇵🇱 Polski)
    it.js           Italian (🇮🇹 Italiano)
    pt.js           Portuguese (🇵🇹 Português)
    ja.js           Japanese (🇯🇵 日本語)
    zh.js           Simplified Chinese (🇨🇳 简体中文)
assets/
  cards/            76 card faces + blank.gif + field.gif + wallp.gif
  audio/            cantina.mp3 (in-game) + credits.mp3 (credits screen)
  avatars/          CPU race avatars (cpu1-5.gif) + default.gif + blank.gif
  images/           bg.jpg (starfield) + table.jpg (felt) + bith.jpg (log bg)
  ui/               gb.gif, ib.gif, back3.gif, generator.gif (panels)
test/
  rules.test.js     Unit tests (run with `node --test`)
analysis.md         Original 2005 code analysis and bug inventory
```

## Credits

- **Idea**: Revan (revan1@mail.ru)
- **Code**: Revan (revan1@mail.ru)
- **Testing & debugging**: Revan
- **Graphics**: Darth Favourite (favourite_2003@mail.ru)
- **Music**: Mark Griskey (KOTOR II: Iziz Cantina) / John Williams (Star Wars: End Credits)
- **Thanks**: James Luceno, for the book *Agents of Chaos I: Hero's Trial*
- **Special thanks**: Denis Konstantin (Sabacc Tour table)
- **And also**: George Lucas, for the *Star Wars* saga; Microsoft, for Notepad

All rights, design, etc. belong to Lucasfilm, Ltd. Star Wars and related
marks are trademarks of Lucasfilm.