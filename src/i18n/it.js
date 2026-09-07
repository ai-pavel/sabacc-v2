// Italiano
;(function (i18n) {
  i18n.register("IT", {
    __label: "🇮🇹 Italiano",

    suits: {
      c: "Monete",
      f: "Fiaschi",
      p: "Sciabole",
      s: "Bastoni",
    },
    faceCards: {
      i: "Idiota",
      q: "Regina della Follia",
      e: "Resistenza",
      b: "Equilibrio",
      d: "Duellante",
      c: "Comandante",
      a: "Asso",
      s: "Senatore",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "Vuoto!",

    cpuRaces: [
      "Umano",
      "Assassino Jedi",
      "Giocatore",
      "Contrabbandiere",
      "Cacciatore di taglie",
    ],
    defaultPlayerName: "Giocatore",

    ui: {
      title: "Sabacc di Coruscant",
      copyright: "Sabacc di Coruscant \u00A9 2005",
      yourName: "Il tuo nome:",
      enableMusic: "Musica?",
      startGame: "Inizia",
      credits: "Crediti",
      language: "Lingua:",
    },

    uiGame: {
      interferenceField: "Campo di interferenza",
      fieldHint: "Trascina qui una carta per proteggerla",
      nextTurn: "Turno successivo",
      pass: "Passa",
      youAlt: "Tu",
      cpu1Alt: "IA 1",
      cpu2Alt: "IA 2",
      generatorAlt: "generatore",
      tournamentTitle: "Torneo",
      tournamentPoints: "pt",
    },

    log: {
      welcome: "{name}, buona fortuna e non montarti la testa!",
      roundHeader: "Turno {n}",
      yourScore: "- Punteggio attuale: {score}",
      opponents: "- I tuoi avversari sono {cpu1} e {cpu2}",
      firstPair: "- Hai ricevuto la tua prima coppia",
      youDrew: '- Hai pescato la carta "{card}"',
      cpuDrew: '- {race} ha pescato la carta "{card}"',
      cpuPasses: "- {race} passa",
      cpuPassesDeckDepleted: "- {race} passa (mazzo esaurito)",
      deckDepletedNoDraw: "- Mazzo esaurito \u2014 niente più pescate",
      generatorReplaced: '- Il generatore ha sostituito "{g1}" con "{g2}"',
      generatorDeckDepleted: "- Generatore: mazzo esaurito",
      separator: "************************************************************",
    },

    toast: {
      bomb: "Sei esploso!",
      pureSabacc: "Sabacc puro!",
      fieldOccupied: "Campo di interferenza occupato!",
      nothingToRetrieve: "Niente da riprendere \u2014 sposta prima una carta",
      roundOver:
        "Turno finito! {race1}{score1} | {player}{score} | {race2}{score2}",
      tie: "Il torneo finisce in parità!",
      winner: "{name} vince il torneo!",
    },

    roundResult: {
      bomb: " esploso :(",
      pureSabacc: " Sabacc puro!",
      valid: " {points} pt.",
    },

    alt: {
      yourField: "Il tuo campo di interferenza",
      opponentField: "Campo di interferenza dell'avversario",
      cardToYourField: "{card} -> campo di interferenza",
      cardToOpponentField: "{card} -> campo dell'avversario",
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);