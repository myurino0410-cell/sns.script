"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, CalendarClock, Wand2, ArrowRight, Rocket } from "lucide-react";
import { TrendCard } from "./components/TrendCard";
import { TrendDigest, TrendVideo, UserProfile } from "./lib/types";
import { loadProfile, isProfileComplete } from "./lib/profile";

export default function HomePage() {
  const router = useRouter();
  const [digest, setDigest] = useState<TrendDigest | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
    fetch("/api/trends")
      .then((r) => r.json())
      .then((d) => setDigest(d.digest))
      .catch(() => setDigest(null))
      .finally(() => setLoading(false));
  }, []);

  const ready = isProfileComplete(profile);

  function pickTrend(v: TrendVideo) {
    sessionStorage.setItem("trendy-studio.pickedTrend", JSON.stringify(v));
    router.push(`/create?from=trend`);
  }

  return (
    <div className="space-y-10 pt-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl3 glass-strong px-6 py-12 text-center sm:px-12">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-aurora-pink/50 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-aurora-sky/50 blur-3xl"
          animate={{ y: [0, -24, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-ink-soft shadow-soft">
            <Sparkles className="h-4 w-4 text-aurora-lilac" />
            毎日23時、AIが最新トレンドを分析
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            バズる台本は、<br className="sm:hidden" />
            <span className="grad-text">3秒で決まる。</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
            業界・職種・ターゲットに合わせて、ショート動画の企画台本をワンタップ生成。
            今週のトレンドを取り入れて、刺さる動画をつくろう。
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/create" className="btn-primary">
              <Wand2 className="h-5 w-5" />
              台本を作る
            </Link>
            <Link href="/profile" className="btn-ghost">
              {ready ? "プロフィールを編集" : "まずは初期設定"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* プロフィール未設定バナー */}
      {!ready && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass flex flex-col items-start gap-3 rounded-xl2 border-l-4 border-aurora-lilac/80 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-aurora-lilac" />
            <p className="text-sm font-medium text-ink-soft">
              先に<strong className="text-ink">業界・職種・ターゲット</strong>
              を登録すると、あなたに刺さる台本が作れます。
            </p>
          </div>
          <Link href="/profile" className="btn-primary !py-2 !text-sm">
            初期設定する
          </Link>
        </motion.div>
      )}

      {/* 今週のおすすめ動画 */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-extrabold">
              <CalendarClock className="h-6 w-6 text-aurora-lilac" />
              今週のおすすめ動画
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              直近1週間で評価・再生数が伸びた動画フォーマット。タップでそのまま台本化。
            </p>
          </div>
          {digest && (
            <span className="hidden text-xs text-ink-faint sm:block">
              集計対象週: {digest.weekOf}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass h-56 animate-pulse rounded-xl2 opacity-60"
              />
            ))}
          </div>
        ) : digest ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {digest.videos.map((v, i) => (
              <TrendCard key={v.id} video={v} rank={i + 1} onPick={pickTrend} />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft">トレンドを読み込めませんでした。</p>
        )}
      </section>
    </div>
  );
}
