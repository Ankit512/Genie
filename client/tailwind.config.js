/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#B8D4FF',
          200: '#8AB9FF',
          300: '#5C9DFF',
          400: '#2E82FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003E99',
          800: '#002966',
          900: '#001533',
        },
      },
    },
  },
  plugins: [],
} 