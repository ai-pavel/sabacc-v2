// Français
;(function (i18n) {
  i18n.register("FR", {
    __label: "🇫🇷 Français",

    suits: {
      c: "Pièces",
      f: "Fioles",
      p: "Sabres",
      s: "Bâtons",
    },
    faceCards: {
      i: "Idiot",
      q: "Reine de la Folie",
      e: "Endurance",
      b: "Équilibre",
      d: "Duelliste",
      c: "Commandant",
      a: "As",
      s: "Sénateur",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "Vide !",

    cpuRaces: [
      "Humain",
      "Tueur Jedi",
      "Joueur",
      "Contrebandier",
      "Chasseur de primes",
    ],
    defaultPlayerName: "Joueur",

    ui: {
      title: "Sabacc de Coruscant",
      copyright: "Sabacc de Coruscant \u00A9 2005",
      yourName: "Votre nom :",
      enableMusic: "Musique ?",
      startGame: "Commencer",
      credits: "Crédits",
      language: "Langue :",
    },

    uiGame: {
      interferenceField: "Champ d'interférence",
      fieldHint: "Glissez une carte ici pour la protéger",
      nextTurn: "Tour suivant",
      pass: "Passer",
      youAlt: "Vous",
      cpu1Alt: "IA 1",
      cpu2Alt: "IA 2",
      generatorAlt: "générateur",
      tournamentTitle: "Tournoi",
      tournamentPoints: "pts",
    },

    log: {
      welcome: "{name}, bonne chance et restez humble !",
      roundHeader: "Manche {n}",
      yourScore: "- Votre score actuel : {score}",
      opponents: "- Vos adversaires sont {cpu1} et {cpu2}",
      firstPair: "- Votre première paire a été distribuée",
      youDrew: '- Vous avez pioché la carte « {card} »',
      cpuDrew: '- {race} a pioché la carte « {card} »',
      cpuPasses: "- {race} passe",
      cpuPassesDeckDepleted: "- {race} passe (paquet épuisé)",
      deckDepletedNoDraw: "- Paquet épuisé \u2014 plus de pioche",
      generatorReplaced: '- Le générateur a remplacé « {g1} » par « {g2} »',
      generatorDeckDepleted: "- Générateur : paquet épuisé",
      separator: "************************************************************",
    },

    toast: {
      bomb: "Vous avez explosé !",
      pureSabacc: "Sabacc pur !",
      fieldOccupied: "Champ d'interférence occupé !",
      nothingToRetrieve: "Rien à reprendre \u2014 déplacez d'abord une carte",
      roundOver:
        "Manche terminée ! {race1}{score1} | {player}{score} | {race2}{score2}",
      tie: "Le tournoi se termine sur une égalité !",
      winner: "{name} remporte le tournoi !",
    },

    roundResult: {
      bomb: " a explosé :(",
      pureSabacc: " Sabacc pur !",
      valid: " a marqué {points} pts.",
    },

    alt: {
      yourField: "Votre champ d'interférence",
      opponentField: "Champ d'interférence de l'adversaire",
      cardToYourField: "{card} -> champ d'interférence",
      cardToOpponentField: "{card} -> champ de l'adversaire",
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);