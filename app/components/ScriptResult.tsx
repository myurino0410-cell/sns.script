"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Film,
  Megaphone,
  Hash,
  Lightbulb,
  Zap,
  Sparkles,
} from "lucide-react";
import { GeneratedScript } from "../lib/types";

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-ink-soft transition hover:bg-white"
    >
      {done ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" /> コピー済み
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> {label ?? "コピー"}
        </>
      )}
    </button>
  );
}

function fullText(s: GeneratedScript): string {
  const scenes = s.scenes
    .map((sc) => `【${sc.timecode}】\nセリフ: ${sc.narration}\n映像: ${sc.visual}`)
    .join("\n\n");
  return [
    `■ タイトル\n${s.title}`,
    `■ フック(冒頭3秒)\n${s.hook}`,
    `■ 構成\n${scenes}`,
    `■ 締め(CTA)\n${s.cta}`,
    `■ キャプション\n${s.caption}`,
    `■ ハッシュタグ\n${s.hashtags.join(" ")}`,
    `■ 撮影・編集のコツ\n${s.tips.map((t) => `・${t}`).join("\n")}`,
  ].join("\n\n");
}

export function ScriptResult({ script }: { script: GeneratedScript }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="glass-strong rounded-xl3 p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-aurora-mint to-aurora-sky">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink-faint">
                {script.source === "ai"
                  ? "Claude AIが生成"
                  : "テンプレートエンジンが生成"}
              </p>
              <h2 className="text-xl font-extrabold leading-tight">
                {script.title}
              </h2>
            </div>
          </div>
          <CopyButton text={fullText(script)} label="全文コピー" />
        </div>

        {/* フック */}
        <Section icon={<Zap className="h-4 w-4" />} title="冒頭3秒のフック" accent>
          <p className="text-lg font-bold text-ink">{script.hook}</p>
        </Section>

        {/* 構成 */}
        <Section icon={<Film className="h-4 w-4" />} title="シーン構成">
          <ol className="space-y-3">
            {script.scenes.map((sc, i) => (
              <li
                key={i}
                className="rounded-xl2 border border-white/60 bg-white/50 p-4"
              >
                <span className="mb-1 inline-block rounded-full bg-gradient-to-r from-aurora-lilac to-aurora-sky px-2.5 py-0.5 text-xs font-bold text-white">
                  {sc.timecode}
                </span>
                <p className="mt-1 font-semibold text-ink">🎙 {sc.narration}</p>
                <p className="mt-1 text-sm text-ink-soft">🎬 {sc.visual}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* CTA */}
        <Section icon={<Megaphone className="h-4 w-4" />} title="締め・行動喚起">
          <p className="font-semibold text-ink">{script.cta}</p>
        </Section>

        {/* キャプション */}
        <Section
          icon={<Hash className="h-4 w-4" />}
          title="投稿キャプション"
          action={<CopyButton text={`${script.caption}\n\n${script.hashtags.join(" ")}`} />}
        >
          <p className="whitespace-pre-wrap text-ink">{script.caption}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {script.hashtags.map((h) => (
              <span
                key={h}
                className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-ink-soft"
              >
                {h}
              </span>
            ))}
          </div>
        </Section>

        {/* Tips */}
        <Section icon={<Lightbulb className="h-4 w-4" />} title="撮影・編集のコツ">
          <ul className="space-y-1.5">
            {script.tips.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-soft">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-aurora-lilac" />
                {t}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </motion.div>
  );
}

function Section({
  icon,
  title,
  children,
  accent,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`mb-4 rounded-xl2 p-4 ${
        accent
          ? "bg-gradient-to-r from-aurora-pink/40 to-aurora-lilac/40"
          : "bg-white/30"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-ink-soft">
          <span className="text-aurora-lilac">{icon}</span>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}
