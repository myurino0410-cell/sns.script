"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Save, UserCircle2 } from "lucide-react";
import {
  Goal,
  GOAL_LABEL,
  Platform,
  PLATFORM_LABEL,
  Tone,
  TONE_LABEL,
  UserProfile,
} from "../lib/types";
import { loadProfile, saveProfile } from "../lib/profile";

const EMPTY: UserProfile = {
  industry: "",
  role: "",
  audience: "",
  goals: [],
  tones: [],
  platforms: [],
  product: "",
  ngWords: "",
  updatedAt: 0,
};

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function ProfilePage() {
  const router = useRouter();
  const [p, setP] = useState<UserProfile>(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = loadProfile();
    if (loaded) setP({ ...EMPTY, ...loaded });
  }, []);

  function handleSave() {
    saveProfile(p);
    setSaved(true);
    setTimeout(() => router.push("/create"), 700);
  }

  const valid =
    p.industry.trim() &&
    p.role.trim() &&
    p.audience.trim() &&
    p.goals.length &&
    p.tones.length &&
    p.platforms.length;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-xl3 p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-aurora-lilac to-aurora-sky shadow-soft">
            <UserCircle2 className="h-6 w-6 text-white" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold">プロフィール初期設定</h1>
            <p className="text-sm text-ink-soft">
              ここで入れた内容をもとに、毎回ターゲットに刺さる台本を作ります。
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">業界 *</label>
              <input
                className="field"
                placeholder="例：美容・サロン / 飲食 / IT"
                value={p.industry}
                onChange={(e) => setP({ ...p, industry: e.target.value })}
              />
            </div>
            <div>
              <label className="label">職種 *</label>
              <input
                className="field"
                placeholder="例：オーナー / マーケター / 講師"
                value={p.role}
                onChange={(e) => setP({ ...p, role: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">ターゲット視聴者 *</label>
            <input
              className="field"
              placeholder="例：20代後半の働く女性、美容に関心が高い層"
              value={p.audience}
              onChange={(e) => setP({ ...p, audience: e.target.value })}
            />
          </div>

          <ChipGroup<Goal>
            label="目的 *（複数可）"
            options={Object.keys(GOAL_LABEL) as Goal[]}
            labelMap={GOAL_LABEL}
            selected={p.goals}
            onToggle={(v) => setP({ ...p, goals: toggle(p.goals, v) })}
          />

          <ChipGroup<Tone>
            label="トーン *（複数可）"
            options={Object.keys(TONE_LABEL) as Tone[]}
            labelMap={TONE_LABEL}
            selected={p.tones}
            onToggle={(v) => setP({ ...p, tones: toggle(p.tones, v) })}
          />

          <ChipGroup<Platform>
            label="投稿先 *（複数可）"
            options={Object.keys(PLATFORM_LABEL) as Platform[]}
            labelMap={PLATFORM_LABEL}
            selected={p.platforms}
            onToggle={(v) => setP({ ...p, platforms: toggle(p.platforms, v) })}
          />

          <div>
            <label className="label">商品・サービス・強み（任意）</label>
            <textarea
              className="field min-h-[80px] resize-y"
              placeholder="例：完全予約制の隠れ家サロン。髪質改善メニューが人気。"
              value={p.product}
              onChange={(e) => setP({ ...p, product: e.target.value })}
            />
          </div>

          <div>
            <label className="label">避けたい表現（任意）</label>
            <input
              className="field"
              placeholder="例：誇大広告・断定的な効果の表現"
              value={p.ngWords}
              onChange={(e) => setP({ ...p, ngWords: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
          {!valid && (
            <span className="text-sm text-ink-faint">
              * の項目を入力すると保存できます
            </span>
          )}
          <button
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!valid}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <Check className="h-5 w-5" /> 保存しました
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> 保存して台本作成へ
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  options,
  labelMap,
  selected,
  onToggle,
}: {
  label: string;
  options: T[];
  labelMap: Record<T, string>;
  selected: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`chip ${on ? "chip-on" : "chip-off"}`}
            >
              {on && <Check className="h-3.5 w-3.5" />}
              {labelMap[opt]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
