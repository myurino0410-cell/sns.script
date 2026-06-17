import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // パステル × 近未来パレット
        aurora: {
          pink: "#ffd6ec",
          lilac: "#e0c3fc",
          sky: "#c2e9fb",
          mint: "#b5f5d8",
          peach: "#ffe6c7",
          lemon: "#fff3b0",
        },
        ink: {
          DEFAULT: "#2a2350",
          soft: "#5b5481",
          faint: "#9a93c2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      boxShadow: {
        glow: "0 8px 40px -8px rgba(180, 150, 255, 0.45)",
        soft: "0 10px 30px -12px rgba(120, 100, 200, 0.35)",
        inset: "inset 0 1px 1px rgba(255,255,255,0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        pop: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 8s ease infinite",
        pop: "pop 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
