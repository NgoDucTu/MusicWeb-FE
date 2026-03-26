import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1DB954",
          dark: "#1aa34a",
        },
        surface: {
          DEFAULT: "#121212",
          elevated: "#1e1e1e",
          highlight: "#282828",
          hover: "#333333",
        },
        text: {
          primary: "#ffffff",
          secondary: "#b3b3b3",
          muted: "#6a6a6a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
