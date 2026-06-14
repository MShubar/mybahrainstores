import preset from "@my-bahrain/config/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  presets: [preset],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#FF5A00",
          secondary: "#7E3AF2",
          surface: "#F7F7F7",
          gold: "#D4AF37",
        },
      },
    },
  },
  plugins: [],
};
