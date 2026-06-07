/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"'],
        barlow: ['"Barlow Condensed"'],
        playfair: ['"Playfair Display"'],
      },
    },
  },
  plugins: [],
}
