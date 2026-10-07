/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neobrutalism palette driven by CSS variables (RGB channels) so dark
        // mode flips them without touching components, while still supporting
        // Tailwind opacity modifiers like text-dark/70. See src/index.css.
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-hover": "rgb(var(--primary-hover) / <alpha-value>)",
        dark: "rgb(var(--ink) / <alpha-value>)",
        "gray-neo": "rgb(var(--muted) / <alpha-value>)",
        "bg-neo": "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        // `white` is used across components as the surface color; map it to the
        // theme surface so cards/inputs follow the active theme.
        white: "rgb(var(--surface) / <alpha-value>)",
        // Status colors
        wishlist: "rgb(var(--wishlist) / <alpha-value>)",
        applied: "rgb(var(--applied) / <alpha-value>)",
        interview: "rgb(var(--interview) / <alpha-value>)",
        offer: "rgb(var(--offer) / <alpha-value>)",
        rejected: "rgb(var(--rejected) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Arial", "sans-serif"],
      },
      boxShadow: {
        neo: "4px 4px 0px rgb(var(--ink))",
        "neo-lg": "6px 6px 0px rgb(var(--ink))",
        "neo-sm": "2px 2px 0px rgb(var(--ink))",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
}
