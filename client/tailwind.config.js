/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'volconn-blue': '#E0F2FE',
        'volconn-navy': '#0C4A6E',
        'volconn-gold': '#FBBF24',
        'volconn-accent': '#3B82F6',
      },
    },
  },
  plugins: [],
}