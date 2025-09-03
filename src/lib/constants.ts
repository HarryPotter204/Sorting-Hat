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
    id: 'q1',
    text: "入学初日に忘れ物をしました。何を忘れた？",
    options: [
      { id: 'q1o1', text: "杖（致命的）", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q1o2', text: "ローブ（ただのコスプレ感）", houseAffinity: { Gryffindor: 2 } },
      { id: 'q1o3', text: "フクロウ（LINEできない…）", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q1o4', text: "宿題（まだ始まってもいないのに）", houseAffinity: { Slytherin: 2 } }
    ]
  },
  {
    id: 'q2',
    text: "魔法の授業で一番やらかしそうなのは？",
    options: [
      { id: 'q2o4', text: "授業中に寝て先生を透明マントと勘違いする", houseAffinity: { Slytherin: 2 } },
      { id: 'q2o1', text: "薬を爆発させる", houseAffinity: { Gryffindor: 2 } },
      { id: 'q2o2', text: "杖を逆に持って呪文を放つ", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q2o3', text: "変身術で自分をカエルにする", houseAffinity: { Ravenclaw: 2 } }
    ]
  },
  {
    id: 'q3',
    text: "ホグワーツの食堂で一番好きそうなメニューは？",
    options: [
      { id: 'q3o1', text: "カボチャジュース（なぜか常温）", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q3o2', text: "百味ビーンズ（外れ率99%）", houseAffinity: { Gryffindor: 2 } },
      { id: 'q3o3', text: "大皿の肉（どこのRPGだ）", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q3o4', text: "謎のプリン（夜中に動くやつ）", houseAffinity: { Slytherin: 2 } }
    ]
  },
  {
    id: 'q4',
    text: "あなたの守護霊が出現！どんな姿？",
    options: [
      { id: 'q4o4', text: "フライドチキン", houseAffinity: { Slytherin: 2 } },
      { id: 'q4o1', text: "ライオン", houseAffinity: { Gryffindor: 2 } },
      { id: 'q4o2', text: "ハムスター", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q4o3', text: "Wi-Fiルーター", houseAffinity: { Ravenclaw: 2 } }
    ]
  },
  {
    id: 'q5',
    text: "魔法省から突然の依頼！あなたの役割は？",
    options: [
      { id: 'q5o1', text: "闇祓い", houseAffinity: { Gryffindor: 2 } },
      { id: 'q5o2', text: "魔法生物の世話係", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q5o3', text: "郵便フクロウの仕分け", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q5o4', text: "バタービールの試飲係", houseAffinity: { Slytherin: 2 } }
    ]
  },
  {
    id: 'q6',
    text: "箒レースに参加しました。あなたの作戦は？",
    options: [
      { id: 'q6o1', text: "全力で飛ばす（そして墜落）", houseAffinity: { Gryffindor: 2 } },
      { id: 'q6o2', text: "相手に呪文をかける（反則スレスレ）", houseAffinity: { Slytherin: 2 } },
      { id: 'q6o3', text: "コースを間違える（観光気分）", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q6o4', text: "徒歩で走る", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q7',
    text: "寮で一番やりたいことは？",
    options: [
      { id: 'q7o1', text: "暖炉の前でおしゃべり", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q7o2', text: "秘密の通路探し", houseAffinity: { Slytherin: 2 } },
      { id: 'q7o3', text: "談話室でUNO大会", houseAffinity: { Gryffindor: 2 } },
      { id: 'q7o4', text: "厨房に忍び込む", houseAffinity: { Ravenclaw: 2 } }
    ]
  },
  {
    id: 'q8',
    text: "謎の魔法道具を見つけました。どうする？",
    options: [
      { id: 'q8o1', text: "とりあえず触る", houseAffinity: { Gryffindor: 2 } },
      { id: 'q8o3', text: "売る", houseAffinity: { Slytherin: 2 } },
      { id: 'q8o4', text: "枕にする", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q8o2', text: "先生に報告する", houseAffinity: { Hufflepuff: 2 } },
    ]
  },
  {
    id: 'q9',
    text: "授業中にカエルチョコが飛んできた！どうする？",
    options: [
      { id: 'q9o1', text: "食べる（授業中でも）", houseAffinity: { Gryffindor: 2 } },
      { id: 'q9o2', text: "先生に献上する", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q9o3', text: "成分を分析する", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q9o4', text: "ついでに友達からも奪う", houseAffinity: { Slytherin: 2 } }
    ]
  },
  {
    id: 'q10',
    text: "禁じられた森に入ることになったら？",
    options: [
      { id: 'q10o1', text: "全力で突撃する", houseAffinity: { Gryffindor: 2 } },
      { id: 'q10o2', text: "動物をなでに行く", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q10o4', text: "魔法生物を密輸する", houseAffinity: { Slytherin: 2 } },
            { id: 'q10o3', text: "植物の観察メモを取る", houseAffinity: { Ravenclaw: 2 } }
    ]
  },
  {
    id: 'q11',
    text: "ホグワーツのトイレで幽霊に遭遇！反応は？",
    options: [
      { id: 'q11o3', text: "研究対象として観察する", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q11o1', text: "「うわっ！」って叫んで逃げる", houseAffinity: { Gryffindor: 2 } },
      { id: 'q11o4', text: "利用して噂を流させる", houseAffinity: { Slytherin: 2 } },
      { id: 'q11o2', text: "話し相手になってあげる", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q12',
    text: "魔法の試験でカンニングできそうな呪文を発見！",
    options: [
      { id: 'q12o2', text: "友達と分け合う", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q12o3', text: "完璧に使いこなす", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q12o4', text: "即ビジネス化する", houseAffinity: { Slytherin: 2 } },
            { id: 'q12o1', text: "使わない（正々堂々）", houseAffinity: { Gryffindor: 2 } }
    ]
  },
  {
    id: 'q13',
    text: "ハニーデュークス（魔法のお菓子のお店）で好きな魔法のお菓子は？",
    options: [
      { id: 'q13o1', text: "爆発ボンボン（危険）", houseAffinity: { Gryffindor: 2 } },
      { id: 'q13o2', text: "ショック・チョコ（ユーモア）", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q13o3', text: "飛ぶキャンディ（研究用）", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q13o4', text: "愛の妙薬入りチョコ（策略）", houseAffinity: { Slytherin: 2 } }
    ]
  },
  {
    id: 'q14',
    text: "あなたの部屋に忍び込む忍びの地図を入手！どう使う？",
    options: [
      { id: 'q14o2', text: "友達に貸す", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q14o4', text: "先生の秘密を暴く", houseAffinity: { Slytherin: 2 } },
      { id: 'q14o1', text: "毎晩探検する", houseAffinity: { Gryffindor: 2 } },
      { id: 'q14o3', text: "校内の歴史を調査する", houseAffinity: { Ravenclaw: 2 } }
    ]
  },
  {
    id: 'q15',
    text: "ホグワーツの階段が動いて道を間違えた！",
    options: [
      { id: 'q15o1', text: "「まあいっか」で冒険開始", houseAffinity: { Gryffindor: 2 } },
      { id: 'q15o2', text: "誰かに助けを求める", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q15o4', text: "わざと迷ってショートカット探し", houseAffinity: { Slytherin: 2 } },
      { id: 'q15o3', text: "地図を広げて分析", houseAffinity: { Ravenclaw: 2 } }
    ]
  },
  {
    id: 'q16',
    text: "魔法生物を飼えるなら？",
    options: [
      { id: 'q16o1', text: "ヒッポグリフ（かっこいい）", houseAffinity: { Gryffindor: 2 } },
      { id: 'q16o3', text: "フクロウ（便利で賢い）", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q16o2', text: "二フラー（かわいい）", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q16o4', text: "バジリスク（野望全開）", houseAffinity: { Slytherin: 2 } }
    ]
  },
  {
    id: 'q17',
    text: "授業のノートを取るときのスタイルは？",
    options: [
      { id: 'q17o2', text: "色分けして丁寧にまとめる", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q17o3', text: "図表・参考文献つきで完璧", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q17o1', text: "殴り書き（自分しか読めない）", houseAffinity: { Gryffindor: 2 } },
      { id: 'q17o4', text: "他人のノートをコピー", houseAffinity: { Slytherin: 2 } }
    ]
  },
  {
    id: 'q18',
    text: "バタービールを飲んだらほろ酔い気分。どうする？",
    options: [
      { id: 'q18o4', text: "こっそりおかわりを奪う", houseAffinity: { Slytherin: 2 } },
      { id: 'q18o1', text: "歌い出す", houseAffinity: { Gryffindor: 2 } },
      { id: 'q18o2', text: "友達と乾杯する", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q18o3', text: "成分を分析する", houseAffinity: { Ravenclaw: 2 } }
    ]
  },
  {
    id: 'q19',
    text: "魔法薬で失敗！体が小さくなったらどうする？",
    options: [
      { id: 'q19o1', text: "元に戻すために全力で実験", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q19o4', text: "小さい姿を利用して悪さ", houseAffinity: { Slytherin: 2 } },
      { id: 'q19o2', text: "小さいまま楽しむ", houseAffinity: { Gryffindor: 2 } },
      { id: 'q19o3', text: "友達に手伝ってもらう", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q20',
    text: "秘密の部屋を発見！中で一番やりたいことは？",
    options: [
      { id: 'q20o3', text: "古文書や魔法道具を調べる", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q20o1', text: "危険を承知で冒険", houseAffinity: { Gryffindor: 2 } },
      { id: 'q20o2', text: "中の生き物と仲良くなる", houseAffinity: { Hufflepuff: 2 } },
      { id: 'q20o4', text: "財宝や秘密を独占", houseAffinity: { Slytherin: 2 } }
    ]
  }
];

export const HOUSE_NAMES_ARRAY: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
