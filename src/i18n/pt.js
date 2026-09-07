// Português
;(function (i18n) {
  i18n.register("PT", {
    __label: "🇵🇹 Português",

    suits: {
      c: "Moedas",
      f: "Frascos",
      p: "Sabres",
      s: "Bastões",
    },
    faceCards: {
      i: "Idiota",
      q: "Rainha da Loucura",
      e: "Resistência",
      b: "Equilíbrio",
      d: "Duelista",
      c: "Comandante",
      a: "Ás",
      s: "Senador",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "Vazio!",

    cpuRaces: [
      "Humano",
      "Assassino Jedi",
      "Jogador",
      "Contrabandista",
      "Caçador de recompensas",
    ],
    defaultPlayerName: "Jogador",

    ui: {
      title: "Sabacc de Coruscant",
      copyright: "Sabacc de Coruscant \u00A9 2005",
      yourName: "Seu nome:",
      enableMusic: "Música?",
      startGame: "Começar",
      credits: "Créditos",
      language: "Idioma:",
    },

    uiGame: {
      interferenceField: "Campo de interferência",
      fieldHint: "Arraste uma carta para cá para protegê-la",
      nextTurn: "Próximo turno",
      pass: "Passar",
      youAlt: "Você",
      cpu1Alt: "IA 1",
      cpu2Alt: "IA 2",
      generatorAlt: "gerador",
    },

    log: {
      welcome: "{name}, boa sorte e não fique arrogante!",
      roundHeader: "Rodada {n}",
      tournamentTable:
        "***** Tabela do torneio *****\n" +
        "{race1} - {points1}\n" +
        "{player} - {points3}\n" +
        "{race2} - {points2}\n" +
        "************************************************************",
      yourScore: "- Sua pontuação atual: {score}",
      opponents: "- Seus oponentes são {cpu1} e {cpu2}",
      firstPair: "- Sua primeira par foi distribuída",
      youDrew: '- Você sacou a carta "{card}"',
      cpuDrew: '- {race} sacou a carta "{card}"',
      cpuPasses: "- {race} passa",
      cpuPassesDeckDepleted: "- {race} passa (baralho esgotado)",
      deckDepletedNoDraw: "- Baralho esgotado \u2014 sem mais saques",
      generatorReplaced: '- O gerador trocou "{g1}" por "{g2}"',
      generatorDeckDepleted: "- Gerador: baralho esgotado",
      separator: "************************************************************",
    },

    toast: {
      bomb: "Você estourou!",
      pureSabacc: "Sabacc puro!",
      fieldOccupied: "Campo de interferência ocupado!",
      nothingToRetrieve: "Nada para devolver \u2014 mova uma carta primeiro",
      roundOver:
        "Rodada encerrada! {race1}{score1} | {player}{score} | {race2}{score2}",
      tie: "O torneio termina em empate!",
      winner: "{name} vence o torneio!",
    },

    roundResult: {
      bomb: " estourou :(",
      pureSabacc: " Sabacc puro!",
      valid: " {points} pts.",
    },

    alt: {
      yourField: "Seu campo de interferência",
      opponentField: "Campo de interferência do oponente",
      cardToYourField: "{card} -> campo de interferência",
      cardToOpponentField: "{card} -> campo do oponente",
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);