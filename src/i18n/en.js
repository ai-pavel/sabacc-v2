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
      startGame: "\uD83C\uDFB2 Start Game",
      settings: "\u2699\uFE0F Settings",
      hallOfFame: "\uD83C\uDFC6 Hall of Fame",
      credits: "\uD83C\uDFAC Credits",
      exitGame: "\uD83D\uDEAA Exit Game",
      skip: "Skip",
      language: "Language:",
      settingsTitle: "Settings",
      resetHoF: "Reset Hall of Fame",
      back: "Back",
      hallOfFameTitle: "Hall of Fame",
      winThreshold: "Points to win:",
      musicOn: "On",
      musicOff: "Off",
      rules: "\uD83D\uDCDC Game Rules",
      rulesTitle: "Rules of Sabacc",
    },

    // ---- Hall of Fame -------------------------------------------------
    hof: {
      rank: "Rank",
      name: "Player",
      score: "Score",
      rounds: "Rounds",
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
    },

    // ---- UI: game screen ---------------------------------------------
    uiGame: {
      interferenceField: "Interference field",
      fieldHint: "Drag a card here to protect it",
      nextTurn: "Next turn",
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
      fieldOccupied: "Interference field is occupied!",
      nothingToRetrieve: "Nothing to put back \u2014 move a card to the field first",
      roundOver: "Round over! {list}",
      tie: "Tournament ends in a tie!",
      winner: "{name} wins the tournament!",
    },

    roundResult: {
      bomb: " bombed :(",
      pureSabacc: " Pure Sabacc!",
      valid: " scored {points} pts.",
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