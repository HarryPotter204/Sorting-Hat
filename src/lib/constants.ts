import type { House, HouseName, QuizQuestion } from './types'; 
import { GryffindorIcon, RavenclawIcon, HufflepuffIcon, SlytherinIcon } from '@/components/icons/HouseIcons';

export const HOGWARTS_HOUSES: Record<HouseName, House> = {
  Gryffindor: {
    name: 'グリフィンドール',
    colors: { primaryHex: '#7F0909', secondaryHex: '#FFD700', primaryVar: '--gryffindor-primary', secondaryVar: '--gryffindor-secondary' },
    crest: '/crests/gryffindor.png',
    values: ['勇気', '勇敢さ', '度胸', '騎士道'],
    founder: 'ゴドリック・グリフィンドール',
    animal: 'ライオン',
    element: '火',
    ghost: 'ニック・Nearly Headless',
    commonRoom: 'グリフィンドール塔',
    notableAlumni: ['ハリー・ポッター', 'ハーマイオニー・グレンジャー', 'ロン・ウィーズリー', 'アルバス・ダンブルドア'],
    quote: "あなたはグリフィンドールにふさわしいかもしれない\n勇気ある者の住む場所\nその大胆さ、度胸、騎士道が\nグリフィンドールを際立たせる",
    IconComponent: GryffindorIcon,
    dataAiHint: 'lion shield'
  },
  Ravenclaw: {
    name: 'レイブンクロー',
    colors: { primaryHex: '#0E1A40', secondaryHex: '#946B2D', primaryVar: '--ravenclaw-primary', secondaryVar: '--ravenclaw-secondary' },
    crest: '/crests/ravenclaw.png',
    values: ['知性', '学習', '知恵', '機知'],
    founder: 'ロウェナ・レイブンクロー',
    animal: 'ワシ',
    element: '風',
    ghost: 'グレイ・レディ',
    commonRoom: 'レイブンクロー塔',
    notableAlumni: ['ルーナ・ラブグッド', 'フィリウス・フリットウィック', 'ギルデロイ・ロックハート', 'チョウ・チャン'],
    quote: "または賢き古きレイブンクローに\n準備のできた心を持つ者たちの場所\n機知と学びを持つ者たちは\n常に同類を見つけるだろう",
    IconComponent: RavenclawIcon,
    dataAiHint: 'eagle shield'
  },
  Hufflepuff: {
    name: 'ハッフルパフ',
    colors: { primaryHex: '#EEE117', secondaryHex: '#000000', primaryVar: '--hufflepuff-primary', secondaryVar: '--hufflepuff-secondary' },
    crest: '/crests/hufflepuff.png',
    values: ['勤勉', '忍耐', '公正', '忠誠'],
    founder: 'ヘルガ・ハッフルパフ',
    animal: 'アナグマ',
    element: '土',
    ghost: '太った修道士',
    commonRoom: 'ハッフルパフ地下室',
    notableAlumni: ['ニュート・スキャマンダー', 'セドリック・ディゴリー', 'ニンファドーラ・トンクス', 'ポモーナ・スプロウト'],
    quote: "あなたはハッフルパフにふさわしいかもしれない\n彼らは公正で忠実\n忍耐強きハッフルパフは真実で\n労を恐れない",
    IconComponent: HufflepuffIcon,
    dataAiHint: 'badger shield'
  },
  Slytherin: {
    name: 'スリザリン',
    colors: { primaryHex: '#2A623D', secondaryHex: '#AAAAAA', primaryVar: '--slytherin-primary', secondaryVar: '--slytherin-secondary' },
    crest: '/crests/slytherin.png',
    values: ['野心', '狡猾さ', '指導力', '才覚'],
    founder: 'サラザール・スリザリン',
    animal: 'ヘビ',
    element: '水',
    ghost: '血塗れ男爵',
    commonRoom: 'スリザリン地下室',
    notableAlumni: ['セブルス・スネイプ', 'ドラコ・マルフォイ', 'ヴォルデモート卿', 'ベラトリックス・レストレンジ'],
    quote: "あるいはスリザリンにいるかもしれない\n本当の友を見つけるだろう\n狡猾な者たちは\n目的達成のため手段を選ばない",
    IconComponent: SlytherinIcon,
    dataAiHint: 'serpent shield'
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'qv2-01',
    text: "入学初日、誰も知らない大広間に入った。まずどうする？",
    order: 1,
    isActive: true,
    options: [
      { id: 'qv2-01o1', text: "気になる人に自分から話しかける", houseAffinity: { Gryffindor: 2 }, reason: "誰も知らない場所で自分から一歩踏み出す行動力は、グリフィンドールの勇気そのものです。" },
      { id: 'qv2-01o2', text: "周囲の建築や装飾をじっくり観察する", houseAffinity: { Ravenclaw: 2 }, reason: "周囲を静かに観察し仕組みを理解しようとする姿は、レイブンクローの知性です。" },
      { id: 'qv2-01o3', text: "困っている人がいないか気にする", houseAffinity: { Hufflepuff: 2 }, reason: "困っている人がいないか気を配る優しさは、ハッフルパフの誠実さです。" },
      { id: 'qv2-01o4', text: "まず周囲の人間関係を把握する", houseAffinity: { Slytherin: 2 }, reason: "まず人間関係を読んで立ち回りを決める冷静さは、スリザリンの戦略眼です。" }
    ]
  },
  {
    id: 'qv2-02',
    text: "禁じられた扉を見つけた。あなたなら？",
    order: 2,
    isActive: true,
    options: [
      { id: 'qv2-02o1', text: "自分に得があるか考える", houseAffinity: { Slytherin: 2 }, reason: "得失を冷静に測って動く判断は、スリザリンの野心と計画性の表れです。" },
      { id: 'qv2-02o2', text: "誰かと相談してから決める", houseAffinity: { Hufflepuff: 2 }, reason: "ひとりで決めず信頼できる相手と相談する誠実さは、ハッフルパフの心です。" },
      { id: 'qv2-02o3', text: "とりあえず開けてみる", houseAffinity: { Gryffindor: 2 }, reason: "迷わず禁じられた扉を開いてみる大胆さは、グリフィンドールの勇気そのものです。" },
      { id: 'qv2-02o4', text: "なぜ禁止されているのか調べる", houseAffinity: { Ravenclaw: 2 }, reason: "禁じられた理由を突き止めようとする探究心は、レイブンクローの知性です。" }
    ]
  },
  {
    id: 'qv2-03',
    text: "グループ課題で意見がまとまらない。どうする？",
    order: 3,
    isActive: true,
    options: [
      { id: 'qv2-03o1', text: "全員が納得できる方法を探す", houseAffinity: { Hufflepuff: 2 }, reason: "全員が納得できる道を探す姿勢は、ハッフルパフの協調性です。" },
      { id: 'qv2-03o2', text: "自分が先頭に立って決断する", houseAffinity: { Gryffindor: 2 }, reason: "先頭に立って決断を下す度胸は、グリフィンドールの勇気です。" },
      { id: 'qv2-03o3', text: "最終的な成果が最大になる方法を選ぶ", houseAffinity: { Slytherin: 2 }, reason: "最終的な成果の最大化を最優先する視点は、スリザリンの野心です。" },
      { id: 'qv2-03o4', text: "それぞれの意見を整理して最適解を探す", houseAffinity: { Ravenclaw: 2 }, reason: "意見を整理し最適解を導き出す知性は、レイブンクローの論理力です。" }
    ]
  },
  {
    id: 'qv2-04',
    text: "図書館で偶然、誰も知らない古い本を見つけた。",
    order: 4,
    isActive: true,
    options: [
      { id: 'qv2-04o1', text: "自分だけが使える知識か考える", houseAffinity: { Slytherin: 2 }, reason: "知識を自分の武器にできるかを見極める視点は、スリザリンのしたたかさです。" },
      { id: 'qv2-04o2', text: "内容を徹底的に読み解く", houseAffinity: { Ravenclaw: 2 }, reason: "未知の本を徹底的に読み解く探究心は、レイブンクローの知性です。" },
      { id: 'qv2-04o3', text: "司書や友人にも共有する", houseAffinity: { Hufflepuff: 2 }, reason: "見つけた知識を司書や友人と分かち合う心は、ハッフルパフの誠実さです。" },
      { id: 'qv2-04o4', text: "すぐにページを開く", houseAffinity: { Gryffindor: 2 }, reason: "迷わず古い本を開いてみる冒険心は、グリフィンドールの勇気です。" }
    ]
  },
  {
    id: 'qv2-05',
    text: "あなたが一番ワクワクする瞬間は？",
    order: 5,
    isActive: true,
    options: [
      { id: 'qv2-05o1', text: "知らなかったことを理解した瞬間", houseAffinity: { Ravenclaw: 2 }, reason: "新たな理解が得られた瞬間に心躍らせるのは、レイブンクローの知的好奇心です。" },
      { id: 'qv2-05o2', text: "新しい冒険が始まる瞬間", houseAffinity: { Gryffindor: 2 }, reason: "新しい冒険の始まりに胸躍らせるのは、グリフィンドールの挑戦魂です。" },
      { id: 'qv2-05o3', text: "目標を達成して結果を出した瞬間", houseAffinity: { Slytherin: 2 }, reason: "目標を達成し結果を出した瞬間に喜びを感じるのは、スリザリンの野心の表れです。" },
      { id: 'qv2-05o4', text: "仲間と一緒に何かを達成した瞬間", houseAffinity: { Hufflepuff: 2 }, reason: "仲間とともに何かを成し遂える喜びを大切にするのは、ハッフルパフの絆の心です。" }
    ]
  },
  {
    id: 'qv2-06',
    text: "試験前夜。あなたの机の上は？",
    order: 6,
    isActive: true,
    options: [
      { id: 'qv2-06o1', text: "友達と問題を出し合っている", houseAffinity: { Hufflepuff: 2 }, reason: "友達と問題を出し合って学び合う姿は、ハッフルパフの協調性です。" },
      { id: 'qv2-06o2', text: "最も点につながる部分だけ重点的に勉強する", houseAffinity: { Slytherin: 2 }, reason: "点数につながる部分を見極めて集中するのは、スリザリンの効率重視の計画性です。" },
      { id: 'qv2-06o3', text: "ノートや資料がきれいに整理されている", houseAffinity: { Ravenclaw: 2 }, reason: "資料を整然と整理して学ぶ姿勢は、レイブンクローの知的な几帳面さです。" },
      { id: 'qv2-06o4', text: "まだ何とかなると思っている", houseAffinity: { Gryffindor: 2 }, reason: "瀬戸際でも動じず「何とかなる」と自信を持つ度胸は、グリフィンドールの大胆さです。" }
    ]
  },
  {
    id: 'qv2-07',
    text: "魔法薬の授業で予想外の結果が起きた。",
    order: 7,
    isActive: true,
    options: [
      { id: 'qv2-07o1', text: "面白そうなのでさらに試してみる", houseAffinity: { Gryffindor: 2 }, reason: "予想外の結果にむしろ興奮して試し続ける度胸は、グリフィンドールの挑戦魂です。" },
      { id: 'qv2-07o2', text: "周囲に迷惑が出ていないか確認する", houseAffinity: { Hufflepuff: 2 }, reason: "まず周囲への影響を気にかける心遣いは、ハッフルパフの誠実さです。" },
      { id: 'qv2-07o3', text: "失敗を利用できないか考える", houseAffinity: { Slytherin: 2 }, reason: "失敗さえ機会に変えてみせる発想は、スリザリンの野心と柔軟な頭脳です。" },
      { id: 'qv2-07o4', text: "原因を分析する", houseAffinity: { Ravenclaw: 2 }, reason: "冷静に原因を分析する姿勢は、レイブンクローの知性です。" }
    ]
  },
  {
    id: 'qv2-08',
    text: "友達が無実なのに疑われている。",
    order: 8,
    isActive: true,
    options: [
      { id: 'qv2-08o1', text: "本人が孤立しないようそばにいる", houseAffinity: { Hufflepuff: 2 }, reason: "疑われた友達が孤立しないよう寄り添う心は、ハッフルパフの信頼と誠実さです。" },
      { id: 'qv2-08o2', text: "証拠を集めて真実を明らかにする", houseAffinity: { Ravenclaw: 2 }, reason: "証拠を集めて真実を明らかにしようとする冷静な探求は、レイブンクローの知性です。" },
      { id: 'qv2-08o3', text: "状況を変えるために誰に働きかけるべきか考える", houseAffinity: { Slytherin: 2 }, reason: "状況を打開する鍵となる人物を見抜く視点は、スリザリンの戦略眼です。" },
      { id: 'qv2-08o4', text: "すぐに本人をかばう", houseAffinity: { Gryffindor: 2 }, reason: "危険を顧みずすぐに友をかばう勇気は、グリフィンドールの騎士道精神です。" }
    ]
  },
  {
    id: 'qv2-09',
    text: "あなたが一番欲しい「秘密の部屋」は？",
    order: 9,
    isActive: true,
    options: [
      { id: 'qv2-09o1', text: "自分の計画を実現するための作戦室", houseAffinity: { Slytherin: 2 }, reason: "計画を実現するための作戦室への憧れは、スリザリンの野心そのものです。" },
      { id: 'qv2-09o2', text: "危険な冒険に出発するための部屋", houseAffinity: { Gryffindor: 2 }, reason: "危険な冒険の拠点を欲しがる心は、グリフィンドールの挑戦魂です。" },
      { id: 'qv2-09o3', text: "世界中の知識が集まった図書室", houseAffinity: { Ravenclaw: 2 }, reason: "世界中の知識が集まる図書室への憧れは、レイブンクローの探究心です。" },
      { id: 'qv2-09o4', text: "誰でも安心して休める部屋", houseAffinity: { Hufflepuff: 2 }, reason: "誰もが安心して休める場所を望む心は、ハッフルパフの温かさです。" }
    ]
  },
  {
    id: 'qv2-10',
    text: "あなたが魔法使いとして一つ才能を得るなら？",
    order: 10,
    isActive: true,
    options: [
      { id: 'qv2-10o1', text: "どんな謎でも理解できる力", houseAffinity: { Ravenclaw: 2 }, reason: "どんな謎でも解き明かしたいという願いは、レイブンクローの知性です。" },
      { id: 'qv2-10o2', text: "誰とでも信頼関係を築ける力", houseAffinity: { Hufflepuff: 2 }, reason: "誰とでも信頼関係を築きたいという願いは、ハッフルパフの誠実さです。" },
      { id: 'qv2-10o3', text: "恐れずに未知の場所へ進む力", houseAffinity: { Gryffindor: 2 }, reason: "恐れず未知の場所へ進みたいという願いは、グリフィンドールの勇気です。" },
      { id: 'qv2-10o4', text: "人を動かし、大きなことを成し遂げる力", houseAffinity: { Slytherin: 2 }, reason: "人を動かし大きなことを成し遂げたいという願望は、スリザリンの野心そのものです。" }
    ]
  },
  {
    id: 'qv2-11',
    text: "大事な試合で仲間がミスをした。",
    order: 11,
    isActive: true,
    options: [
      { id: 'qv2-11o1', text: "次は自分が取り返そうとする", houseAffinity: { Gryffindor: 2 }, reason: "自ら流れを変えようと立ち上がる度胸は、グリフィンドールの勇気です。" },
      { id: 'qv2-11o2', text: "残り時間で勝つための作戦を考える", houseAffinity: { Slytherin: 2 }, reason: "残り時間で勝利への最善手を探す冷静さは、スリザリンの戦略眼です。" },
      { id: 'qv2-11o3', text: "ミスの原因を冷静に考える", houseAffinity: { Ravenclaw: 2 }, reason: "ミスの原因を冷静に分析する姿勢は、レイブンクローの知性です。" },
      { id: 'qv2-11o4', text: "まず仲間を励ます", houseAffinity: { Hufflepuff: 2 }, reason: "まず仲間を支え励ます心は、ハッフルパフの絆の精神です。" }
    ]
  },
  {
    id: 'qv2-12',
    text: "知らない場所で道に迷った。",
    order: 12,
    isActive: true,
    options: [
      { id: 'qv2-12o1', text: "一番効率よく目的地へ行ける方法を探す", houseAffinity: { Slytherin: 2 }, reason: "最短・最善のルートを見極めようとする視点は、スリザリンの計画性です。" },
      { id: 'qv2-12o2', text: "地図や周囲の情報から現在地を推測する", houseAffinity: { Ravenclaw: 2 }, reason: "手がかりから現在地を論理的に推測する知性は、レイブンクローそのものです。" },
      { id: 'qv2-12o3', text: "気になる方向へ進んでみる", houseAffinity: { Gryffindor: 2 }, reason: "気になる方へ足を踏み出す冒険心は、グリフィンドールの勇気です。" },
      { id: 'qv2-12o4', text: "誰かに助けを求める", houseAffinity: { Hufflepuff: 2 }, reason: "素直に助けを求められる誠実さは、ハッフルパフの信頼の心です。" }
    ]
  },
  {
    id: 'qv2-13',
    text: "あなたにとって「成功」とは？",
    order: 13,
    isActive: true,
    options: [
      { id: 'qv2-13o1', text: "大切な人たちと喜びを分け合うこと", houseAffinity: { Hufflepuff: 2 }, reason: "大切な人たちと喜びを分かち合えることを成功とする心は、ハッフルパフの絆です。" },
      { id: 'qv2-13o2', text: "新しい発見をすること", houseAffinity: { Ravenclaw: 2 }, reason: "新しい発見こそ成功と考える心は、レイブンクローの探究心です。" },
      { id: 'qv2-13o3', text: "自分の限界を超えること", houseAffinity: { Gryffindor: 2 }, reason: "自分の限界を超えることを成功とする心は、グリフィンドールの挑戦魂です。" },
      { id: 'qv2-13o4', text: "目標を現実にすること", houseAffinity: { Slytherin: 2 }, reason: "目標を現実に変えることを成功とする信念は、スリザリンの野心です。" }
    ]
  },
  {
    id: 'qv2-14',
    text: "先生から「自由に好きな研究をしていい」と言われた。",
    order: 14,
    isActive: true,
    options: [
      { id: 'qv2-14o1', text: "とことん謎を掘り下げられるテーマを選ぶ", houseAffinity: { Ravenclaw: 2 }, reason: "謎をとことん掘り下げられるテーマを選ぶのは、レイブンクローの探究心そのものです。" },
      { id: 'qv2-14o2', text: "将来一番大きな成果につながるテーマを選ぶ", houseAffinity: { Slytherin: 2 }, reason: "将来の大きな成果につながるかで選ぶ視点は、スリザリンの野心と計画性です。" },
      { id: 'qv2-14o3', text: "みんなの役に立つテーマを選ぶ", houseAffinity: { Hufflepuff: 2 }, reason: "みんなの役に立つテーマを選ぶ心は、ハッフルパフの誠実さです。" },
      { id: 'qv2-14o4', text: "今まで誰も挑戦していないテーマを選ぶ", houseAffinity: { Gryffindor: 2 }, reason: "誰も挑戦したことのない道を選ぶ度胸は、グリフィンドールの勇気です。" }
    ]
  },
  {
    id: 'qv2-15',
    text: "魔法学校に隠された宝物の噂を聞いた。",
    order: 15,
    isActive: true,
    options: [
      { id: 'qv2-15o1', text: "仲間を集めて探しに行く", houseAffinity: { Gryffindor: 2 }, reason: "仲間を率いてすぐに宝探しへ向かう行動力は、グリフィンドールの勇気です。" },
      { id: 'qv2-15o2', text: "仲間を集める前に伝説や記録を調べる", houseAffinity: { Ravenclaw: 2 }, reason: "先に伝説や記録を調べ上げる慎重な探究心は、レイブンクローの知性です。" },
      { id: 'qv2-15o3', text: "他の人より先に情報を集める", houseAffinity: { Slytherin: 2 }, reason: "誰よりも先に情報を握ろうとする動きは、スリザリンの野心と戦略です。" },
      { id: 'qv2-15o4', text: "信頼できる仲間と協力する", houseAffinity: { Hufflepuff: 2 }, reason: "信頼できる仲間と力を合わせる姿は、ハッフルパフの協調性です。" }
    ]
  },
  {
    id: 'qv2-16',
    text: "初めて会った人から、あなたはどう思われたい？",
    order: 16,
    isActive: true,
    options: [
      { id: 'qv2-16o1', text: "頼りになる人", houseAffinity: { Gryffindor: 2 }, reason: "頼りになる存在でありたいという思いは、グリフィンドールの勇気の裏返しです。" },
      { id: 'qv2-16o2', text: "面白くて知的な人", houseAffinity: { Ravenclaw: 2 }, reason: "面白くて知的な人だと思われたい願いは、レイブンクローの知性の表れです。" },
      { id: 'qv2-16o3', text: "優しくて話しやすい人", houseAffinity: { Hufflepuff: 2 }, reason: "優しくて話しやすい人だと思われたい心は、ハッフルパフの温かさです。" },
      { id: 'qv2-16o4', text: "只者ではないと思われる人", houseAffinity: { Slytherin: 2 }, reason: "只者ではない雰囲気を放ちたいという願いは、スリザリンの野心の表れです。" }
    ]
  },
  {
    id: 'q17',
    text: "授業のノートを取るときのスタイルは？",
    options: [
      { id: 'q17o2', text: "色分けして丁寧にまとめる", houseAffinity: { Hufflepuff: 2 }, reason: "色分けして丁寧にまとめる几帳面さは、ハッフルパフの勤勉さです。" },
      { id: 'q17o3', text: "図表・参考文献つきで完璧", houseAffinity: { Ravenclaw: 2 }, reason: "図表・参考文献つきの完璧なノートは、レイブンクローの知性です。" },
      { id: 'q17o1', text: "殴り書き（自分しか読めない）", houseAffinity: { Gryffindor: 2 }, reason: "殴り書きで突き進むスピード感は、グリフィンドールの行動力です。" },
      { id: 'q17o4', text: "他人のノートをコピー", houseAffinity: { Slytherin: 2 }, reason: "他人のノートをコピーする効率重視は、スリザリンのしたたかさです。" }
    ]
  },
  {
    id: 'q18',
    text: "バタービールを飲んだらほろ酔い気分。どうする？",
    options: [
      { id: 'q18o4', text: "こっそりおかわりを奪う", houseAffinity: { Slytherin: 2 }, reason: "こっそりおかわりを奪うしたたかさは、スリザリンの才覚です。" },
      { id: 'q18o1', text: "歌い出す", houseAffinity: { Gryffindor: 2 }, reason: "ほろ酔いで歌い出す陽気さは、グリフィンドールの大胆さです。" },
      { id: 'q18o2', text: "友達と乾杯する", houseAffinity: { Hufflepuff: 2 }, reason: "友達と乾杯する温かさは、ハッフルパフの仲間思いです。" },
      { id: 'q18o3', text: "成分を分析する", houseAffinity: { Ravenclaw: 2 }, reason: "ほろ酔いでも成分を分析するとは、レイブンクローの知性です。" }
    ]
  },
  {
    id: 'q19',
    text: "魔法薬で失敗！体が小さくなったらどうする？",
    options: [
      { id: 'q19o1', text: "元に戻すために全力で実験", houseAffinity: { Ravenclaw: 2 }, reason: "元に戻すために全力で実験する探究心は、レイブンクローの知性です。" },
      { id: 'q19o4', text: "小さい姿を利用して悪さ", houseAffinity: { Slytherin: 2 }, reason: "小さい姿を利用する発想は、スリザリンのしたたかさです。" },
      { id: 'q19o2', text: "小さいまま楽しむ", houseAffinity: { Gryffindor: 2 }, reason: "小さくなっても楽しむ前向きさは、グリフィンドールの勇気です。" },
      { id: 'q19o3', text: "友達に手伝ってもらう", houseAffinity: { Hufflepuff: 2 }, reason: "友達に手伝ってもらう素直さは、ハッフルパフの忠誠心です。" }
    ]
  },
  {
    id: 'q20',
    text: "秘密の部屋を発見！中で一番やりたいことは？",
    options: [
      { id: 'q20o3', text: "古文書や魔法道具を調べる", houseAffinity: { Ravenclaw: 2 }, reason: "古文書や魔法道具を調べる探究心は、レイブンクローの知性です。" },
      { id: 'q20o1', text: "危険を承知で冒険", houseAffinity: { Gryffindor: 2 }, reason: "危険を承知で冒険する勇気は、グリフィンドールの真骨頂です。" },
      { id: 'q20o2', text: "中の生き物と仲良くなる", houseAffinity: { Hufflepuff: 2 }, reason: "中の生き物と仲良くなる優しさは、ハッフルパフの温かい心です。" },
      { id: 'q20o4', text: "財宝や秘密を独占", houseAffinity: { Slytherin: 2 }, reason: "財宝や秘密を独占したい野心は、スリザリンの真骨頂です。" }
    ]
  }
];

export const HOUSE_NAMES_ARRAY: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
