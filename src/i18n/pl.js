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
      startGame: "\uD83C\uDFB2 Rozpocznij grę",
      settings: "\u2699\uFE0F Opcje",
      hallOfFame: "\uD83C\uDFC6 Galeria sław",
      credits: "\uD83C\uDFAC Twórcy",
      exitGame: "\uD83D\uDEAA Wyjdź",
      skip: "Pomiń",
      language: "Język:",
      settingsTitle: "Opcje",
      resetHoF: "Wyczyść galerię sław",
      back: "Wstecz",
      hallOfFameTitle: "Galeria sław",
      winThreshold: "Punkty do zwycięstwa:",
      musicOn: "Wł.",
      musicOff: "Wył.",
      rules: "\uD83D\uDCDC Zasady gry",
      rulesTitle: "Zasady Sabacca",
    },

    hof: {
      rank: "Miejsce",
      name: "Gracz",
      score: "Punkty",
      rounds: "Rundy",
      time: "Czas",
      empty: "Brak wyników — zagraj!",
      resetConfirm: "Wyczyścić galerię sław?",
    },

    rules: {
      html:
        "<h3>Cel</h3>" +
        "<p>Bądź pierwszym graczem, który przekroczy próg punktów turnieju (domyślnie 500). " +
        "Grasz przeciwko 4 przeciwnikom AI przy jednym stole.</p>" +

        "<h3>Talia</h3>" +
        "<p>Talia 76 kart ma cztery kolory — Monety, Butle, Szable, Laski — " +
        "każdy z kartami numerowanymi 1–15. Dodatkowo 16 kart figur " +
        "(8 nazw, każda z wariantem dodatnim i ujemnym):</p>" +
        "<table>" +
        "<tr><th>Karta</th><th>Wartość</th></tr>" +
        "<tr><td>Idiota</td><td>0</td></tr>" +
        "<tr><td>Królowa Obłędu</td><td>+2 / −2</td></tr>" +
        "<tr><td>Wytrzymałość</td><td>+6 / −6</td></tr>" +
        "<tr><td>Równowaga</td><td>+8 / −8</td></tr>" +
        "<tr><td>Pojedynkownik</td><td>+11 / −11</td></tr>" +
        "<tr><td>Dowódca</td><td>+13 / −13</td></tr>" +
        "<tr><td>As</td><td>+15 / −15</td></tr>" +
        "<tr><td>Senator</td><td>+17 / −17</td></tr>" +
        "</table>" +

        "<h3>Wynik ręki</h3>" +
        "<p>Suma wartości wszystkich kart (włącznie z polem interferencji). " +
        "Wartość bezwzględna ma znaczenie — +15 i −15 to oba 15 punktów.</p>" +

        "<h3>Wyniki rundy</h3>" +
        "<ul>" +
        "<li><b>Bomba</b> — wynik 0, powyżej +23 lub poniżej −23. Tracisz 24 punkty.</li>" +
        "<li><b>Czysty Sabacc</b> — dokładnie +23 lub −23. Zyskujesz 24 punkty rundy " +
        "i 46 punktów turnieju.</li>" +
        "<li><b>Array Idioty</b> — Idiota (0) + 2 + 3 = 23. Liczy się jako czysty Sabacc.</li>" +
        "<li><b>Ważny</b> — dowolny wynik od ±1 do ±22. Zyskujesz |wynik| punktów.</li>" +
        "</ul>" +
        "<p>Lider rundy (najwyższy wynik, gdy nikt nie miał czystego Sabacca) " +
        "dostaje bonus +połowa swoich punktów. Remis = brak bonusu.</p>" +

        "<h3>Generator</h3>" +
        "<p>Po każdej turze generator losuje dwie karty. Jeśli są różne, " +
        "wszyscy gracze trzymający pierwszą kartę dostają zamianę na drugą. " +
        "Jeśli takie same — nic się nie dzieje.</p>" +
        "<p>Dwa pola u góry planszy pokazują zastępowaną kartę (po lewej) i jej zamiennik (po prawej).</p>" +

        "<h3>Pole interferencji</h3>" +
        "<p>Każdy gracz ma slot pola. Karta tam liczy się do wyniku, ale jest " +
        "<b>chroniona</b> przed generatorem. Tylko jedna karta naraz.</p>" +
        "<p><b>Ty:</b> przeciągnij kartę do pola; kliknij pole by ją odzyskać.</p>" +
        "<p><b>AI:</b> automatycznie umieszcza ulubioną kartę w polu.</p>" +

        "<h3>Turniej</h3>" +
        "<p>Punkty kumulują się między rundami. Kto pierwszy przekroczy próg " +
        "(konfigurowalny: 500, 1000, 2500 lub 5000), wygrywa. " +
        "Remis na progu = wyższy wins; dokładny remis = remis.</p>",
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
      opponents: "- Twoi przeciwnicy to {names}",
      firstPair: "- Rozdano twoją pierwszą parę",
      youDrew: '- Dobrano kartę „{card}”',
      cpuDrew: '- {race} dobrał kartę „{card}”',
      cpuPasses: "- {race} pasuje",
      cpuPassesDeckDepleted: "- {race} pasuje (brak kart)",
      deckDepletedNoDraw: "- Brak kart \u2014 niemożliwe dobieranie",
      generatorReplaced: '- Generator zamienił „{g1}” na „{g2}”',
      generatorDeckDepleted: "- Generator: brak kart",
      separator: "***********************************************************",
    },

    toast: {
      bomb: "Wypadłeś!",
      pureSabacc: "Czyste Sabacc!",
      fieldOccupied: "Pole interferencji zajęte!",
      nothingToRetrieve: "Brak karty do zwrotu \u2014 najpierw przenieś kartę",
      roundOver: "Runda zakończona! {list}",
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

    // ---- Credits (HTML) ----------------------------------------------
    credits: {
      html:
        '<div class="panel">Wszelkie prawa, projekt itp. należą<br>do Lucasfilm, Ltd<br><br><b>Lucasfilm. Ltd</b><br><br><span class="small">Wszelkie prawa zastrzeżone</span></div>' +
        '<div class="panel">Pomysł<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Kod<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Testowanie i debugowanie<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Grafika<br><br><b>Darth Favourite</b><br><br><span class="small">favourite_2003@mail.ru<br>ICQ#: 297-600-992</span></div>' +
        '<div class="panel">Muzyka<br><br><b>Mark Griskey</b><br><span class="small">(The Sith Lords: Iziz Cantina)</span><br>&amp;<br><b>John Williams</b><br><span class="small">(Star Wars: End Credits)</span></div>' +
        '<div class="panel">Podziękowania<br><br><b>James Luceno</b><br><br><span class="small">za książkę "Agents of Chaos I:<br>Hero\'s Trial"</span></div>' +
        '<div class="panel">A także<br><br><b>George Lucas</b><br><br><span class="small">za wspaniałą sagę<br>« Star Wars »</span></div>' +
        '<div class="panel">Specjalne podziękowania<br><br><b>Denis Konstantin</b><br><br><span class="small">za pomoc z<br>tabelą « Sabacc Tour »</span></div>' +
        '<div class="panel">Spakowano za pomocą<br><br><b><a href="https://web.archive.org/web/20021123121929/http://natata.hn3.net/" target="_blank">Natata eBook Compiler</a></b><br><br><span class="small">oryginalny .exe z 2005 roku powstał w</span></div>' +
        '<div class="panel">A także <b>Microsoft</b><br><br><b>za Notepad</b><br><br><span class="small">i za to, że nie zawiesił się... =)</span></div>',
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);