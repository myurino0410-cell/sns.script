"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PlayCircle,
  Wand2,
  Sparkles,
  Check,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import {
  DEMO_PERSONAS,
  DemoPersona,
  personaToProfile,
} from "../lib/demo";
import { saveProfile, clearProfile } from "../lib/profile";
import { GOAL_LABEL, PLATFORM_LABEL, TONE_LABEL } from "../lib/types";

export default function DemoPage() {
  const router = useRouter();
  const [activated, setActivated] = useState<string | null>(null);

  function activate(p: DemoPersona, go: "home" | "create") {
    saveProfile(personaToProfile(p));
    setActivated(p.id);
    if (go === "create") {
      sessionStorage.setItem("trendy-studio.demoTopic", p.sampleTopic);
      setTimeout(() => router.push("/create?from=demo"), 400);
    } else {
      setTimeout(() => router.push("/"), 400);
    }
  }

  function reset() {
    clearProfile();
    setActivated(null);
  }

  return (
    <div className="space-y-8 pt-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong relative overflow-hidden rounded-xl3 p-6 sm:p-8"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-ink-soft shadow-soft">
          <Sparkles className="h-4 w-4 text-aurora-lilac" />
          登録不要・ワンタップで体験
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
          <span className="grad-text">デモアカウント</span>で
          <br className="sm:hidden" />
          すぐにお試し
        </h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          サンプルのアカウントを選ぶだけで、プロフィール設定済みの状態から
          「今週のおすすめ動画」や台本生成をそのまま確認できます。
          いつでもリセットして自分のプロフィールに戻せます。
        </p>
        <button
          onClick={reset}
          className="btn-ghost mt-5 !py-2 !text-sm"
        >
          <RotateCcw className="h-4 w-4" />
          デモをリセット
        </button>
      </motion.section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {DEMO_PERSONAS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 120 }}
            className="glass flex flex-col gap-4 rounded-xl2 p-6"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-aurora-pink to-aurora-sky text-3xl shadow-soft">
                {p.emoji}
              </span>
              <div>
                <h2 className="text-lg font-extrabold leading-tight text-ink">
                  {p.name}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">{p.catch}</p>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-1.5 text-sm">
              <Row label="業界" value={p.profile.industry} />
              <Row label="職種" value={p.profile.role} />
              <Row label="ターゲット" value={p.profile.audience} />
            </dl>

            <div className="flex flex-wrap gap-1.5">
              {p.profile.goals.map((g) => (
                <Tag key={g}>{GOAL_LABEL[g]}</Tag>
              ))}
              {p.profile.tones.map((t) => (
                <Tag key={t}>{TONE_LABEL[t]}</Tag>
              ))}
              {p.profile.platforms.map((pl) => (
                <Tag key={pl}>{PLATFORM_LABEL[pl]}</Tag>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
              <button
                onClick={() => activate(p, "create")}
                className="btn-primary flex-1 !py-2.5 !text-sm"
              >
                {activated === p.id ? (
                  <>
                    <Check className="h-4 w-4" /> 起動中...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" /> このアカウントで台本作成
                  </>
                )}
              </button>
              <button
                onClick={() => activate(p, "home")}
                className="btn-ghost flex-1 !py-2.5 !text-sm"
              >
                <PlayCircle className="h-4 w-4" /> ホームを見る
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="glass flex flex-col items-center gap-3 rounded-xl2 p-6 text-center">
        <p className="text-sm text-ink-soft">
          自分のアカウントで使いたくなったら、プロフィールを登録するだけ。
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="btn-ghost !text-sm"
        >
          自分のプロフィールを作る
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 flex-shrink-0 font-semibold text-ink-faint">{label}</dt>
      <dd className="text-ink-soft">{value}</dd>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-medium text-ink-soft">
      {children}
    </span>
  );
}
