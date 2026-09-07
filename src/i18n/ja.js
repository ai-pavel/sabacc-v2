// 日本語
;(function (i18n) {
  i18n.register("JA", {
    __label: "🇯🇵 日本語",

    suits: {
      c: "コイン",
      f: "フラスク",
      p: "セイバー",
      s: "スタッフ",
    },
    faceCards: {
      i: "愚か者",
      q: "狂気の女王",
      e: "耐久力",
      b: "均衡",
      d: "決闘者",
      c: "司令官",
      a: "エース",
      s: "元老院議員",
    },
    positiveSuffix: "(+)",
    negativeSuffix: "(-)",
    emptyCard: "空!",

    cpuRaces: [
      "人間",
      "ジェダイ・キラー",
      "ギャンブラー",
      "密輸業者",
      "賞金稼ぎ",
    ],
    defaultPlayerName: "プレイヤー",

    ui: {
      title: "コルサントのサバック",
      copyright: "コルサントのサバック \u00A9 2005",
      yourName: "名前:",
      enableMusic: "音楽を再生する?",
      startGame: "ゲーム開始",
      credits: "クレジット",
      language: "言語:",
    },

    uiGame: {
      interferenceField: "干渉フィールド",
      fieldHint: "カードをここにドラッグして保護",
      nextTurn: "次のターン",
      pass: "パス",
      youAlt: "あなた",
      cpu1Alt: "AI 1",
      cpu2Alt: "AI 2",
      generatorAlt: "ジェネレータ",
      tournamentTitle: "トーナメント",
      tournamentPoints: "点",
    },

    log: {
      welcome: "{name}、幸運を。うぬぼれないように!",
      roundHeader: "ラウンド {n}",
      yourScore: "- 現在のスコア: {score}",
      opponents: "- 対戦相手は {names}",
      firstPair: "- 最初のペアが配られました",
      youDrew: '- カード「{card}」を引きました',
      cpuDrew: '- {race} がカード「{card}」を引きました',
      cpuPasses: "- {race} はパス",
      cpuPassesDeckDepleted: "- {race} はパス (山札切れ)",
      deckDepletedNoDraw: "- 山札切れ \u2014 ドロー不可",
      generatorReplaced: '- ジェネレータが「{g1}」を「{g2}」に置換',
      generatorDeckDepleted: "- ジェネレータ: 山札切れ",
      separator: "***********************************************************",
    },

    toast: {
      bomb: "バンクしました!",
      pureSabacc: "純サバック!",
      fieldOccupied: "干渉フィールドが埋まっています!",
      nothingToRetrieve: "戻すカードがありません \u2014 先にカードを置いてください",
      roundOver: "ラウンド終了! {list}",
      tie: "トーナメントは引き分け!",
      winner: "{name} がトーナメント優勝!",
    },

    roundResult: {
      bomb: " バンク :(",
      pureSabacc: " 純サバック!",
      valid: " {points} 点",
    },

    alt: {
      yourField: "あなたの干渉フィールド",
      opponentField: "相手の干渉フィールド",
      cardToYourField: "{card} -> 干渉フィールド",
      cardToOpponentField: "{card} -> 相手のフィールド",
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);