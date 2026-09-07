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
      startGame: "\uD83C\uDFB2 ゲーム開始",
      settings: "\u2699\uFE0F 設定",
      hallOfFame: "\uD83C\uDFC6 殿堂",
      credits: "\uD83C\uDFAC クレジット",
      exitGame: "\uD83D\uDEAA 終了",
      skip: "スキップ",
      language: "言語:",
      settingsTitle: "設定",
      resetHoF: "殿堂をリセット",
      back: "戻る",
      hallOfFameTitle: "殿堂",
      winThreshold: "勝利ポイント:",
      musicOn: "オン",
      musicOff: "オフ",
      rules: "\uD83D\uDCDC ゲームルール",
      rulesTitle: "サバックのルール",
      mainMenu: "メインメニュー",
      playAgain: "もう一度プレイ",
    },

    // ---- End screen (win / lose / tie) -------------------------------
    end: {
      victory: "勝利!",
      defeat: "敗北",
      tie: "引き分け!",
      victoryEmoji: "\uD83C\uDFC6",
      defeatEmoji: "\uD83D\uDD1B",
      tieEmoji: "\uD83E\uDDF1",
      youWin: "トーナメント優勝!",
      youLose: "{name} がトーナメント優勝。",
      tieMessage: "トーナメントは引き分け!",
      yourScore: "あなたのスコア: {score}",
      rounds: "プレイしたラウンド: {rounds}",
      gameTime: "プレイ時間: {time}",
    },

    hof: {
      rank: "順位",
      name: "プレイヤー",
      score: "スコア",
      rounds: "ラウンド",
      time: "プレイ時間",
      empty: "記録なし — プレイしましょう!",
      resetConfirm: "殿堂をリセットしますか?",
    },

    rules: {
      html:
        "<h3>目標</h3>" +
        "<p>トーナメントのポイント上限（デフォルト500）を最初に超えたプレイヤーが勝者。 " +
        "4人のAI対戦相手と同じテーブルで戦います。</p>" +

        "<h3>デッキ</h3>" +
        "<p>76枚のデッキは4つのスート — コイン、フラスク、セイバー、スタッフ — " +
        "各1〜15の数字カード。加えて16枚の絵カード " +
        "(8種類、各正負のバリアント):</p>" +
        "<table>" +
        "<tr><th>カード</th><th>値</th></tr>" +
        "<tr><td>愚か者</td><td>0</td></tr>" +
        "<tr><td>狂気の女王</td><td>+2 / −2</td></tr>" +
        "<tr><td>耐久力</td><td>+6 / −6</td></tr>" +
        "<tr><td>均衡</td><td>+8 / −8</td></tr>" +
        "<tr><td>決闘者</td><td>+11 / −11</td></tr>" +
        "<tr><td>司令官</td><td>+13 / −13</td></tr>" +
        "<tr><td>エース</td><td>+15 / −15</td></tr>" +
        "<tr><td>元老院議員</td><td>+17 / −17</td></tr>" +
        "</table>" +

        "<h3>手札のスコア</h3>" +
        "<p>全カードの合計（干渉フィールド含む）。 " +
        "絶対値が重要 — +15も−15も15ポイント。</p>" +

        "<h3>ラウンド結果</h3>" +
        "<ul>" +
        "<li><b>バンク</b> — スコア0、+23超、または−23未満。24ポイント失う。</li>" +
        "<li><b>純サバック</b> — 丁度+23または−23。ラウンド24ポイント " +
        "とトーナメント46ポイント獲得。</li>" +
        "<li><b>愚か者の配列</b> — 愚か者(0) + 2 + 3 = 23。純サバック扱い。</li>" +
        "<li><b>有効</b> — ±1〜±22のスコア。|スコア|ポイント獲得。</li>" +
        "</ul>" +
        "<p>ラウンドリーダー（純サバックなしなら最高得点者）は " +
        "自分のポイントの+半分のボーナス。同点はボーナスなし。</p>" +

        "<h3>ジェネレータ</h3>" +
        "<p>各ターン後ジェネレータが2枚選ぶ。異なれば、 " +
        "最初のカードを持つ全プレイヤーは2枚目に置換。同じなら何も起きない。</p>" +
        "<p>ボード上部の2つのフィールドは置換されるカード（左）と置換先（右）を表示します。</p>" +

        "<h3>干渉フィールド</h3>" +
        "<p>各プレイヤーに1スロット。カードはスコアに含まれるが " +
        "ジェネレータから<b>保護</b>される。同時に1枚のみ。</p>" +
        "<p><b>あなた:</b> カードをドラッグ; クリックで回収。</p>" +
        "<p><b>AI:</b> お気に入りカードを自動的にフィールドへ。</p>" +

        "<h3>トーナメント</h3>" +
        "<p>ポイントはラウンド間で蓄積。上限（設定可能: 500, 1000, 2500, 5000）を " +
        "最初に超えた者勝ち。同ポイント = 高い方勝ち; 完全同点 = 引き分け。</p>",
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

    // ---- Credits (HTML) ----------------------------------------------
    credits: {
      html:
        '<div class="panel">すべての権利、デザインなどは<br>Lucasfilm, Ltd に帰属します<br><br><b>Lucasfilm. Ltd</b><br><br><span class="small">All rights reserved</span></div>' +
        '<div class="panel">アイデア<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">コード<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">テストとデバッグ<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">グラフィック<br><br><b>Darth Favourite</b><br><br><span class="small">favourite_2003@mail.ru<br>ICQ#: 297-600-992</span></div>' +
        '<div class="panel">音楽<br><br><b>Mark Griskey</b><br><span class="small">(The Sith Lords: Iziz Cantina)</span><br>&amp;<br><b>John Williams</b><br><span class="small">(Star Wars: End Credits)</span></div>' +
        '<div class="panel">感謝<br><br><b>James Luceno</b><br><br><span class="small">著書 "Agents of Chaos I:<br>Hero\'s Trial"</span></div>' +
        '<div class="panel">そして<br><br><b>George Lucas</b><br><br><span class="small">素晴らしい<br>「スター・ウォーズ」サーガ</span></div>' +
        '<div class="panel">スペシャルサンクス<br><br><b>Denis Konstantin</b><br><br><span class="small">「Sabacc Tour」テーブルの<br>協力に感謝</span></div>' +
        '<div class="panel">パッケージ化に使用<br><br><b><a href="https://web.archive.org/web/20021123121929/http://natata.hn3.net/" target="_blank">Natata eBook Compiler</a></b><br><br><span class="small">2005年のオリジナル.exeはこれで作られました</span></div>' +
        '<div class="panel">そして <b>Microsoft</b><br><br><b>Notepad に</b><br><br><span class="small">そしてクラッシュしないことに... =)</span></div>',
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);