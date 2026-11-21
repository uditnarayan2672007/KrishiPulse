/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#050608',
          900: '#0a0c10',
          850: '#0e1117',
          800: '#141721',
          750: '#1b1f2c',
          700: '#232838',
          600: '#333a4f',
        },
        chrome: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
          800: '#334155',
        },
        crimson: {
          laser: '#ff003b',
          glow: '#ff1744',
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },
      boxShadow: {
        'laser-sm': '0 0 10px rgba(255, 0, 59, 0.3)',
        'laser-md': '0 0 20px rgba(255, 0, 59, 0.45)',
        'laser-lg': '0 0 35px rgba(255, 0, 59, 0.6)',
        'chrome-sm': '0 0 15px rgba(226, 232, 240, 0.15)',
        'chrome-card': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(203, 213, 225, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'chrome-gradient': 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
        'crimson-gradient': 'linear-gradient(135deg, #ff003b 0%, #be123c 100%)',
        'obsidian-glass': 'linear-gradient(180deg, rgba(20, 23, 33, 0.75) 0%, rgba(10, 12, 16, 0.85) 100%)',
      }
    },
  },
  plugins: [],
}
