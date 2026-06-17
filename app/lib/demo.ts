"use client";

import { UserProfile } from "./types";

// デモ確認用のアカウント（ペルソナ）。
// オンボーディングを飛ばして、すぐに各機能を体験できるサンプルプロフィール。
export interface DemoPersona {
  id: string;
  emoji: string;
  name: string; // アカウント名
  catch: string; // ひとこと紹介
  sampleTopic: string; // 台本作成のサンプルテーマ
  profile: Omit<UserProfile, "updatedAt">;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "salon",
    emoji: "💇‍♀️",
    name: "髪質改善サロン オーナー",
    catch: "完全予約制の隠れ家サロン。リピーターを増やしたい。",
    sampleTopic: "髪質改善トリートメントのビフォーアフターを見せたい",
    profile: {
      industry: "美容・サロン",
      role: "サロンオーナー",
      audience: "20代後半〜30代の働く女性、髪の悩みが深い層",
      goals: ["sales", "followers"],
      tones: ["friendly", "luxury"],
      platforms: ["reels", "tiktok"],
      product: "髪質改善トリートメント。1回で手触りが変わると評判。",
      ngWords: "誇大広告・効果の断定表現",
    },
  },
  {
    id: "cafe",
    emoji: "☕️",
    name: "個人カフェ 店長",
    catch: "自家焙煎が自慢の街の小さなカフェ。新規来店を増やしたい。",
    sampleTopic: "看板メニューのスペシャルティコーヒーの魅力を伝えたい",
    profile: {
      industry: "飲食・カフェ",
      role: "店長",
      audience: "近隣に住む20〜40代、コーヒー好き・カフェ巡りが趣味の人",
      goals: ["awareness", "engagement"],
      tones: ["calm", "friendly"],
      platforms: ["reels", "shorts"],
      product: "自家焙煎スペシャルティコーヒーと自家製スイーツ。",
      ngWords: "",
    },
  },
  {
    id: "saas",
    emoji: "🚀",
    name: "SaaSスタートアップ マーケター",
    catch: "中小企業向け業務効率化ツールの認知を広げたい。",
    sampleTopic: "面倒な経費精算を自動化できることを分かりやすく伝えたい",
    profile: {
      industry: "IT・SaaS",
      role: "マーケティング担当",
      audience: "中小企業の経営者・バックオフィス担当者",
      goals: ["awareness", "sales"],
      tones: ["educational", "energetic"],
      platforms: ["shorts", "tiktok"],
      product: "経費精算を自動化するクラウドツール。無料トライアルあり。",
      ngWords: "専門用語の使いすぎ",
    },
  },
  {
    id: "trainer",
    emoji: "💪",
    name: "パーソナルトレーナー",
    catch: "オンライン指導もする現役トレーナー。体験申込を増やしたい。",
    sampleTopic: "自宅でできる二の腕引き締めトレーニングを紹介したい",
    profile: {
      industry: "フィットネス・健康",
      role: "パーソナルトレーナー",
      audience: "運動初心者の30〜40代女性、ダイエットに挫折しがちな人",
      goals: ["followers", "recruiting"],
      tones: ["energetic", "friendly"],
      platforms: ["reels", "shorts"],
      product: "オンライン/対面パーソナル指導。初回体験あり。",
      ngWords: "過度な煽り表現",
    },
  },
];

export function personaToProfile(p: DemoPersona): UserProfile {
  return { ...p.profile, updatedAt: Date.now() };
}
