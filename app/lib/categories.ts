import { CategoryGroup, ScriptCategory, TrendVideo } from "./types";

// 台本カテゴリの定義（静的なもの）。
// トレンド別・最新人気は動的に生成するため、ここには含めない。
export const CATEGORIES: ScriptCategory[] = [
  // ── テーマ別 ───────────────────────────────
  {
    id: "theme-entertainment",
    group: "theme",
    label: "エンタメ",
    emoji: "🎉",
    desc: "テンポよく笑いや驚きで最後まで飽きさせない",
    angle:
      "笑い・驚き・意外性を盛り込み、テンポの速いカット割りで楽しませるエンタメ構成にする。",
    toneOverride: ["humor", "energetic"],
    formatHint: "テンポ重視エンタメ",
  },
  {
    id: "theme-serious",
    group: "theme",
    label: "真面目",
    emoji: "🤝",
    desc: "誠実で信頼感のある、事実ベースの内容",
    angle: "誠実で落ち着いたトーン。事実と根拠を丁寧に示し、信頼を獲得する。",
    toneOverride: ["calm", "educational"],
    formatHint: "信頼構築",
  },
  {
    id: "theme-explainer",
    group: "theme",
    label: "解説",
    emoji: "📖",
    desc: "ひとつのテーマを分かりやすく順序立てて",
    angle:
      "ひとつのテーマを『結論→理由→具体例→まとめ』の順で分かりやすく解説する。",
    toneOverride: ["educational"],
    formatHint: "ステップ解説",
  },
  {
    id: "theme-quiz",
    group: "theme",
    label: "クイズ系",
    emoji: "❓",
    desc: "視聴者に問いかけてコメントを誘発",
    angle:
      "冒頭でクイズを出題し、視聴者に考えさせてから答えを明かす参加型構成。コメントを誘発する。",
    toneOverride: ["energetic", "friendly"],
    formatHint: "参加型クイズ",
  },
  {
    id: "theme-knowledge",
    group: "theme",
    label: "知識系",
    emoji: "🧠",
    desc: "意外な豆知識・データで学びを与える",
    angle:
      "意外な豆知識やデータ・数字を提示し、『知れてよかった』と思わせて保存を促す。",
    toneOverride: ["educational"],
    formatHint: "トリビア/データ",
  },

  // ── 業界別 ───────────────────────────────
  ...industry("beauty", "💇‍♀️", "美容・サロン"),
  ...industry("food", "🍽️", "飲食・グルメ"),
  ...industry("it", "💻", "IT・SaaS"),
  ...industry("fitness", "💪", "フィットネス・健康"),
  ...industry("education", "🎓", "教育・スクール"),
  ...industry("realestate", "🏠", "不動産・住宅"),
  ...industry("medical", "🩺", "医療・クリニック"),
  ...industry("apparel", "👗", "アパレル・ファッション"),

  // ── 業種別 ───────────────────────────────
  ...businessType("owner", "👑", "経営者・オーナー"),
  ...businessType("marketer", "📈", "マーケター・広報"),
  ...businessType("sales", "🛍️", "販売・接客"),
  ...businessType("instructor", "🎤", "講師・コーチ"),
  ...businessType("creator", "🎨", "クリエイター"),
  ...businessType("engineer", "🛠️", "エンジニア・専門職"),

  // ── 女性向け ───────────────────────────────
  {
    id: "female-default",
    group: "female",
    label: "女性向け",
    emoji: "🌸",
    desc: "女性が共感しやすい言葉選びと世界観",
    angle:
      "女性視聴者が共感しやすい言葉選び・テンポ・世界観で構成する。日常の『あるある』や感情に寄り添う。",
    audienceHint: "女性視聴者",
    toneOverride: ["friendly"],
  },

  // ── 男性向け ───────────────────────────────
  {
    id: "male-default",
    group: "male",
    label: "男性向け",
    emoji: "🔥",
    desc: "ロジカルさ・実利・スペック訴求",
    angle:
      "男性視聴者が反応しやすいロジカルな構成。実利・効率・スペック・数字を前面に出す。",
    audienceHint: "男性視聴者",
    toneOverride: ["energetic", "educational"],
  },

  // ── 採用向け ───────────────────────────────
  {
    id: "recruiting-default",
    group: "recruiting",
    label: "採用向け",
    emoji: "🤝",
    desc: "職場の魅力・働く人の声で求職者に訴求",
    angle:
      "求職者に向けて、職場の雰囲気・働く人のリアルな声・カルチャー・成長環境を伝える採用動画にする。",
    goalOverride: ["recruiting"],
    toneOverride: ["friendly", "energetic"],
    formatHint: "社員インタビュー/1日密着",
  },
];

function industry(
  id: string,
  emoji: string,
  name: string,
): ScriptCategory[] {
  return [
    {
      id: `industry-${id}`,
      group: "industry",
      label: name,
      emoji,
      desc: `${name}ならではの専門性・悩みを活かす`,
      angle: `${name}業界の視点で、その業界ならではの専門知識・お客様の悩み・現場のリアルを活かした内容にする。`,
      industryOverride: name,
    },
  ];
}

function businessType(
  id: string,
  emoji: string,
  name: string,
): ScriptCategory[] {
  return [
    {
      id: `btype-${id}`,
      group: "businessType",
      label: name,
      emoji,
      desc: `${name}の立場・視点からの発信`,
      angle: `${name}の立場・視点から語る。その職種だからこそ説得力のある切り口にする。`,
      roleOverride: name,
    },
  ];
}

export function categoriesByGroup(group: CategoryGroup): ScriptCategory[] {
  return CATEGORIES.filter((c) => c.group === group);
}

export function findCategory(id: string): ScriptCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

// トレンド動画 → カテゴリ表示用に変換（トレンド別・最新人気で使用）
export function trendToCategory(
  v: TrendVideo,
  group: "trend" | "popular",
): ScriptCategory {
  return {
    id: `${group}-${v.id}`,
    group,
    label: v.format,
    emoji: group === "popular" ? "🔥" : "📈",
    desc: v.reason,
    angle: `今${group === "popular" ? "直近1ヶ月で人気の" : "今週伸びている"}「${v.format}」の型（${v.title}）を取り入れて構成する。`,
    formatHint: v.format,
  };
}
