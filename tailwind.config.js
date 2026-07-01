/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7C5CFF",
          soft: "rgba(124,92,255,0.18)",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.08)",
        },
      },
      boxShadow: {
        glass: "0 30px 120px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "auth-grid":
          "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
