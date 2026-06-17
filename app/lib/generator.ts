// 台本生成エンジン（サーバー側）
// ANTHROPIC_API_KEY があれば Claude API を使い、無ければ高品質テンプレートで生成。

import Anthropic from "@anthropic-ai/sdk";
import {
  GeneratedScript,
  GOAL_LABEL,
  PLATFORM_LABEL,
  ScriptRequest,
  ScriptScene,
  TONE_LABEL,
} from "./types";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// カテゴリ指定をプロフィールに反映した実効リクエストを作る
function applyCategory(req: ScriptRequest): ScriptRequest {
  const c = req.category;
  if (!c) return req;
  const profile = { ...req.profile };
  if (c.industryOverride) profile.industry = c.industryOverride;
  if (c.roleOverride) profile.role = c.roleOverride;
  if (c.audienceHint)
    profile.audience = profile.audience
      ? `${profile.audience}（特に${c.audienceHint}）`
      : c.audienceHint;
  if (c.toneOverride?.length) profile.tones = c.toneOverride;
  if (c.goalOverride?.length) profile.goals = c.goalOverride;
  return { ...req, profile };
}

function buildPrompt(req: ScriptRequest): string {
  const { profile, topic, durationSec, trendHint, category } = req;
  const goals = profile.goals.map((g) => GOAL_LABEL[g]).join("・");
  const tones = profile.tones.map((t) => TONE_LABEL[t]).join("・");
  const platforms = profile.platforms.map((p) => PLATFORM_LABEL[p]).join("・");
  const trend = trendHint
    ? `\n参考にすべき今週のトレンドの型: 「${trendHint.format}」 / ${trendHint.title}\n伸びている理由: ${trendHint.reason}`
    : "";
  const cat = category
    ? `\n# カテゴリ指定（最優先で反映）\n- カテゴリ: ${category.label}（${category.desc}）\n- 方向づけ: ${category.angle}${category.formatHint ? `\n- 推奨フォーマット: ${category.formatHint}` : ""}`
    : "";

  return `あなたは一流のSNSショート動画ディレクター兼コピーライターです。
以下の条件で、${durationSec}秒のショート動画の企画台本を作ってください。
${cat}

# クライアント情報
- 業界: ${profile.industry}
- 職種: ${profile.role}
- ターゲット視聴者: ${profile.audience}
- 目的: ${goals}
- トーン: ${tones}
- 投稿先: ${platforms}
- 商品/サービス/強み: ${profile.product || "（指定なし）"}
- 避けたい表現: ${profile.ngWords || "（指定なし）"}

# 動画テーマ
${topic}
${trend}

# 要件
- 冒頭3秒で離脱されない強いフック
- ターゲットの心に刺さる言葉選び（業界・職種の文脈を踏まえる）
- ${durationSec}秒に収まるシーン構成（各シーンにタイムコード・セリフ・画面演出）
- 最後に目的に沿った自然な行動喚起(CTA)
- 投稿キャプションとハッシュタグ
- 撮影/編集のコツ

# 出力フォーマット（厳密にこのJSONのみ。前後に文章を付けない）
{
  "title": "動画タイトル",
  "hook": "冒頭3秒のセリフ",
  "scenes": [{"timecode": "0-3秒", "narration": "セリフ", "visual": "画面・テロップ・演出"}],
  "cta": "締めの行動喚起",
  "caption": "投稿キャプション",
  "hashtags": ["#タグ"],
  "tips": ["コツ"]
}`;
}

export async function generateWithAI(
  req: ScriptRequest,
): Promise<GeneratedScript | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: "user", content: buildPrompt(req) }],
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const jsonStr = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(jsonStr);

    return {
      id: uid(),
      title: String(parsed.title ?? req.topic),
      hook: String(parsed.hook ?? ""),
      scenes: Array.isArray(parsed.scenes) ? parsed.scenes : [],
      cta: String(parsed.cta ?? ""),
      caption: String(parsed.caption ?? ""),
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
      source: "ai",
      createdAt: Date.now(),
    };
  } catch (err) {
    console.error("[generator] AI generation failed:", err);
    return null;
  }
}

// --- フォールバック：テンプレートエンジン -------------------------------

