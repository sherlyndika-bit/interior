const colors = require('tailwindcss/colors');

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
        brand: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0b1d30',
        },
        stone: colors.slate,
        zinc: colors.slate,
        amber: colors.sky,
        emerald: colors.blue,
        accent: {
          gold: '#3b82f6', // Changed to blue to fit the theme
          warm: '#0ea5e9', // Changed to sky to fit the theme
          slate: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
