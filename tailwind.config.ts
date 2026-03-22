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
          50: "#f0fafa",
          100: "#ccefef",
          200: "#99dfdf",
          300: "#5ec9c9",
          400: "#2db5b5",
          500: "#0D9B9B",
          600: "#0D7E7E",
          700: "#0D6E6E",
          800: "#0a5858",
          900: "#084444",
          950: "#052c2c",
        },
        coral: {
          300: "#f8a898",
          400: "#f58a76",
          500: "#F2735D",
          600: "#e85a42",
          700: "#d44433",
        },
        background: "#FAFAF7",
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
