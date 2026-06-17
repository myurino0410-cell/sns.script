import { NextRequest, NextResponse } from "next/server";
import { generateScript } from "@/app/lib/generator";
import { ScriptRequest } from "@/app/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ScriptRequest>;

    if (!body.topic || !body.profile || !body.durationSec) {
      return NextResponse.json(
        { error: "topic, durationSec, profile は必須です。" },
        { status: 400 },
      );
    }

    const script = await generateScript(body as ScriptRequest);
    return NextResponse.json({ script });
  } catch (err) {
    console.error("[api/generate] error:", err);
    return NextResponse.json(
      { error: "台本生成に失敗しました。時間をおいて再試行してください。" },
      { status: 500 },
    );
  }
}
