"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Home, PenLine, UserCircle2, Activity } from "lucide-react";

const links = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/create", label: "台本作成", icon: PenLine },
  { href: "/profile", label: "プロフィール", icon: UserCircle2 },
  { href: "/diagnostics", label: "診断", icon: Activity },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6">
      <nav className="glass-strong mx-auto flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <motion.span
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-aurora-lilac to-aurora-sky shadow-soft"
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.span>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="grad-text">Trendy</span>{" "}
            <span className="text-ink">Studio</span>
          </span>
        </Link>

        <ul className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                    active ? "text-white" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-aurora-lilac to-aurora-sky shadow-soft"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
