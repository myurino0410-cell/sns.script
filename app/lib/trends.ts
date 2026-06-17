// トレンド集計ロジック（サーバー側）
//
// 本番では各SNSの公式API/解析サービスからデータを取得して `RAW_SIGNALS` を
// 差し替えてください。ここではAPIキー無しでも動くよう、現実的な
// トレンドの「型」プールからスコアリングしてダイジェストを生成します。

import fs from "node:fs";
import path from "node:path";
import { Platform, TrendDigest, TrendVideo } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE = path.join(DATA_DIR, "trends.json");

// 動画の「型」プール：各SNSで繰り返し伸びるフォーマット
type Seed = {
  platform: Platform;
  title: string;
  format: string;
  reason: string;
  tags: string[];
  baseScore: number; // 平均的な強さ
};

const SEED_POOL: Seed[] = [
  {
    platform: "tiktok",
    title: "3秒で結論→理由を畳みかける『逆張り解説』",
    format: "結論ファースト",
    reason: "冒頭で常識を否定し、離脱を防ぐ構成が継続的に高評価。",
    tags: ["逆張り", "解説", "保存される"],
    baseScore: 86,
  },
  {
    platform: "tiktok",
    title: "ビフォーアフターを1カットで見せる『変化動画』",
    format: "ビフォーアフター",
    reason: "視覚的な変化が最後まで見たくなる引きを作る。",
    tags: ["変化", "ルーティン", "満足感"],
    baseScore: 82,
  },
  {
    platform: "reels",
    title: "テキストだけで進む『無言ノウハウ』リール",
    format: "テキストオンリー",
    reason: "音無し視聴に最適化。保存数が伸びやすい。",
    tags: ["ノウハウ", "保存", "無音"],
    baseScore: 80,
  },
  {
    platform: "reels",
    title: "あるある→共感→解決の『お悩み解決』テンポ動画",
    format: "共感ストーリー",
    reason: "ターゲットの悩みを言語化しコメントが伸びる。",
    tags: ["共感", "あるある", "コメント増"],
    baseScore: 84,
  },
  {
    platform: "shorts",
    title: "数字で殴る『データ系トリビア』ショート",
    format: "データドリブン",
    reason: "意外な数字が冒頭に来てクリック後の維持率が高い。",
    tags: ["トリビア", "数字", "教育"],
    baseScore: 79,
  },
  {
    platform: "shorts",
    title: "1つの質問に全力で答える『Q&A一本勝負』",
    format: "Q&A",
    reason: "検索流入と相性が良く、ロングテールで再生が伸びる。",
    tags: ["Q&A", "検索", "ロングテール"],
    baseScore: 81,
  },
  {
    platform: "tiktok",
    title: "失敗談から学ぶ『しくじり共有』ストーリー",
    format: "ストーリーテリング",
    reason: "弱さの開示が信頼を生み、フォロー転換率が高い。",
    tags: ["ストーリー", "信頼", "フォロー増"],
    baseScore: 83,
  },
  {
    platform: "reels",
    title: "持ち物・道具を並べる『これ使ってます』紹介",
    format: "リスト紹介",
    reason: "実用情報で保存され、シェアからの拡散が続く。",
    tags: ["紹介", "リスト", "シェア"],
    baseScore: 78,
  },
  {
    platform: "shorts",
    title: "5秒チャレンジ形式の『一緒にやってみて』参加型",
    format: "参加型",
    reason: "コメント誘発が強く、再生維持と再訪が伸びる。",
    tags: ["参加型", "チャレンジ", "コメント増"],
    baseScore: 80,
  },
];

// 週ごとに安定した擬似乱数（同じ週なら同じ結果＝再現性）
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function isoWeekKey(d: Date): string {
  // 週の月曜を基準にしたキー
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() - day + 1);
  return tmp.toISOString().slice(0, 10);
}

// 集計（=毎日23時のジョブが呼ぶ本体）
export function computeDigest(now = new Date()): TrendDigest {
  const weekOf = isoWeekKey(now);
  const rng = seededRandom(
    Number(weekOf.replaceAll("-", "")) + now.getUTCDate(),
  );

  const videos: TrendVideo[] = SEED_POOL.map((seed, i) => {
    const growthPct = Math.round(40 + rng() * 220); // 40-260%
    const engagementPct = Math.round((4 + rng() * 12) * 10) / 10; // 4-16%
    const views = Math.round((120 + rng() * 900) * 1000); // 12万-100万超
    // 総合スコア：伸び率・エンゲージ・再生数を重み付け
    const score = Math.min(
      99,
      Math.round(
        seed.baseScore * 0.5 +
          (growthPct / 260) * 25 +
          (engagementPct / 16) * 15 +
          (views / 1_000_000) * 10,
      ),
    );
    return {
      id: `${weekOf}-${i}`,
      platform: seed.platform,
      title: seed.title,
      format: seed.format,
      reason: seed.reason,
      tags: seed.tags,
      metrics: { views, growthPct, engagementPct, score },
    };
  })
    .sort((a, b) => b.metrics.score - a.metrics.score)
    .slice(0, 6);

  return { weekOf, generatedAt: now.getTime(), videos };
}

export function readStoredDigest(): TrendDigest | null {
  try {
    const raw = fs.readFileSync(STORE, "utf-8");
    return JSON.parse(raw) as TrendDigest;
  } catch {
    return null;
  }
}

export function writeDigest(digest: TrendDigest) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE, JSON.stringify(digest, null, 2), "utf-8");
}

// 取得：保存済みが今週分ならそれを、無ければ即時集計して保存
export function getOrRefreshDigest(): TrendDigest {
  const now = new Date();
  const stored = readStoredDigest();
  if (stored && stored.weekOf === isoWeekKey(now)) return stored;
  const fresh = computeDigest(now);
  try {
    writeDigest(fresh);
  } catch {
    // 読み取り専用環境でも落とさない
  }
  return fresh;
}
