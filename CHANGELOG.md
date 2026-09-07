# Changelog

Major changes since the 2005 original.

## Gameplay

- **4 CPU opponents** (up from 2) — 5 players total, human seated in the middle
- **Configurable win threshold** — 100 / 500 / 1000 / 2500 / 5000 (was fixed 500)
- **Tournament standings panel** — live scoreboard under avatars (was text in event log)
- **Win / Lose / Tie screen** — dedicated end screen with stats, replacing toast + page reload
- **Pure Sabacc counter** — tracked across the tournament, shown on end screen and Hall of Fame

## UI

- **HoMM-style main menu** — six left-aligned buttons with emoji prefixes (Start Game, Settings, Game Rules, Hall of Fame, Credits, Exit Game)
- **Settings screen** — player name, music toggle, win threshold, language picker, reset Hall of Fame
- **Game Rules screen** — scrollable dark panel with full rules (deck, scoring, generator, interference field, tournament)
- **Hall of Fame** — top 10 victories in localStorage, sortable by score / rounds / pure sabaccs / game time
- **Credits screen** — rolling animation with music, integrated into index.html (no separate page)
- **Intro video** — autoplay with skip button, auto-dismiss after 6 seconds
- **Toast notifications** — replaced browser alerts for bomb / pure sabacc / round results
- **Drag-and-drop** — for the player's interference field (replaced click-to-move)

## Internationalization

- **10 languages** — English, Russian, Spanish, French, German, Polish, Italian, Portuguese, Japanese, Chinese
- **Language picker** in Settings, persisted in localStorage, applies on the fly
- **All human-facing strings** extracted to `src/i18n/*.js` locale files
- **CPU opponent names** translate with locale (via `i18n.onLocaleChange` hook)

## Architecture

- **`players[]` array** — replaced all numbered globals (`cards1`, `score1`, `points1`, etc.)
- **Dynamic board builder** — `buildGameBoard()` generates all seat DOM from templates
- **`generatorSwap()`** — generalized to accept any number of hands
- **`pickOpponents()`** — Fisher-Yates shuffle for N distinct races
- **Settings persistence** — player name, music, win threshold, language all in localStorage
- **Inter font** replaced Palatino Linotype across the UI
