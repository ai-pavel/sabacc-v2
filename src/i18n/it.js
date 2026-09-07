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
      startGame: "\uD83C\uDFB2 Inizia partita",
      settings: "\u2699\uFE0F Impostazioni",
      hallOfFame: "\uD83C\uDFC6 Hall of Fame",
      credits: "\uD83C\uDFAC Crediti",
      exitGame: "\uD83D\uDEAA Esci",
      skip: "Salta",
      language: "Lingua:",
      settingsTitle: "Impostazioni",
      resetHoF: "Azzera Hall of Fame",
      back: "Indietro",
      hallOfFameTitle: "Hall of Fame",
      winThreshold: "Punti per vincere:",
      musicOn: "Sì",
      musicOff: "No",
      rules: "\uD83D\uDCDC Regole del gioco",
      rulesTitle: "Regole del Sabacc",
      mainMenu: "Menu principale",
      playAgain: "Gioca ancora",
    },

    // ---- End screen (win / lose / tie) -------------------------------
    end: {
      victory: "Vittoria!",
      defeat: "Sconfitta",
      tie: "Pareggio!",
      victoryEmoji: "\uD83C\uDFC6",
      defeatEmoji: "\uD83D\uDD1B",
      tieEmoji: "\uD83E\uDDF1",
      youWin: "Hai vinto il torneo!",
      youLose: "{name} ha vinto il torneo.",
      tieMessage: "Il torneo è finito in parità!",
      yourScore: "Il tuo punteggio: {score}",
      rounds: "Turni giocati: {rounds}",
      gameTime: "Durata: {time}",
    },

    hof: {
      rank: "Pos",
      name: "Giocatore",
      score: "Punti",
      rounds: "Turni",
      time: "Durata",
      empty: "Nessun record — gioca una partita!",
      resetConfirm: "Azzerare la Hall of Fame?",
    },

    rules: {
      html:
        "<h3>Obiettivo</h3>" +
        "<p>Sii il primo a superare la soglia di punti del torneo (500 di default). " +
        "Gioci contro 4 avversari IA allo stesso tavolo.</p>" +

        "<h3>Il mazzo</h3>" +
        "<p>Il mazzo di 76 carte ha quattro semi — Monete, Fiaschi, Sciabole, Bastoni — " +
        "ognuno con carte numerate da 1 a 15. Più 16 carte di figura " +
        "(8 nomi, ciascuno con variante positiva e negativa):</p>" +
        "<table>" +
        "<tr><th>Carta</th><th>Valore</th></tr>" +
        "<tr><td>Idiota</td><td>0</td></tr>" +
        "<tr><td>Regina della Follia</td><td>+2 / −2</td></tr>" +
        "<tr><td>Resistenza</td><td>+6 / −6</td></tr>" +
        "<tr><td>Equilibrio</td><td>+8 / −8</td></tr>" +
        "<tr><td>Duellante</td><td>+11 / −11</td></tr>" +
        "<tr><td>Comandante</td><td>+13 / −13</td></tr>" +
        "<tr><td>Asso</td><td>+15 / −15</td></tr>" +
        "<tr><td>Senatore</td><td>+17 / −17</td></tr>" +
        "</table>" +

        "<h3>Punteggio della mano</h3>" +
        "<p>Somma di tutte le carte (incluso il campo di interferenza). " +
        "Il valore assoluto conta — +15 e −15 valgono entrambi 15.</p>" +

        "<h3>Risultati del turno</h3>" +
        "<ul>" +
        "<li><b>Bomba</b> — punteggio 0, sopra +23 o sotto −23. Perdi 24 punti.</li>" +
        "<li><b>Sabacc puro</b> — esattamente +23 o −23. Ottieni 24 punti turno " +
        "e 46 punti torneo.</li>" +
        "<li><b>Array dell'Idiota</b> — Idiota (0) + 2 + 3 = 23. Vale come Sabacc puro.</li>" +
        "<li><b>Valido</b> — qualsiasi punteggio da ±1 a ±22. Ottieni |punti|.</li>" +
        "</ul>" +
        "<p>Il leader del turno (miglior punteggio senza Sabacc puro) riceve " +
        "un bonus di +metà dei suoi punti. Parità = nessun bonus.</p>" +

        "<h3>Il generatore</h3>" +
        "<p>Dopo ogni turno il generatore sceglie due carte. Se diverse, " +
        "tutti i giocatori con la prima carta la vedono sostituita dalla seconda. " +
        "Se uguali, non succede nulla.</p>" +
        "<p>I due campi in cima al tabellone mostrano la carta sostituita (a sinistra) e la sua sostituzione (a destra).</p>" +

        "<h3>Campo di interferenza</h3>" +
        "<p>Ogni giocatore ha uno slot. La carta conta ancora ma è <b>protetta</b> " +
        "dal generatore. Una sola carta alla volta.</p>" +
        "<p><b>Tu:</b> trascina una carta nel campo; clicca per recuperarla.</p>" +
        "<p><b>IA:</b> sposta automaticamente una carta preferita nel campo.</p>" +

        "<h3>Torneo</h3>" +
        "<p>I punti si accumulano tra i turni. Il primo a superare la soglia " +
        "(configurabile: 500, 1000, 2500 o 5000) vince. Parità = " +
        "vince il totale maggiore; parità perfetta = pareggio.</p>",
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
      opponents: "- I tuoi avversari sono {names}",
      firstPair: "- Hai ricevuto la tua prima coppia",
      youDrew: '- Hai pescato la carta "{card}"',
      cpuDrew: '- {race} ha pescato la carta "{card}"',
      cpuPasses: "- {race} passa",
      cpuPassesDeckDepleted: "- {race} passa (mazzo esaurito)",
      deckDepletedNoDraw: "- Mazzo esaurito \u2014 niente più pescate",
      generatorReplaced: '- Il generatore ha sostituito "{g1}" con "{g2}"',
      generatorDeckDepleted: "- Generatore: mazzo esaurito",
      separator: "***********************************************************",
    },

    toast: {
      bomb: "Sei esploso!",
      pureSabacc: "Sabacc puro!",
      fieldOccupied: "Campo di interferenza occupato!",
      nothingToRetrieve: "Niente da riprendere \u2014 sposta prima una carta",
      roundOver: "Turno finito! {list}",
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

    // ---- Credits (HTML) ----------------------------------------------
    credits: {
      html:
        '<div class="panel">Tutti i diritti, design, ecc. appartengono<br>a Lucasfilm, Ltd<br><br><b>Lucasfilm. Ltd</b><br><br><span class="small">Tutti i diritti riservati</span></div>' +
        '<div class="panel">Idea<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Codice<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Test e debug<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Grafica<br><br><b>Darth Favourite</b><br><br><span class="small">favourite_2003@mail.ru<br>ICQ#: 297-600-992</span></div>' +
        '<div class="panel">Musica<br><br><b>Mark Griskey</b><br><span class="small">(The Sith Lords: Iziz Cantina)</span><br>&amp;<br><b>John Williams</b><br><span class="small">(Star Wars: End Credits)</span></div>' +
        '<div class="panel">Ringraziamenti<br><br><b>James Luceno</b><br><br><span class="small">per il libro "Agents of Chaos I:<br>Hero\'s Trial"</span></div>' +
        '<div class="panel">E anche<br><br><b>George Lucas</b><br><br><span class="small">per la magnifica saga<br>« Star Wars »</span></div>' +
        '<div class="panel">Ringraziamenti speciali<br><br><b>Denis Konstantin</b><br><br><span class="small">per l\'aiuto con<br>la tabella « Sabacc Tour »</span></div>' +
        '<div class="panel">Compilato con<br><br><b><a href="https://web.archive.org/web/20021123121929/http://natata.hn3.net/" target="_blank">Natata eBook Compiler</a></b><br><br><span class="small">l\'.exe originale del 2005 è stato creato con</span></div>' +
        '<div class="panel">E anche <b>Microsoft</b><br><br><b>per Notepad</b><br><br><span class="small">e per non essersi bloccato... =)</span></div>',
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);