/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paper': {
          50: '#f5e6d3',
          100: '#e8d5c4',
          200: '#d4c4b0',
          300: '#c4b09a',
          400: '#b89d84',
          500: '#a68a6e',
          600: '#8b6f47',
          700: '#6b4e37',
          800: '#5a3f2a',
          900: '#3d2817',
        },
      },
      fontFamily: {
        'serif-chinese': ['STKaiti', 'KaiTi', '楷体', 'SimKai', 'STSong', '宋体', 'SimSun', 'serif'],
      },
    },
  },
  plugins: [],
}

