// 简体中文
;(function (i18n) {
  i18n.register("ZH", {
    __label: "🇨🇳 简体中文",

    suits: {
      c: "钱币",
      f: "酒瓶",
      p: "光剑",
      s: "权杖",
    },
    faceCards: {
      i: "愚者",
      q: "疯狂女王",
      e: "耐力",
      b: "平衡",
      d: "决斗者",
      c: "指挥官",
      a: "王牌",
      s: "议员",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "空!",

    cpuRaces: [
      "人类",
      "绝地杀手",
      "赌徒",
      "走私客",
      "赏金猎人",
    ],
    defaultPlayerName: "玩家",

    ui: {
      title: "科洛桑萨巴克",
      copyright: "科洛桑萨巴克 \u00A9 2005",
      yourName: "你的名字:",
      enableMusic: "播放音乐?",
      startGame: "开始游戏",
      credits: "制作人员",
      language: "语言:",
    },

    uiGame: {
      interferenceField: "干涉场",
      fieldHint: "把一张牌拖到这里以保护它",
      nextTurn: "下一回合",
      pass: "弃权",
      youAlt: "你",
      cpu1Alt: "AI 1",
      cpu2Alt: "AI 2",
      generatorAlt: "生成器",
    },

    log: {
      welcome: "{name}, 祝你好运, 别得意忘形!",
      roundHeader: "第 {n} 回合",
      tournamentTable:
        "***** 锦标赛排行榜 *****\n" +
        "{race1} - {points1}\n" +
        "{player} - {points3}\n" +
        "{race2} - {points2}\n" +
        "************************************************************",
      yourScore: "- 当前分数: {score}",
      opponents: "- 你的对手是 {cpu1} 和 {cpu2}",
      firstPair: "- 你的首对牌已发出",
      youDrew: '- 你抽到了「{card}」',
      cpuDrew: '- {race} 抽到了「{card}」',
      cpuPasses: "- {race} 弃权",
      cpuPassesDeckDepleted: "- {race} 弃权 (牌堆耗尽)",
      deckDepletedNoDraw: "- 牌堆耗尽 \u2014 无法再抽",
      generatorReplaced: '- 随机生成器把「{g1}」替换为「{g2}」',
      generatorDeckDepleted: "- 生成器: 牌堆耗尽",
      separator: "************************************************************",
    },

    toast: {
      bomb: "你爆牌了!",
      pureSabacc: "纯萨巴克!",
      fieldOccupied: "干涉场已被占用!",
      nothingToRetrieve: "没有可取回的牌 \u2014 请先把一张牌放入干涉场",
      roundOver:
        "回合结束! {race1}{score1} | {player}{score} | {race2}{score2}",
      tie: "锦标赛以平局结束!",
      winner: "{name} 赢得锦标赛!",
    },

    roundResult: {
      bomb: " 爆牌 :(",
      pureSabacc: " 纯萨巴克!",
      valid: " {points} 分",
    },

    alt: {
      yourField: "你的干涉场",
      opponentField: "对手的干涉场",
      cardToYourField: "{card} -> 干涉场",
      cardToOpponentField: "{card} -> 对手干涉场",
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);