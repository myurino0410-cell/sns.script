"use client";

import { motion } from "framer-motion";
import { TrendingUp, Eye, Heart, ArrowRight } from "lucide-react";
import { PLATFORM_LABEL, TrendVideo } from "../lib/types";

const platformStyle: Record<string, string> = {
  tiktok: "from-fuchsia-300 to-cyan-300",
  reels: "from-pink-300 to-purple-300",
  shorts: "from-rose-300 to-amber-200",
};

function fmtViews(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toLocaleString();
}

export function TrendCard({
  video,
  rank,
  onPick,
}: {
  video: TrendVideo;
  rank: number;
  onPick: (v: TrendVideo) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onPick(video)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06, type: "spring", stiffness: 120 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="glass group relative flex flex-col gap-3 rounded-xl2 p-5 text-left"
    >
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold text-white ${platformStyle[video.platform]}`}
        >
          {PLATFORM_LABEL[video.platform]}
        </span>
        <span className="flex items-center gap-1 text-xs font-bold text-ink-faint">
          総合スコア
          <span className="grad-text text-base">{video.metrics.score}</span>
        </span>
      </div>

      <div className="flex items-start gap-2">
        <span className="grad-text text-2xl font-black leading-none">
          #{rank}
        </span>
        <h3 className="text-base font-bold leading-snug text-ink">
          {video.title}
        </h3>
      </div>

      <p className="text-sm text-ink-soft">{video.reason}</p>

      <div className="mt-auto grid grid-cols-3 gap-2 pt-1 text-center">
        <Metric
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          label="伸び率"
          value={`+${video.metrics.growthPct}%`}
        />
        <Metric
          icon={<Eye className="h-3.5 w-3.5" />}
          label="再生数"
          value={fmtViews(video.metrics.views)}
        />
        <Metric
          icon={<Heart className="h-3.5 w-3.5" />}
          label="反応率"
          value={`${video.metrics.engagementPct}%`}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-wrap gap-1">
          {video.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-medium text-ink-soft"
            >
              #{t}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-sm font-bold text-ink opacity-70 transition group-hover:opacity-100">
          台本化
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </motion.button>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/50 px-1 py-2">
      <div className="flex items-center justify-center gap-1 text-ink-faint">
        {icon}
        <span className="text-[10px]">{label}</span>
      </div>
      <div className="text-sm font-bold text-ink">{value}</div>
    </div>
  );
}
