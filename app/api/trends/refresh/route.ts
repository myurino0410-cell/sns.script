import { NextRequest, NextResponse } from "next/server";
import { computeDigest, writeDigest } from "@/app/lib/trends";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 毎日23時に呼ばれる集計ジョブのエンドポイント。
// cron（Vercel Cron / GitHub Actions / OSのcron）から POST する想定。
// CRON_SECRET を設定しておくと外部からの不正実行を防げる。
function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // 未設定なら誰でも（開発用）
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const digest = computeDigest(new Date());
    writeDigest(digest);
    return NextResponse.json({
      ok: true,
      weekOf: digest.weekOf,
      count: digest.videos.length,
      generatedAt: digest.generatedAt,
    });
  } catch (err) {
    console.error("[api/trends/refresh] error:", err);
    return NextResponse.json({ error: "集計に失敗しました。" }, { status: 500 });
  }
}

// 動作確認用にGETでも実行できるようにしておく
export async function GET(req: NextRequest) {
  return POST(req);
}
