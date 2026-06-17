# Trendy Studio — SNSショート動画 企画台本メーカー

毎日トレンドを追いかけ、業界・職種・ターゲットに合わせたショート動画の
企画台本をワンタップで生成するWebアプリです。パステルカラーのグラデーションを
基調にした、明るく近未来感のあるUIで、誰でも気持ちよく使えます。

## 主な機能

- **🪄 台本作成** — 業界・職種・ターゲットを登録しておけば、テーマと尺を選ぶだけで
  「フック → 構成 → CTA → キャプション → ハッシュタグ → 撮影のコツ」まで生成。
- **📅 今週のおすすめ動画** — 毎日23時に各SNS（TikTok / Reels / Shorts）の
  トレンドを集計。1週間で評価・再生数が伸びた動画フォーマットを総合スコアで
  ランキング表示。カードをタップすると、あなたのプロフィールに合わせて自動で台本化。
- **🩺 システム自己診断** — AIエンジン・トレンド集計・ストレージの健全性を
  チェックし、不具合の原因究明を助けます（`/diagnostics`）。
- **🎨 こだわりのUI/UX** — グラスモーフィズム、なめらかなアニメーション
  （Framer Motion）、押し心地のよいボタンとマイクロインタラクション。

## セットアップ

```bash
npm install
cp .env.example .env.local   # 任意：APIキー等を設定
npm run dev                  # http://localhost:3000
```

APIキーが無くても、高品質なテンプレートエンジンで台本生成が動作します。
`ANTHROPIC_API_KEY` を設定すると、Claude AIによるより精度の高い台本になります。

## 技術スタック

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS（パステル×近未来テーマ）
- Framer Motion（アニメーション）
- Anthropic Claude API（任意、フォールバックあり）

## トレンド集計（毎日23時）

`/api/trends/refresh` を毎日23時(JST)に実行するとダイジェストが更新されます。

- **Vercelの場合**: `vercel.json` の cron 設定済み（`0 14 * * *` = 14:00 UTC = 23:00 JST）。
- **自前サーバーの場合**: OSのcronなどから実行。
  ```bash
  curl -X POST https://<your-domain>/api/trends/refresh \
    -H "Authorization: Bearer $CRON_SECRET"
  ```
- 集計結果が未保存・古い場合は、画面表示時に自動で即時集計するため空にはなりません。

> 本番で実データを使う場合は、`app/lib/trends.ts` の `SEED_POOL` を
> 各SNSの公式API/解析サービスから取得したデータに差し替えてください。

## ディレクトリ構成

```
app/
  api/
    generate/        台本生成API（Claude + フォールバック）
    trends/          今週のおすすめ取得API
    trends/refresh/  毎日23時のトレンド集計ジョブ
    diagnostics/     自己診断API
  components/        NavBar / TrendCard / ScriptResult
  lib/               型定義・プロフィール・トレンド・生成エンジン
  create/            台本作成ページ
  profile/           初期設定ページ
  diagnostics/       自己診断ページ
  page.tsx           ホーム（今週のおすすめ）
```
