/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neobrutalism palette
        primary: "#FFD600",
        "primary-hover": "#F5C800",
        dark: "#1a1a1a",
        "gray-neo": "#6b6b6b",
        "bg-neo": "#FFFBF0",
        // Status colors
        wishlist: "#E0E0E0",
        applied: "#90CAF9",
        interview: "#FFF176",
        offer: "#A5D6A7",
        rejected: "#EF9A9A",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Arial", "sans-serif"],
      },
      boxShadow: {
        neo: "4px 4px 0px #1a1a1a",
        "neo-lg": "6px 6px 0px #1a1a1a",
        "neo-sm": "2px 2px 0px #1a1a1a",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
}
