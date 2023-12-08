/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/**.{js,ts,jsx,tsx}',
    './src/components/**/**.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "accent": "#a72f57",
        "greyed-out": "#C0C0C0"
      }
    }
  },
  plugins: [],
}
