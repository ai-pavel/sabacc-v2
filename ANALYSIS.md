# Sabacc Tournament — Code Analysis

## Overview
A 3-player Sabacc tournament game (you + 2 CPU opponents) implemented as a single HTML page with a 1387-line `program.js`. Built in 2005 by "Revan/Darth Favourite" using Notepad, packaged with Natata eBook Compiler. Text is windows-1251 Russian.

## Reverse-Engineered Rules

### The Deck (76 cards, 4 "suits": c/f/p/s)
- **Numbered 1–15** in 4 suits = 60 cards, value = face value
- **Face cards** (16 cards, each has ±value pairs):

  | Code | Name | Value |
  |------|------|-------|
  | i1/i2 | Idiot | 0 |
  | q1/q2 | Queen | +2 / −2 |
  | e1/e2 | Endurance | +6 / −6 |
  | b1/b2 | Balance | +8 / −8 |
  | d1/d2 | Duelist | +11 / −11 |
  | c1/c2 | Commander | +13 / −13 |
  | a1/a2 | Ace | +15 / −15 |
  | s1/s2 | Senator | +17 / −17 |

### Goal
Reach a hand total closest to **±23** without bombing. Sign is irrelevant for scoring — |23| is best.

### Hand evaluation (`scheck`, `gamescr`)

  | Score | Result | Round points |
  |-------|--------|-------------|
  | 0, >23, <−23 | **Bomb** | −24 |
  | exactly ±23 | **Pure Sabacc** | +46 |
  | 1…22 or −22…−1 | valid | +|score|, plus +|score|/2 bonus if you're the round leader |

### Round flow
1. Each player is dealt 2 cards (yours face up, CPUs face down).
2. Each **turn**: CPUs auto-draw 1 card (into slots 2→3→4) unless they've passed; you draw 1 by clicking "След. ход". Then a **randomization generator** fires: two random cards are picked; if they differ, every player who holds the first card has it replaced by the second.
3. You may move one of your cards to the **interference field** (click it) — it still counts toward your score but is protected from the generator. Click the field to retrieve it.
4. CPUs automatically protect a card if it matches their pre-rolled "favorite" list.
5. You click **"Пас"** to stand. The CPUs keep drawing until they pass or fill their 5th slot.
6. Highest |score| (≤23) wins the round; points accumulate. First to **>500** wins the tournament.

### CPU opponents (5 races, randomly chosen)

  | Race | Pass threshold (±) | Behavior |
  |------|-------------------|----------|
  | Человек (Human) | 15 | cautious |
  | Джедай-убийца (Jedi-Killer) | 16 | |
  | Азартный (Gambler) | 17 | |
  | Контрабандист (Smuggler) | 18 | |
  | Охотник за головами (Bounty Hunter) | 19 | boldest |

CPU "AI" is just: keep drawing while `|score| < limit`, otherwise pass. They pass automatically when their 5th slot fills.

---

## Bugs & Issues

### Critical / gameplay-affecting

**1. Broken deck — Endurance −6 (e2.jpg) is missing from play.** `program.js:26,27,28,910,911`
The deck arrays `ac`, `as`, `favc` all contain `"e1.jpg", "e1.jpg"` where the second should be `"e2.jpg"`. So there are **two Endurance +6** cards and **zero Endurance −6** cards. The same typo is re-introduced in `nullifier()` when resetting the deck, so the bug persists every round.

**2. `pass()` loop exits too early — one CPU may not finish their turn.** `program.js:152`
```js
do { turn() } while (pas1 != 1 && pas2 != 1)
```
With `&&`, the loop stops as soon as **either** CPU passes. The other CPU may be left mid-hand. Should almost certainly be `||` (keep going while **neither** has passed).

**3. Tournament win logic is broken — tiebreakers are dead code.** `program.js:163-173`
```js
if (points1 <= 500 && points2 <= 500 && points3 <= 500) { gamer() }
else if (points1 > 500) { /* cpu1 wins */ }
else if (points2 > 500) { /* cpu2 wins */ }
else if (points3 > 500) { /* human wins */ }
else if (points1 > 500 && points2 > 500 && points1 > points2) { ... }   // unreachable
...
```
If two players cross 500 in the same round, the first single-winner branch (`points1 > 500`) fires and declares CPU1 the winner **regardless of score**. The 6 "tiebreaker" branches below can never execute. Additional typos in the dead code:
- Line 170: `points2 > 500 && points2 > 500` (should be `points2 && points3`)
- Lines 171 & 172 are **duplicate conditions** (`points1 > 500 && points3 > 500 && points1 < points3`) but print different winners
- Line 173 `else` ("everyone won") is unreachable

**4. The generator leaks cards out of the game.** `program.js:1183-1198, 1200-1303`
- `g2 = randomize(g2)` removes g2 from `ac` **before** the equality check. If `g1 == g2` ("generator failed"), a card is destroyed for nothing.
- On a successful swap, the swapped-out card (g1) is **not returned** to `ac`. The deck shrinks by 1 per generation. Within a single round (≤76 cards, ~15 drawn + ~8 leaked) this is survivable only because `nullifier()` rebuilds the deck each round — but it's still wrong and means the generator can fail by picking an already-removed card.

