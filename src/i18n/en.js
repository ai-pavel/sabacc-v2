// English — canonical locale. Other locales translate this file verbatim.
;(function (i18n) {
  i18n.register("EN", {
    __label: "🇬🇧 English",

    // ---- Card names ---------------------------------------------------
    suits: {
      c: "Coins",
      f: "Flasks",
      p: "Sabers",
      s: "Staves",
    },
    faceCards: {
      i: "Idiot",
      q: "Queen of Madness",
      e: "Endurance",
      b: "Balance",
      d: "Duelist",
      c: "Commander",
      a: "Ace",
      s: "Senator",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "Empty!",

    // ---- Players ------------------------------------------------------
    cpuRaces: [
      "Human",
      "Jedi-Killer",
      "Gambler",
      "Smuggler",
      "Bounty Hunter",
    ],
    defaultPlayerName: "Player",

    // ---- UI: start screen ---------------------------------------------
    ui: {
      title: "Sabacc of Coruscant",
      copyright: "Sabacc of Coruscant \u00A9 2005",
      yourName: "Your name:",
      enableMusic: "Enable music?",
      sfxLabel: "Sound effects?",
      musicVolume: "Music volume:",
      startGame: "\uD83C\uDFB2 Start Game",
      continue: "▶️ Continue",
      settings: "\u2699\uFE0F Settings",
      hallOfFame: "\uD83C\uDFC6 Hall of Fame",
      credits: "\uD83C\uDFAC Credits",
      exitGame: "\uD83D\uDEAA Exit Game",
      skip: "Skip",
      language: "Language:",
      settingsTitle: "Settings",
      resetHoF: "Reset Hall of Fame",
      clearSave: "Clear Save",
      back: "Back",
      hallOfFameTitle: "Hall of Fame",
      winThreshold: "Points to win:",
      cpuCount: "CPU opponents:",
      musicOn: "On",
      musicOff: "Off",
      sfxOn: "On",
      sfxOff: "Off",
      rules: "\uD83D\uDCDC Game Rules",
      rulesTitle: "Rules of Sabacc",
      difficultyTitle: "Choose Your Path",
      rulesetTitle: "Choose Your Sabacc Variant",
      mainMenu: "Main Menu",
      playAgain: "Play Again",
    },

    // ---- End screen (win / lose / tie) -------------------------------
    end: {
      victory: "Victory!",
      defeat: "Defeat",
      tie: "Tournament Tie!",
      victoryEmoji: "\uD83C\uDFC6",
      defeatEmoji: "\uD83D\uDD1B",
      tieEmoji: "\uD83E\uDDF1",
      youWin: "You won the tournament!",
      youLose: "{name} won the tournament.",
      tieMessage: "The tournament ended in a tie!",
      yourScore: "Your score: {score}",
      rounds: "Rounds played: {rounds}",
      gameTime: "Game time: {time}",
      pureSabaccs: "Pure Sabaccs: {count}",
    },

    // ---- Hall of Fame -------------------------------------------------
    hof: {
      rank: "Rank",
      name: "Player",
      score: "Score",
      rounds: "Rounds",
      pureSabaccs: "Pure Sabaccs",
      difficulty: "Difficulty",
      time: "Game Time",
      empty: "No records yet — play a game!",
      resetConfirm: "Are you sure you want to reset the Hall of Fame?",
    },

    // ---- Rules text (HTML) -------------------------------------------
    rules: {
      html:
        "<h3>Goal</h3>" +
        "<p>Be the first player to exceed the tournament point threshold (default 500). " +
        "You play against 4 CPU opponents at the same table.</p>" +

        "<h3>The deck</h3>" +
        "<p>The 76-card deck has four suits — Coins, Flasks, Sabers, Staves — " +
        "each with numbered cards 1–15. In addition there are 16 face cards " +
        "(8 names, each with a positive and negative variant):</p>" +
        "<table>" +
        "<tr><th>Card</th><th>Value</th></tr>" +
        "<tr><td>Idiot</td><td>0</td></tr>" +
        "<tr><td>Queen of Madness</td><td>+2 / −2</td></tr>" +
        "<tr><td>Endurance</td><td>+6 / −6</td></tr>" +
        "<tr><td>Balance</td><td>+8 / −8</td></tr>" +
        "<tr><td>Duelist</td><td>+11 / −11</td></tr>" +
        "<tr><td>Commander</td><td>+13 / −13</td></tr>" +
        "<tr><td>Ace</td><td>+15 / −15</td></tr>" +
        "<tr><td>Senator</td><td>+17 / −17</td></tr>" +
        "</table>" +

        "<h3>Hand score</h3>" +
        "<p>Your hand score is the sum of all card values (including the card " +
        "in your interference field). The absolute value matters — +15 and −15 " +
        "are both 15 points from zero.</p>" +

        "<h3>Round results</h3>" +
        "<ul>" +
        "<li><b>Bomb</b> — score of 0, above +23, or below −23. You lose 24 points.</li>" +
        "<li><b>Pure Sabacc</b> — exactly +23 or −23. You score 24 round points " +
        "and 46 tournament points.</li>" +
        "<li><b>Idiot's Array</b> — Idiot (0) + 2 + 3 = 23. Counts as Pure Sabacc.</li>" +
        "<li><b>Valid</b> — any score from ±1 to ±22. You score |score| points.</li>" +
        "</ul>" +
        "<p>The round leader (highest scorer when nobody hit Pure Sabacc) gets " +
        "a bonus of +half their round points. Ties for highest get no bonus.</p>" +

        "<h3>The generator (randomizer pot)</h3>" +
        "<p>After every turn the random generator picks two cards from the deck. " +
        "If they differ, every player who holds the first card has it replaced " +
        "with the second — across all hand slots and the interference field. " +
        "If the two cards match, the generator fails and nothing happens.</p>" +
        "<p>The two display fields at the top of the board show the card being " +
        "replaced (left) and its replacement (right).</p>" +

        "<h3>Interference field</h3>" +
        "<p>Each player has one interference field slot. A card placed there " +
        "still counts toward your hand score but is <b>protected</b> from the " +
        "generator's swaps. Only one card at a time may occupy the field.</p>" +
        "<p><b>You:</b> drag a card to your field to protect it; click the field " +
        "to retrieve it.</p>" +
        "<p><b>CPU opponents:</b> automatically move a favorite card to their " +
        "field when one appears in their hand.</p>" +

        "<h3>Tournament</h3>" +
        "<p>Tournament points accumulate across rounds. The first player to " +
        "exceed the threshold (configurable in Settings: 500, 1000, 2500, or 5000) " +
        "wins. If two players cross the threshold in the same round, the higher " +
        "total wins; an exact tie triggers a draw.</p>",
      traditional:
        "<h3>Goal</h3>" +
        "<p>Be the first player to exceed the tournament point threshold. " +
        "You play against CPU opponents at the same table.</p>" +
        "<h3>The deck</h3>" +
        "<p>76 cards: 1-15 in four suits plus 16 face cards (8 names x +/-).</p>" +
        "<h3>Goal</h3><p>Get closest to +/-23. Idiot + 2 + 3 = Idiot's Array (Pure Sabacc).</p>" +
        "<h3>Generator</h3><p>Picks 2 cards each turn; replaces the first with the second across all hands.</p>" +
        "<h3>Interference field</h3><p>Protects 1 card from the generator.</p>",
      spike:
        "<h3>Corellian Spike</h3>" +
        "<p>A faster variant with a smaller deck and dice instead of a card generator.</p>" +
        "<h3>The deck</h3>" +
        "<p>42 cards: four suits with values 1-10, plus 2 Idiot cards (value 0).</p>" +
        "<h3>Goal</h3><p>Get as close to <b>0</b> as possible (not 23).</p>" +
        "<h3>Dice</h3><p>After every turn, two dice are rolled. <b>Doubles</b> shift all cards (random swap). No doubles = nothing happens.</p>" +
        "<h3>Scoring</h3><p>Score 0 = Pure Sabacc (+60 pts). Bomb if too far from 0. Otherwise |score| pts.</p>" +
        "<h3>No interference field</h3><p>No field protection in this variant.</p>",
      gungan:
        "<h3>Otoh Gunga (Gungan Sabacc)</h3>" +
        "<p>A variant where <b>low scores prevail</b>.</p>" +
        "<h3>The deck</h3><p>Standard 76-card deck.</p>" +
        "<h3>Goal</h3><p>Get closest to <b>0</b>. Lowest |score| wins the round. Score 0 = Pure Sabacc.</p>" +
        "<h3>Generator</h3><p>Still active, same as Traditional.</p>" +
        "<h3>Interference field</h3><p>Available, same rules as Traditional.</p>" +
        "<h3>Scoring</h3><p>Score 0 = Pure Sabacc (+46 pts). All other scores give |score| pts.</p>",
    },

    // ---- UI: game screen ---------------------------------------------
    uiGame: {
      interferenceField: "Interference field",
      fieldHint: "Drag a card here to protect it",
      nextTurn: "Draw Card",
      pass: "Pass",
      youAlt: "You",
      cpu1Alt: "CPU 1",
      cpu2Alt: "CPU 2",
      generatorAlt: "generator",
      tournamentTitle: "Tournament",
      tournamentPoints: "pts",
    },

    // ---- Event log ----------------------------------------------------
    log: {
      welcome: "{name}, good luck and don't get cocky!",
      roundHeader: "Round {n}",
      yourScore: "- Your current score: {score}",
      opponents: "- Your opponents are {names}",
      firstPair: "- Your first pair has been dealt",
      youDrew: '- You drew card "{card}"',
      cpuDrew: '- {race} drew card "{card}"',
      cpuPasses: "- {race} passes",
      cpuPassesDeckDepleted: "- {race} passes (deck depleted)",
      deckDepletedNoDraw: "- Deck depleted \u2014 no more draws",
      generatorReplaced: '- Random generator replaced card "{g1}" with "{g2}"',
      generatorDeckDepleted: "- Random generator: deck depleted",
      separator: "***********************************************************",
    },

    // ---- Toast notifications ------------------------------------------
    toast: {
      bomb: "You bombed!",
      pureSabacc: "Pure Sabacc!",
      idiotsArray: "Idiot's Array!",
      fieldOccupied: "Interference field is occupied!",
      nothingToRetrieve: "Nothing to put back \u2014 move a card to the field first",
      roundOver: "Round over! {list}",
      tie: "Tournament ends in a tie!",
      winner: "{name} wins the tournament!",
      saveCleared: "Save cleared",
    },

    roundResult: {
      bomb: " bombed :(",
      pureSabacc: " Pure Sabacc!",
      valid: " scored {points} pts.",
    },

    // ---- Ruleset variants ----
    ruleset: {
      traditional: "Traditional Sabacc",
      traditionalDesc: "76-card deck, target +/-23, generator, interference field",
      spike: "Corellian Spike",
      spikeDesc: "42-card deck, target 0, dice replace generator, doubles shift cards",
      gungan: "Otoh Gunga",
      gunganDesc: "Standard deck, lowest score wins, closest to 0 is best",
    },

    // ---- Difficulty presets ----
    difficulty: {
      youngling: "🟢 Youngling",
      younglingDesc: "Training at the Jedi Temple - 1 normal opponent, quick games",
      padawan: "🔵 Padawan",
      padawanDesc: "Learning the ways of the Force - 2 cautious opponents",
      knight: "🟡 Knight",
      knightDesc: "A Jedi Knight seeks not these things - 3 mixed opponents",
      sithlord: "🔴 Sith Lord",
      sithlordDesc: "The dark side of the Force - 4 aggressive opponents, long run",
      grandmaster: "⚔️ Grand Master",
      grandmasterDesc: "Size matters not - 4 reckless opponents, marathon",
    },


    // ---- Round summary ----
    roundSummary: {
      title: "Round Results",
      continue: "Continue",
      hand: "Hand",
      result: "Result",
    },


    // ---- Image alt-text -----------------------------------------------
    alt: {
      yourField: "Your interference field",
      opponentField: "Opponent's interference field",
      cardToYourField: "{card} -> interference field",
      cardToOpponentField: "{card} -> opponent's interference field",
    },

    // ---- Credits (HTML) ----------------------------------------------
    credits: {
      html:
        '<div class="panel">All rights, design, etc. belong<br>to Lucasfilm, Ltd<br><br><b>Lucasfilm. Ltd</b><br><br><span class="small">All rights reserved</span></div>' +
        '<div class="panel">Idea<br>by<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Code<br>by<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Testing and debugging<br>by<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Graphics<br>by<br><br><b>Darth Favourite</b><br><br><span class="small">favourite_2003@mail.ru<br>ICQ#: 297-600-992</span></div>' +
        '<div class="panel">Music<br>by<br><br><b>Mark Griskey</b><br><span class="small">(The Sith Lords: Iziz Cantina)</span><br>&amp;<br><b>John Williams</b><br><span class="small">(Star Wars: End Credits)</span></div>' +
        '<div class="panel">Thanks<br><br><b>James Luceno</b><br><br><span class="small">for the book "Agents of Chaos I:<br>Hero\'s Trial"</span></div>' +
        '<div class="panel">And also<br><br><b>George Lucas</b><br><br><span class="small">for the magnificent<br>"Star Wars" saga</span></div>' +
        '<div class="panel">Special thanks<br><br><b>Denis Konstantin</b><br><br><span class="small">for help with<br>the "Sabacc Tour" table</span></div>' +
        '<div class="panel">Packaged with<br><br><b><a href="https://web.archive.org/web/20021123121929/http://natata.hn3.net/" target="_blank">Natata eBook Compiler</a></b><br><br><span class="small">the original 2005 .exe was built with</span></div>' +
        '<div class="panel">And also <b>Microsoft</b><br><br><b>for Notepad</b><br><br><span class="small">and for not crashing... =)</span></div>',
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);