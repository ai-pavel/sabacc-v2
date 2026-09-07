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
      startGame: "Start game",
      credits: "Credits",
      language: "Language:",
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
      opponents: "- Your opponents are {cpu1} and {cpu2}",
      firstPair: "- Your first pair has been dealt",
      youDrew: '- You drew card "{card}"',
      cpuDrew: '- {race} drew card "{card}"',
      cpuPasses: "- {race} passes",
      cpuPassesDeckDepleted: "- {race} passes (deck depleted)",
      deckDepletedNoDraw: "- Deck depleted \u2014 no more draws",
      generatorReplaced: '- Random generator replaced card "{g1}" with "{g2}"',
      generatorDeckDepleted: "- Random generator: deck depleted",
      separator: "************************************************************",
    },

    // ---- Toast notifications ------------------------------------------
    toast: {
      bomb: "You bombed!",
      pureSabacc: "Pure Sabacc!",
      fieldOccupied: "Interference field is occupied!",
      nothingToRetrieve: "Nothing to put back \u2014 move a card to the field first",
      roundOver:
        "Round over! {race1}{score1} | {player}{score} | {race2}{score2}",
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
  });
})(typeof window !== "undefined" ? window.i18n : undefined);