function splitScenes(durationSec: number): { tc: string; ratio: number }[] {
  // 尺に応じてフック/本編/CTAへ時間配分
  const hookEnd = Math.max(3, Math.round(durationSec * 0.18));
  const ctaStart = Math.round(durationSec * 0.82);
  return [
    { tc: `0-${hookEnd}秒`, ratio: 0.18 },
    { tc: `${hookEnd}-${Math.round(durationSec * 0.5)}秒`, ratio: 0.32 },
    { tc: `${Math.round(durationSec * 0.5)}-${ctaStart}秒`, ratio: 0.32 },
    { tc: `${ctaStart}-${durationSec}秒`, ratio: 0.18 },
  ];
}

export function generateWithTemplate(req: ScriptRequest): GeneratedScript {
  const { profile, topic, durationSec, trendHint, category } = req;
  const audience = profile.audience || "視聴者";
  const role = profile.role || "発信者";
  const format =
    category?.formatHint ?? trendHint?.format ?? "結論ファースト";
  const slots = splitScenes(durationSec);

  const hook = `「${topic}」、実は${audience}の9割が損してます。`;

  const scenes: ScriptScene[] = [
    {
      timecode: slots[0].tc,
      narration: hook,
      visual: "話者アップ＋大きめテロップ。0.5秒ごとにカット割りでテンポを作る。",
    },
    {
      timecode: slots[1].tc,
      narration: `${role}の視点で結論から言うと、${topic}でいちばん大事なのは「最初の3秒」です。`,
      visual: `${format}の型でテロップを箇条書き表示。背景はパステルグラデ。`,
    },
    {
      timecode: slots[2].tc,
      narration: `理由はシンプル。${audience}は最後まで観るかを冒頭で判断するから。具体例で見せます。`,
      visual: "ビフォーアフター or 実演カット。数字や矢印のアニメで変化を強調。",
    },
    {
      timecode: slots[3].tc,
      narration: `保存して何度も見返してね。${profile.product ? profile.product + "の詳細はプロフから。" : "続きはプロフのリンクへ。"}`,
      visual: "CTAテロップ＋フォローボタン演出。最後にロゴ/アカウント名。",
    },
  ];

  const goalCta: Record<string, string> = {
    awareness: "「保存」で見返せます。友達にもシェアしてね！",
    followers: "もっと知りたい人はフォローで次回も見逃さないで！",
    sales: "気になった方はプロフィールのリンクをチェック！",
    engagement: "あなたはどっち派？コメントで教えて！",
    recruiting: "一緒に働きたい人はプロフのリンクから応募できます！",
  };
  const cta = goalCta[profile.goals[0]] ?? goalCta.awareness;

  const baseTags = ["#ショート動画", "#バズりたい", `#${profile.industry}`];
  const platTags = profile.platforms.map((p) =>
    p === "tiktok" ? "#tiktok" : p === "reels" ? "#reels" : "#shorts",
  );
  const trendTags = (trendHint?.tags ?? ["#今日の学び"]).map((t) =>
    t.startsWith("#") ? t : `#${t}`,
  );

  const catTags = category ? [`#${category.label}`] : [];

  return {
    id: uid(),
    title: `${category ? `【${category.label}】` : ""}${topic}｜${audience}が思わず保存する${durationSec}秒`,
    hook,
    scenes,
    cta,
    caption: `${topic}について${role}が解説！\n${audience}の人はぜひ最後まで👀\n${cta}`,
    hashtags: Array.from(
      new Set([...baseTags, ...catTags, ...platTags, ...trendTags]),
    ),
    tips: [
      ...(category ? [`カテゴリ「${category.label}」: ${category.angle}`] : []),
      "冒頭3秒は『顔＋大きいテロップ＋結論』で離脱を防ぐ。",
      "BGMはトレンド音源を使うとアルゴリズム評価が上がりやすい。",
      "テロップは1画面1メッセージ。読める速度を意識する。",
      `${PLATFORM_LABEL[profile.platforms[0]]}は縦9:16・字幕必須で最適化。`,
    ],
    source: "template",
    createdAt: Date.now(),
  };
}

// 入口：カテゴリを反映 → AI→ダメならテンプレ
export async function generateScript(
  req: ScriptRequest,
): Promise<GeneratedScript> {
  const eff = applyCategory(req);
  const ai = await generateWithAI(eff);
  return ai ?? generateWithTemplate(eff);
}
