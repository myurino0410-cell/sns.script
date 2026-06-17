import { NextResponse } from "next/server";
import { readStoredDigest, computeDigest } from "@/app/lib/trends";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// アプリの自己診断（自走でバグ原因究明するための土台）
// 各サブシステムの健全性をまとめて返す。
export async function GET() {
  const checks: { name: string; ok: boolean; detail: string }[] = [];

  // 1. AI生成エンジン
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
  checks.push({
    name: "AI台本エンジン",
    ok: true,
    detail: hasKey
      ? `Claude APIに接続可能 (model: ${process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6"})`
      : "APIキー未設定 → 高品質テンプレートで動作中（生成は可能）",
  });

  // 2. トレンド集計
  let trendOk = true;
  let trendDetail = "";
  try {
    const stored = readStoredDigest();
    const fresh = computeDigest();
    trendDetail = stored
      ? `保存済みダイジェスト: ${stored.weekOf}（${stored.videos.length}件）`
      : `未保存。即時集計でフォールバック可能（${fresh.videos.length}件）`;
  } catch (e) {
    trendOk = false;
    trendDetail = `集計エラー: ${(e as Error).message}`;
  }
  checks.push({ name: "トレンド集計", ok: trendOk, detail: trendDetail });

  // 3. ストレージ書き込み可否
  let storageOk = true;
  let storageDetail = "data/ に書き込み可能";
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const dir = path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });
    const probe = path.join(dir, ".probe");
    fs.writeFileSync(probe, "ok");
    fs.unlinkSync(probe);
  } catch (e) {
    storageOk = false;
    storageDetail = `書き込み不可（読み取り専用環境の可能性）: ${(e as Error).message}`;
  }
  checks.push({
    name: "データストレージ",
    ok: storageOk,
    detail: storageDetail,
  });

  const allOk = checks.every((c) => c.ok);
  return NextResponse.json({
    status: allOk ? "healthy" : "degraded",
    time: new Date().toISOString(),
    runtime: `node ${process.version}`,
    checks,
  });
}
