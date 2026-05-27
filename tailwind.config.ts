import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "nm-bg":            "#0C0A09",
        "nm-surface":       "#161412",
        "nm-card":          "#1E1C1A",
        "nm-border":        "#3A3530",
        "nm-border-subtle": "#252220",
        "nm-gold":          "#CA8A04",
        "nm-gold-light":    "#D49B1E",
        "nm-text":          "#F5F0E8",
        "nm-muted":         "#A8A29E",
        "nm-faint":         "#6B6460",
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "Georgia", "serif"],
        sans:  ['"DM Sans"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #CA8A04 0%, #D49B1E 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
