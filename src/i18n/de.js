// Deutsch
;(function (i18n) {
  i18n.register("DE", {
    __label: "🇩🇪 Deutsch",

    suits: {
      c: "Münzen",
      f: "Flaschen",
      p: "Säbel",
      s: "Stäbe",
    },
    faceCards: {
      i: "Idiot",
      q: "Königin des Wahnsinns",
      e: "Ausdauer",
      b: "Gleichgewicht",
      d: "Duellant",
      c: "Kommandant",
      a: "Ass",
      s: "Senator",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "Leer!",

    cpuRaces: [
      "Mensch",
      "Jedi-Mörder",
      "Spieler",
      "Schmuggler",
      "Kopfgeldjäger",
    ],
    defaultPlayerName: "Spieler",

    ui: {
      title: "Sabacc von Coruscant",
      copyright: "Sabacc von Coruscant \u00A9 2005",
      yourName: "Dein Name:",
      enableMusic: "Musik?",
      startGame: "Start",
      credits: "Mitwirkende",
      language: "Sprache:",
    },

    uiGame: {
      interferenceField: "Interferenzfeld",
      fieldHint: "Ziehe eine Karte hierher, um sie zu schützen",
      nextTurn: "Nächster Zug",
      pass: "Passen",
      youAlt: "Du",
      cpu1Alt: "KI 1",
      cpu2Alt: "KI 2",
      generatorAlt: "Generator",
    },

    log: {
      welcome: "{name}, viel Glück und werde nicht übermütig!",
      roundHeader: "Runde {n}",
      tournamentTable:
        "***** Turniertabelle *****\n" +
        "{race1} - {points1}\n" +
        "{player} - {points3}\n" +
        "{race2} - {points2}\n" +
        "************************************************************",
      yourScore: "- Dein aktueller Punktestand: {score}",
      opponents: "- Deine Gegner sind {cpu1} und {cpu2}",
      firstPair: "- Dein erstes Paar wurde ausgeteilt",
      youDrew: '- Du hast die Karte „{card}“ gezogen',
      cpuDrew: '- {race} hat die Karte „{card}“ gezogen',
      cpuPasses: "- {race} passt",
      cpuPassesDeckDepleted: "- {race} passt (Stapel leer)",
      deckDepletedNoDraw: "- Stapel leer \u2014 kein Ziehen mehr",
      generatorReplaced: '- Generator ersetzte „{g1}“ durch „{g2}“',
      generatorDeckDepleted: "- Generator: Stapel leer",
      separator: "************************************************************",
    },

    toast: {
      bomb: "Du bist rausgeflogen!",
      pureSabacc: "Reines Sabacc!",
      fieldOccupied: "Interferenzfeld belegt!",
      nothingToRetrieve: "Nichts zurückzulegen \u2014 zuerst eine Karte ins Feld",
      roundOver:
        "Runde vorbei! {race1}{score1} | {player}{score} | {race2}{score2}",
      tie: "Das Turnier endet unentschieden!",
      winner: "{name} gewinnt das Turnier!",
    },

    roundResult: {
      bomb: " rausgeflogen :(",
      pureSabacc: " Reines Sabacc!",
      valid: " {points} Pkt.",
    },

    alt: {
      yourField: "Dein Interferenzfeld",
      opponentField: "Interferenzfeld des Gegners",
      cardToYourField: "{card} -> Interferenzfeld",
      cardToOpponentField: "{card} -> Feld des Gegners",
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);