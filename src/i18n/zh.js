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
      startGame: "\uD83C\uDFB2 开始游戏",
      settings: "\u2699\uFE0F 设置",
      hallOfFame: "\uD83C\uDFC6 名人堂",
      credits: "\uD83C\uDFAC 制作人员",
      exitGame: "\uD83D\uDEAA 退出",
      skip: "跳过",
      language: "语言:",
      settingsTitle: "设置",
      resetHoF: "清除名人堂",
      back: "返回",
      hallOfFameTitle: "名人堂",
      winThreshold: "胜利分数:",
      musicOn: "开",
      musicOff: "关",
      rules: "\uD83D\uDCDC 游戏规则",
      rulesTitle: "萨巴克规则",
    },

    hof: {
      rank: "名次",
      name: "玩家",
      score: "分数",
      rounds: "回合",
      time: "游戏时长",
      empty: "暂无记录 — 去玩一局吧!",
      resetConfirm: "确定要清除名人堂吗?",
    },

    rules: {
      html:
        "<h3>目标</h3>" +
        "<p>第一个超过锦标赛分数上限（默认500）的玩家获胜。 " +
        "你将与4名AI对手同桌竞技。</p>" +

        "<h3>牌堆</h3>" +
        "<p>76张牌堆有四种花色 — 钱币、酒瓶、光剑、权杖 — " +
        "每花色1~15的数字牌。另有16张面牌 " +
        "(8种，各有正负版本):</p>" +
        "<table>" +
        "<tr><th>牌</th><th>点数</th></tr>" +
        "<tr><td>愚者</td><td>0</td></tr>" +
        "<tr><td>疯狂女王</td><td>+2 / −2</td></tr>" +
        "<tr><td>耐力</td><td>+6 / −6</td></tr>" +
        "<tr><td>平衡</td><td>+8 / −8</td></tr>" +
        "<tr><td>决斗者</td><td>+11 / −11</td></tr>" +
        "<tr><td>指挥官</td><td>+13 / −13</td></tr>" +
        "<tr><td>王牌</td><td>+15 / −15</td></tr>" +
        "<tr><td>议员</td><td>+17 / −17</td></tr>" +
        "</table>" +

        "<h3>手牌分数</h3>" +
        "<p>所有牌点数之和（包括干涉场中的牌）。 " +
        "绝对值才重要 — +15和−15都是15分。</p>" +

        "<h3>回合结果</h3>" +
        "<ul>" +
        "<li><b>爆牌</b> — 分数为0、超过+23或低于−23。你失去24分。</li>" +
        "<li><b>纯萨巴克</b> — 恰好+23或−23。你获得24回合分 " +
        "和46锦标赛分。</li>" +
        "<li><b>愚者阵列</b> — 愚者(0) + 2 + 3 = 23。视为纯萨巴克。</li>" +
        "<li><b>有效</b> — ±1到±22的任何分数。你获得|分数|分。</li>" +
        "</ul>" +
        "<p>回合领先者（无人纯萨巴克时最高分者）获得 " +
        "+自己分数一半的奖励。平局无奖励。</p>" +

        "<h3>生成器</h3>" +
        "<p>每回合后生成器选两张牌。若不同， " +
        "所有持有第一张牌的玩家将其替换为第二张。若相同则无变化。</p>" +
        "<p>棋盘顶部的两个字段显示被替换的牌（左）和替换牌（右）。</p>" +

        "<h3>干涉场</h3>" +
        "<p>每位玩家有一个槽位。场中的牌仍计入分数，但<b>受保护</b> " +
        "免受生成器替换。同时只能放一张。</p>" +
        "<p><b>你:</b> 拖牌到干涉场; 点击场取回。</p>" +
        "<p><b>AI:</b> 自动将偏好的牌放入干涉场。</p>" +

        "<h3>锦标赛</h3>" +
        "<p>分数跨回合累计。第一个超过上限（可设置: 500, 1000, 2500, 5000） " +
        "者获胜。同分 = 高者胜; 完全平局 = 平局。</p>",
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
      tournamentTitle: "锦标赛",
      tournamentPoints: "分",
    },

    log: {
      welcome: "{name}, 祝你好运, 别得意忘形!",
      roundHeader: "第 {n} 回合",
      yourScore: "- 当前分数: {score}",
      opponents: "- 你的对手是 {names}",
      firstPair: "- 你的首对牌已发出",
      youDrew: '- 你抽到了「{card}」',
      cpuDrew: '- {race} 抽到了「{card}」',
      cpuPasses: "- {race} 弃权",
      cpuPassesDeckDepleted: "- {race} 弃权 (牌堆耗尽)",
      deckDepletedNoDraw: "- 牌堆耗尽 \u2014 无法再抽",
      generatorReplaced: '- 随机生成器把「{g1}」替换为「{g2}」',
      generatorDeckDepleted: "- 生成器: 牌堆耗尽",
      separator: "***********************************************************",
    },

    toast: {
      bomb: "你爆牌了!",
      pureSabacc: "纯萨巴克!",
      fieldOccupied: "干涉场已被占用!",
      nothingToRetrieve: "没有可取回的牌 \u2014 请先把一张牌放入干涉场",
      roundOver: "回合结束! {list}",
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

    // ---- Credits (HTML) ----------------------------------------------
    credits: {
      html:
        '<div class="panel">所有权利、设计等均属于<br>Lucasfilm, Ltd<br><br><b>Lucasfilm. Ltd</b><br><br><span class="small">版权所有</span></div>' +
        '<div class="panel">创意<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">代码<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">测试与调试<br><br><b>Revan</b><br><br><span class="small">revan1@mail.ru<br>ICQ#: 204-399-592</span></div>' +
        '<div class="panel">图形<br><br><b>Darth Favourite</b><br><br><span class="small">favourite_2003@mail.ru<br>ICQ#: 297-600-992</span></div>' +
        '<div class="panel">音乐<br><br><b>Mark Griskey</b><br><span class="small">(The Sith Lords: Iziz Cantina)</span><br>&amp;<br><b>John Williams</b><br><span class="small">(Star Wars: End Credits)</span></div>' +
        '<div class="panel">感谢<br><br><b>James Luceno</b><br><br><span class="small">感谢著作 "Agents of Chaos I:<br>Hero\'s Trial"</span></div>' +
        '<div class="panel">同时<br><br><b>George Lucas</b><br><br><span class="small">感谢精彩的<br>《星球大战》系列</span></div>' +
        '<div class="panel">特别感谢<br><br><b>Denis Konstantin</b><br><br><span class="small">协助制作<br>「Sabacc Tour」表格</span></div>' +
        '<div class="panel">打包工具<br><br><b><a href="https://web.archive.org/web/20021123121929/http://natata.hn3.net/" target="_blank">Natata eBook Compiler</a></b><br><br><span class="small">2005年的原始.exe使用此工具制作</span></div>' +
        '<div class="panel">同时 <b>Microsoft</b><br><br><b>感谢 Notepad</b><br><br><span class="small">以及没有崩溃... =)</span></div>',
    },
  });
})(typeof window !== "undefined" ? window.i18n : undefined);