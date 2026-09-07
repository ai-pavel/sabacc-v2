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
      startGame: "\uD83C\uDFB2 Lancer la partie",
      settings: "\u2699\uFE0F Options",
      hallOfFame: "\uD83C\uDFC6 Temple de la renommée",
      credits: "\uD83C\uDFAC Crédits",
      exitGame: "\uD83D\uDEAA Quitter",
      skip: "Passer",
      language: "Langue :",
      settingsTitle: "Options",
      resetHoF: "Effacer le Temple de la renommée",
      back: "Retour",
      hallOfFameTitle: "Temple de la renommée",
      winThreshold: "Points pour gagner :",
      musicOn: "Oui",
      musicOff: "Non",
      rules: "\uD83D\uDCDC Règles du jeu",
      rulesTitle: "Règles du Sabacc",
    },

    hof: {
      rank: "Rang",
      name: "Joueur",
      score: "Points",
      rounds: "Manches",
      time: "Durée",
      empty: "Aucun record — jouez une partie !",
      resetConfirm: "Effacer le Temple de la renommée ?",
    },

    rules: {
      html:
        "<h3>Objectif</h3>" +
        "<p>Soyez le premier à dépasser le seuil de points du tournoi (500 par défaut). " +
        "Vous affrontez 4 adversaires IA à la même table.</p>" +

        "<h3>Le jeu</h3>" +
        "<p>Le jeu de 76 cartes a quatre couleurs — Pièces, Fioles, Sabres, Bâtons — " +
        "chacune avec des cartes numérotées de 1 à 15. Plus 16 cartes de figure " +
        "(8 noms, chacun avec une variante positive et négative) :</p>" +
        "<table>" +
        "<tr><th>Carte</th><th>Valeur</th></tr>" +
        "<tr><td>Idiot</td><td>0</td></tr>" +
        "<tr><td>Reine de la Folie</td><td>+2 / −2</td></tr>" +
        "<tr><td>Endurance</td><td>+6 / −6</td></tr>" +
        "<tr><td>Équilibre</td><td>+8 / −8</td></tr>" +
        "<tr><td>Duelliste</td><td>+11 / −11</td></tr>" +
        "<tr><td>Commandant</td><td>+13 / −13</td></tr>" +
        "<tr><td>As</td><td>+15 / −15</td></tr>" +
        "<tr><td>Sénateur</td><td>+17 / −17</td></tr>" +
        "</table>" +

        "<h3>Score de la main</h3>" +
        "<p>Somme de toutes les cartes (y compris le champ d'interférence). " +
        "La valeur absolue compte — +15 et −15 valent tous deux 15.</p>" +

        "<h3>Résultats de la manche</h3>" +
        "<ul>" +
        "<li><b>Bombe</b> — score de 0, au-dessus de +23 ou en-dessous de −23. Vous perdez 24 points.</li>" +
        "<li><b>Sabacc pur</b> — exactement +23 ou −23. Vous gagnez 24 points de manche " +
        "et 46 points de tournoi.</li>" +
        "<li><b>Array de l'Idiot</b> — Idiot (0) + 2 + 3 = 23. Compte comme Sabacc pur.</li>" +
        "<li><b>Valide</b> — tout score de ±1 à ±22. Vous gagnez |score| points.</li>" +
        "</ul>" +
        "<p>Le leader de la manche (le meilleur scoreur si personne n'a eu de Sabacc pur) " +
        "reçoit un bonus de +la moitié de ses points. Les égalités n'ont pas de bonus.</p>" +

        "<h3>Le générateur</h3>" +
        "<p>Après chaque tour le générateur choisit deux cartes. Si elles diffèrent, " +
        "tous les joueurs tenant la première la voient remplacée par la seconde. " +
        "Si elles sont identiques, rien ne se passe.</p>" +
        "<p>Les deux champs en haut du plateau affichent la carte remplacée (à gauche) et son remplacement (à droite).</p>" +

        "<h3>Champ d'interférence</h3>" +
        "<p>Chaque joueur a un emplacement de champ. La carte y est toujours comptée " +
        "mais est <b>protégée</b> du générateur. Une seule carte à la fois.</p>" +
        "<p><b>Vous :</b> glissez une carte vers le champ ; cliquez pour la récupérer.</p>" +
        "<p><b>IA :</b> place automatiquement une carte favorite dans son champ.</p>" +

        "<h3>Tournoi</h3>" +
        "<p>Les points s'accumulent d'une manche à l'autre. Le premier à dépasser le seuil " +
        "(configurable : 500, 1000, 2500 ou 5000) gagne. Égalité au même seuil = " +
        "le plus haut total gagne ; égalité parfaite = match nul.</p>",
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
      opponents: "- Vos adversaires sont {names}",
      firstPair: "- Votre première paire a été distribuée",
      youDrew: '- Vous avez pioché la carte « {card} »',
      cpuDrew: '- {race} a pioché la carte « {card} »',
      cpuPasses: "- {race} passe",
      cpuPassesDeckDepleted: "- {race} passe (paquet épuisé)",
      deckDepletedNoDraw: "- Paquet épuisé \u2014 plus de pioche",
      generatorReplaced: '- Le générateur a remplacé « {g1} » par « {g2} »',
      generatorDeckDepleted: "- Générateur : paquet épuisé",
      separator: "***********************************************************",
    },

    toast: {
      bomb: "Vous avez explosé !",
      pureSabacc: "Sabacc pur !",
      fieldOccupied: "Champ d'interférence occupé !",
      nothingToRetrieve: "Rien à reprendre \u2014 déplacez d'abord une carte",
      roundOver: "Manche terminée ! {list}",
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

    // ---- Credits (HTML) ----------------------------------------------
    credits: {
      html:
        '<div class="panel">Tous les droits, design, etc. appartiennent<br>à Lucasfilm, Ltd<br><br><b>Lucasfilm. Ltd</b><br><br><span class="small">Tous droits réservés</span></div>' +
        '<div class="panel">Idée<br>par<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Code<br>par<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Tests et débogage<br>par<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Graphismes<br>par<br><br><b>Darth Favourite</b><br><br><span class="small">favourite_2003@mail.ru<br>ICQ#: 297-600-992</span></div>' +
        '<div class="panel">Musique<br>par<br><br><b>Mark Griskey</b><br><span class="small">(The Sith Lords: Iziz Cantina)</span><br>&amp;<br><b>John Williams</b><br><span class="small">(Star Wars: End Credits)</span></div>' +
        '<div class="panel">Remerciements<br><br><b>James Luceno</b><br><br><span class="small">pour le livre "Agents of Chaos I:<br>Hero\'s Trial"</span></div>' +
        '<div class="panel">Et aussi<br><br><b>George Lucas</b><br><br><span class="small">pour la magnifique saga<br>« Star Wars »</span></div>' +
        '<div class="panel">Remerciements particuliers<br><br><b>Denis Konstantin</b><br><br><span class="small">pour l\'aide avec<br>la table « Sabacc Tour »</span></div>' +
        '<div class="panel">Compilé avec<br><br><b><a href="https://web.archive.org/web/20021123121929/http://natata.hn3.net/" target="_blank">Natata eBook Compiler</a></b><br><br><span class="small">le .exe original de 2005 a été créé avec</span></div>' +
        '<div class="panel">Et aussi <b>Microsoft</b><br><br><b>pour Notepad</b><br><br><span class="small">et pour ne pas avoir planté... =)</span></div>',
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);