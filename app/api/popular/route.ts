import { NextResponse } from "next/server";
import { computeMonthlyPopular } from "@/app/lib/trends";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 最新人気（直近1ヶ月以内）の動画フォーマットを返す
export async function GET() {
  try {
    const videos = computeMonthlyPopular(new Date());
    return NextResponse.json({ videos });
  } catch (err) {
    console.error("[api/popular] error:", err);
    return NextResponse.json(
      { error: "最新人気の取得に失敗しました。" },
      { status: 500 },
    );
  }
}
