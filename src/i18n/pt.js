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
      sfxLabel: "Efeitos sonoros?",
      musicVolume: "Volume da música:",
      startGame: "\uD83C\uDFB2 Iniciar jogo",
      continue: "▶️ Continuar",
      settings: "\u2699\uFE0F Opções",
      hallOfFame: "\uD83C\uDFC6 Hall da Fama",
      credits: "\uD83C\uDFAC Créditos",
      exitGame: "\uD83D\uDEAA Sair",
      skip: "Pular",
      language: "Idioma:",
      settingsTitle: "Opções",
      resetHoF: "Limpar Hall da Fama",
      clearSave: "Limpar save",
      back: "Voltar",
      hallOfFameTitle: "Hall da Fama",
      winThreshold: "Pontos para vencer:",
      cpuCount: "Oponentes IA:",
      musicOn: "Sim",
      musicOff: "Não",
      sfxOn: "Sim",
      sfxOff: "Não",
      rules: "\uD83D\uDCDC Regras do jogo",
      rulesTitle: "Regras do Sabacc",
      mainMenu: "Menu principal",
      playAgain: "Jogar novamente",
    },

    // ---- End screen (win / lose / tie) -------------------------------
    end: {
      victory: "Vitória!",
      defeat: "Derrota",
      tie: "Empate!",
      victoryEmoji: "\uD83C\uDFC6",
      defeatEmoji: "\uD83D\uDD1B",
      tieEmoji: "\uD83E\uDDF1",
      youWin: "Você venceu o torneio!",
      youLose: "{name} venceu o torneio.",
      tieMessage: "O torneio terminou em empate!",
      yourScore: "Sua pontuação: {score}",
      rounds: "Rodadas jogadas: {rounds}",
      gameTime: "Tempo de jogo: {time}",
      pureSabaccs: "Sabacc puros: {count}",
    },

    hof: {
      rank: "Pos",
      name: "Jogador",
      score: "Pontos",
      rounds: "Rodadas",
      pureSabaccs: "Sabacc puros",
      time: "Duração",
      empty: "Sem registros — jogue uma partida!",
      resetConfirm: "Limpar o Hall da Fama?",
    },

    rules: {
      html:
        "<h3>Objetivo</h3>" +
        "<p>Seja o primeiro a ultrapassar o limite de pontos do torneio (500 padrão). " +
        "Você joga contra 4 oponentes IA na mesma mesa.</p>" +

        "<h3>O baralho</h3>" +
        "<p>O baralho de 76 cartas tem quatro naipes — Moedas, Frascos, Sabres, Bastões — " +
        "cada um com cartas numeradas de 1 a 15. Mais 16 cartas de figura " +
        "(8 nomes, cada uma com variante positiva e negativa):</p>" +
        "<table>" +
        "<tr><th>Carta</th><th>Valor</th></tr>" +
        "<tr><td>Idiota</td><td>0</td></tr>" +
        "<tr><td>Rainha da Loucura</td><td>+2 / −2</td></tr>" +
        "<tr><td>Resistência</td><td>+6 / −6</td></tr>" +
        "<tr><td>Equilíbrio</td><td>+8 / −8</td></tr>" +
        "<tr><td>Duelista</td><td>+11 / −11</td></tr>" +
        "<tr><td>Comandante</td><td>+13 / −13</td></tr>" +
        "<tr><td>Ás</td><td>+15 / −15</td></tr>" +
        "<tr><td>Senador</td><td>+17 / −17</td></tr>" +
        "</table>" +

        "<h3>Pontuação da mão</h3>" +
        "<p>Soma de todas as cartas (incluindo o campo de interferência). " +
        "O valor absoluto importa — +15 e −15 valem 15 cada.</p>" +

        "<h3>Resultados da rodada</h3>" +
        "<ul>" +
        "<li><b>Bomba</b> — pontuação 0, acima de +23 ou abaixo de −23. Você perde 24 pontos.</li>" +
        "<li><b>Sabacc puro</b> — exatamente +23 ou −23. Você ganha 24 pontos de rodada " +
        "e 46 pontos de torneio.</li>" +
        "<li><b>Array do Idiota</b> — Idiota (0) + 2 + 3 = 23. Conta como Sabacc puro.</li>" +
        "<li><b>Válido</b> — qualquer pontuação de ±1 a ±22. Você ganha |pontos|.</li>" +
        "</ul>" +
        "<p>O líder da rodada (maior pontuador sem Sabacc puro) recebe " +
        "bônus de +metade dos pontos. Empate = sem bônus.</p>" +

        "<h3>O gerador</h3>" +
        "<p>Após cada turno o gerador escolhe duas cartas. Se diferentes, " +
        "todos com a primeira carta a veem substituída pela segunda. " +
        "Se iguais, nada acontece.</p>" +
        "<p>Os dois campos no topo do tabuleiro mostram a carta substituída (esquerda) e sua substituição (direita).</p>" +

        "<h3>Campo de interferência</h3>" +
        "<p>Cada jogador tem um slot. A carta conta mas está <b>protegida</b> " +
        "do gerador. Apenas uma carta por vez.</p>" +
        "<p><b>Você:</b> arraste uma carta para o campo; clique para recuperá-la.</p>" +
        "<p><b>IA:</b> move automaticamente uma carta favorita para o campo.</p>" +

        "<h3>Torneio</h3>" +
        "<p>Pontos se acumulam entre rodadas. O primeiro a ultrapassar o limite " +
        "(configurável: 500, 1000, 2500 ou 5000) vence. Empate = " +
        "maior total vence; empate exato = empate.</p>",
    },

    uiGame: {
      interferenceField: "Campo de interferência",
      fieldHint: "Arraste uma carta para cá para protegê-la",
      nextTurn: "Sacar carta",
      pass: "Passar",
      youAlt: "Você",
      cpu1Alt: "IA 1",
      cpu2Alt: "IA 2",
      generatorAlt: "gerador",
      tournamentTitle: "Torneio",
      tournamentPoints: "pts",
    },

    log: {
      welcome: "{name}, boa sorte e não fique arrogante!",
      roundHeader: "Rodada {n}",
      yourScore: "- Sua pontuação atual: {score}",
      opponents: "- Seus oponentes são {names}",
      firstPair: "- Sua primeira par foi distribuída",
      youDrew: '- Você sacou a carta "{card}"',
      cpuDrew: '- {race} sacou a carta "{card}"',
      cpuPasses: "- {race} passa",
      cpuPassesDeckDepleted: "- {race} passa (baralho esgotado)",
      deckDepletedNoDraw: "- Baralho esgotado \u2014 sem mais saques",
      generatorReplaced: '- O gerador trocou "{g1}" por "{g2}"',
      generatorDeckDepleted: "- Gerador: baralho esgotado",
      separator: "***********************************************************",
    },

    toast: {
      bomb: "Você estourou!",
      pureSabacc: "Sabacc puro!",
      idiotsArray: "Array do Idiota!",
      fieldOccupied: "Campo de interferência ocupado!",
      nothingToRetrieve: "Nada para devolver \u2014 mova uma carta primeiro",
      roundOver: "Rodada encerrada! {list}",
      tie: "O torneio termina em empate!",
      winner: "{name} vence o torneio!",
      saveCleared: "Save limpo",
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

    // ---- Credits (HTML) ----------------------------------------------
    credits: {
      html:
        '<div class="panel">Todos os direitos, design, etc. pertencem<br>a Lucasfilm, Ltd<br><br><b>Lucasfilm. Ltd</b><br><br><span class="small">Todos os direitos reservados</span></div>' +
        '<div class="panel">Ideia<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Código<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Testes e depuração<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">Gráficos<br><br><b>Darth Favourite</b><br><br><span class="small">favourite_2003@mail.ru<br>ICQ#: 297-600-992</span></div>' +
        '<div class="panel">Música<br><br><b>Mark Griskey</b><br><span class="small">(The Sith Lords: Iziz Cantina)</span><br>&amp;<br><b>John Williams</b><br><span class="small">(Star Wars: End Credits)</span></div>' +
        '<div class="panel">Agradecimentos<br><br><b>James Luceno</b><br><br><span class="small">pelo livro "Agents of Chaos I:<br>Hero\'s Trial"</span></div>' +
        '<div class="panel">E também<br><br><b>George Lucas</b><br><br><span class="small">pela magnífica saga<br>« Star Wars »</span></div>' +
        '<div class="panel">Agradecimento especial<br><br><b>Denis Konstantin</b><br><br><span class="small">pela ajuda com<br>a tabela « Sabacc Tour »</span></div>' +
        '<div class="panel">Empacotado com<br><br><b><a href="https://web.archive.org/web/20021123121929/http://natata.hn3.net/" target="_blank">Natata eBook Compiler</a></b><br><br><span class="small">o .exe original de 2005 foi criado com</span></div>' +
        '<div class="panel">E também <b>Microsoft</b><br><br><b>pelo Notepad</b><br><br><span class="small">e por não travar... =)</span></div>',
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);