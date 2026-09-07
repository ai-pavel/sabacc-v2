// Russian — перевод на основе "Правила.txt" из оригинала 2005 года.
;(function (i18n) {
  i18n.register("RU", {
    __label: "🇷🇺 Русский",

    suits: {
      c: "Монеты",
      f: "Фляги",
      p: "Сабель",
      s: "Шесты",
    },
    faceCards: {
      i: "Идиот",
      q: "Королева Воздуха и Тьмы",
      e: "Выносливость",
      b: "Равновесие",
      d: "Кончина",
      c: "Сдержанность",
      a: "Злоба",
      s: "Звезда",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "Пусто!",

    cpuRaces: [
      "Человек",
      "Убийца-Джедай",
      "Игрок",
      "Контрабандист",
      "Охотник за головами",
    ],
    defaultPlayerName: "Игрок",

    ui: {
      title: "Сабакк Корусанта",
      copyright: "Сабакк Корусанта \u00A9 2005",
      yourName: "Ваше имя:",
      enableMusic: "Включить музыку?",
      startGame: "Начать игру",
      credits: "Создатели",
      language: "Язык:",
    },

    uiGame: {
      interferenceField: "Интерферирующее поле",
      fieldHint: "Перетащите карту сюда, чтобы защитить её",
      nextTurn: "Следующий хід",
      pass: "Пас",
      youAlt: "Вы",
      cpu1Alt: "ИИ 1",
      cpu2Alt: "ИИ 2",
      generatorAlt: "генератор",
      tournamentTitle: "Турнир",
      tournamentPoints: "очк",
    },

    log: {
      welcome: "{name}, удачи и не зазнавайся!",
      roundHeader: "Раунд {n}",
      yourScore: "- Ваш текущий счёт: {score}",
      opponents: "- Ваши соперники: {cpu1} и {cpu2}",
      firstPair: "- Вам роздана первая пара карт",
      youDrew: '- Вы вытянули карту "{card}"',
      cpuDrew: '- {race} вытянул карту "{card}"',
      cpuPasses: "- {race} пасует",
      cpuPassesDeckDepleted: "- {race} пасует (колода исчерпана)",
      deckDepletedNoDraw: "- Колода исчерпана \u2014 ходы невозможны",
      generatorReplaced: '- Случайный генератор заменил карту "{g1}" на "{g2}"',
      generatorDeckDepleted: "- Случайный генератор: колода исчерпана",
      separator: "************************************************************",
    },

    toast: {
      bomb: "Вы разбомбились!",
      pureSabacc: "Чистый сабакк!",
      fieldOccupied: "Интерферирующее поле занято!",
      nothingToRetrieve: "Нечего возвращать \u2014 сначала положите карту в поле",
      roundOver:
        "Раунд окончен! {race1}{score1} | {player}{score} | {race2}{score2}",
      tie: "Турнир заканчивается боевой ничьей!",
      winner: "{name} побеждает в турнире!",
    },

    roundResult: {
      bomb: " разбомбился :(",
      pureSabacc: " Чистый сабакк!",
      valid: " набрал {points} очк.",
    },

    alt: {
      yourField: "Ваше интерферирующее поле",
      opponentField: "Интерферирующее поле соперника",
      cardToYourField: "{card} -> в интерферирующее поле",
      cardToOpponentField: "{card} -> в интерферирующее поле соперника",
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);