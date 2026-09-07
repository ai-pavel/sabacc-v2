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
      sfxLabel: "Soundeffekte?",
      musicVolume: "Musiklautstärke:",
      startGame: "\uD83C\uDFB2 Spiel starten",
      continue: "▶️ Fortsetzen",
      settings: "\u2699\uFE0F Einstellungen",
      hallOfFame: "\uD83C\uDFC6 Ruhmeshalle",
      credits: "\uD83C\uDFAC Mitwirkende",
      exitGame: "\uD83D\uDEAA Beenden",
      skip: "Überspringen",
      language: "Sprache:",
      settingsTitle: "Einstellungen",
      resetHoF: "Ruhmeshalle zurücksetzen",
      clearSave: "Spielstand löschen",
      back: "Zurück",
      hallOfFameTitle: "Ruhmeshalle",
      winThreshold: "Punkte zum Sieg:",
      cpuCount: "KI-Gegner:",
      musicOn: "An",
      musicOff: "Aus",
      sfxOn: "An",
      sfxOff: "Aus",
      rules: "\uD83D\uDCDC Spielregeln",
      rulesTitle: "Sabacc-Regeln",
      difficultyTitle: "Waehle deinen Weg",
      rulesetTitle: "Waehle deine Sabacc-Variante",
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
      difficulty: "Schwierigkeit",
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
      nextTurn: "Karte ziehen",
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
      traditional:
        "<h3>Ziel</h3>" +
        "<p>Be the first player to exceed the tournament point threshold. " +
        "You play against CPU opponents at the same table.</p>" +
        "<h3>Deck</h3>" +
        "<p>76 cards: 1-15 in four suits plus 16 face cards (8 names x +/-).</p>" +
        "<h3>Ziel</h3><p>Get closest to +/-23. Idiot + 2 + 3 = Idiot's Array (Pure Sabacc).</p>" +
        "<h3>Generator</h3><p>Picks 2 cards each turn; replaces the first with the second across all hands.</p>" +
        "<h3>Feld</h3><p>Protects 1 card from the generator.</p>",
      spike:
        "<h3>Corellian Spike</h3>" +
        "<p>A faster variant with a smaller deck and dice instead of a card generator.</p>" +
        "<h3>Deck</h3>" +
        "<p>42 cards: four suits with values 1-10, plus 2 Idiot cards (value 0).</p>" +
        "<h3>Ziel</h3><p>Get as close to <b>0</b> as possible (not 23).</p>" +
        "<h3>Wuerfel</h3><p>After every turn, two dice are rolled. <b>Doubles</b> shift all cards (random swap). No doubles = nothing happens.</p>" +
        "<h3>Punkte</h3><p>Score 0 = Pure Sabacc (+60 pts). Bomb if too far from 0. Otherwise |score| pts.</p>" +
        "<h3>Ohne Feld</h3><p>No field protection in this variant.</p>",
      gungan:
        "<h3>Otoh Gunga (Gungan Sabacc)</h3>" +
        "<p>A variant where <b>low scores prevail</b>.</p>" +
        "<h3>Deck</h3><p>Standard 76-card deck.</p>" +
        "<h3>Ziel</h3><p>Get closest to <b>0</b>. Lowest |score| wins the round. Score 0 = Pure Sabacc.</p>" +
        "<h3>Generator</h3><p>Still active, same as Traditional.</p>" +
        "<h3>Feld</h3><p>Available, same rules as Traditional.</p>" +
        "<h3>Punkte</h3><p>Score 0 = Pure Sabacc (+46 pts). All other scores give |score| pts.</p>",
    },

    toast: {
      bomb: "Du bist rausgeflogen!",
      pureSabacc: "Reines Sabacc!",
      idiotsArray: "Idioten-Array!",
      fieldOccupied: "Interferenzfeld belegt!",
      nothingToRetrieve: "Nichts zurückzulegen \u2014 zuerst eine Karte ins Feld",
      roundOver: "Runde vorbei! {list}",
      tie: "Das Turnier endet unentschieden!",
      winner: "{name} gewinnt das Turnier!",
      saveCleared: "Spielstand gelöscht",
    },

    roundResult: {
      bomb: " rausgeflogen :(",
      pureSabacc: " Reines Sabacc!",
      valid: " {points} Pkt.",
    },

    // ---- Ruleset variants ----
    ruleset: {
      traditional: "Traditioneller Sabacc",
      traditionalDesc: "76 Karten, Ziel +/-23, Generator, Interferenzfeld",
      spike: "Corellian Spike",
      spikeDesc: "42 Karten, Ziel 0, Wuerfel statt Generator, Doppel tauschen Karten",
      gungan: "Otoh Gunga",
      gunganDesc: "Standarddeck, niedrigster Score gewinnt, am naechsten an 0",
    },

    // ---- Difficulty presets ----
    difficulty: {
      youngling: "🟢 Juengling",
      younglingDesc: "Training im Jedi-Tempel - 1 normaler Gegner, schnelle Spiele",
      padawan: "🔵 Padawan",
      padawanDesc: "Die Wege der Macht erlernen - 2 vorsichtige Gegner",
      knight: "🟡 Ritter",
      knightDesc: "Ein Jedi-Ritter sucht nicht nach diesen Dingen - 3 gemischte Gegner",
      sithlord: "🔴 Sith-Lord",
      sithlordDesc: "Die dunkle Seite der Macht - 4 aggressive Gegner, langer Lauf",
      grandmaster: "⚔️ Grossmeister",
      grandmasterDesc: "Groesse spielt keine Rolle - 4 ruecksichtslose Gegner, Marathon",
    },


    roundSummary: {
      title: "Rundenergebnisse",
      continue: "Weiter",
      hand: "Hand",
      result: "Ergebnis",
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