**5. The Idiot (value 0) is a pure liability.** `program.js:993, 33`
A hand summing to 0 counts as a **bomb** (`score == 0` in `scheck`). Since the Idiot contributes 0, it can only ever drag you toward bombing, and there's no "Idiot's Array" combo rule (Idiot + 2 + 3 = 23) from real Sabacc to compensate. The card is never beneficial.

### Modern-browser incompatibilities

**6. `<bgsound>` is IE-only.** `INDEX.HTM:67`
The music (`cantina.mp3`) won't play in any modern browser. Needs an `<audio>` element. Same for `AUTORS.HTM:43`.

**7. File-input avatar won't load.** `program.js:257`
`document.getElementById("ava").value` returns a fake `C:\fakepath\...` path in modern browsers. The avatar feature is broken outside old IE.

**8. Encoding depends on the meta tag being honored.** All files are windows-1251. Opening via `file://` usually works because of the `<meta>` tag, but serving over HTTP without `Content-Type: charset=windows-1251` will garble the Russian text.

### Logic / correctness

**9. `interac()` guard has a subtle but harmless precedence quirk.** `program.js:1309`
```js
if (doom == "cart2" && cards[2] == 20 || doom == "cart3" && cards[3] == 20 || ...)
```
Due to `&&` binding tighter than `||`, this parses correctly as three `(doom==X && cards[X]==20)` clauses — but it's fragile and should have explicit parens. It also doesn't guard slots 0/1 (always filled, so currently safe).

**10. `cards[e] = 0` in `interac` is always executed.** `program.js:1313`
```js
inter = cards[e]
if (cards[e] == inter) { cards[e] = 0 }   // condition is always true
```
Dead conditional — `cards[e]` was just assigned to `inter` one line above.

**11. Human's `pas` is never set when slot 4 fills.** `program.js:104-109`
Filling the 5th slot disables the "След. ход" button but doesn't set `pas = 1`. The player must still click "Пас" to end the round. Not strictly a bug, but inconsistent with the CPUs (who auto-pass on slot 4) and confusing.

**12. `scheck()` can fire a "you bombed" alert during a CPU's turn.** `program.js:84, 147`
`turn()` calls `scheck()` unconditionally (it only guards against `bomb == 1` repeats, not against firing during the `pass()` do-while loop). The human can get an alert popup while the CPUs are still resolving.

**13. `race1`/`race2` are never reset.** `program.js:11, 898`
`nullifier()` doesn't reset the race variables, so `opps()` (called from `clearlog()`) silently no-ops every subsequent round. Opponents stay the same for the entire tournament. Likely intentional, but the code structure (resetting everything else in `nullifier`) suggests it's an oversight.

**14. Implicit globals.** `aiscore()` (`program.js:343-358`) declares `pts1`/`pts2` without `var`; `generate()` declares `g1,g2,f1,f2,q1,q2,genlog` without `var`. They leak to `window`. Not a runtime bug but a landmine for any future maintenance.

**15. `convert()` and `compile()` are 76-way if/else chains.** `program.js:962-1179`
~200 lines that could be a 76-entry lookup object. Pure maintainability issue.

**16. `randomize()` is O(∞) in the worst case.** `program.js:377-535`
As cards get marked `"0"`, it retries random indices until it hits a live one. Near the end of a long round this gets slow; if the deck were ever fully depleted it would **hang the browser**. Saved only by `nullifier()` rebuilding the deck each round.

**17. `compile()` handles `e2.jpg` even though it can never appear** (see bug #1) — dead branch at `program.js:1000-1001`.

**18. `AUTORS.HTM` credits script has a self-comparison bug.** `AUTORS.HTM:33`
```js
if (a==38) b-=2,ob+=1; if (ob==9) { ob=1; ... }
```
`b` starts at 1, flips between 1 and −1 via `b-=2` / `b+=2`, so `a` oscillates 0→38→0. Works as a strobe effect, but `window.offsetWidth = 205` on line 13 throws in strict browsers (offsetWidth is read-only) — silently ignored in IE. Minor.

### Design notes (not bugs)
- No special hands (Idiot's Array, Sabacc Shift, etc.) — only Pure Sabacc / valid / bomb.
- The generator affecting all players simultaneously is a faithful Sabacc "randomizer pot" mechanic.
- Score 0 = bomb is a house rule; canonical Sabacc usually allows 0.

### Quick patch priorities if you want to revive it
1. Fix `e1.jpg/e2.jpg` in all five deck-array definitions (lines 26, 27, 28, 910, 911).
2. Change `pass()`'s `&&` to `||` on line 152.
3. Rewrite the win-condition block (lines 163–173) as a single `max()` check.
4. Replace `<bgsound>` with `<audio autoplay loop>` and the file-input avatar with a URL/preset picker.
5. Optionally: return swapped-out cards to `ac` in `generate()` so the generator doesn't leak cards.