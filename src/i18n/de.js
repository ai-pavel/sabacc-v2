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
      startGame: "\uD83C\uDFB2 Spiel starten",
      settings: "\u2699\uFE0F Einstellungen",
      hallOfFame: "\uD83C\uDFC6 Ruhmeshalle",
      credits: "\uD83C\uDFAC Mitwirkende",
      exitGame: "\uD83D\uDEAA Beenden",
      skip: "Überspringen",
      language: "Sprache:",
      settingsTitle: "Einstellungen",
      resetHoF: "Ruhmeshalle zurücksetzen",
      back: "Zurück",
      hallOfFameTitle: "Ruhmeshalle",
      winThreshold: "Punkte zum Sieg:",
      musicOn: "An",
      musicOff: "Aus",
      rules: "\uD83D\uDCDC Spielregeln",
      rulesTitle: "Sabacc-Regeln",
      mainMenu: "Hauptmenü",
      playAgain: "Nochmal spielen",
    },

    // ---- End screen (win / lose / tie) -------------------------------
    end: {
      victory: "Sieg!",
      defeat: "Niederlage",
      tie: "Unentschieden!",
      victoryEmoji: "\uD83C\uDFC6",
      defeatEmoji: "\uD83D\uDD1B",
      tieEmoji: "\uD83E\uDDF1",
      youWin: "Du hast das Turnier gewonnen!",
      youLose: "{name} hat das Turnier gewonnen.",
      tieMessage: "Das Turnier endete unentschieden!",
      yourScore: "Dein Punktestand: {score}",
      rounds: "Gespielte Runden: {rounds}",
      gameTime: "Spieldauer: {time}",
      pureSabaccs: "Reine Sabaccs: {count}",
    },

    hof: {
      rank: "Rang",
      name: "Spieler",
      score: "Punkte",
      rounds: "Runden",
      pureSabaccs: "Reine Sabaccs",
      time: "Dauer",
      empty: "Noch keine Einträge — spiele eine Partie!",
      resetConfirm: "Ruhmeshalle wirklich zurücksetzen?",
    },

    rules: {
      html:
        "<h3>Ziel</h3>" +
        "<p>Sei der erste Spieler, der die Punkteschwelle des Turniers überschreitet (Standard 500). " +
        "Du spielst gegen 4 KI-Gegner am selben Tisch.</p>" +

        "<h3>Das Deck</h3>" +
        "<p>Das 76-Karten-Deck hat vier Farben — Münzen, Flaschen, Säbel, Stäbe — " +
        "jeweils mit nummerierten Karten 1–15. Dazu kommen 16 Bildkarten " +
        "(8 Namen, je eine positive und negative Variante):</p>" +
        "<table>" +
        "<tr><th>Karte</th><th>Wert</th></tr>" +
        "<tr><td>Idiot</td><td>0</td></tr>" +
        "<tr><td>Königin des Wahnsinns</td><td>+2 / −2</td></tr>" +
        "<tr><td>Ausdauer</td><td>+6 / −6</td></tr>" +
        "<tr><td>Gleichgewicht</td><td>+8 / −8</td></tr>" +
        "<tr><td>Duellant</td><td>+11 / −11</td></tr>" +
        "<tr><td>Kommandant</td><td>+13 / −13</td></tr>" +
        "<tr><td>Ass</td><td>+15 / −15</td></tr>" +
        "<tr><td>Senator</td><td>+17 / −17</td></tr>" +
        "</table>" +

        "<h3>Handpunktzahl</h3>" +
        "<p>Summe aller Kartenwerte (inklusive Interferenzfeld). " +
        "Der Betrag zählt — +15 und −15 sind jeweils 15 Punkte.</p>" +

        "<h3>Rundenergebnisse</h3>" +
        "<ul>" +
        "<li><b>Bombe</b> — 0, über +23 oder unter −23. Du verlierst 24 Punkte.</li>" +
        "<li><b>Reines Sabacc</b> — genau +23 oder −23. Du erhältst 24 Rundepunkte " +
        "und 46 Turnierpunkte.</li>" +
        "<li><b>Idioten-Array</b> — Idiot (0) + 2 + 3 = 23. Zählt als reines Sabacc.</li>" +
        "<li><b>Gültig</b> — jeder Score von ±1 bis ±22. Du erhältst |Score| Punkte.</li>" +
        "</ul>" +
        "<p>Rundenleader (höchster Scorer bei keinem reinen Sabacc) bekommt " +
        "+die Hälfte seiner Punkte als Bonus. Bei Gleichstand kein Bonus.</p>" +

        "<h3>Der Generator</h3>" +
        "<p>Nach jedem Zug wählt der Generator zwei Karten. Sind sie verschieden, " +
        "wird die erste bei allen Spielern durch die zweite ersetzt. " +
        "Sind sie gleich, passiert nichts.</p>" +
        "<p>Die zwei Felder oben auf dem Brett zeigen die ersetzte Karte (links) und ihren Ersatz (rechts).</p>" +

        "<h3>Interferenzfeld</h3>" +
        "<p>Jeder Spieler hat ein Feld. Die Karte dort zählt weiter, ist aber " +
        "<b>geschützt</b> vor dem Generator. Nur eine Karte zur Zeit.</p>" +
        "<p><b>Du:</b> ziehe eine Karte ins Feld; klicke aufs Feld zum Zurückholen.</p>" +
        "<p><b>KI:</b> legt automatisch eine Favoritenkarte ins Feld.</p>" +

        "<h3>Turnier</h3>" +
        "<p>Punkte sammeln sich über Runden. Wer zuerst die Schwelle überschreitet " +
        "(einstellbar: 500, 1000, 2500 oder 5000), gewinnt. Gleichstand = " +
        "höchste Summe gewinnt; exaktes Unentschieden = Remis.</p>",
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
      tournamentTitle: "Turnier",
      tournamentPoints: "Pkt",
    },

    log: {
      welcome: "{name}, viel Glück und werde nicht übermütig!",
      roundHeader: "Runde {n}",
      yourScore: "- Dein aktueller Punktestand: {score}",
      opponents: "- Deine Gegner sind {names}",
      firstPair: "- Dein erstes Paar wurde ausgeteilt",
      youDrew: '- Du hast die Karte „{card}“ gezogen',
      cpuDrew: '- {race} hat die Karte „{card}“ gezogen',
      cpuPasses: "- {race} passt",
      cpuPassesDeckDepleted: "- {race} passt (Stapel leer)",
      deckDepletedNoDraw: "- Stapel leer \u2014 kein Ziehen mehr",
      generatorReplaced: '- Generator ersetzte „{g1}“ durch „{g2}“',
      generatorDeckDepleted: "- Generator: Stapel leer",
      separator: "***********************************************************",
    },

    toast: {
      bomb: "Du bist rausgeflogen!",
      pureSabacc: "Reines Sabacc!",
      fieldOccupied: "Interferenzfeld belegt!",
      nothingToRetrieve: "Nichts zurückzulegen \u2014 zuerst eine Karte ins Feld",
      roundOver: "Runde vorbei! {list}",
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

    // ---- Credits (HTML) ----------------------------------------------
    credits: {
      html:
        '<div class="panel">Alle Rechte, Design usw. gehören<br>Lucasfilm, Ltd<br><br><b>Lucasfilm. Ltd</b><br><br><span class="small">Alle Rechte vorbehalten</span></div>' +
        '<div class="panel">Idee<br>von<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Code<br>von<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Testen und Debugging<br>von<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Grafik<br>von<br><br><b>Darth Favourite</b><br><br><span class="small">favourite_2003@mail.ru<br>ICQ#: 297-600-992</span></div>' +
        '<div class="panel">Musik<br>von<br><br><b>Mark Griskey</b><br><span class="small">(The Sith Lords: Iziz Cantina)</span><br>&amp;<br><b>John Williams</b><br><span class="small">(Star Wars: End Credits)</span></div>' +
        '<div class="panel">Danke<br><br><b>James Luceno</b><br><br><span class="small">für das Buch "Agents of Chaos I:<br>Hero\'s Trial"</span></div>' +
        '<div class="panel">Und auch<br><br><b>George Lucas</b><br><br><span class="small">für die großartige<br>« Star Wars »-Saga</span></div>' +
        '<div class="panel">Besonderer Dank<br><br><b>Denis Konstantin</b><br><br><span class="small">für die Hilfe bei<br>der « Sabacc Tour »-Tabelle</span></div>' +
        '<div class="panel">Verpackt mit<br><br><b><a href="https://web.archive.org/web/20021123121929/http://natata.hn3.net/" target="_blank">Natata eBook Compiler</a></b><br><br><span class="small">die originale .exe von 2005 wurde erstellt mit</span></div>' +
        '<div class="panel">Und auch <b>Microsoft</b><br><br><b>für Notepad</b><br><br><span class="small">und fürs Nicht-Abstürzen... =)</span></div>',
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);