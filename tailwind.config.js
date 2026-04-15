/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fdf6f0",
        blush: "#f9ede8",
        rose: "#f2d4cc",
        muted: "#8a7a75",
      }
    },
  },
  plugins: [],
}