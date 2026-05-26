import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        qaliq: {
          navy: "#1F3A5F",
          gold: "#F5B335",
          teal: "#2BB3A8",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
