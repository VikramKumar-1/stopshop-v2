import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic tokens — auto-switch via CSS variables
        surface: "var(--surface)",
        "surface-card": "var(--surface-card)",
        "surface-hover": "var(--surface-hover)",
        "surface-elevated": "var(--surface-elevated)",
        heading: "var(--heading)",
        body: "var(--body)",
        muted: "var(--muted)",
        subtle: "var(--subtle)",
        border: "var(--border)",

        // Premium orange accent — rich & warm
        bronze: {
          50: "#fff8f0",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(249, 115, 22, 0.2)" },
          "100%": { boxShadow: "0 0 40px rgba(249, 115, 22, 0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shrink: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        }
      },
    },
  },
  plugins: [],
};
export default config;
