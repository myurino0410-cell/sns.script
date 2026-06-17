// アプリ全体で使う型定義

export type Platform = "tiktok" | "reels" | "shorts";

export const PLATFORM_LABEL: Record<Platform, string> = {
  tiktok: "TikTok",
  reels: "Instagram Reels",
  shorts: "YouTube Shorts",
};

export type Tone =
  | "friendly"
  | "energetic"
  | "calm"
  | "luxury"
  | "humor"
  | "educational";

export const TONE_LABEL: Record<Tone, string> = {
  friendly: "親しみやすい",
  energetic: "エネルギッシュ",
  calm: "落ち着いた",
  luxury: "上品・高級感",
  humor: "ユーモア",
  educational: "教育・解説",
};

export type Goal =
  | "awareness"
  | "followers"
  | "sales"
  | "engagement"
  | "recruiting";

export const GOAL_LABEL: Record<Goal, string> = {
  awareness: "認知拡大",
  followers: "フォロワー増加",
  sales: "商品・サービス販売",
  engagement: "エンゲージメント",
  recruiting: "採用・求人",
};

// オンボーディングで入力する「必要項目」
export interface UserProfile {
  industry: string; // 業界
  role: string; // 職種
  audience: string; // ターゲット視聴者
  goals: Goal[]; // 目的（複数可）
  tones: Tone[]; // トーン（複数可）
  platforms: Platform[]; // 投稿先（複数可）
  product?: string; // 商品・サービス・強み
  ngWords?: string; // 避けたい表現
  updatedAt: number;
}

// 台本作成リクエスト
export interface ScriptRequest {
  topic: string; // テーマ・伝えたいこと
  durationSec: number; // 尺（秒）
  profile: UserProfile;
  trendHint?: TrendVideo; // おすすめ動画から来た場合のヒント
  category?: ScriptCategory; // カテゴリ指定から来た場合のヒント
}

// 台本カテゴリのグループ
export type CategoryGroup =
  | "theme" // テーマ別
  | "industry" // 業界別
  | "businessType" // 業種別
  | "trend" // トレンド別
  | "female" // 女性向け
  | "male" // 男性向け
  | "recruiting" // 採用向け
  | "popular"; // 最新人気（直近1ヶ月）

export const CATEGORY_GROUP_LABEL: Record<CategoryGroup, string> = {
  theme: "テーマ別",
  industry: "業界別",
  businessType: "業種別",
  trend: "トレンド別",
  female: "女性向け",
  male: "男性向け",
  recruiting: "採用向け",
  popular: "最新人気",
};

// 1つの台本カテゴリ（選ぶと生成内容に反映される）
export interface ScriptCategory {
  id: string;
  group: CategoryGroup;
  label: string;
  emoji: string;
  desc: string;
  angle: string; // 生成時に効く方向づけ
  toneOverride?: Tone[];
  goalOverride?: Goal[];
  industryOverride?: string;
  roleOverride?: string;
  audienceHint?: string;
  formatHint?: string;
}


// 生成された台本
export interface ScriptScene {
  timecode: string; // 例 "0-3秒"
  narration: string; // セリフ・ナレーション
  visual: string; // 画面・テロップ・演出
}

export interface GeneratedScript {
  id: string;
  title: string;
  hook: string; // 冒頭3秒のフック
  scenes: ScriptScene[];
  cta: string; // 締め・行動喚起
  caption: string; // 投稿キャプション
  hashtags: string[];
  tips: string[]; // 撮影・編集のコツ
  source: "ai" | "template"; // どのエンジンで作ったか
  createdAt: number;
}

// 今週のおすすめ（トレンド動画）
export interface TrendVideo {
  id: string;
  platform: Platform;
  title: string;
  format: string; // 動画の型（例: ビフォーアフター）
  reason: string; // なぜ伸びているか
  metrics: {
    views: number; // 再生数
    growthPct: number; // 1週間の伸び率(%)
    engagementPct: number; // エンゲージメント率(%)
    score: number; // 総合スコア 0-100
  };
  tags: string[];
}

export interface TrendDigest {
  weekOf: string; // 集計対象週 (ISO日付)
  generatedAt: number; // 集計実行時刻
  videos: TrendVideo[];
}
