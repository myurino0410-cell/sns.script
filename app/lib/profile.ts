"use client";

import { UserProfile } from "./types";

const KEY = "trendy-studio.profile.v1";

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(p: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify({ ...p, updatedAt: Date.now() }));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function isProfileComplete(p: UserProfile | null): p is UserProfile {
  return Boolean(
    p &&
      p.industry.trim() &&
      p.role.trim() &&
      p.audience.trim() &&
      p.goals.length &&
      p.tones.length &&
      p.platforms.length,
  );
}
