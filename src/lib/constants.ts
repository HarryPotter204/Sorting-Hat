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
    text: "どの性格特性が最もあなたらしいですか？",
    options: [
      { id: 'q1o1', text: "勇敢さ", houseAffinity: { Gryffindor: 2 } },
      { id: 'q1o2', text: "野心", houseAffinity: { Slytherin: 2 } },
      { id: 'q1o3', text: "知性", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q1o4', text: "忠誠", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q2',
    text: "挑戦にどう立ち向かいますか？",
    options: [
      { id: 'q2o1', text: "正面から立ち向かう", houseAffinity: { Gryffindor: 2 } },
      { id: 'q2o2', text: "賢く回避策を探す", houseAffinity: { Slytherin: 2 } },
      { id: 'q2o3', text: "解決策を調べる", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q2o4', text: "助けを求める", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q3',
    text: "理想の週末はどんな過ごし方ですか？",
    options: [
      { id: 'q3o1', text: "冒険スポーツ", houseAffinity: { Gryffindor: 2 } },
      { id: 'q3o2', text: "戦略ゲーム", houseAffinity: { Slytherin: 2 } },
      { id: 'q3o3', text: "読書・学習", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q3o4', text: "人助け", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q4',
    text: "あなたのリーダーシップスタイルは？",
    options: [
      { id: 'q4o1', text: "大胆で決断力がある", houseAffinity: { Gryffindor: 2 } },
      { id: 'q4o2', text: "計算高く目標志向", houseAffinity: { Slytherin: 2 } },
      { id: 'q4o3', text: "分析的で公平", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q4o4', text: "支援的で包摂的", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q5',
    text: "理想の超能力を選ぶなら？",
    options: [
      { id: 'q5o1', text: "超人的な力", houseAffinity: { Gryffindor: 2 } },
      { id: 'q5o2', text: "透明化", houseAffinity: { Slytherin: 2 } },
      { id: 'q5o3', text: "瞬間移動", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q5o4', text: "治癒能力", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q6',
    text: "友人はあなたをどう表現しますか？",
    options: [
      { id: 'q6o1', text: "恐れ知らず", houseAffinity: { Gryffindor: 2 } },
      { id: 'q6o2', text: "才覚がある", houseAffinity: { Slytherin: 2 } },
      { id: 'q6o3', text: "賢い", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q6o4', text: "優しい", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q7',
    text: "チームで作業するとき、あなたは？",
    options: [
      { id: 'q7o1', text: "指揮を取る", houseAffinity: { Gryffindor: 2 } },
      { id: 'q7o2', text: "最も効率的な方法を見つける", houseAffinity: { Slytherin: 2 } },
      { id: 'q7o3', text: "論理的な解決策を確実にする", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q7o4', text: "全員をまとめる", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q8',
    text: "ルールに対するあなたの姿勢は？",
    options: [
      { id: 'q8o1', text: "正当なら破る", houseAffinity: { Gryffindor: 2 } },
      { id: 'q8o2', text: "自分に有利に曲げる", houseAffinity: { Slytherin: 2 } },
      { id: 'q8o3', text: "ルールの目的を理解する", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q8o4', text: "忠実に従う", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q9',
    text: "あなたの最大の強みは？",
    options: [
      { id: 'q9o1', text: "勇気", houseAffinity: { Gryffindor: 2 } },
      { id: 'q9o2', text: "決意", houseAffinity: { Slytherin: 2 } },
      { id: 'q9o3', text: "創造力", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q9o4', text: "共感力", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q10',
    text: "あなたを最も動機付けるものは？",
    options: [
      { id: 'q10o1', text: "困難を乗り越えること", houseAffinity: { Gryffindor: 2 } },
      { id: 'q10o2', text: "成功を達成すること", houseAffinity: { Slytherin: 2 } },
      { id: 'q10o3', text: "知識を得ること", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q10o4', text: "人間関係を築くこと", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q11',
    text: "理想の休暇は？",
    options: [
      { id: 'q11o1', text: "山登り", houseAffinity: { Gryffindor: 2 } },
      { id: 'q11o2', text: "高級リゾート", houseAffinity: { Slytherin: 2 } },
      { id: 'q11o3', text: "文化探訪", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q11o4', text: "ボランティア旅行", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q12',
    text: "危機のとき、あなたはどうする？",
    options: [
      { id: 'q12o1', text: "すぐ行動する", houseAffinity: { Gryffindor: 2 } },
      { id: 'q12o2', text: "自分に最適な結果を評価する", houseAffinity: { Slytherin: 2 } },
      { id: 'q12o3', text: "状況を分析する", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q12o4', text: "全員の安全を確保する", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q13',
    text: "好きな教科は？",
    options: [
      { id: 'q13o1', text: "体育", houseAffinity: { Gryffindor: 2 } },
      { id: 'q13o2', text: "経済", houseAffinity: { Slytherin: 2 } },
      { id: 'q13o3', text: "理科", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q13o4', text: "心理学", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q14',
    text: "意思決定はどうやってしますか？",
    options: [
      { id: 'q14o1', text: "直感で決める", houseAffinity: { Gryffindor: 2 } },
      { id: 'q14o2', text: "利点と欠点を比較する", houseAffinity: { Slytherin: 2 } },
      { id: 'q14o3', text: "徹底的に調べる", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q14o4', text: "友人や家族に相談する", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q15',
    text: "理想のペットは？",
    options: [
      { id: 'q15o1', text: "大型犬", houseAffinity: { Gryffindor: 1 } },
      { id: 'q15o2', text: "エキゾチックな爬虫類", houseAffinity: { Slytherin: 1 } },
      { id: 'q15o3', text: "オウム", houseAffinity: { Ravenclaw: 1 } },
      { id: 'q15o4', text: "キツネ", houseAffinity: { Hufflepuff: 1 } }
    ]
  },
  {
    id: 'q16',
    text: "あなたのコミュニケーションスタイルは？",
    options: [
      { id: 'q16o1', text: "直接的で大胆", houseAffinity: { Gryffindor: 2 } },
      { id: 'q16o2', text: "説得力がある", houseAffinity: { Slytherin: 2 } },
      { id: 'q16o3', text: "正確", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q16o4', text: "温かく親しみやすい", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q17',
    text: "あなたの最大の恐怖は？",
    options: [
      { id: 'q17o1', text: "無力であること", houseAffinity: { Gryffindor: 2 } },
      { id: 'q17o2', text: "平凡であること", houseAffinity: { Slytherin: 2 } },
      { id: 'q17o3', text: "無知であること", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q17o4', text: "孤独であること", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q18',
    text: "友人グループでのあなたの役割は？",
    options: [
      { id: 'q18o1', text: "守護者", houseAffinity: { Gryffindor: 2 } },
      { id: 'q18o2', text: "戦略家", houseAffinity: { Slytherin: 2 } },
      { id: 'q18o3', text: "助言者", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q18o4', text: "仲裁者", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q19',
    text: "学習スタイルは？",
    options: [
      { id: 'q19o1', text: "実践を通して学ぶ", houseAffinity: { Gryffindor: 2 } },
      { id: 'q19o2', text: "競争環境で学ぶ", houseAffinity: { Slytherin: 2 } },
      { id: 'q19o3', text: "独学で学ぶ", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q19o4', text: "グループで協力して学ぶ", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q20',
    text: "あなたの人生のモットーは？",
    options: [
      { id: 'q20o1', text: "運は大胆な者に味方する", houseAffinity: { Gryffindor: 2 } },
      { id: 'q20o2', text: "目的は手段を正当化する", houseAffinity: { Slytherin: 2 } },
      { id: 'q20o3', text: "知識は力なり", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q20o4', text: "優しさがすべてを変える", houseAffinity: { Hufflepuff: 2 } }
    ]
  }
];

export const HOUSE_NAMES_ARRAY: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
