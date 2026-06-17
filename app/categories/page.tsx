"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Loader2, ArrowRight } from "lucide-react";
import {
  CategoryGroup,
  CATEGORY_GROUP_LABEL,
  ScriptCategory,
  TrendVideo,
} from "../lib/types";
import { categoriesByGroup, trendToCategory } from "../lib/categories";

const GROUP_ORDER: CategoryGroup[] = [
  "theme",
  "industry",
  "businessType",
  "trend",
  "female",
  "male",
  "recruiting",
  "popular",
];

const GROUP_EMOJI: Record<CategoryGroup, string> = {
  theme: "🎭",
  industry: "🏢",
  businessType: "💼",
  trend: "📈",
  female: "🌸",
  male: "🔥",
  recruiting: "🤝",
  popular: "⭐️",
};

export default function CategoriesPage() {
  const router = useRouter();
  const [group, setGroup] = useState<CategoryGroup>("theme");
  const [dynamic, setDynamic] = useState<ScriptCategory[]>([]);
  const [trendVideos, setTrendVideos] = useState<Record<string, TrendVideo>>({});
  const [loading, setLoading] = useState(false);

  const isDynamic = group === "trend" || group === "popular";

  useEffect(() => {
    if (!isDynamic) return;
    setLoading(true);
    const url = group === "trend" ? "/api/trends" : "/api/popular";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const videos: TrendVideo[] =
          group === "trend" ? d.digest?.videos ?? [] : d.videos ?? [];
        const map: Record<string, TrendVideo> = {};
        const cats = videos.map((v) => {
          const c = trendToCategory(v, group as "trend" | "popular");
          map[c.id] = v;
          return c;
        });
        setTrendVideos(map);
        setDynamic(cats);
      })
      .catch(() => setDynamic([]))
      .finally(() => setLoading(false));
  }, [group, isDynamic]);

  const cats = isDynamic ? dynamic : categoriesByGroup(group);

  function pick(c: ScriptCategory) {
    if (isDynamic) {
      // トレンド由来は元の動画情報(trendHint)も渡す
      const v = trendVideos[c.id];
      if (v) sessionStorage.setItem("trendy-studio.pickedTrend", JSON.stringify(v));
      sessionStorage.setItem("trendy-studio.pickedCategory", JSON.stringify(c));
      router.push("/create?from=category");
    } else {
      sessionStorage.removeItem("trendy-studio.pickedTrend");
      sessionStorage.setItem("trendy-studio.pickedCategory", JSON.stringify(c));
      router.push("/create?from=category");
    }
  }

  return (
    <div className="space-y-7 pt-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-xl3 p-6 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-aurora-lilac to-aurora-sky shadow-soft">
            <LayoutGrid className="h-6 w-6 text-white" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold">カテゴリから台本を作る</h1>
            <p className="text-sm text-ink-soft">
              作りたい切り口を選ぶだけ。あなたのプロフィールに合わせて生成します。
            </p>
          </div>
        </div>

        {/* グループタブ */}
        <div className="mt-6 flex flex-wrap gap-2">
          {GROUP_ORDER.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`chip ${group === g ? "chip-on" : "chip-off"}`}
            >
              <span>{GROUP_EMOJI[g]}</span>
              {CATEGORY_GROUP_LABEL[g]}
            </button>
          ))}
        </div>
      </motion.section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-xl font-extrabold">
            {GROUP_EMOJI[group]} {CATEGORY_GROUP_LABEL[group]}
          </h2>
          {group === "popular" && (
            <span className="rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
              直近1ヶ月以内
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid place-items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-aurora-lilac" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cats.map((c, i) => (
                <motion.button
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 140 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => pick(c)}
                  className="glass group flex flex-col items-start gap-2 rounded-xl2 p-5 text-left"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-aurora-pink to-aurora-sky text-2xl shadow-soft">
                    {c.emoji}
                  </span>
                  <h3 className="text-base font-bold text-ink">{c.label}</h3>
                  <p className="text-sm text-ink-soft">{c.desc}</p>
                  <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-bold text-ink opacity-70 transition group-hover:opacity-100">
                    この切り口で作る
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.button>
              ))}
            </div>
          </AnimatePresence>
        )}

        {!loading && cats.length === 0 && (
          <p className="text-ink-soft">カテゴリを読み込めませんでした。</p>
        )}
      </section>
    </div>
  );
}
