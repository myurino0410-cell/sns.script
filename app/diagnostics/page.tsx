"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, XCircle, RefreshCw, Loader2 } from "lucide-react";

interface Diag {
  status: string;
  time: string;
  runtime: string;
  checks: { name: string; ok: boolean; detail: string }[];
}

export default function DiagnosticsPage() {
  const [diag, setDiag] = useState<Diag | null>(null);
  const [loading, setLoading] = useState(true);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/diagnostics");
      setDiag(await res.json());
    } catch {
      setDiag(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run();
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-xl3 p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-aurora-mint to-aurora-sky shadow-soft">
              <Activity className="h-6 w-6 text-white" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold">システム自己診断</h1>
              <p className="text-sm text-ink-soft">
                各機能の健全性をチェックし、不具合の原因究明を助けます。
              </p>
            </div>
          </div>
          <button onClick={run} className="btn-ghost !px-3" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading && !diag ? (
          <div className="grid place-items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-aurora-lilac" />
          </div>
        ) : diag ? (
          <>
            <div
              className={`mb-5 flex items-center gap-3 rounded-xl2 p-4 ${
                diag.status === "healthy"
                  ? "bg-emerald-100/60"
                  : "bg-amber-100/60"
              }`}
            >
              {diag.status === "healthy" ? (
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              ) : (
                <XCircle className="h-7 w-7 text-amber-500" />
              )}
              <div>
                <p className="font-bold text-ink">
                  {diag.status === "healthy"
                    ? "すべて正常に動作しています"
                    : "一部に注意が必要です"}
                </p>
                <p className="text-xs text-ink-soft">
                  {diag.runtime}・{new Date(diag.time).toLocaleString("ja-JP")}
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {diag.checks.map((c, i) => (
                <motion.li
                  key={c.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-xl2 border border-white/60 bg-white/50 p-4"
                >
                  {c.ok ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
                  )}
                  <div>
                    <p className="font-semibold text-ink">{c.name}</p>
                    <p className="text-sm text-ink-soft">{c.detail}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-ink-soft">診断を実行できませんでした。</p>
        )}
      </motion.div>
    </div>
  );
}
