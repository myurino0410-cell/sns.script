"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Clock, AlertCircle, Loader2, Flame, RefreshCw } from "lucide-react";
import { GeneratedScript, TrendVideo, UserProfile } from "../lib/types";
import { loadProfile, isProfileComplete } from "../lib/profile";
import { ScriptResult } from "../components/ScriptResult";

const DURATIONS = [15, 30, 45, 60];

function CreateInner() {
  const params = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(30);
  const [trend, setTrend] = useState<TrendVideo | null>(null);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
    if (params.get("from") === "trend") {
      const raw = sessionStorage.getItem("trendy-studio.pickedTrend");
      if (raw) {
        const v = JSON.parse(raw) as TrendVideo;
        setTrend(v);
        setTopic(`${v.format}の型で、自分の発信に合わせた動画`);
      }
    }
  }, [params]);

  const ready = isProfileComplete(profile);

  async function generate() {
    if (!ready || !topic.trim()) return;
    setLoading(true);
    setError(null);
    setScript(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          durationSec: duration,
          profile,
          trendHint: trend ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成に失敗しました");
      setScript(data.script);
      setTimeout(
        () =>
          document
            .getElementById("result")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-xl pt-12">
        <div className="glass-strong flex flex-col items-center gap-4 rounded-xl3 p-10 text-center">
          <AlertCircle className="h-12 w-12 text-aurora-lilac" />
          <h1 className="text-2xl font-extrabold">まずは初期設定から</h1>
          <p className="text-ink-soft">
            業界・職種・ターゲットを登録すると、刺さる台本が作れます。
          </p>
          <Link href="/profile" className="btn-primary">
            プロフィールを設定する
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-xl3 p-6 sm:p-8"
      >
        <h1 className="text-2xl font-extrabold">台本をつくる</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {profile?.industry} / {profile?.role} 向けに最適化されています。
        </p>

        {trend && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex items-start gap-3 rounded-xl2 bg-gradient-to-r from-aurora-pink/50 to-aurora-lilac/50 p-4"
          >
            <Flame className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-400" />
            <div className="text-sm">
              <p className="font-bold text-ink">今週のトレンドを反映中</p>
              <p className="text-ink-soft">{trend.title}</p>
            </div>
          </motion.div>
        )}

        <div className="mt-6 space-y-5">
          <div>
            <label className="label">テーマ・伝えたいこと *</label>
            <textarea
              className="field min-h-[90px] resize-y"
              placeholder="例：髪質改善トリートメントの効果を分かりやすく伝えたい"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> 動画の尺
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`chip ${duration === d ? "chip-on" : "chip-off"}`}
                >
                  {d}秒
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading || !topic.trim()}
            onClick={generate}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> 生成中...
              </>
            ) : script ? (
              <>
                <RefreshCw className="h-5 w-5" /> もう一度生成する
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" /> 台本を生成する
              </>
            )}
          </button>

          {error && (
            <p className="flex items-center gap-2 rounded-xl2 bg-rose-100/70 p-3 text-sm font-medium text-rose-600">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
        </div>
      </motion.div>

      <div id="result">
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass flex flex-col items-center gap-3 rounded-xl3 p-12 text-center"
            >
              <Loader2 className="h-10 w-10 animate-spin text-aurora-lilac" />
              <p className="font-semibold text-ink-soft">
                あなたに刺さる台本を考えています...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {script && !loading && <ScriptResult script={script} />}
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-aurora-lilac" />
        </div>
      }
    >
      <CreateInner />
    </Suspense>
  );
}
