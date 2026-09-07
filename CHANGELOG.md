# Changelog

Major changes since the 2005 original.

## Major Features (17)

1. **Difficulty presets** — 5 Star Wars-themed levels (Youngling / Padawan / Knight / Sith Lord / Grand Master) with varying CPU count, personalities, and win threshold
2. **CPU personalities** — bluffer / folder / risk-taker / normal, randomly assigned per CPU per difficulty
3. **Tournament standings panel** — live scoreboard under avatars (was text in event log)
4. **Win / Lose / Tie screen** — dedicated end screen with stats, replacing toast + page reload
5. **Round summary overlay** — shows all hands/scores before advancing to next round
6. **Hall of Fame** — top 10 victories in localStorage, sortable by score / rounds / pure sabaccs / difficulty / game time
7. **Game state save/load** — auto-save after each turn, Continue button on main menu, clear save in Settings
8. **HoMM-style main menu** — left-aligned buttons with emoji prefixes (Continue, Start Game, Settings, Game Rules, Hall of Fame, Credits, Exit Game)
9. **Settings screen** — language, player name, SFX toggle, music toggle, music volume, reset Hall of Fame, clear save
10. **Game Rules screen** — scrollable dark panel with full rules (deck, scoring, generator, interference field, tournament)
11. **Credits screen** — rolling animation (45s) with music, integrated into index.html (no separate page)
12. **Intro video** — autoplay with skip button, auto-dismiss after 6 seconds, music starts on dismiss
13. **Sound effects** — synthesized via Web Audio API (card draw, CPU draw, generator swap, bomb, pure sabacc, Idiot's Array, pass, deal)
14. **10 languages** — English, Russian, Spanish, French, German, Polish, Italian, Portuguese, Japanese, Chinese
15. **Card animations** — slide-in on draw, flip on reveal, golden glow on generator swap
16. **Drag-and-drop** — for the player's interference field (replaced click-to-move)
17. **Remixed cantina music** — modern version of the original cantina track

## Improvements (12)

1. **Pure Sabacc counter** — tracked across the tournament, shown on end screen and Hall of Fame
2. **Idiot's Array feedback** — celebratory toast + sound when the player assembles Idiot + 2 + 3
3. **Esc key** — returns to main menu mid-game, auto-saves state
4. **"Draw Card" button** — renamed from "Next Turn" for clarity
5. **Continue button** — appears on main menu when a saved game exists (▶️ emoji prefix)
6. **Toast notifications** — replaced browser alerts for bomb / pure sabacc / round results
7. **Independent SFX toggle** — separate from music toggle, persisted in localStorage
8. **Background music volume** — slider in Settings, applied to both in-game cantina and credits music
9. **Cantina in main menu** — music plays on the main menu, pauses during credits, resumes on return
10. **Language picker** in Settings, persisted in localStorage, applies on the fly
11. **Inter font** replaced Palatino Linotype across the UI
12. **Separation of concerns** — pure rules in `src/rules.js`, DOM/UI in `src/game.js`

## Architecture Refactoring (8)

1. **`players[]` array** — replaced all numbered globals (`cards1`, `score1`, `points1`, etc.)
2. **Dynamic board builder** — `buildGameBoard()` generates all seat DOM from templates
3. **`generatorSwap()`** — generalized to accept any number of hands
4. **`pickOpponents()`** — Fisher-Yates shuffle for N distinct races
5. **`cpuWantsToDraw()`** — accepts personality parameter for varied AI behavior
6. **Settings persistence** — player name, music, SFX, volume, language all in localStorage
7. **Renamed** `program.js` → `rules.js` + `game.js`, `credits.html` merged into `index.html`
8. **Difficulty presets architecture** — `DIFFICULTY_PRESETS` in rules.js drives CPU count, personality pool, and win threshold