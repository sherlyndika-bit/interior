/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#e4d4cf',
          300: '#d0b5ac',
          400: '#b89083',
          500: '#9e6d5e',
          600: '#845345',
          700: '#6b4136',
          800: '#58362d',
          900: '#4a2f28',
          950: '#281713',
        },
        accent: {
          gold: '#D4AF37',
          warm: '#C87D55',
          slate: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
