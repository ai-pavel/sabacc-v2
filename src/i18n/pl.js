// Polski
;(function (i18n) {
  i18n.register("PL", {
    __label: "🇵🇱 Polski",

    suits: {
      c: "Monety",
      f: "Butle",
      p: "Szable",
      s: "Laski",
    },
    faceCards: {
      i: "Idiota",
      q: "Królowa Obłędu",
      e: "Wytrzymałość",
      b: "Równowaga",
      d: "Pojedynkownik",
      c: "Dowódca",
      a: "As",
      s: "Senator",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "Puste!",

    cpuRaces: [
      "Człowiek",
      "Zabójca Jedi",
      "Gracz",
      "Przemytnik",
      "Łowca nagród",
    ],
    defaultPlayerName: "Gracz",

    ui: {
      title: "Sabacc z Coruscant",
      copyright: "Sabacc z Coruscant \u00A9 2005",
      yourName: "Twoje imię:",
      enableMusic: "Muzyka?",
      startGame: "Rozpocznij",
      credits: "Twórcy",
      language: "Język:",
    },

    uiGame: {
      interferenceField: "Pole interferencji",
      fieldHint: "Przeciągnij kartę tutaj, aby ją chronić",
      nextTurn: "Następna tura",
      pass: "Pas",
      youAlt: "Ty",
      cpu1Alt: "AI 1",
      cpu2Alt: "AI 2",
      generatorAlt: "generator",
      tournamentTitle: "Turniej",
      tournamentPoints: "pkt",
    },

    log: {
      welcome: "{name}, powodzenia i nie pyskuj!",
      roundHeader: "Runda {n}",
      yourScore: "- Twój aktualny wynik: {score}",
      opponents: "- Twoi przeciwnicy to {cpu1} i {cpu2}",
      firstPair: "- Rozdano twoją pierwszą parę",
      youDrew: '- Dobrano kartę „{card}”',
      cpuDrew: '- {race} dobrał kartę „{card}”',
      cpuPasses: "- {race} pasuje",
      cpuPassesDeckDepleted: "- {race} pasuje (brak kart)",
      deckDepletedNoDraw: "- Brak kart \u2014 niemożliwe dobieranie",
      generatorReplaced: '- Generator zamienił „{g1}” na „{g2}”',
      generatorDeckDepleted: "- Generator: brak kart",
      separator: "************************************************************",
    },

    toast: {
      bomb: "Wypadłeś!",
      pureSabacc: "Czyste Sabacc!",
      fieldOccupied: "Pole interferencji zajęte!",
      nothingToRetrieve: "Brak karty do zwrotu \u2014 najpierw przenieś kartę",
      roundOver:
        "Runda zakończona! {race1}{score1} | {player}{score} | {race2}{score2}",
      tie: "Turniej kończy się remisem!",
      winner: "{name} wygrywa turniej!",
    },

    roundResult: {
      bomb: " wypadł :(",
      pureSabacc: " Czyste Sabacc!",
      valid: " {points} pkt.",
    },

    alt: {
      yourField: "Twoje pole interferencji",
      opponentField: "Pole interferencji przeciwnika",
      cardToYourField: "{card} -> pole interferencji",
      cardToOpponentField: "{card} -> pole przeciwnika",
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);