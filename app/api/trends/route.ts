import { NextResponse } from "next/server";
import { getOrRefreshDigest } from "@/app/lib/trends";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 今週のおすすめ動画を返す
export async function GET() {
  try {
    const digest = getOrRefreshDigest();
    return NextResponse.json({ digest });
  } catch (err) {
    console.error("[api/trends] error:", err);
    return NextResponse.json(
      { error: "トレンドの取得に失敗しました。" },
      { status: 500 },
    );
  }
}
