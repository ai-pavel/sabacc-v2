# Changelog

Major changes since the 2005 original.

## Gameplay (9)

1. **Configurable CPU count** — 1–4 opponents (was fixed 2), human seated in the middle
2. **CPU personalities** — bluffer / folder / risk-taker / normal, randomly assigned per CPU
3. **Configurable win threshold** — 100 / 500 / 1000 / 2500 / 5000 (was fixed 500)
4. **Tournament standings panel** — live scoreboard under avatars (was text in event log)
5. **Win / Lose / Tie screen** — dedicated end screen with stats, replacing toast + page reload
6. **Pure Sabacc counter** — tracked across the tournament, shown on end screen and Hall of Fame
7. **Idiot's Array feedback** — celebratory toast + sound when the player assembles Idiot + 2 + 3
8. **"Draw Card" button** — renamed from "Next Turn" for clarity
9. **Esc key** — returns to main menu mid-game, auto-saves state

## UI (9)

1. **HoMM-style main menu** — seven left-aligned buttons with emoji prefixes (Continue, Start Game, Settings, Game Rules, Hall of Fame, Credits, Exit Game)
2. **Settings screen** — player name, music toggle, music volume, SFX toggle, win threshold, CPU count, language picker, reset Hall of Fame, clear save
3. **Game Rules screen** — scrollable dark panel with full rules (deck, scoring, generator, interference field, tournament)
4. **Hall of Fame** — top 10 victories in localStorage, sortable by score / rounds / pure sabaccs / game time
5. **Credits screen** — rolling animation (45s) with music, integrated into index.html (no separate page)
6. **Intro video** — autoplay with skip button, auto-dismiss after 6 seconds, music starts on dismiss
7. **Continue button** — appears on main menu when a saved game exists (▶️ emoji prefix)
8. **Toast notifications** — replaced browser alerts for bomb / pure sabacc / round results
9. **Drag-and-drop** — for the player's interference field (replaced click-to-move)

## Audio (5)

1. **Sound effects** — synthesized via Web Audio API (card draw, CPU draw, generator swap, bomb, pure sabacc, Idiot's Array, pass, deal)
2. **Independent SFX toggle** — separate from music toggle, persisted in localStorage
3. **Background music volume** — slider in Settings, applied to both in-game cantina and credits music
4. **Cantina in main menu** — music plays on the main menu, pauses during credits, resumes on return
5. **Remixed cantina music** — modern version of the original cantina track

## Animations (3)

1. **Card slide-in** — drawn cards animate from above with scale
2. **Card flip reveal** — CPU face-down cards flip when revealed at round end
3. **Card glow** — generator-swapped cards pulse with golden glow

## Internationalization (6)

1. **10 languages** — English, Russian, Spanish, French, German, Polish, Italian, Portuguese, Japanese, Chinese
2. **Language picker** in Settings, persisted in localStorage, applies on the fly
3. **All human-facing strings** extracted to `src/i18n/*.js` locale files
4. **CPU opponent names** translate with locale (via `i18n.onLocaleChange` hook)
5. **Localized card names** — face cards and suits translate with locale (compile() reads STR live)
6. **Localized credits** — all credit panels translated in each locale

## Architecture (10)

1. **Separation of concerns** — pure rules in `src/rules.js`, DOM/UI in `src/game.js`
2. **`players[]` array** — replaced all numbered globals (`cards1`, `score1`, `points1`, etc.)
3. **Dynamic board builder** — `buildGameBoard()` generates all seat DOM from templates
4. **`generatorSwap()`** — generalized to accept any number of hands
5. **`pickOpponents()`** — Fisher-Yates shuffle for N distinct races
6. **`cpuWantsToDraw()`** — accepts personality parameter for varied AI behavior
7. **Game state save/load** — auto-save after each turn, Continue button on main menu, clear save in Settings
8. **Settings persistence** — player name, music, SFX, volume, win threshold, CPU count, language all in localStorage
9. **Inter font** replaced Palatino Linotype across the UI
10. **Renamed** `program.js` → `rules.js` + `game.js`, `credits.html` merged into `index.html`