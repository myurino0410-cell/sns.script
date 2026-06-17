"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

// アプリ全体のエラーバウンダリ。
// 例外を画面に分かりやすく出し、原因究明をしやすくする。
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl pt-16">
      <div className="glass-strong flex flex-col items-center gap-4 rounded-xl3 p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-aurora-peach to-aurora-pink shadow-soft">
          <AlertTriangle className="h-7 w-7 text-white" />
        </span>
        <h1 className="text-2xl font-extrabold">問題が発生しました</h1>
        <p className="text-ink-soft">
          ご不便をおかけします。下のボタンで再試行できます。
        </p>

        <details className="w-full rounded-xl2 bg-white/50 p-4 text-left">
          <summary className="cursor-pointer text-sm font-semibold text-ink-soft">
            エラー詳細（原因究明用）
          </summary>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words text-xs text-rose-600">
            {error.message}
            {error.digest ? `\n\ndigest: ${error.digest}` : ""}
          </pre>
        </details>

        <div className="flex gap-3">
          <button onClick={reset} className="btn-primary">
            <RotateCcw className="h-5 w-5" /> 再試行
          </button>
          <Link href="/" className="btn-ghost">
            <Home className="h-4 w-4" /> ホームへ
          </Link>
        </div>
      </div>
    </div>
  );
}
