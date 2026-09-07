// Español
;(function (i18n) {
  i18n.register("ES", {
    __label: "🇪🇸 Español",

    suits: {
      c: "Monedas",
      f: "Frascos",
      p: "Sables",
      s: "Bastones",
    },
    faceCards: {
      i: "Idiota",
      q: "Reina de la Locura",
      e: "Resistencia",
      b: "Equilibrio",
      d: "Duelista",
      c: "Comandante",
      a: "As",
      s: "Senador",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "¡Vacío!",

    cpuRaces: [
      "Humano",
      "Asesino Jedi",
      "Jugador",
      "Contrabandista",
      "Cazarrecompensas",
    ],
    defaultPlayerName: "Jugador",

    ui: {
      title: "Sabacc de Coruscant",
      copyright: "Sabacc de Coruscant \u00A9 2005",
      yourName: "Tu nombre:",
      enableMusic: "¿Música?",
      startGame: "Comenzar",
      credits: "Créditos",
      language: "Idioma:",
    },

    uiGame: {
      interferenceField: "Campo de interferencia",
      fieldHint: "Arrastra una carta aquí para protegerla",
      nextTurn: "Siguiente turno",
      pass: "Pasar",
      youAlt: "Tú",
      cpu1Alt: "IA 1",
      cpu2Alt: "IA 2",
      generatorAlt: "generador",
    },

    log: {
      welcome: "¡{name}, buena suerte y no te confíes!",
      roundHeader: "Ronda {n}",
      tournamentTable:
        "***** Tabla del torneo *****\n" +
        "{race1} - {points1}\n" +
        "{player} - {points3}\n" +
        "{race2} - {points2}\n" +
        "************************************************************",
      yourScore: "- Tu puntaje actual: {score}",
      opponents: "- Tus oponentes son {cpu1} y {cpu2}",
      firstPair: "- Te repartieron tu primera pareja",
      youDrew: '- Robaste la carta "{card}"',
      cpuDrew: '- {race} robó la carta "{card}"',
      cpuPasses: "- {race} pasa",
      cpuPassesDeckDepleted: "- {race} pasa (mazo agotado)",
      deckDepletedNoDraw: "- Mazo agotado \u2014 no más robos",
      generatorReplaced: '- El generador reemplazó la carta "{g1}" por "{g2}"',
      generatorDeckDepleted: "- Generador: mazo agotado",
      separator: "************************************************************",
    },

    toast: {
      bomb: "¡Te bombaste!",
      pureSabacc: "¡Sabacc puro!",
      fieldOccupied: "¡Campo de interferencia ocupado!",
      nothingToRetrieve: "Nada que devolver \u2014 primero mueve una carta al campo",
      roundOver:
        "¡Ronda terminada! {race1}{score1} | {player}{score} | {race2}{score2}",
      tie: "¡El torneo termina en empate!",
      winner: "¡{name} gana el torneo!",
    },

    roundResult: {
      bomb: " bombado :(",
      pureSabacc: " ¡Sabacc puro!",
      valid: " {points} pts.",
    },

    alt: {
      yourField: "Tu campo de interferencia",
      opponentField: "Campo de interferencia del oponente",
      cardToYourField: "{card} -> campo de interferencia",
      cardToOpponentField: "{card} -> campo del oponente",
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);