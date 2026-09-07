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
      sfxLabel: "¿Efectos de sonido?",
      musicVolume: "Volumen de música:",
      startGame: "\uD83C\uDFB2 Comenzar juego",
      continue: "▶️ Continuar",
      settings: "\u2699\uFE0F Opciones",
      hallOfFame: "\uD83C\uDFC6 Salón de la Fama",
      credits: "\uD83C\uDFAC Créditos",
      exitGame: "\uD83D\uDEAA Salir",
      skip: "Saltar",
      language: "Idioma:",
      settingsTitle: "Opciones",
      resetHoF: "Borrar Salón de la Fama",
      clearSave: "Borrar guardado",
      back: "Volver",
      hallOfFameTitle: "Salón de la Fama",
      winThreshold: "Puntos para ganar:",
      cpuCount: "Oponentes IA:",
      musicOn: "Sí",
      musicOff: "No",
      sfxOn: "Sí",
      sfxOff: "No",
      rules: "\uD83D\uDCDC Reglas del juego",
      rulesTitle: "Reglas del Sabacc",
      difficultyTitle: "Elige tu camino",
      rulesetTitle: "Elige tu variante de Sabacc",
      mainMenu: "Menú principal",
      playAgain: "Jugar de nuevo",
    },

    // ---- End screen (win / lose / tie) -------------------------------
    end: {
      victory: "¡Victoria!",
      defeat: "Derrota",
      tie: "¡Empate!",
      victoryEmoji: "\uD83C\uDFC6",
      defeatEmoji: "\uD83D\uDD1B",
      tieEmoji: "\uD83E\uDDF1",
      youWin: "¡Ganaste el torneo!",
      youLose: "{name} ganó el torneo.",
      tieMessage: "¡El torneo terminó en empate!",
      yourScore: "Tu puntuación: {score}",
      rounds: "Rondas jugadas: {rounds}",
      gameTime: "Tiempo de juego: {time}",
      pureSabaccs: "Sabacc puros: {count}",
    },

    hof: {
      rank: "Pos",
      name: "Jugador",
      score: "Puntos",
      rounds: "Rondas",
      pureSabaccs: "Sabacc puro",
      difficulty: "Dificultad",
      time: "Tiempo",
      empty: "Sin registros — ¡juega una partida!",
      resetConfirm: "¿Borrar el Salón de la Fama?",
    },

    rules: {
      html:
        "<h3>Objetivo</h3>" +
        "<p>Sé el primero en superar el umbral de puntos del torneo (por defecto 500). " +
        "Juegas contra 4 oponentes IA en la misma mesa.</p>" +

        "<h3>La baraja</h3>" +
        "<p>La baraja de 76 cartas tiene cuatro palos — Monedas, Frascos, Sables, Bastones — " +
        "cada uno con cartas numeradas del 1 al 15. Además hay 16 cartas de figura " +
        "(8 nombres, cada una con variante positiva y negativa):</p>" +
        "<table>" +
        "<tr><th>Carta</th><th>Valor</th></tr>" +
        "<tr><td>Idiota</td><td>0</td></tr>" +
        "<tr><td>Reina de la Locura</td><td>+2 / −2</td></tr>" +
        "<tr><td>Resistencia</td><td>+6 / −6</td></tr>" +
        "<tr><td>Equilibrio</td><td>+8 / −8</td></tr>" +
        "<tr><td>Duelista</td><td>+11 / −11</td></tr>" +
        "<tr><td>Comandante</td><td>+13 / −13</td></tr>" +
        "<tr><td>As</td><td>+15 / −15</td></tr>" +
        "<tr><td>Senador</td><td>+17 / −17</td></tr>" +
        "</table>" +

        "<h3>Puntuación de la mano</h3>" +
        "<p>La suma de todas las cartas (incluida la del campo de interferencia). " +
        "El valor absoluto importa — +15 y −15 ambos valen 15.</p>" +

        "<h3>Resultados de la ronda</h3>" +
        "<ul>" +
        "<li><b>Bomba</b> — puntuación de 0, más de +23 o menos de −23. Pierdes 24 puntos.</li>" +
        "<li><b>Sabacc puro</b> — exactamente +23 o −23. Ganas 24 puntos de ronda " +
        "y 46 puntos de torneo.</li>" +
        "<li><b>Array del Idiota</b> — Idiota (0) + 2 + 3 = 23. Cuenta como Sabacc puro.</li>" +
        "<li><b>Válido</b> — cualquier puntuación de ±1 a ±22. Ganas |puntos|.</li>" +
        "</ul>" +
        "<p>El líder de la ronda (el mayor puntador si nadie logró Sabacc puro) " +
        "recibe un bonus de +la mitad de sus puntos. Empates no reciben bonus.</p>" +

        "<h3>El generador</h3>" +
        "<p>Después de cada turno el generador elige dos cartas de la baraja. " +
        "Si son distintas, todos los jugadores que tengan la primera carta la ven " +
        "reemplazada por la segunda. Si coinciden, no pasa nada.</p>" +
        "<p>Los dos campos en la parte superior del tablero muestran la carta reemplazada (izquierda) y su reemplazo (derecha).</p>" +

        "<h3>Campo de interferencia</h3>" +
        "<p>Cada jugador tiene un slot de campo. La carta allí sigue sumando al " +
        "marcador pero está <b>protegida</b> del generador. Solo una carta a la vez.</p>" +
        "<p><b>Tú:</b> arrastra una carta al campo para protegerla; haz clic para recuperarla.</p>" +
        "<p><b>IA:</b> mueve automáticamente una carta favorita al campo cuando aparece.</p>" +

        "<h3>Torneo</h3>" +
        "<p>Los puntos se acumulan entre rondas. El primero en superar el umbral " +
        "(configurable: 500, 1000, 2500 o 5000) gana. Empate en el mismo umbral = " +
        "gana el mayor; empate exacto = empate.</p>",
    },

    uiGame: {
      interferenceField: "Campo de interferencia",
      fieldHint: "Arrastra una carta aquí para protegerla",
      nextTurn: "Sacar carta",
      pass: "Pasar",
      youAlt: "Tú",
      cpu1Alt: "IA 1",
      cpu2Alt: "IA 2",
      generatorAlt: "generador",
      tournamentTitle: "Torneo",
      tournamentPoints: "pts",
    },

    log: {
      welcome: "¡{name}, buena suerte y no te confíes!",
      roundHeader: "Ronda {n}",
      yourScore: "- Tu puntaje actual: {score}",
      opponents: "- Tus oponentes son {names}",
      firstPair: "- Te repartieron tu primera pareja",
      youDrew: '- Robaste la carta "{card}"',
      cpuDrew: '- {race} robó la carta "{card}"',
      cpuPasses: "- {race} pasa",
      cpuPassesDeckDepleted: "- {race} pasa (mazo agotado)",
      deckDepletedNoDraw: "- Mazo agotado \u2014 no más robos",
      generatorReplaced: '- El generador reemplazó la carta "{g1}" por "{g2}"',
      generatorDeckDepleted: "- Generador: mazo agotado",
      separator: "***********************************************************",
      traditional:
        "<h3>Objetivo</h3><p>Ser el primero en superar el umbral de puntos.</p>" +
        "<h3>Baraja</h3><p>76 cartas: 1-15 en 4 palos + 16 cartas de figura.</p>" +
        "<h3>Meta</h3><p>Acercarse a +/-23. Idiota + 2 + 3 = Array del Idiota (Sabacc puro).</p>" +
        "<h3>Generador</h3><p>Toma 2 cartas cada turno; reemplaza la primera con la segunda.</p>" +
        "<h3>Campo</h3><p>Protege 1 carta del generador.</p>",
      spike:
        "<h3>Corellian Spike</h3><p>Variante rapida con baraja menor y dados.</p>" +
        "<h3>Baraja</h3><p>42 cartas: 4 palos 1-10 + 2 Idiotas (0).</p>" +
        "<h3>Meta</h3><p>Acercarse a <b>0</b> (no a 23).</p>" +
        "<h3>Dados</h3><p>Cada turno se tiran 2 dados. <b>Dobles</b> cambian todas las cartas.</p>" +
        "<h3>Puntos</h3><p>0 = Sabacc puro (+60 pts). Bomba si lejos de 0. Sino |puntos| pts.</p>" +
        "<h3>Sin campo</h3><p>No hay campo de interferencia.</p>",
      gungan:
        "<h3>Otoh Gunga</h3><p>Variante donde <b>los puntajes bajos ganan</b>.</p>" +
        "<h3>Baraja</h3><p>76 cartas estandar.</p>" +
        "<h3>Meta</h3><p>Cercano a <b>0</b>. Menor |puntaje| gana. 0 = Sabacc puro.</p>" +
        "<h3>Generador</h3><p>Activo como en tradicional.</p>" +
        "<h3>Campo</h3><p>Disponible, mismas reglas.</p>" +
        "<h3>Puntos</h3><p>0 = Sabacc puro (+46 pts). Sino |puntaje| pts.</p>",
    },

    toast: {
      bomb: "¡Te bombaste!",
      pureSabacc: "¡Sabacc puro!",
      idiotsArray: "¡Array del Idiota!",
      fieldOccupied: "¡Campo de interferencia ocupado!",
      nothingToRetrieve: "Nada que devolver \u2014 primero mueve una carta al campo",
      roundOver: "¡Ronda terminada! {list}",
      tie: "¡El torneo termina en empate!",
      winner: "¡{name} gana el torneo!",
      saveCleared: "Guardado borrado",
    },

    roundResult: {
      bomb: " bombado :(",
      pureSabacc: " ¡Sabacc puro!",
      valid: " {points} pts.",
    },

    // ---- Ruleset variants ----
    ruleset: {
      traditional: "Sabacc tradicional",
      traditionalDesc: "76 cartas, objetivo +/-23, generador, campo de interferencia",
      spike: "Corellian Spike",
      spikeDesc: "42 cartas, objetivo 0, dados en lugar de generador, dobles cambian cartas",
      gungan: "Otoh Gunga",
      gunganDesc: "Baraja estandar, gana el menor puntaje, mas cerca de 0",
    },

    // ---- Difficulty presets ----
    difficulty: {
      youngling: "🟢 Joven",
      younglingDesc: "Entrenamiento en el Templo Jedi - 1 oponente normal, partidas rapidas",
      padawan: "🔵 Padawan",
      padawanDesc: "Aprendiendo los caminos de la Fuerza - 2 oponentes cautelosos",
      knight: "🟡 Caballero",
      knightDesc: "Un Caballero Jedi no busca estas cosas - 3 oponentes variados",
      sithlord: "🔴 Lord Sith",
      sithlordDesc: "El lado oscuro de la Fuerza - 4 oponentes agresivos",
      grandmaster: "⚔️ Gran Maestro",
      grandmasterDesc: "El tamano no importa - 4 oponentes temerarios, maraton",
    },


    roundSummary: {
      title: "Resultados de la ronda",
      continue: "Continuar",
      hand: "Mano",
      result: "Resultado",
    },


    alt: {
      yourField: "Tu campo de interferencia",
      opponentField: "Campo de interferencia del oponente",
      cardToYourField: "{card} -> campo de interferencia",
      cardToOpponentField: "{card} -> campo del oponente",
    },

    credits: {
      html:
        '<div class="panel">Todos los derechos, diseño, etc. pertenecen<br>a Lucasfilm, Ltd<br><br><b>Lucasfilm. Ltd</b><br><br><span class="small">Todos los derechos reservados</span></div>' +
        '<div class="panel">Idea<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Código<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Pruebas y depuración<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Gráficos<br><br><b>Darth Favourite</b><br><br><span class="small">favourite_2003@mail.ru<br>ICQ#: 297-600-992</span></div>' +
        '<div class="panel">Música<br><br><b>Mark Griskey</b><br><span class="small">(The Sith Lords: Iziz Cantina)</span><br>&amp;<br><b>John Williams</b><br><span class="small">(Star Wars: End Credits)</span></div>' +
        '<div class="panel">Gracias<br><br><b>James Luceno</b><br><br><span class="small">por el libro "Agents of Chaos I:<br>Hero\'s Trial"</span></div>' +
        '<div class="panel">Y también<br><br><b>George Lucas</b><br><br><span class="small">por la magnífica saga<br>"Star Wars"</span></div>' +
        '<div class="panel">Agradecimiento especial<br><br><b>Denis Konstantin</b><br><br><span class="small">por su ayuda con<br>la tabla "Sabacc Tour"</span></div>' +
        '<div class="panel">Empaquetado con<br><br><b><a href="https://web.archive.org/web/20021123121929/http://natata.hn3.net/" target="_blank">Natata eBook Compiler</a></b><br><br><span class="small">el .exe original de 2005 fue creado con</span></div>' +
        '<div class="panel">Y también <b>Microsoft</b><br><br><b>por Notepad</b><br><br><span class="small">y por no colgarse... =)</span></div>',
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);