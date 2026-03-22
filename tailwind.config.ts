import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  "#f1f6f6",
          100: "#d8e9e9",
          200: "#b2d3d3",
          300: "#7db4b4",
          400: "#4d9494",
          500: "#2d7a7a",
          600: "#1f6565",
          700: "#1a5454",   // primary — deep slate-teal
          800: "#153f3f",
          900: "#0e2c2c",
          950: "#071818",
        },
        coral: {
          100: "#f5ece9",
          200: "#e8ccC4",
          300: "#d4a99e",
          400: "#c08778",
          500: "#a86b5a",   // muted terracotta
          600: "#8f5445",
          700: "#723f33",
        },
        background: "#F8F6F2",   // slightly warmer warm white
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
