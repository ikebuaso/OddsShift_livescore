/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2C4B33',
        background: '#F9FAFB',
      },
    },
  },
  plugins: [],
};