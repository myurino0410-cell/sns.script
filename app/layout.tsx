import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "./components/NavBar";

export const metadata: Metadata = {
  title: "Trendy Studio — SNSショート動画 台本メーカー",
  description:
    "毎日トレンドを追いかけ、あなたに刺さるショート動画の企画台本を自動生成。パステル×近未来のクリエイティブスタジオ。",
};

export const viewport: Viewport = {
  themeColor: "#e0c3fc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        <NavBar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-4 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
